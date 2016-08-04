/**
 * jQuery EasyUI 1.4.2
 * 
 * Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the commercial license: http://www.jeasyui.com/license_commercial.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
/**
 * parser - jQuery EasyUI
 * 
 */

(function($){
	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['draggable','droppable','resizable','pagination','tooltip',
		         'linkbutton','menu','menubutton','splitbutton','progressbar',
				 'tree','textbox','filebox','combo','combobox','combotree','combogrid','numberbox','validatebox','searchbox',
				 'spinner','numberspinner','timespinner','datetimespinner','calendar','datebox','datetimebox','slider',
				 'layout','panel','datagrid','propertygrid','treegrid','datalist','tabs','accordion','window','dialog','form'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.easyui-' + name, context);
				if (r.length){
					if (r[name]){
						r[name]();
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq[name]();
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		},
		
		parseValue: function(property, value, parent, delta){
			delta = delta || 0;
			var v = $.trim(String(value||''));
			var endchar = v.substr(v.length-1, 1);
			if (endchar == '%'){
				v = parseInt(v.substr(0, v.length-1));
				if (property.toLowerCase().indexOf('width') >= 0){
					v = Math.floor((parent.width()-delta) * v / 100.0);
				} else {
					v = Math.floor((parent.height()-delta) * v / 100.0);
				}
			} else {
				v = parseInt(v) || undefined;
			}
			return v;
		},
		
		/**
		 * parse options, including standard 'data-options' attribute.
		 * 
		 * calling examples:
		 * $.parser.parseOptions(target);
		 * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
		 */
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-options'));
			if (s){
				if (s.substring(0, 1) != '{'){
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
			$.map(['width','height','left','top','minWidth','maxWidth','minHeight','maxHeight'], function(p){
				var pv = $.trim(target.style[p] || '');
				if (pv){
					if (pv.indexOf('%') == -1){
						pv = parseInt(pv) || undefined;
					}
					options[p] = pv;
				}
			});
				
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						opts[pp] = t.attr(pp);
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}
						}
					}
				}
				$.extend(options, opts);
			}
			return options;
		}
	};
	$(function(){
		var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
		$._boxModel = d.outerWidth()!=100;
		d.remove();
		
		if (!window.easyloader && $.parser.auto){
			$.parser.parse();
		}
	});
	
	/**
	 * extend plugin to set box model width
	 */
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				return this.width() || document.body.clientWidth;
			}
			return this.outerWidth()||0;
		}
		return this._size('width', width);
	};
	
	/**
	 * extend plugin to set box model height
	 */
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				return this.height() || document.body.clientHeight;
			}
			return this.outerHeight()||0;
		}
		return this._size('height', height);
	};
	
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	};
	
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	
	$.fn._size = function(options, parent){
		if (typeof options == 'string'){
			if (options == 'clear'){
				return this.each(function(){
					$(this).css({width:'',minWidth:'',maxWidth:'',height:'',minHeight:'',maxHeight:''});
				});
			} else if (options == 'fit'){
				return this.each(function(){
					_fit(this, this.tagName=='BODY' ? $('body') : $(this).parent(), true);
				});
			} else if (options == 'unfit'){
				return this.each(function(){
					_fit(this, $(this).parent(), false);
				});
			} else {
				if (parent == undefined){
					return _css(this[0], options);
				} else {
					return this.each(function(){
						_css(this, options, parent);
					});
				}
			}
		} else {
			return this.each(function(){
				parent = parent || $(this).parent();
				$.extend(options, _fit(this, parent, options.fit)||{});
				var r1 = _setSize(this, 'width', parent, options);
				var r2 = _setSize(this, 'height', parent, options);
				if (r1 || r2){
					$(this).addClass('easyui-fluid');
				} else {
					$(this).removeClass('easyui-fluid');
				}
			});
		}
		
		function _fit(target, parent, fit){
			if (!parent.length){return false;}
			var t = $(target)[0];
			var p = parent[0];
			var fcount = p.fcount || 0;
			if (fit){
				if (!t.fitted){
					t.fitted = true;
					p.fcount = fcount + 1;
					$(p).addClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').addClass('panel-fit');
					}
				}
				return {
					width: ($(p).width()||1),
					height: ($(p).height()||1)
				};
			} else {
				if (t.fitted){
					t.fitted = false;
					p.fcount = fcount - 1;
					if (p.fcount == 0){
						$(p).removeClass('panel-noscroll');
						if (p.tagName == 'BODY'){
							$('html').removeClass('panel-fit');
						}
					}
				}
				return false;
			}
		}
		function _setSize(target, property, parent, options){
			var t = $(target);
			var p = property;
			var p1 = p.substr(0,1).toUpperCase() + p.substr(1);
			var min = $.parser.parseValue('min'+p1, options['min'+p1], parent);// || 0;
			var max = $.parser.parseValue('max'+p1, options['max'+p1], parent);// || 99999;
			var val = $.parser.parseValue(p, options[p], parent);
			var fluid = (String(options[p]||'').indexOf('%') >= 0 ? true : false);
			
			if (!isNaN(val)){
				var v = Math.min(Math.max(val, min||0), max||99999);
				if (!fluid){
					options[p] = v;
				}
				t._size('min'+p1, '');
				t._size('max'+p1, '');
				t._size(p, v);
			} else {
				t._size(p, '');
				t._size('min'+p1, min);
				t._size('max'+p1, max);
			}
			return fluid || options.fit;
		}
		function _css(target, property, value){
			var t = $(target);
			if (value == undefined){
				value = parseInt(target.style[property]);
				if (isNaN(value)){return undefined;}
				if ($._boxModel){
					value += getDeltaSize();
				}
				return value;
			} else if (value === ''){
				t.css(property, '');
			} else {
				if ($._boxModel){
					value -= getDeltaSize();
					if (value < 0){value = 0;}
				}
				t.css(property, value+'px');
			}
			function getDeltaSize(){
				if (property.toLowerCase().indexOf('width') >= 0){
					return t.outerWidth() - t.width();
				} else {
					return t.outerHeight() - t.height();
				}
			}
		}
	};
	
})(jQuery);

/**
 * support for mobile devices
 */
(function($){
	var longTouchTimer = null;
	var dblTouchTimer = null;
	var isDblClick = false;
	
	function onTouchStart(e){
		if (e.touches.length != 1){return}
		if (!isDblClick){
			isDblClick = true;
			dblClickTimer = setTimeout(function(){
				isDblClick = false;
			}, 500);
		} else {
			clearTimeout(dblClickTimer);
			isDblClick = false;
			fire(e, 'dblclick');
//			e.preventDefault();
		}
		longTouchTimer = setTimeout(function(){
			fire(e, 'contextmenu', 3);
		}, 1000);
		fire(e, 'mousedown');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchMove(e){
		if (e.touches.length != 1){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mousemove');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchEnd(e){
//		if (e.touches.length > 0){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mouseup');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	
	function fire(e, name, which){
		var event = new $.Event(name);
		event.pageX = e.changedTouches[0].pageX;
		event.pageY = e.changedTouches[0].pageY;
		event.which = which || 1;
		$(e.target).trigger(event);
	}
	
	if (document.addEventListener){
		document.addEventListener("touchstart", onTouchStart, true);
		document.addEventListener("touchmove", onTouchMove, true);
		document.addEventListener("touchend", onTouchEnd, true);
	}
})(jQuery);

/**
 * draggable - jQuery EasyUI
 * 
 */
(function($){
	function drag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		
		var dragData = e.data;
		var left = dragData.startLeft + e.pageX - dragData.startX;
		var top = dragData.startTop + e.pageY - dragData.startY;
		
		if (proxy){
			if (proxy.parent()[0] == document.body){
				if (opts.deltaX != null && opts.deltaX != undefined){
					left = e.pageX + opts.deltaX;
				} else {
					left = e.pageX - e.data.offsetWidth;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top = e.pageY + opts.deltaY;
				} else {
					top = e.pageY - e.data.offsetHeight;
				}
			} else {
				if (opts.deltaX != null && opts.deltaX != undefined){
					left += e.data.offsetWidth + opts.deltaX;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top += e.data.offsetHeight + opts.deltaY;
				}
			}
		}
		
		if (e.data.parent != document.body) {
			left += $(e.data.parent).scrollLeft();
			top += $(e.data.parent).scrollTop();
		}
		
		if (opts.axis == 'h') {
			dragData.left = left;
		} else if (opts.axis == 'v') {
			dragData.top = top;
		} else {
			dragData.left = left;
			dragData.top = top;
		}
	}
	
	function applyDrag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		if (!proxy){
			proxy = $(e.data.target);
		}
		proxy.css({
			left:e.data.left,
			top:e.data.top
		});
		$('body').css('cursor', opts.cursor);
	}
	
	function doDown(e){
		if (!$.fn.draggable.isDragging){return false;}
		
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		
		var droppables = $('.droppable').filter(function(){
			return e.data.target != this;
		}).filter(function(){
			var accept = $.data(this, 'droppable').options.accept;
			if (accept){
				return $(accept).filter(function(){
					return this == e.data.target;
				}).length > 0;
			} else {
				return true;
			}
		});
		state.droppables = droppables;
		
		var proxy = state.proxy;
		if (!proxy){
			if (opts.proxy){
				if (opts.proxy == 'clone'){
					proxy = $(e.data.target).clone().insertAfter(e.data.target);
				} else {
					proxy = opts.proxy.call(e.data.target, e.data.target);
				}
				state.proxy = proxy;
			} else {
				proxy = $(e.data.target);
			}
		}
		
		proxy.css('position', 'absolute');
		drag(e);
		applyDrag(e);
		
		opts.onStartDrag.call(e.data.target, e);
		return false;
	}
	
	function doMove(e){
		if (!$.fn.draggable.isDragging){return false;}
		
		var state = $.data(e.data.target, 'draggable');
		drag(e);
		if (state.options.onDrag.call(e.data.target, e) != false){
			applyDrag(e);
		}
		
		var source = e.data.target;
		state.droppables.each(function(){
			var dropObj = $(this);
			if (dropObj.droppable('options').disabled){return;}
			
			var p2 = dropObj.offset();
			if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
					&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
				if (!this.entered){
					$(this).trigger('_dragenter', [source]);
					this.entered = true;
				}
				$(this).trigger('_dragover', [source]);
			} else {
				if (this.entered){
					$(this).trigger('_dragleave', [source]);
					this.entered = false;
				}
			}
		});
		
		return false;
	}
	
	function doUp(e){
		if (!$.fn.draggable.isDragging){
			clearDragging();
			return false;
		}
		
		doMove(e);
		
		var state = $.data(e.data.target, 'draggable');
		var proxy = state.proxy;
		var opts = state.options;
		if (opts.revert){
			if (checkDrop() == true){
				$(e.data.target).css({
					position:e.data.startPosition,
					left:e.data.startLeft,
					top:e.data.startTop
				});
			} else {
				if (proxy){
					var left, top;
					if (proxy.parent()[0] == document.body){
						left = e.data.startX - e.data.offsetWidth;
						top = e.data.startY - e.data.offsetHeight;
					} else {
						left = e.data.startLeft;
						top = e.data.startTop;
					}
					proxy.animate({
						left: left,
						top: top
					}, function(){
						removeProxy();
					});
				} else {
					$(e.data.target).animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						$(e.data.target).css('position', e.data.startPosition);
					});
				}
			}
		} else {
			$(e.data.target).css({
				position:'absolute',
				left:e.data.left,
				top:e.data.top
			});
			checkDrop();
		}
		
		opts.onStopDrag.call(e.data.target, e);
		
		clearDragging();
		
		function removeProxy(){
			if (proxy){
				proxy.remove();
			}
			state.proxy = null;
		}
		
		function checkDrop(){
			var dropped = false;
			state.droppables.each(function(){
				var dropObj = $(this);
				if (dropObj.droppable('options').disabled){return;}
				
				var p2 = dropObj.offset();
				if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
					if (opts.revert){
						$(e.data.target).css({
							position:e.data.startPosition,
							left:e.data.startLeft,
							top:e.data.startTop
						});
					}
					$(this).trigger('_drop', [e.data.target]);
					removeProxy();
					dropped = true;
					this.entered = false;
					return false;
				}
			});
			if (!dropped && !opts.revert){
				removeProxy();
			}
			return dropped;
		}
		
		return false;
	}
	
	function clearDragging(){
		if ($.fn.draggable.timer){
			clearTimeout($.fn.draggable.timer);
			$.fn.draggable.timer = undefined;
		}
		$(document).unbind('.draggable');
		$.fn.draggable.isDragging = false;
		setTimeout(function(){
			$('body').css('cursor','');
		},100);
	}
	
	$.fn.draggable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.draggable.methods[options](this, param);
		}
		
		return this.each(function(){
			var opts;
			var state = $.data(this, 'draggable');
			if (state) {
				state.handle.unbind('.draggable');
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.draggable.defaults, $.fn.draggable.parseOptions(this), options || {});
			}
			var handle = opts.handle ? (typeof opts.handle=='string' ? $(opts.handle, this) : opts.handle) : $(this);
			
			$.data(this, 'draggable', {
				options: opts,
				handle: handle
			});
			
			if (opts.disabled) {
				$(this).css('cursor', '');
				return;
			}
			
			handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
				if ($.fn.draggable.isDragging){return}
				var opts = $.data(e.data.target, 'draggable').options;
				if (checkArea(e)){
					$(this).css('cursor', opts.cursor);
				} else {
					$(this).css('cursor', '');
				}
			}).bind('mouseleave.draggable', {target:this}, function(e){
				$(this).css('cursor', '');
			}).bind('mousedown.draggable', {target:this}, function(e){
				if (checkArea(e) == false) return;
				$(this).css('cursor', '');

				var position = $(e.data.target).position();
				var offset = $(e.data.target).offset();
				var data = {
					startPosition: $(e.data.target).css('position'),
					startLeft: position.left,
					startTop: position.top,
					left: position.left,
					top: position.top,
					startX: e.pageX,
					startY: e.pageY,
					offsetWidth: (e.pageX - offset.left),
					offsetHeight: (e.pageY - offset.top),
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				
				$.extend(e.data, data);
				var opts = $.data(e.data.target, 'draggable').options;
				if (opts.onBeforeDrag.call(e.data.target, e) == false) return;
				
				$(document).bind('mousedown.draggable', e.data, doDown);
				$(document).bind('mousemove.draggable', e.data, doMove);
				$(document).bind('mouseup.draggable', e.data, doUp);
				
				$.fn.draggable.timer = setTimeout(function(){
					$.fn.draggable.isDragging = true;
					doDown(e);
				}, opts.delay);
				return false;
			});
			
			// check if the handle can be dragged
			function checkArea(e) {
				var state = $.data(e.data.target, 'draggable');
				var handle = state.handle;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				
				return Math.min(t,r,b,l) > state.options.edge;
			}
			
		});
	};
	
	$.fn.draggable.methods = {
		options: function(jq){
			return $.data(jq[0], 'draggable').options;
		},
		proxy: function(jq){
			return $.data(jq[0], 'draggable').proxy;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:true});
			});
		}
	};
	
	$.fn.draggable.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, 
				$.parser.parseOptions(target, ['cursor','handle','axis',
				       {'revert':'boolean','deltaX':'number','deltaY':'number','edge':'number','delay':'number'}]), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.draggable.defaults = {
		proxy:null,	// 'clone' or a function that will create the proxy object, 
					// the function has the source parameter that indicate the source object dragged.
		revert:false,
		cursor:'move',
		deltaX:null,
		deltaY:null,
		handle: null,
		disabled: false,
		edge:0,
		axis:null,	// v or h
		delay:100,
		
		onBeforeDrag: function(e){},
		onStartDrag: function(e){},
		onDrag: function(e){},
		onStopDrag: function(e){}
	};
	
	$.fn.draggable.isDragging = false;
	
})(jQuery);
/**
 * droppable - jQuery EasyUI
 * 
 */
(function($){
	function init(target){
		$(target).addClass('droppable');
		$(target).bind('_dragenter', function(e, source){
			$.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
		});
		$(target).bind('_dragleave', function(e, source){
			$.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
		});
		$(target).bind('_dragover', function(e, source){
			$.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
		});
		$(target).bind('_drop', function(e, source){
			$.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
		});
	}
	
	$.fn.droppable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.droppable.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'droppable');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'droppable', {
					options: $.extend({}, $.fn.droppable.defaults, $.fn.droppable.parseOptions(this), options)
				});
			}
		});
	};
	
	$.fn.droppable.methods = {
		options: function(jq){
			return $.data(jq[0], 'droppable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:true});
			});
		}
	};
	
	$.fn.droppable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},	$.parser.parseOptions(target, ['accept']), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.droppable.defaults = {
		accept:null,
		disabled:false,
		onDragEnter:function(e, source){},
		onDragOver:function(e, source){},
		onDragLeave:function(e, source){},
		onDrop:function(e, source){}
	};
})(jQuery);
/**
 * resizable - jQuery EasyUI
 * 
 */
(function($){
//	var isResizing = false;
	$.fn.resizable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.resizable.methods[options](this, param);
		}
		
		function resize(e){
			var resizeData = e.data;
			var options = $.data(resizeData.target, 'resizable').options;
			if (resizeData.dir.indexOf('e') != -1) {
				var width = resizeData.startWidth + e.pageX - resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
			}
			if (resizeData.dir.indexOf('s') != -1) {
				var height = resizeData.startHeight + e.pageY - resizeData.startY;
				height = Math.min(
						Math.max(height, options.minHeight),
						options.maxHeight
				);
				resizeData.height = height;
			}
			if (resizeData.dir.indexOf('w') != -1) {
				var width = resizeData.startWidth - e.pageX + resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
				resizeData.left = resizeData.startLeft + resizeData.startWidth - resizeData.width;
				
//				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
//				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
//					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
//				}
			}
			if (resizeData.dir.indexOf('n') != -1) {
				var height = resizeData.startHeight - e.pageY + resizeData.startY;
				height = Math.min(
							Math.max(height, options.minHeight),
							options.maxHeight
						);
				resizeData.height = height;
				resizeData.top = resizeData.startTop + resizeData.startHeight - resizeData.height;
				
//				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
//				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
//					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
//				}
			}
		}
		
		function applySize(e){
			var resizeData = e.data;
			var t = $(resizeData.target);
			t.css({
				left: resizeData.left,
				top: resizeData.top
			});
			if (t.outerWidth() != resizeData.width){t._outerWidth(resizeData.width)}
			if (t.outerHeight() != resizeData.height){t._outerHeight(resizeData.height)}
//			t._outerWidth(resizeData.width)._outerHeight(resizeData.height);
		}
		
		function doDown(e){
//			isResizing = true;
			$.fn.resizable.isResizing = true;
			$.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
			return false;
		}
		
		function doMove(e){
			resize(e);
			if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
				applySize(e)
			}
			return false;
		}
		
		function doUp(e){
//			isResizing = false;
			$.fn.resizable.isResizing = false;
			resize(e, true);
			applySize(e);
			$.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
			$(document).unbind('.resizable');
			$('body').css('cursor','');
//			$('body').css('cursor','auto');
			return false;
		}
		
		return this.each(function(){
			var opts = null;
			var state = $.data(this, 'resizable');
			if (state) {
				$(this).unbind('.resizable');
				opts = $.extend(state.options, options || {});
			} else {
				opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
				$.data(this, 'resizable', {
					options:opts
				});
			}
			
			if (opts.disabled == true) {
				return;
			}
			
			// bind mouse event using namespace resizable
			$(this).bind('mousemove.resizable', {target:this}, function(e){
//				if (isResizing) return;
				if ($.fn.resizable.isResizing){return}
				var dir = getDirection(e);
				if (dir == '') {
					$(e.data.target).css('cursor', '');
				} else {
					$(e.data.target).css('cursor', dir + '-resize');
				}
			}).bind('mouseleave.resizable', {target:this}, function(e){
				$(e.data.target).css('cursor', '');
			}).bind('mousedown.resizable', {target:this}, function(e){
				var dir = getDirection(e);
				if (dir == '') return;
				
				function getCssValue(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				}
				
				var data = {
					target: e.data.target,
					dir: dir,
					startLeft: getCssValue('left'),
					startTop: getCssValue('top'),
					left: getCssValue('left'),
					top: getCssValue('top'),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind('mousedown.resizable', data, doDown);
				$(document).bind('mousemove.resizable', data, doMove);
				$(document).bind('mouseup.resizable', data, doUp);
				$('body').css('cursor', dir+'-resize');
			});
			
			// get the resize direction
			function getDirection(e) {
				var tt = $(e.data.target);
				var dir = '';
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = opts.edge;
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {
					dir += 'n';
				} else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
					dir += 's';
				}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {
					dir += 'w';
				} else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
					dir += 'e';
				}
				
				var handles = opts.handles.split(',');
				for(var i=0; i<handles.length; i++) {
					var handle = handles[i].replace(/(^\s*)|(\s*$)/g, '');
					if (handle == 'all' || handle == dir) {
						return dir;
					}
				}
				return '';
			}
			
			
		});
	};
	
	$.fn.resizable.methods = {
		options: function(jq){
			return $.data(jq[0], 'resizable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:true});
			});
		}
	};
	
	$.fn.resizable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					'handles',{minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number',edge:'number'}
				]), {
			disabled: (t.attr('disabled') ? true : undefined)
		})
	};
	
	$.fn.resizable.defaults = {
		disabled:false,
		handles:'n, e, s, w, ne, se, sw, nw, all',
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,//$(document).width(),
		maxHeight: 10000,//$(document).height(),
		edge:5,
		onStartResize: function(e){},
		onResize: function(e){},
		onStopResize: function(e){}
	};
	
	$.fn.resizable.isResizing = false;
	
})(jQuery);
/**
 * linkbutton - jQuery EasyUI
 * 
 */
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'linkbutton').options;
		if (param){
			$.extend(opts, param);
		}
		if (opts.width || opts.height || opts.fit){
			var btn = $(target);
			var parent = btn.parent();
			var isVisible = btn.is(':visible');
			if (!isVisible){
				var spacer = $('<div style="display:none"></div>').insertBefore(target);
				var style = {
					position: btn.css('position'),
					display: btn.css('display'),
					left: btn.css('left')
				};
				btn.appendTo('body');
				btn.css({
					position: 'absolute',
					display: 'inline-block',
					left: -20000
				});
			}
			btn._size(opts, parent);
			var left = btn.find('.l-btn-left');
			left.css('margin-top', 0);
			left.css('margin-top', parseInt((btn.height()-left.height())/2)+'px');
			if (!isVisible){
				btn.insertAfter(spacer);
				btn.css(style);
				spacer.remove();
			}
		}
	}
	
	function createButton(target) {
		var opts = $.data(target, 'linkbutton').options;
		var t = $(target).empty();
		
		t.addClass('l-btn').removeClass('l-btn-plain l-btn-selected l-btn-plain-selected l-btn-outline');
		t.removeClass('l-btn-small l-btn-medium l-btn-large').addClass('l-btn-'+opts.size);
		if (opts.plain){t.addClass('l-btn-plain')}
		if (opts.outline){t.addClass('l-btn-outline')}
		if (opts.selected){
			t.addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
		}
		t.attr('group', opts.group || '');
		t.attr('id', opts.id || '');
		
		var inner = $('<span class="l-btn-left"></span>').appendTo(t);
		if (opts.text){
			$('<span class="l-btn-text"></span>').html(opts.text).appendTo(inner);
		} else {
			$('<span class="l-btn-text l-btn-empty">&nbsp;</span>').appendTo(inner);
		}
		if (opts.iconCls){
			$('<span class="l-btn-icon">&nbsp;</span>').addClass(opts.iconCls).appendTo(inner);
			inner.addClass('l-btn-icon-'+opts.iconAlign);
		}
		
		t.unbind('.linkbutton').bind('focus.linkbutton',function(){
			if (!opts.disabled){
				$(this).addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton',function(){
			$(this).removeClass('l-btn-focus');
		}).bind('click.linkbutton',function(){
			if (!opts.disabled){
				if (opts.toggle){
					if (opts.selected){
						$(this).linkbutton('unselect');
					} else {
						$(this).linkbutton('select');
					}
				}
				opts.onClick.call(this);
			}
//			return false;
		});
//		if (opts.toggle && !opts.disabled){
//			t.bind('click.linkbutton', function(){
//				if (opts.selected){
//					$(this).linkbutton('unselect');
//				} else {
//					$(this).linkbutton('select');
//				}
//			});
//		}
		
		setSelected(target, opts.selected)
		setDisabled(target, opts.disabled);
	}
	
	function setSelected(target, selected){
		var opts = $.data(target, 'linkbutton').options;
		if (selected){
			if (opts.group){
				$('a.l-btn[group="'+opts.group+'"]').each(function(){
					var o = $(this).linkbutton('options');
					if (o.toggle){
						$(this).removeClass('l-btn-selected l-btn-plain-selected');
						o.selected = false;
					}
				});
			}
			$(target).addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
			opts.selected = true;
		} else {
			if (!opts.group){
				$(target).removeClass('l-btn-selected l-btn-plain-selected');
				opts.selected = false;
			}
		}
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'linkbutton');
		var opts = state.options;
		$(target).removeClass('l-btn-disabled l-btn-plain-disabled');
		if (disabled){
			opts.disabled = true;
			var href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
			opts.plain ? $(target).addClass('l-btn-disabled l-btn-plain-disabled') : $(target).addClass('l-btn-disabled');
		} else {
			opts.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
		}
	}
	
	$.fn.linkbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.linkbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'linkbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
				$(this).bind('_resize', function(e, force){
					if ($(this).hasClass('easyui-fluid') || force){
						setSize(this);
					}
					return false;
				});
			}
			
			createButton(this);
			setSize(this);
		});
	};
	
	$.fn.linkbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'linkbutton').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		select: function(jq){
			return jq.each(function(){
				setSelected(this, true);
			});
		},
		unselect: function(jq){
			return jq.each(function(){
				setSelected(this, false);
			});
		}
	};
	
	$.fn.linkbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['id','iconCls','iconAlign','group','size',{plain:'boolean',toggle:'boolean',selected:'boolean',outline:'boolean'}]
		), {
			disabled: (t.attr('disabled') ? true : undefined),
			text: $.trim(t.html()),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};
	
	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		toggle: false,
		selected: false,
		outline: false,
		group: null,
		plain: false,
		text: '',
		iconCls: null,
		iconAlign: 'left',
		size: 'small',	// small,large
		onClick: function(){}
	};
	
})(jQuery);
/**
 * pagination - jQuery EasyUI
 * 
 * Dependencies:
 * 	linkbutton
 * 
 */
(function($){
	function buildToolbar(target){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		var bb = state.bb = {};	// the buttons;
		
		var pager = $(target).addClass('pagination').html('<table cellspacing="0" cellpadding="0" border="0"><tr></tr></table>');
		var tr = pager.find('tr');
		
		var aa = $.extend([], opts.layout);
		if (!opts.showPageList){removeArrayItem(aa, 'list');}
		if (!opts.showRefresh){removeArrayItem(aa, 'refresh');}
		if (aa[0] == 'sep'){aa.shift();}
		if (aa[aa.length-1] == 'sep'){aa.pop();}
		
		for(var index=0; index<aa.length; index++){
			var item = aa[index];
			if (item == 'list'){
				var ps = $('<select class="pagination-page-list"></select>');
				ps.bind('change', function(){
					opts.pageSize = parseInt($(this).val());
					opts.onChangePageSize.call(target, opts.pageSize);
					selectPage(target, opts.pageNumber);
				});
				for(var i=0; i<opts.pageList.length; i++) {
					$('<option></option>').text(opts.pageList[i]).appendTo(ps);
				}
				$('<td></td>').append(ps).appendTo(tr);
			} else if (item == 'sep'){
				$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			} else if (item == 'first'){
				bb.first = createButton('first');
			} else if (item == 'prev'){
				bb.prev = createButton('prev');
			} else if (item == 'next'){
				bb.next = createButton('next');
			} else if (item == 'last'){
				bb.last = createButton('last');
			} else if (item == 'manual'){
				$('<span style="padding-left:6px;"></span>').html(opts.beforePageText).appendTo(tr).wrap('<td></td>');
				bb.num = $('<input class="pagination-num" type="text" value="1" size="2">').appendTo(tr).wrap('<td></td>');
				bb.num.unbind('.pagination').bind('keydown.pagination', function(e){
					if (e.keyCode == 13){
						var pageNumber = parseInt($(this).val()) || 1;
						selectPage(target, pageNumber);
						return false;
					}
				});
				bb.after = $('<span style="padding-right:6px;"></span>').appendTo(tr).wrap('<td></td>');
			} else if (item == 'refresh'){
				bb.refresh = createButton('refresh');
			} else if (item == 'links'){
				$('<td class="pagination-links"></td>').appendTo(tr);
			}
		}
		if (opts.buttons){
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			if ($.isArray(opts.buttons)){
				for(var i=0; i<opts.buttons.length; i++){
					var btn = opts.buttons[i];
					if (btn == '-') {
						$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
					} else {
						var td = $('<td></td>').appendTo(tr);
						var a = $('<a href="javascript:void(0)"></a>').appendTo(td);
						a[0].onclick = eval(btn.handler || function(){});
						a.linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			} else {
				var td = $('<td></td>').appendTo(tr);
				$(opts.buttons).appendTo(td).show();
			}
		}
		$('<div class="pagination-info"></div>').appendTo(pager);
		$('<div style="clear:both;"></div>').appendTo(pager);
		
		function createButton(name){
			var btn = opts.nav[name];
			var a = $('<a href="javascript:void(0)"></a>').appendTo(tr);
			a.wrap('<td></td>');
			a.linkbutton({
				iconCls: btn.iconCls,
				plain: true
			}).unbind('.pagination').bind('click.pagination', function(){
				btn.handler.call(target);
			});
			return a;
		}
		function removeArrayItem(aa, item){
			var index = $.inArray(item, aa);
			if (index >= 0){
				aa.splice(index, 1);
			}
			return aa;
		}
	}
	
	function selectPage(target, page){
		var opts = $.data(target, 'pagination').options;
		refreshData(target, {pageNumber:page});
		opts.onSelectPage.call(target, opts.pageNumber, opts.pageSize);
	}
	
	function refreshData(target, param){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		var bb = state.bb;
		
		$.extend(opts, param||{});
		
		var ps = $(target).find('select.pagination-page-list');
		if (ps.length){
			ps.val(opts.pageSize+'');
			opts.pageSize = parseInt(ps.val());
		}
		
		var pageCount = Math.ceil(opts.total/opts.pageSize) || 1;
		if (opts.pageNumber < 1){opts.pageNumber = 1;}
		if (opts.pageNumber > pageCount){opts.pageNumber = pageCount}
		if (opts.total == 0){
			opts.pageNumber = 0;
			pageCount = 0;
		}
		
		if (bb.num) {bb.num.val(opts.pageNumber);}
		if (bb.after) {bb.after.html(opts.afterPageText.replace(/{pages}/, pageCount));}
		
		var td = $(target).find('td.pagination-links');
		if (td.length){
			td.empty();
			var listBegin = opts.pageNumber - Math.floor(opts.links/2);
			if (listBegin < 1) {listBegin = 1;}
			var listEnd = listBegin + opts.links - 1;
			if (listEnd > pageCount) {listEnd = pageCount;}
			listBegin = listEnd - opts.links + 1;
			if (listBegin < 1) {listBegin = 1;}
			for(var i=listBegin; i<=listEnd; i++){
				var a = $('<a class="pagination-link" href="javascript:void(0)"></a>').appendTo(td);
				a.linkbutton({
					plain:true,
					text:i
				});
				if (i == opts.pageNumber){
					a.linkbutton('select');
				} else {
					a.unbind('.pagination').bind('click.pagination', {pageNumber:i}, function(e){
						selectPage(target, e.data.pageNumber);
					});
				}
			}
		}
		
		var pinfo = opts.displayMsg;
		pinfo = pinfo.replace(/{from}/, opts.total==0 ? 0 : opts.pageSize*(opts.pageNumber-1)+1);
		pinfo = pinfo.replace(/{to}/, Math.min(opts.pageSize*(opts.pageNumber), opts.total));
		pinfo = pinfo.replace(/{total}/, opts.total);
		
		$(target).find('div.pagination-info').html(pinfo);
		
//		bb.first.add(bb.prev).linkbutton({disabled: (opts.pageNumber == 1)});
//		bb.next.add(bb.last).linkbutton({disabled: (opts.pageNumber == pageCount)});
		
		if (bb.first){bb.first.linkbutton({disabled: ((!opts.total) || opts.pageNumber == 1)})}
		if (bb.prev){bb.prev.linkbutton({disabled: ((!opts.total) || opts.pageNumber == 1)})}
		if (bb.next){bb.next.linkbutton({disabled: (opts.pageNumber == pageCount)})}
		if (bb.last){bb.last.linkbutton({disabled: (opts.pageNumber == pageCount)})}
		
		setLoadStatus(target, opts.loading);
	}
	
	function setLoadStatus(target, loading){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		opts.loading = loading;
		if (opts.showRefresh && state.bb.refresh){
			state.bb.refresh.linkbutton({
				iconCls:(opts.loading ? 'pagination-loading' : 'pagination-load')
			});
		}
	}
	
	$.fn.pagination = function(options, param) {
		if (typeof options == 'string'){
			return $.fn.pagination.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var opts;
			var state = $.data(this, 'pagination');
			if (state) {
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.pagination.defaults, $.fn.pagination.parseOptions(this), options);
				$.data(this, 'pagination', {
					options: opts
				});
			}
			
			buildToolbar(this);
			refreshData(this);
			
		});
	};
	
	$.fn.pagination.methods = {
		options: function(jq){
			return $.data(jq[0], 'pagination').options;
		},
		loading: function(jq){
			return jq.each(function(){
				setLoadStatus(this, true);
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				setLoadStatus(this, false);
			});
		},
		refresh: function(jq, options){
			return jq.each(function(){
				refreshData(this, options);
			});
		},
		select: function(jq, page){
			return jq.each(function(){
				selectPage(this, page);
			});
		}
	};
	
	$.fn.pagination.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					{total:'number',pageSize:'number',pageNumber:'number',links:'number'},
					{loading:'boolean',showPageList:'boolean',showRefresh:'boolean'}
				]), {
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined)
		});
	};
	
	$.fn.pagination.defaults = {
		total: 1,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10,20,30,50],
		loading: false,
		buttons: null,
		showPageList: true,
		showRefresh: true,
		links: 10,
		layout: ['list','sep','first','prev','sep','manual','sep','next','last','sep','refresh'],
		
		onSelectPage: function(pageNumber, pageSize){},
		onBeforeRefresh: function(pageNumber, pageSize){},
		onRefresh: function(pageNumber, pageSize){},
		onChangePageSize: function(pageSize){},
		
		beforePageText: 'Page',
		afterPageText: 'of {pages}',
		displayMsg: 'Displaying {from} to {to} of {total} items',
		
		nav: {
			first: {
				iconCls: 'pagination-first',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.pageNumber > 1){$(this).pagination('select', 1)}
				}
			},
			prev: {
				iconCls: 'pagination-prev',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.pageNumber > 1){$(this).pagination('select', opts.pageNumber - 1)}
				}
			},
			next: {
				iconCls: 'pagination-next',
				handler: function(){
					var opts = $(this).pagination('options');
					var pageCount = Math.ceil(opts.total/opts.pageSize);
					if (opts.pageNumber < pageCount){$(this).pagination('select', opts.pageNumber + 1)}
				}
			},
			last: {
				iconCls: 'pagination-last',
				handler: function(){
					var opts = $(this).pagination('options');
					var pageCount = Math.ceil(opts.total/opts.pageSize);
					if (opts.pageNumber < pageCount){$(this).pagination('select', pageCount)}
				}
			},
			refresh: {
				iconCls: 'pagination-refresh',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.onBeforeRefresh.call(this, opts.pageNumber, opts.pageSize) != false){
						$(this).pagination('select', opts.pageNumber);
						opts.onRefresh.call(this, opts.pageNumber, opts.pageSize);
					}
				}
			}
		}
	};
})(jQuery);
/**
 * tree - jQuery EasyUI
 * 
 * Dependencies:
 * 	 draggable
 *   droppable
 *   
 * Node is a javascript object which contains following properties:
 * 1 id: An identity value bind to the node.
 * 2 text: Text to be showed.
 * 3 checked: Indicate whether the node is checked selected.
 * 3 attributes: Custom attributes bind to the node.
 * 4 target: Target DOM object.
 */
(function($){
	/**
	 * wrap the <ul> tag as a tree and then return it.
	 */
	function wrapTree(target){
		var tree = $(target);
		tree.addClass('tree');
		return tree;
	}
	
	function bindTreeEvents(target){
		var opts = $.data(target, 'tree').options;
		$(target).unbind().bind('mouseover', function(e){
			var tt = $(e.target);
			var node = tt.closest('div.tree-node');
			if (!node.length){return;}
			node.addClass('tree-node-hover');
			if (tt.hasClass('tree-hit')){
				if (tt.hasClass('tree-expanded')){
					tt.addClass('tree-expanded-hover');
				} else {
					tt.addClass('tree-collapsed-hover');
				}
			}
			e.stopPropagation();
		}).bind('mouseout', function(e){
			var tt = $(e.target);
			var node = tt.closest('div.tree-node');
			if (!node.length){return;}
			node.removeClass('tree-node-hover');
			if (tt.hasClass('tree-hit')){
				if (tt.hasClass('tree-expanded')){
					tt.removeClass('tree-expanded-hover');
				} else {
					tt.removeClass('tree-collapsed-hover');
				}
			}
			e.stopPropagation();
		}).bind('click', function(e){
			var tt = $(e.target);
			var node = tt.closest('div.tree-node');
			if (!node.length){return;}
			if (tt.hasClass('tree-hit')){
				toggleNode(target, node[0]);
				return false;
			} else if (tt.hasClass('tree-checkbox')){
				// checkNode(target, node[0], !tt.hasClass('tree-checkbox1'));
				checkNode(target, node[0]);
				return false;
			} else {
				selectNode(target, node[0]);
				opts.onClick.call(target, getNode(target, node[0]));
			}
			e.stopPropagation();
		}).bind('dblclick', function(e){
			var node = $(e.target).closest('div.tree-node');
			if (!node.length){return;}
			selectNode(target, node[0]);
			opts.onDblClick.call(target, getNode(target, node[0]));
			e.stopPropagation();
		}).bind('contextmenu', function(e){
			var node = $(e.target).closest('div.tree-node');
			if (!node.length){return;}
			opts.onContextMenu.call(target, e, getNode(target, node[0]));
			e.stopPropagation();
		});
	}
	
	function disableDnd(target){
		var opts = $.data(target, 'tree').options;
		opts.dnd = false;
		var nodes = $(target).find('div.tree-node');
		nodes.draggable('disable');
		nodes.css('cursor', 'pointer');
	}
	
	function enableDnd(target){
		var state = $.data(target, 'tree');
		var opts = state.options;
		var tree = state.tree;
		state.disabledNodes = [];
		opts.dnd = true;
		
		tree.find('div.tree-node').draggable({
			disabled: false,
			revert: true,
			cursor: 'pointer',
			proxy: function(source){
				var p = $('<div class="tree-node-proxy"></div>').appendTo('body');
//				var p = $('<div class="tree-node-proxy tree-dnd-no"></div>').appendTo('body');
				p.html('<span class="tree-dnd-icon tree-dnd-no">&nbsp;</span>'+$(source).find('.tree-title').html());
				p.hide();
				return p;
			},
			deltaX: 15,
			deltaY: 15,
			onBeforeDrag: function(e){
				if (opts.onBeforeDrag.call(target, getNode(target, this)) == false){return false}
				if ($(e.target).hasClass('tree-hit') || $(e.target).hasClass('tree-checkbox')){return false;}
				if (e.which != 1){return false;}
				$(this).next('ul').find('div.tree-node').droppable({accept:'no-accept'});	// the child node can't be dropped
				var indent = $(this).find('span.tree-indent');
				if (indent.length){
					e.data.offsetWidth -= indent.length*indent.width();
				}
			},
			onStartDrag: function(){
				$(this).draggable('proxy').css({
					left:-10000,
					top:-10000
				});
				opts.onStartDrag.call(target, getNode(target, this));
				var node = getNode(target, this);
				if (node.id == undefined){
					node.id = 'easyui_tree_node_id_temp';
					updateNode(target, node);
				}
				state.draggingNodeId = node.id;	// store the dragging node id
			},
			onDrag: function(e){
				var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
				var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				if (d>3){	// when drag a little distance, show the proxy object
					$(this).draggable('proxy').show();
				}
				this.pageY = e.pageY;
			},
			onStopDrag: function(){
				$(this).next('ul').find('div.tree-node').droppable({accept:'div.tree-node'}); // restore the accept property of child nodes
				for(var i=0; i<state.disabledNodes.length; i++){
					$(state.disabledNodes[i]).droppable('enable');
				}
				state.disabledNodes = [];
				// get the source node
				var node = findNode(target, state.draggingNodeId);
				if (node && node.id == 'easyui_tree_node_id_temp'){
					node.id = '';
					updateNode(target, node);
				}
				opts.onStopDrag.call(target, node);
			}
		}).droppable({
			accept:'div.tree-node',
			onDragEnter: function(e, source){
				if (opts.onDragEnter.call(target, this, getSourceData(source)) == false){
					allowDrop(source, false);
//					$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
					$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					$(this).droppable('disable');
					state.disabledNodes.push(this);
				}
			},
			onDragOver: function(e, source){
				if ($(this).droppable('options').disabled){return}
				var pageY = source.pageY;
				var top = $(this).offset().top;
				var bottom = top + $(this).outerHeight();
				
				allowDrop(source, true);
//				$(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
				if (pageY > top + (bottom - top) / 2){
					if (bottom - pageY < 5){
						$(this).addClass('tree-node-bottom');
					} else {
						$(this).addClass('tree-node-append');
					}
				} else {
					if (pageY - top < 5){
						$(this).addClass('tree-node-top');
					} else {
						$(this).addClass('tree-node-append');
					}
				}
				if (opts.onDragOver.call(target, this, getSourceData(source)) == false){
					allowDrop(source, false);
//					$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
					$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					$(this).droppable('disable');
					state.disabledNodes.push(this);
				}
			},
			onDragLeave: function(e, source){
				allowDrop(source, false);
//				$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
				opts.onDragLeave.call(target, this, getSourceData(source));
			},
			onDrop: function(e, source){
				var dest = this;
				var action, point;
				if ($(this).hasClass('tree-node-append')){
					action = append;
					point = 'append';
				} else {
					action = insert;
					point = $(this).hasClass('tree-node-top') ? 'top' : 'bottom';
				}
				
				if (opts.onBeforeDrop.call(target, dest, getSourceData(source), point) == false){
					$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					return;
				}
				action(source, dest, point);
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
			}
		});
		
		function getSourceData(source, pop){
			return $(source).closest('ul.tree').tree(pop?'pop':'getData', source);
		}
		
		function allowDrop(source, allowed){
			var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
			icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
		}
		
		function append(source, dest){
			if (getNode(target, dest).state == 'closed'){
				expandNode(target, dest, function(){
					doAppend();
				});
			} else {
				doAppend();
			}
			
			function doAppend(){
				var node = getSourceData(source, true);
				$(target).tree('append', {
					parent: dest,
					data: [node]
				});
				opts.onDrop.call(target, dest, node, 'append');
			}
		}
		
		function insert(source, dest, point){
			var param = {};
			if (point == 'top'){
				param.before = dest;
			} else {
				param.after = dest;
			}
			
			var node = getSourceData(source, true);
			param.data = node;
			$(target).tree('insert', param);
			opts.onDrop.call(target, dest, node, point);
		}
	}
	
	function checkNode(target, nodeEl, checked){
		var state = $.data(target, 'tree');
		var opts = state.options;
		if (!opts.checkbox) {return;}
		
		var nodedata = getNode(target, nodeEl);
		if (checked == undefined){
			var ck = $(nodeEl).find('.tree-checkbox');
			if (ck.hasClass('tree-checkbox1')){
				checked = false;
			} else if (ck.hasClass('tree-checkbox0')){
				checked = true;
			} else {
				if (nodedata._checked == undefined){
					nodedata._checked = $(nodeEl).find('.tree-checkbox').hasClass('tree-checkbox1');
				}
				checked = !nodedata._checked;				
			}
		}
		nodedata._checked = checked;

		if (opts.onBeforeCheck.call(target, nodedata, checked) == false){return;}
		if (opts.cascadeCheck){
			setChildCheckbox(nodedata, checked);
            if(opts.parentCheck){
                setParentCheckbox(nodedata, checked);
            }
		} else {
			setCheckedFlag($(nodedata.target), checked?'1':'0');
		}
		opts.onCheck.call(target, nodedata, checked);
		
		function setCheckedFlag(node, flag){
			var ck = node.find('.tree-checkbox');
			ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
			ck.addClass('tree-checkbox' + flag);
		}
		function setChildCheckbox(nodedata, checked){
			if (opts.deepCheck){
				var node = $('#'+nodedata.domId);
				var flag = checked ? '1' : '0';
				setCheckedFlag(node, flag);
				setCheckedFlag(node.next(), flag);
			} else {
				adjustClass(nodedata, checked);
				forNodes(nodedata.children||[], function(n){
					adjustClass(n, checked);
				});				
			}
		}
		function adjustClass(nodedata, checked){
			if (nodedata.hidden){return;}
			var cls = 'tree-checkbox' + (checked?'1':'0');
			var node = $('#'+nodedata.domId);
			setCheckedFlag(node, checked?'1':'0');
			if (nodedata.children){
				for(var i=0; i<nodedata.children.length; i++){
					if (nodedata.children[i].hidden){
						if (!$('#'+nodedata.children[i].domId).find('.'+cls).length){
							setCheckedFlag(node, '2');
							var pnode = getParentNode(target, node[0]);
							while(pnode){
								setCheckedFlag($(pnode.target), '2');
								pnode = getParentNode(target, pnode[0]);
							}
							return;
						}
					}
				}
			}
		}
		function setParentCheckbox(nodedata, checked){
			var node = $('#'+nodedata.domId);
			var pnode = getParentNode(target, node[0]);
			if (pnode){
				var flag = '';
				if (hasAllSiblings(node, true)){
					flag = '1';
				} else if (hasAllSiblings(node, false)){
					flag = '0';
				} else {
					flag = '2';
				}
				setCheckedFlag($(pnode.target), flag);
				setParentCheckbox(pnode, checked);
			}
		}
		function hasAllSiblings(node, checked){
			var cls = 'tree-checkbox' + (checked?'1':'0');
			var ck = node.find('.tree-checkbox');
			if (!ck.hasClass(cls)){return false;}
			var b = true;
			node.parent().siblings().each(function(){
				var ck = $(this).children('div.tree-node').children('.tree-checkbox');
				if (ck.length && !ck.hasClass(cls)){
					b = false;
					return false;
				}
			});
			return b;
		}
	}
	
	/**
	 * when append or remove node, adjust its parent node check status.
	 */
	function adjustCheck(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		if (!opts.checkbox){return}
		
		var node = $(nodeEl);
		if (isLeaf(target, nodeEl)){
			var ck = node.find('.tree-checkbox');
			if (ck.length){
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else {
					checkNode(target, nodeEl, false);
				}
			} else if (opts.onlyLeafCheck){
				$('<span class="tree-checkbox tree-checkbox0"></span>').insertBefore(node.find('.tree-title'));
			}
		} else {
			var ck = node.find('.tree-checkbox');
			if (opts.onlyLeafCheck){
				ck.remove();
			} else {
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else if (ck.hasClass('tree-checkbox2')){
					var allchecked = true;
					var allunchecked = true;
					var children = getChildren(target, nodeEl);
					for(var i=0; i<children.length; i++){
						if (children[i].checked){
							allunchecked = false;
						} else {
							allchecked = false;
						}
					}
					if (allchecked){
						checkNode(target, nodeEl, true);
					}
					if (allunchecked){
						checkNode(target, nodeEl, false);
					}
				}
			}
		}
	}
	
	/**
	 * load tree data to <ul> tag
	 * ul: the <ul> dom element
	 * data: array, the tree node data
	 * append: defines if to append data
	 */
	function loadData(target, ul, data, append){
		var state = $.data(target, 'tree');
		var opts = state.options;
		var parent = $(ul).prevAll('div.tree-node:first');
		data = opts.loadFilter.call(target, data, parent[0]);
		
		var pnode = findNodeBy(target, 'domId', parent.attr('id'));
		if (!append){
			pnode ? pnode.children = data : state.data = data;
			$(ul).empty();
		} else {
			if (pnode){
				pnode.children ? pnode.children = pnode.children.concat(data) : pnode.children = data;
			} else {
				state.data = state.data.concat(data);
			}
		}
		
		opts.view.render.call(opts.view, target, ul, data);
		
		if (opts.dnd){enableDnd(target);}
		if (pnode){updateNode(target, pnode);}
		
		var uncheckedNodes = [];
		var checkedNodes = [];
		for(var i=0; i<data.length; i++){
			var node = data[i];
			if (!node.checked){
				uncheckedNodes.push(node);
			}
		}
		forNodes(data, function(node){
			if (node.checked){
				checkedNodes.push(node);
			}
		});
		
		var onCheck = opts.onCheck;
		opts.onCheck = function(){};
		if (uncheckedNodes.length){
			checkNode(target, $('#'+uncheckedNodes[0].domId)[0], false);
		}
		for(var i=0; i<checkedNodes.length; i++){
			checkNode(target, $('#'+checkedNodes[i].domId)[0], true);
		}
		opts.onCheck = onCheck;
		
		setTimeout(function(){
			showLines(target, target);
		}, 0);
		
		opts.onLoadSuccess.call(target, pnode, data);
	}
	
	/**
	 * draw tree lines
	 */
	function showLines(target, ul, called){
		var opts = $.data(target, 'tree').options;
		if (opts.lines){
			$(target).addClass('tree-lines');
		} else {
			$(target).removeClass('tree-lines');
			return;
		}
		
		if (!called){
			called = true;
			$(target).find('span.tree-indent').removeClass('tree-line tree-join tree-joinbottom');
			$(target).find('div.tree-node').removeClass('tree-node-last tree-root-first tree-root-one');
			var roots = $(target).tree('getRoots');
			if (roots.length > 1){
				$(roots[0].target).addClass('tree-root-first');
			} else if (roots.length == 1){
				$(roots[0].target).addClass('tree-root-one');
			}
		}
		$(ul).children('li').each(function(){
			var node = $(this).children('div.tree-node');
			var ul = node.next('ul');
			if (ul.length){
				if ($(this).next().length){
					_line(node);
				}
				showLines(target, ul, called);
			} else {
				_join(node);
			}
		});
		var lastNode = $(ul).children('li:last').children('div.tree-node').addClass('tree-node-last');
		lastNode.children('span.tree-join').removeClass('tree-join').addClass('tree-joinbottom');
		
		function _join(node, hasNext){
			var icon = node.find('span.tree-icon');
			icon.prev('span.tree-indent').addClass('tree-join');
		}
		
		function _line(node){
			var depth = node.find('span.tree-indent, span.tree-hit').length;
			node.next().find('div.tree-node').each(function(){
				$(this).children('span:eq('+(depth-1)+')').addClass('tree-line');
			});
		}
	}
	
	/**
	 * request remote data and then load nodes in the <ul> tag.
	 * ul: the <ul> dom element
	 * param: request parameter
	 */
	function request(target, ul, param, callback){
		var opts = $.data(target, 'tree').options;
		
		param = $.extend({}, opts.queryParams, param||{});
//		param = param || {};
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}

		if (opts.onBeforeLoad.call(target, nodedata, param) == false) return;
		
		var folder = $(ul).prev().children('span.tree-folder');
		folder.addClass('tree-loading');
		var result = opts.loader.call(target, param, function(data){
			folder.removeClass('tree-loading');
			loadData(target, ul, data);
			if (callback){
				callback();
			}
		}, function(){
			folder.removeClass('tree-loading');
			opts.onLoadError.apply(target, arguments);
			if (callback){
				callback();
			}
		});
		if (result == false){
			folder.removeClass('tree-loading');
		}
	}
	
	function expandNode(target, nodeEl, callback){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeExpand.call(target, node) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (ul.length){
			if (opts.animate){
				ul.slideDown('normal', function(){
					node.state = 'open';
					opts.onExpand.call(target, node);
					if (callback) callback();
				});
			} else {
				ul.css('display','block');
				node.state = 'open';
				opts.onExpand.call(target, node);
				if (callback) callback();
			}
		} else {
			var subul = $('<ul style="display:none"></ul>').insertAfter(nodeEl);
			// request children nodes data
			request(target, subul[0], {id:node.id}, function(){
				if (subul.is(':empty')){
					subul.remove();	// if load children data fail, remove the children node container
				}
				if (opts.animate){
					subul.slideDown('normal', function(){
						node.state = 'open';
						opts.onExpand.call(target, node);
						if (callback) callback();
					});
				} else {
					subul.css('display','block');
					node.state = 'open';
					opts.onExpand.call(target, node);
					if (callback) callback();
				}
			});
		}
	}
	
	function collapseNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeCollapse.call(target, node) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (opts.animate){
			ul.slideUp('normal', function(){
				node.state = 'closed';
				opts.onCollapse.call(target, node);
			});
		} else {
			ul.css('display','none');
			node.state = 'closed';
			opts.onCollapse.call(target, node);
		}
	}
	
	function toggleNode(target, nodeEl){
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		
		if (hit.hasClass('tree-expanded')){
			collapseNode(target, nodeEl);
		} else {
			expandNode(target, nodeEl);
		}
	}
	
	function expandAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function expandToNode(target, nodeEl){
		var nodes = [];
		var p = getParentNode(target, nodeEl);
		while(p){
			nodes.unshift(p);
			p = getParentNode(target, p.target);
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function scrollToNode(target, nodeEl){
		var c = $(target).parent();
		while(c[0].tagName != 'BODY' && c.css('overflow-y') != 'auto'){
			c = c.parent();
		}
		var n = $(nodeEl);
		var ntop = n.offset().top;
		if (c[0].tagName != 'BODY'){
			var ctop = c.offset().top;
			if (ntop < ctop){
				c.scrollTop(c.scrollTop() + ntop - ctop);
			} else if (ntop + n.outerHeight() > ctop + c.outerHeight() - 18){
				c.scrollTop(c.scrollTop() + ntop + n.outerHeight() - ctop - c.outerHeight() + 18);
			}
		} else {
			c.scrollTop(ntop);
		}
	}
	
	function collapseAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			collapseNode(target, nodes[i].target);
		}
	}
	
	
	/**
	 * Append nodes to tree.
	 * The param parameter has two properties:
	 * 1 parent: DOM object, the parent node to append to.
	 * 2 data: array, the nodes data.
	 */
	function appendNodes(target, param){
		var node = $(param.parent);
		var data = param.data;
		if (!data){return}
		data = $.isArray(data) ? data : [data];
		if (!data.length){return}
		
		var ul;
		if (node.length == 0){
			ul = $(target);
		} else {
			// ensure the node is a folder node
			if (isLeaf(target, node[0])){
				var nodeIcon = node.find('span.tree-icon');
				nodeIcon.removeClass('tree-file').addClass('tree-folder tree-folder-open');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
			
			ul = node.next();
			if (!ul.length){
				ul = $('<ul></ul>').insertAfter(node);
			}
		}
		
		loadData(target, ul[0], data, true);
		
		adjustCheck(target, ul.prev());
	}
	
	/**
	 * insert node to before or after specified node
	 * param has the following properties:
	 * before: DOM object, the node to insert before
	 * after: DOM object, the node to insert after
	 * data: object, the node data 
	 */
	function insertNode(target, param){
		var ref = param.before || param.after;
		var pnode = getParentNode(target, ref);
		var data = param.data;
		if (!data){return}
		data = $.isArray(data) ? data : [data];
		if (!data.length){return}
		
		appendNodes(target, {
			parent: (pnode ? pnode.target : null),
			data: data
		});
		
		//adjust the sequence of nodes
		var pdata = pnode ? pnode.children : $(target).tree('getRoots');
		for(var i=0; i<pdata.length; i++){
			if (pdata[i].domId == $(ref).attr('id')){
				for(var j=data.length-1; j>=0; j--){
					pdata.splice((param.before ? i : (i+1)), 0, data[j]);
				}
				pdata.splice(pdata.length-data.length, data.length);
				break;
			}
		}
		
		var li = $();
		for(var i=0; i<data.length; i++){
			li = li.add($('#'+data[i].domId).parent());
		}
		
		if (param.before){
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	
	/**
	 * Remove node from tree. 
	 * nodeEl: DOM object, indicate the node to be removed.
	 */
	function removeNode(target, nodeEl){
		var parent = del(nodeEl);
		$(nodeEl).parent().remove();
		if (parent){
			if (!parent.children || !parent.children.length){
				var node = $(parent.target);
				node.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
				node.find('.tree-hit').remove();
				$('<span class="tree-indent"></span>').prependTo(node);
				node.next().remove();
			}
			updateNode(target, parent);
			adjustCheck(target, parent.target);
		}
		
		showLines(target, target);
		
		function del(nodeEl){
			var id = $(nodeEl).attr('id');
			var parent = getParentNode(target, nodeEl);
			var cc = parent ? parent.children : $.data(target, 'tree').data;
			for(var i=0; i<cc.length; i++){
				if (cc[i].domId == id){
					cc.splice(i, 1);
					break;
				}
			}
			return parent;
		}
	}
	
	function updateNode(target, param){
		var opts = $.data(target, 'tree').options;
		var node = $(param.target);
		var data = getNode(target, param.target);
		var oldChecked = data.checked;
		if (data.iconCls){
			node.find('.tree-icon').removeClass(data.iconCls);
		}
		$.extend(data, param);
		node.find('.tree-title').html(opts.formatter.call(target, data));
		if (data.iconCls){
			node.find('.tree-icon').addClass(data.iconCls);
		}
		if (oldChecked != data.checked){
			checkNode(target, param.target, data.checked);
		}
		
	}
	
	/**
	 * get the first root node of a specified node, if no root node exists, return null.
	 */
	function getRootNode(target, nodeEl){
		if (nodeEl){
			var p = getParentNode(target, nodeEl);
			while(p){
				nodeEl = p.target;
				p = getParentNode(target, nodeEl);
			}
			return getNode(target, nodeEl);
		} else {
			var roots = getRootNodes(target);
			return roots.length ? roots[0] : null;
		}
	}
	
	/**
	 * get the root nodes.
	 */
	function getRootNodes(target){
		var nodes = $.data(target, 'tree').data;
		for(var i=0; i<nodes.length; i++){
			attachProperties(nodes[i]);
		}
		return nodes;
	}
	
	/**
	 * get all child nodes corresponding to specified node
	 * nodeEl: the node DOM element
	 */
	function getChildren(target, nodeEl){
		var nodes = [];
		var n = getNode(target, nodeEl);
		var data = n ? (n.children||[]) : $.data(target, 'tree').data;
		forNodes(data, function(node){
			nodes.push(attachProperties(node));				
		});
		return nodes;
	}
	
	/**
	 * get the parent node
	 * nodeEl: DOM object, from which to search it's parent node 
	 */
	function getParentNode(target, nodeEl){
		var p = $(nodeEl).closest('ul').prevAll('div.tree-node:first');
		return getNode(target, p[0]);
	}
	
	/**
	 * get the specified state nodes
	 * the state available values are: 'checked','unchecked','indeterminate', default is 'checked'.
	 */
	function getCheckedNode(target, state){
		state = state || 'checked';
		if (!$.isArray(state)){state = [state]}
		
		var selectors = [];
		for(var i=0; i<state.length; i++){
			var s = state[i];
			if (s == 'checked'){
				selectors.push('span.tree-checkbox1');
			} else if (s == 'unchecked'){
				selectors.push('span.tree-checkbox0');
			} else if (s == 'indeterminate'){
				selectors.push('span.tree-checkbox2');
			}
		}
		
		var nodes = [];
		$(target).find(selectors.join(',')).each(function(){
			var node = $(this).parent();
			nodes.push(getNode(target, node[0]));
		});
		return nodes;
	}
	
	/**
	 * Get the selected node data which contains following properties: id,text,attributes,target
	 */
	function getSelectedNode(target){
		var node = $(target).find('div.tree-node-selected');
		return node.length ? getNode(target, node[0]) : null;
	}
	
	/**
	 * get specified node data, include its children data
	 */
	function getData(target, nodeEl){
		var data = getNode(target, nodeEl);
		if (data && data.children){
			forNodes(data.children, function(node){
				attachProperties(node);
			});
		}
		return data;
	}
	
	/**
	 * get the specified node
	 */
	function getNode(target, nodeEl){
		return findNodeBy(target, 'domId', $(nodeEl).attr('id'));
	}
	
	function findNode(target, id){
		return findNodeBy(target, 'id', id);
	}
	
	function findNodeBy(target, param, value){
		var data = $.data(target, 'tree').data;
		var result = null;
		forNodes(data, function(node){
			if (node[param] == value){
				result = attachProperties(node);
				return false;
			}
		});
		return result;
	}
	
	function attachProperties(node){
		var d = $('#'+node.domId);
		node.target = d[0];
		node.checked = d.find('.tree-checkbox').hasClass('tree-checkbox1');
		return node;
	}
	
	function forNodes(data, callback){
		var nodes = [];
		for(var i=0; i<data.length; i++){
			nodes.push(data[i]);
		}
		while(nodes.length){
			var node = nodes.shift();
			if (callback(node) == false){return;}
			if (node.children){
				for(var i=node.children.length-1; i>=0; i--){
					nodes.unshift(node.children[i]);
				}
			}
		}
	}
	
	/**
	 * select the specified node.
	 * nodeEl: DOM object, indicate the node to be selected.
	 */
	function selectNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		if (opts.onBeforeSelect.call(target, node) == false) return;
		$(target).find('div.tree-node-selected').removeClass('tree-node-selected');
		$(nodeEl).addClass('tree-node-selected');
		opts.onSelect.call(target, node);
	}
	
	/**
	 * Check if the specified node is leaf.
	 * nodeEl: DOM object, indicate the node to be checked.
	 */
	function isLeaf(target, nodeEl){
		return $(nodeEl).children('span.tree-hit').length == 0;
	}
	
	function beginEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeEdit.call(target, node) == false) return;
		
		$(nodeEl).css('position', 'relative');
		var nt = $(nodeEl).find('.tree-title');
		var width = nt.outerWidth();
		nt.empty();
		var editor = $('<input class="tree-editor">').appendTo(nt);
		editor.val(node.text).focus();
		editor.width(width + 20);
		editor.height(document.compatMode=='CSS1Compat' ? (18-(editor.outerHeight()-editor.height())) : 18);
		editor.bind('click', function(e){
			return false;
		}).bind('mousedown', function(e){
			e.stopPropagation();
		}).bind('mousemove', function(e){
			e.stopPropagation();
		}).bind('keydown', function(e){
			if (e.keyCode == 13){	// enter
				endEdit(target, nodeEl);
				return false;
			} else if (e.keyCode == 27){	// esc
				cancelEdit(target, nodeEl);
				return false;
			}
		}).bind('blur', function(e){
			e.stopPropagation();
			endEdit(target, nodeEl);
		});
	}
	
	function endEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		var editor = $(nodeEl).find('input.tree-editor');
		var val = editor.val();
		editor.remove();
		var node = getNode(target, nodeEl);
		node.text = val;
		updateNode(target, node);
		opts.onAfterEdit.call(target, node);
	}
	
	function cancelEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		$(nodeEl).find('input.tree-editor').remove();
		var node = getNode(target, nodeEl);
		updateNode(target, node);
		opts.onCancelEdit.call(target, node);
	}
	
	function doFilter(target, q){
		var state = $.data(target, 'tree');
		var opts = state.options;
		var ids = {};
		forNodes(state.data, function(node){
			if (opts.filter.call(target, q, node)){
				$('#'+node.domId).removeClass('tree-node-hidden');
				ids[node.domId] = 1;
				node.hidden = false;
			} else {
				$('#'+node.domId).addClass('tree-node-hidden');
				node.hidden = true;
			}
		});
		for(var id in ids){
			showParents(id);
		}

		function showParents(domId){
			var p = $(target).tree('getParent', $('#'+domId)[0]);
			while (p){
				$(p.target).removeClass('tree-node-hidden');
				p.hidden = false;
				p = $(target).tree('getParent', p.target);
			}
		}
	}
	
	$.fn.tree = function(options, param){
		if (typeof options == 'string'){
			return $.fn.tree.methods[options](this, param);
		}
		
		var options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tree');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.fn.tree.defaults, $.fn.tree.parseOptions(this), options);
				$.data(this, 'tree', {
					options: opts,
					tree: wrapTree(this),
					data: []
				});
				var data = $.fn.tree.parseData(this);
				if (data.length){
					loadData(this, this, data);
				}
			}
			bindTreeEvents(this);
			
			if (opts.data){
				loadData(this, this, $.extend(true,[],opts.data));
			}
			request(this, this);
		});
	};
	
	$.fn.tree.methods = {
		options: function(jq){
			return $.data(jq[0], 'tree').options;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, this, data);
			});
		},
		getNode: function(jq, nodeEl){	// get the single node
			return getNode(jq[0], nodeEl);
		},
		getData: function(jq, nodeEl){	// get the specified node data, include its children
			return getData(jq[0], nodeEl);
		},
		reload: function(jq, nodeEl){
			return jq.each(function(){
				if (nodeEl){
					var node = $(nodeEl);
					var hit = node.children('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					node.next().remove();
					expandNode(this, nodeEl);
				} else {
					$(this).empty();
					request(this, this);
				}
			});
		},
		getRoot: function(jq, nodeEl){	// if specify 'nodeEl', return its top parent node, otherwise return the first root node.
			return getRootNode(jq[0], nodeEl);
		},
		getRoots: function(jq){
			return getRootNodes(jq[0]);
		},
		getParent: function(jq, nodeEl){
			return getParentNode(jq[0], nodeEl);
		},
		getChildren: function(jq, nodeEl){
			return getChildren(jq[0], nodeEl);
		},
		getChecked: function(jq, state){	// the state available values are: 'checked','unchecked','indeterminate', default is 'checked'.
			return getCheckedNode(jq[0], state);
		},
		getSelected: function(jq){
			return getSelectedNode(jq[0]);
		},
		isLeaf: function(jq, nodeEl){
			return isLeaf(jq[0], nodeEl);
		},
		find: function(jq, id){
			return findNode(jq[0], id);
		},
		select: function(jq, nodeEl){
			return jq.each(function(){
				selectNode(this, nodeEl);
			});
		},
		check: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, true);
			});
		},
		uncheck: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, false);
			});
		},
		collapse: function(jq, nodeEl){
			return jq.each(function(){
				collapseNode(this, nodeEl);
			});
		},
		expand: function(jq, nodeEl){
			return jq.each(function(){
				expandNode(this, nodeEl);
			});
		},
		collapseAll: function(jq, nodeEl){
			return jq.each(function(){
				collapseAllNode(this, nodeEl);
			});
		},
		expandAll: function(jq, nodeEl){
			return jq.each(function(){
				expandAllNode(this, nodeEl);
			});
		},
		expandTo: function(jq, nodeEl){
			return jq.each(function(){
				expandToNode(this, nodeEl);
			});
		},
		scrollTo: function(jq, nodeEl){
			return jq.each(function(){
				scrollToNode(this, nodeEl);
			});
		},
		toggle: function(jq, nodeEl){
			return jq.each(function(){
				toggleNode(this, nodeEl);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				appendNodes(this, param);
			});
		},
		insert: function(jq, param){
			return jq.each(function(){
				insertNode(this, param);
			});
		},
		remove: function(jq, nodeEl){
			return jq.each(function(){
				removeNode(this, nodeEl);
			});
		},
		pop: function(jq, nodeEl){
			var node = jq.tree('getData', nodeEl);
			jq.tree('remove', nodeEl);
			return node;
		},
		update: function(jq, param){
			return jq.each(function(){
				updateNode(this, param);
			});
		},
		enableDnd: function(jq){
			return jq.each(function(){
				enableDnd(this);
			});
		},
		disableDnd: function(jq){
			return jq.each(function(){
				disableDnd(this);
			});
		},
		beginEdit: function(jq, nodeEl){
			return jq.each(function(){
				beginEdit(this, nodeEl);
			});
		},
		endEdit: function(jq, nodeEl){
			return jq.each(function(){
				endEdit(this, nodeEl);
			});
		},
		cancelEdit: function(jq, nodeEl){
			return jq.each(function(){
				cancelEdit(this, nodeEl);
			});
		},
		doFilter: function(jq, q){
			return jq.each(function(){
				doFilter(this, q);
			});
		}
	};
	
	$.fn.tree.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'url','method',
			{checkbox:'boolean',cascadeCheck:'boolean',parentCheck:'boolean',onlyLeafCheck:'boolean'},
			{animate:'boolean',lines:'boolean',dnd:'boolean'}
		]));
	};
	
	$.fn.tree.parseData = function(target){
		var data = [];
		_parseNode(data, $(target));
		return data;
		
		function _parseNode(aa, tree){
			tree.children('li').each(function(){
				var node = $(this);
				var item = $.extend({}, $.parser.parseOptions(this, ['id','iconCls','state']), {
					checked: (node.attr('checked') ? true : undefined)
				});
				item.text = node.children('span').html();
				if (!item.text){
					item.text = node.html();
				}
				
				var subTree = node.children('ul');
				if (subTree.length){
					item.children = [];
					_parseNode(item.children, subTree);
				}
				aa.push(item);
			});
		}
	};
	
	var nodeIndex = 1;
	var defaultView = {
		render: function(target, ul, data) {
			var opts = $.data(target, 'tree').options;
			var depth = $(ul).prev('div.tree-node').find('span.tree-indent, span.tree-hit').length;
			var cc = getTreeData(depth, data);
			$(ul).append(cc.join(''));
			
			function getTreeData(depth, children){
				var cc = [];
				for(var i=0; i<children.length; i++){
					var item = children[i];
					if (item.state != 'open' && item.state != 'closed'){
						item.state = 'open';
					}
					item.domId = '_easyui_tree_' + nodeIndex++;
					
					cc.push('<li>');
					cc.push('<div id="' + item.domId + '" class="tree-node">');
					for(var j=0; j<depth; j++){
						cc.push('<span class="tree-indent"></span>');
					}
					var isFileNode = false;
					if (item.state == 'closed'){
                        // 添加tree-empty空组判断。2015-05-12
                        if (item.children && item.children.length){
                            cc.push('<span class="tree-hit tree-collapsed"></span>');
                            cc.push('<span class="tree-icon tree-folder ' + (item.iconCls?item.iconCls:'') + '"></span>');
                        } else if(item.iconCls == "tree-empty") {
                            cc.push('<span class="tree-indent"></span>');
                            cc.push("<span class=\"tree-icon tree-folder\"></span>");
                        } else {
                            cc.push('<span class="tree-indent"></span>');
                            cc.push('<span class="tree-icon tree-file ' + (item.iconCls?item.iconCls:'') + '"></span>');
                        }

					} else {
						if (item.children && item.children.length){
							cc.push('<span class="tree-hit tree-expanded"></span>');
							cc.push('<span class="tree-icon tree-folder tree-folder-open ' + (item.iconCls?item.iconCls:'') + '"></span>');
						} else {
                            // 添加tree-empty空组判断。2015-05-12
                            if(item.iconCls == "tree-empty") {
                                cc.push('<span class="tree-indent"></span>');
                                cc.push("<span class=\"tree-icon tree-folder\"></span>");
                            }else if (item.foldType == "1"){     //用户组的图标都用文件夹icon
                                cc.push("<span class=\"tree-indent\"></span>");
                                cc.push("<span class=\"tree-icon tree-folder\"></span>");
                            } else {
                                cc.push('<span class="tree-indent"></span>');
                                cc.push('<span class="tree-icon tree-file ' + (item.iconCls?item.iconCls:'') + '"></span>');
                            }
							isFileNode = true;
						}
					}
					if (opts.checkbox){
						if ((!opts.onlyLeafCheck) || isFileNode){
							cc.push('<span class="tree-checkbox tree-checkbox0"></span>');
						}
					}
					cc.push('<span class="tree-title">' + opts.formatter.call(target, item) + '</span>');
					cc.push('</div>');
					
					if (item.children && item.children.length){
						var tmp = getTreeData(depth+1, item.children);
						cc.push('<ul style="display:' + (item.state=='closed'?'none':'block') + '">');
						cc = cc.concat(tmp);
						cc.push('</ul>');
					}
					cc.push('</li>');
				}
				return cc;
			}
		}
	};
	
	$.fn.tree.defaults = {
		url: null,
		method: 'post',
		animate: false,
		checkbox: false,
		cascadeCheck: true,
        parentCheck: true,
		onlyLeafCheck: false,
		lines: false,
		dnd: false,
		data: null,
		queryParams: {},
		formatter: function(node){
			return node.text;
		},
		filter: function(q, node){
			return node.text.toLowerCase().indexOf(q.toLowerCase()) >= 0;   //==改为>=
		},
		loader: function(param, success, error){
			var opts = $(this).tree('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data, parent){
			return data;
		},
		view: defaultView,
		
		onBeforeLoad: function(node, param){},
		onLoadSuccess: function(node, data){},
		onLoadError: function(){},
		onClick: function(node){},	// node: id,text,checked,attributes,target
		onDblClick: function(node){},	// node: id,text,checked,attributes,target
		onBeforeExpand: function(node){},
		onExpand: function(node){},
		onBeforeCollapse: function(node){},
		onCollapse: function(node){},
		onBeforeCheck: function(node, checked){},
		onCheck: function(node, checked){},
		onBeforeSelect: function(node){},
		onSelect: function(node){},
		onContextMenu: function(e, node){},
		onBeforeDrag: function(node){},	// return false to deny drag
		onStartDrag: function(node){},
		onStopDrag: function(node){},
		onDragEnter: function(target, source){},	// return false to deny drop
		onDragOver: function(target, source){},	// return false to deny drop
		onDragLeave: function(target, source){},
		onBeforeDrop: function(target, source, point){},
		onDrop: function(target, source, point){},	// point:'append','top','bottom'
		onBeforeEdit: function(node){},
		onAfterEdit: function(node){},
		onCancelEdit: function(node){}
	};
})(jQuery);
/**
 * progressbar - jQuery EasyUI
 * 
 * Dependencies:
 * 	 none
 * 
 */
(function($){
	function init(target){
		$(target).addClass('progressbar');
		$(target).html('<div class="progressbar-text"></div><div class="progressbar-value"><div class="progressbar-text"></div></div>');
		$(target).bind('_resize', function(e,force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		return $(target);
	}
	
	function setSize(target,width){
		var opts = $.data(target, 'progressbar').options;
		var bar = $.data(target, 'progressbar').bar;
		if (width) opts.width = width;
		bar._size(opts);
		
		bar.find('div.progressbar-text').css('width', bar.width());
		bar.find('div.progressbar-text,div.progressbar-value').css({
			height: bar.height()+'px',
			lineHeight: bar.height()+'px'
		});
	}
	
	$.fn.progressbar = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.progressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'progressbar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'progressbar', {
					options: $.extend({}, $.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), options),
					bar: init(this)
				});
			}
			$(this).progressbar('setValue', state.options.value);
			setSize(this);
		});
	};
	
	$.fn.progressbar.methods = {
		options: function(jq){
			return $.data(jq[0], 'progressbar').options;
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		getValue: function(jq){
			return $.data(jq[0], 'progressbar').options.value;
		},
		setValue: function(jq, value){
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			return jq.each(function(){
				var opts = $.data(this, 'progressbar').options;
				var text = opts.text.replace(/{value}/, value);
				var oldValue = opts.value;
				opts.value = value;
				$(this).find('div.progressbar-value').width(value+'%');
				$(this).find('div.progressbar-text').html(text);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
				}
			});
		}
	};
	
	$.fn.progressbar.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['width','height','text',{value:'number'}]));
	};
	
	$.fn.progressbar.defaults = {
		width: 'auto',
		height: 22,
		value: 0,	// percentage value
		text: '{value}%',
		onChange:function(newValue,oldValue){}
	};
})(jQuery);
/**
 * tooltip - jQuery EasyUI
 * 
 */
(function($){
	function init(target){
		$(target).addClass('tooltip-f');
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'tooltip').options;
		$(target).unbind('.tooltip').bind(opts.showEvent+'.tooltip', function(e){
//			showTip(target, e);
			$(target).tooltip('show', e);
		}).bind(opts.hideEvent+'.tooltip', function(e){
//			hideTip(target, e);
			$(target).tooltip('hide', e);
		}).bind('mousemove.tooltip', function(e){
			if (opts.trackMouse){
				opts.trackMouseX = e.pageX;
				opts.trackMouseY = e.pageY;
				$(target).tooltip('reposition');
			}
		});
	}
	
	function clearTimeouts(target){
		var state = $.data(target, 'tooltip');
		if (state.showTimer){
			clearTimeout(state.showTimer);
			state.showTimer = null;
		}
		if (state.hideTimer){
			clearTimeout(state.hideTimer);
			state.hideTimer = null;
		}
	}
	
	function reposition(target){
		var state = $.data(target, 'tooltip');
		if (!state || !state.tip){return}
		var opts = state.options;
		var tip = state.tip;
		var pos = {left:-100000,top:-100000};
		
		if ($(target).is(':visible')){
			pos = getPosition(opts.position);
			if (opts.position == 'top' && pos.top < 0){
				pos = getPosition('bottom');
			} else if ((opts.position == 'bottom') && (pos.top + tip._outerHeight() > $(window)._outerHeight() + $(document).scrollTop())){
				pos = getPosition('top');
			}
			if (pos.left < 0){
				if (opts.position == 'left'){
					pos = getPosition('right');
				} else {
					$(target).tooltip('arrow').css('left', tip._outerWidth()/2 + pos.left);
					pos.left = 0;
				}
			} else if (pos.left + tip._outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()){
				if (opts.position == 'right'){
					pos = getPosition('left');
				} else {
					var left = pos.left;
					pos.left = $(window)._outerWidth() + $(document)._scrollLeft() - tip._outerWidth();
					$(target).tooltip('arrow').css('left', tip._outerWidth()/2 - (pos.left-left));
				}
			}
		}
		
		tip.css({
			left: pos.left,
			top: pos.top,
			zIndex: (opts.zIndex!=undefined ? opts.zIndex : ($.fn.window ? $.fn.window.defaults.zIndex++ : ''))
		});
		opts.onPosition.call(target, pos.left, pos.top);
		
		function getPosition(position){
			opts.position = position || 'bottom';
			tip.removeClass('tooltip-top tooltip-bottom tooltip-left tooltip-right').addClass('tooltip-'+opts.position);
			var left,top;
			if (opts.trackMouse){
				t = $();
				left = opts.trackMouseX + opts.deltaX;
				top = opts.trackMouseY + opts.deltaY;
			} else {
				var t = $(target);
				left = t.offset().left + opts.deltaX;
				top = t.offset().top + opts.deltaY;
			}
			switch(opts.position){
			case 'right':
				left += t._outerWidth() + 12 + (opts.trackMouse?12:0);
				top -= (tip._outerHeight() - t._outerHeight()) / 2;
				break;
			case 'left':
				left -= tip._outerWidth() + 12 + (opts.trackMouse?12:0);
				top -= (tip._outerHeight() - t._outerHeight()) / 2;
				break;
			case 'top':
				left -= (tip._outerWidth() - t._outerWidth()) / 2;
				top -= tip._outerHeight() + 12 + (opts.trackMouse?12:0);
				break;
			case 'bottom':
				left -= (tip._outerWidth() - t._outerWidth()) / 2;
				top += t._outerHeight() + 12 + (opts.trackMouse?12:0);
				break;
			}
			return {
				left: left,
				top: top
			}
		}
	}
	
	function showTip(target, e){
		var state = $.data(target, 'tooltip');
		var opts = state.options;
		var tip = state.tip;
		if (!tip){
			tip = $(
				'<div tabindex="-1" class="tooltip">' +
					'<div class="tooltip-content"></div>' +
					'<div class="tooltip-arrow-outer"></div>' +
					'<div class="tooltip-arrow"></div>' +
				'</div>'
			).appendTo('body');
			state.tip = tip;
			updateTip(target);
		}
//		tip.removeClass('tooltip-top tooltip-bottom tooltip-left tooltip-right').addClass('tooltip-'+opts.position);
		
		clearTimeouts(target);
		
		state.showTimer = setTimeout(function(){
			$(target).tooltip('reposition');
			tip.show();
			opts.onShow.call(target, e);
			
			var arrowOuter = tip.children('.tooltip-arrow-outer');
			var arrow = tip.children('.tooltip-arrow');
			var bc = 'border-'+opts.position+'-color';
			arrowOuter.add(arrow).css({
				borderTopColor:'',
				borderBottomColor:'',
				borderLeftColor:'',
				borderRightColor:''
			});
			arrowOuter.css(bc, tip.css(bc));
			arrow.css(bc, tip.css('backgroundColor'));
		}, opts.showDelay);
	}
	
	function hideTip(target, e){
		var state = $.data(target, 'tooltip');
		if (state && state.tip){
			clearTimeouts(target);
			state.hideTimer = setTimeout(function(){
				state.tip.hide();
				state.options.onHide.call(target, e);
			}, state.options.hideDelay);
		}
	}
	
	function updateTip(target, content){
		var state = $.data(target, 'tooltip');
		var opts = state.options;
		if (content){opts.content = content;}
		if (!state.tip){return;}
		
		var cc = typeof opts.content == 'function' ? opts.content.call(target) : opts.content;
		state.tip.children('.tooltip-content').html(cc);
		opts.onUpdate.call(target, cc);
	}
	
	function destroyTip(target){
		var state = $.data(target, 'tooltip');
		if (state){
			clearTimeouts(target);
			var opts = state.options;
			if (state.tip){state.tip.remove();}
			if (opts._title){
				$(target).attr('title', opts._title);
			}
			$.removeData(target, 'tooltip');
			$(target).unbind('.tooltip').removeClass('tooltip-f');
			opts.onDestroy.call(target);
		}
	}
	
	$.fn.tooltip = function(options, param){
		if (typeof options == 'string'){
			return $.fn.tooltip.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tooltip');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'tooltip', {
					options: $.extend({}, $.fn.tooltip.defaults, $.fn.tooltip.parseOptions(this), options)
				});
				init(this);
			}
			bindEvents(this);
			updateTip(this);
		});
	};
	
	$.fn.tooltip.methods = {
		options: function(jq){
			return $.data(jq[0], 'tooltip').options;
		},
		tip: function(jq){
			return $.data(jq[0], 'tooltip').tip;
		},
		arrow: function(jq){
			return jq.tooltip('tip').children('.tooltip-arrow-outer,.tooltip-arrow');
		},
		show: function(jq, e){
			return jq.each(function(){
				showTip(this, e);
			});
		},
		hide: function(jq, e){
			return jq.each(function(){
				hideTip(this, e);
			});
		},
		update: function(jq, content){
			return jq.each(function(){
				updateTip(this, content);
			});
		},
		reposition: function(jq){
			return jq.each(function(){
				reposition(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyTip(this);
			});
		}
	};
	
	$.fn.tooltip.parseOptions = function(target){
		var t = $(target);
		var opts = $.extend({}, $.parser.parseOptions(target, [
			'position','showEvent','hideEvent','content',
			{trackMouse:'boolean',deltaX:'number',deltaY:'number',showDelay:'number',hideDelay:'number'}
		]), {
			_title: t.attr('title')
		});
		t.attr('title', '');
		if (!opts.content){
			opts.content = opts._title;
		}
		return opts;
	};
	
	$.fn.tooltip.defaults = {
		position: 'bottom',	// possible values are: 'left','right','top','bottom'
		content: null,
		trackMouse: false,
		deltaX: 0,
		deltaY: 0,
		showEvent: 'mouseenter',
		hideEvent: 'mouseleave',
		showDelay: 200,
		hideDelay: 100,
		
		onShow: function(e){},
		onHide: function(e){},
		onUpdate: function(content){},
		onPosition: function(left,top){},
		onDestroy: function(){}
	};
})(jQuery);
/**
 * panel - jQuery EasyUI
 * 
 */
(function($){
	$.fn._remove = function(){
		return this.each(function(){
			$(this).remove();
			try{
				this.outerHTML = '';
			} catch(err){}
		});
	}
	function removeNode(node){
		node._remove();
	}
	
	function setSize(target, param){
		var state = $.data(target, 'panel');
		var opts = state.options;
		var panel = state.panel;
		var pheader = panel.children('.panel-header');
		var pbody = panel.children('.panel-body');
		var pfooter = panel.children('.panel-footer');
		
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height,
				minWidth: param.minWidth,
				maxWidth: param.maxWidth,
				minHeight: param.minHeight,
				maxHeight: param.maxHeight,
				left: param.left,
				top: param.top
			});
		}
		
		panel._size(opts);
		pheader.add(pbody)._outerWidth(panel.width());
		if (!isNaN(parseInt(opts.height))){
			pbody._outerHeight(panel.height() - pheader._outerHeight() - pfooter._outerHeight());
		} else {
			pbody.css('height', '');
			var min = $.parser.parseValue('minHeight', opts.minHeight, panel.parent());
			var max = $.parser.parseValue('maxHeight', opts.maxHeight, panel.parent());
			var distance = pheader._outerHeight() + pfooter._outerHeight() + panel._outerHeight() - panel.height();
			pbody._size('minHeight', min ? (min - distance) : '');
			pbody._size('maxHeight', max ? (max - distance) : '');
		}
		panel.css({
			height: '',
			minHeight: '',
			maxHeight: '',
			left: opts.left,
			top: opts.top
		});
		
		opts.onResize.apply(target, [opts.width, opts.height]);
		
		$(target).panel('doLayout');
//		$(target).find('>div:visible,>form>div:visible').triggerHandler('_resize');
	}
	
	function movePanel(target, param){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		if (param){
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		panel.css({
			left: opts.left,
			top: opts.top
		});
		opts.onMove.apply(target, [opts.left, opts.top]);
	}
	
	function wrapPanel(target){
		$(target).addClass('panel-body')._size('clear');
		var panel = $('<div class="panel"></div>').insertBefore(target);
		panel[0].appendChild(target);
		panel.bind('_resize', function(e, force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		
		return panel;
	}
	
	function createPanel(target){
		var state = $.data(target, 'panel');
		var opts = state.options;
		var panel = state.panel;
		panel.css(opts.style);
		panel.addClass(opts.cls);
		
		_addHeader();
		_addFooter();
		
		var header = $(target).panel('header');
		var body = $(target).panel('body');
		var footer = $(target).siblings('.panel-footer');
		if (opts.border){
			header.removeClass('panel-header-noborder');
			body.removeClass('panel-body-noborder');
			footer.removeClass('panel-footer-noborder');
		} else {
			header.addClass('panel-header-noborder');
			body.addClass('panel-body-noborder');
			footer.addClass('panel-footer-noborder');
		}
		header.addClass(opts.headerCls);
		body.addClass(opts.bodyCls);
		
		$(target).attr('id', opts.id || '');
		if (opts.content){
			$(target).panel('clear');
			$(target).html(opts.content);
			$.parser.parse($(target));
		}
		
		function _addHeader(){
			if (opts.noheader || (!opts.title && !opts.header)){
				removeNode(panel.children('.panel-header'));
				panel.children('.panel-body').addClass('panel-body-noheader');
			} else {
				if (opts.header){
					$(opts.header).addClass('panel-header').prependTo(panel);
				} else {
					var header = panel.children('.panel-header');
					if (!header.length){
						header = $('<div class="panel-header"></div>').prependTo(panel);
					}
					if (!$.isArray(opts.tools)){
						header.find('div.panel-tool .panel-tool-a').appendTo(opts.tools);
					}
					header.empty();
					var htitle = $('<div class="panel-title"></div>').html(opts.title).appendTo(header);
					if (opts.iconCls){
						htitle.addClass('panel-with-icon');
						$('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
					}
					var tool = $('<div class="panel-tool"></div>').appendTo(header);
					tool.bind('click', function(e){
                                                e.stopPropagation();
					});
					
					if (opts.tools){
						if ($.isArray(opts.tools)){
							$.map(opts.tools, function(t){
								_buildTool(tool, t.iconCls, eval(t.handler));
							});
						} else {
							$(opts.tools).children().each(function(){
								$(this).addClass($(this).attr('iconCls')).addClass('panel-tool-a').appendTo(tool);
							});
						}
					}
					if (opts.collapsible){
						_buildTool(tool, 'panel-tool-collapse', function(){
							if (opts.collapsed == true){
								expandPanel(target, true);
							} else {
								collapsePanel(target, true);
							}
						});
					}
					if (opts.minimizable){
						_buildTool(tool, 'panel-tool-min', function(){
							minimizePanel(target);
						});
					}
					if (opts.maximizable){
						_buildTool(tool, 'panel-tool-max', function(){
							if (opts.maximized == true){
								restorePanel(target);
							} else {
								maximizePanel(target);
							}
						});
					}
					if (opts.closable){
						_buildTool(tool, 'panel-tool-close', function(){
							closePanel(target);
						});
					}
					
				}
				panel.children('div.panel-body').removeClass('panel-body-noheader');
			}
		}
		function _buildTool(c, icon, handler){
			var a = $('<a href="javascript:void(0)"></a>').addClass(icon).appendTo(c);
			a.bind('click', handler);
		}
		function _addFooter(){
			if (opts.footer){
				$(opts.footer).addClass('panel-footer').appendTo(panel);
				$(target).addClass('panel-body-nobottom');
			} else {
				panel.children('.panel-footer').remove();
				$(target).removeClass('panel-body-nobottom');
			}
		}
	}
	
	/**
	 * load content from remote site if the href attribute is defined
	 */
	function loadData(target, params){
		var state = $.data(target, 'panel');
		var opts = state.options;
		if (param){opts.queryParams = params}
		if (!opts.href){return;}
		if (!state.isLoaded || !opts.cache){
			var param = $.extend({}, opts.queryParams);
			if (opts.onBeforeLoad.call(target, param) == false){return}
			state.isLoaded = false;
			$(target).panel('clear');
			if (opts.loadingMessage){
				$(target).html($('<div class="panel-loading"></div>').html(opts.loadingMessage));
			}
			opts.loader.call(target, param, function(data){
				var content = opts.extractor.call(target, data);
				$(target).html(content);
				$.parser.parse($(target));
				opts.onLoad.apply(target, arguments);
				state.isLoaded = true;
			}, function(){
				opts.onLoadError.apply(target, arguments);
			});
		}
	}
	
	/**
	 * clear the panel content.
	 */
	function clearPanel(target){
		var t = $(target);
		t.find('.combo-f').each(function(){
			$(this).combo('destroy');
		});
		t.find('.m-btn').each(function(){
			$(this).menubutton('destroy');
		});
		t.find('.s-btn').each(function(){
			$(this).splitbutton('destroy');
		});
		t.find('.tooltip-f').each(function(){
			$(this).tooltip('destroy');
		});
		t.children('div').each(function(){
			$(this)._size('unfit');
		});
		t.empty();
	}
	
	function doLayout(target){
		$(target).panel('doLayout', true);
//		$(target).find('div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible').each(function(){
//			$(this).triggerHandler('_resize', [true]);
//		});
	}
	
	function openPanel(target, forceOpen){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceOpen != true){
			if (opts.onBeforeOpen.call(target) == false) return;
		}
		panel.stop(true, true);
		if ($.isFunction(opts.openAnimation)){
			opts.openAnimation.call(target, cb);
		} else {
			switch(opts.openAnimation){
			case 'slide':
				panel.slideDown(opts.openDuration, cb);
				break;
			case 'fade':
				panel.fadeIn(opts.openDuration, cb);
				break;
			case 'show':
				panel.show(opts.openDuration, cb);
				break;
			default:
				panel.show();
				cb();
			}
		}
		
		function cb(){
			opts.closed = false;
			opts.minimized = false;
			var tool = panel.children('.panel-header').find('a.panel-tool-restore');
			if (tool.length){
				opts.maximized = true;
			}
			opts.onOpen.call(target);
			
			if (opts.maximized == true) {
				opts.maximized = false;
				maximizePanel(target);
			}
			if (opts.collapsed == true) {
				opts.collapsed = false;
				collapsePanel(target);
			}
			
			if (!opts.collapsed){
				loadData(target);
				doLayout(target);
			}
		}
	}
	
	function closePanel(target, forceClose){
		var opts = $.data(target, 'panel').options;

		var panel = $.data(target, 'panel').panel;
		
		if (forceClose != true){
			if (opts.onBeforeClose.call(target) == false) return;
		}
		panel.stop(true, true);
		panel._size('unfit');
		
		if ($.isFunction(opts.closeAnimation)){
			opts.closeAnimation.call(target, cb);
		} else {
			switch(opts.closeAnimation){
			case 'slide':
				panel.slideUp(opts.closeDuration, cb);
				break;
			case 'fade':
				panel.fadeOut(opts.closeDuration, cb);
				break;
			case 'hide':
				panel.hide(opts.closeDuration, cb);
				break;
			default:
				panel.hide();
				cb();
			}
		}
		
		function cb(){
			opts.closed = true;
			opts.onClose.call(target);
		}
	}
	
	function destroyPanel(target, forceDestroy){
		var state = $.data(target, 'panel');
		var opts = state.options;
		var panel = state.panel;
		
		if (forceDestroy != true){
			if (opts.onBeforeDestroy.call(target) == false) return;
		}
		$(target).panel('clear').panel('clear', 'footer');
		removeNode(panel);
		opts.onDestroy.call(target);
	}
	
	function collapsePanel(target, animate){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var body = panel.children('.panel-body');
		var tool = panel.children('.panel-header').find('a.panel-tool-collapse');
		
		if (opts.collapsed == true) return;
		
		body.stop(true, true);	// stop animation
		if (opts.onBeforeCollapse.call(target) == false) return;
		
		tool.addClass('panel-tool-expand');
		if (animate == true){
			body.slideUp('normal', function(){
				opts.collapsed = true;
				opts.onCollapse.call(target);
			});
		} else {
			body.hide();
			opts.collapsed = true;
			opts.onCollapse.call(target);
		}
	}
	
	function expandPanel(target, animate){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var body = panel.children('.panel-body');
		var tool = panel.children('.panel-header').find('a.panel-tool-collapse');
		
		if (opts.collapsed == false) return;
		
		body.stop(true, true);	// stop animation
		if (opts.onBeforeExpand.call(target) == false) return;
		
		tool.removeClass('panel-tool-expand');
		if (animate == true){
			body.slideDown('normal', function(){
				opts.collapsed = false;
				opts.onExpand.call(target);
				loadData(target);
				doLayout(target);
			});
		} else {
			body.show();
			opts.collapsed = false;
			opts.onExpand.call(target);
			loadData(target);
			doLayout(target);
		}
	}
	
	function maximizePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var tool = panel.children('.panel-header').find('a.panel-tool-max');
		
		if (opts.maximized == true) return;
		
		tool.addClass('panel-tool-restore');
		
		if (!$.data(target, 'panel').original){
			$.data(target, 'panel').original = {
				width: opts.width,
				height: opts.height,
				left: opts.left,
				top: opts.top,
				fit: opts.fit
			};
		}
		opts.left = 0;
		opts.top = 0;
		opts.fit = true;
		setSize(target);
		opts.minimized = false;
		opts.maximized = true;
		opts.onMaximize.call(target);
	}
	
	function minimizePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		panel._size('unfit');
		panel.hide();
		opts.minimized = true;
		opts.maximized = false;
		opts.onMinimize.call(target);
	}
	
	function restorePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var tool = panel.children('.panel-header').find('a.panel-tool-max');
		
		if (opts.maximized == false) return;
		
		panel.show();
		tool.removeClass('panel-tool-restore');
		$.extend(opts, $.data(target, 'panel').original);
//		var original = $.data(target, 'panel').original;
//		opts.width = original.width;
//		opts.height = original.height;
//		opts.left = original.left;
//		opts.top = original.top;
//		opts.fit = original.fit;
		setSize(target);
		opts.minimized = false;
		opts.maximized = false;
		$.data(target, 'panel').original = null;
		opts.onRestore.call(target);
	}
	
	
	function setTitle(target, title){
		$.data(target, 'panel').options.title = title;
		$(target).panel('header').find('div.panel-title').html(title);
	}
	
	var resizeTimer = null;
	$(window).unbind('.panel').bind('resize.panel', function(){
		if (resizeTimer){
			clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(function(){
			var layout = $('body.layout');
			if (layout.length){
				layout.layout('resize');
//				$('body').children('.easyui-fluid:visible').trigger('_resize');
				$('body').children('.easyui-fluid:visible').each(function(){
					$(this).triggerHandler('_resize');
				});
			} else {
				$('body').panel('doLayout');
//				$('body').children('div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible').triggerHandler('_resize');
			}
			resizeTimer = null;
		}, 100);
	});
	
	$.fn.panel = function(options, param){
		if (typeof options == 'string'){
			return $.fn.panel.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'panel');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.isLoaded = false;
			} else {
				opts = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), options);
				$(this).attr('title', '');
				state = $.data(this, 'panel', {
					options: opts,
					panel: wrapPanel(this),
					isLoaded: false
				});
			}
			
			createPanel(this);
			
			if (opts.doSize == true){
				state.panel.css('display','block');
				setSize(this);
			}
			if (opts.closed == true || opts.minimized == true){
				state.panel.hide();
			} else {
				openPanel(this);
			}
		});
	};
	
	$.fn.panel.methods = {
		options: function(jq){
			return $.data(jq[0], 'panel').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'panel').panel;
		},
		header: function(jq){
			return $.data(jq[0], 'panel').panel.children('.panel-header');
		},
		footer: function(jq){
			return jq.panel('panel').children('.panel-footer');
		},
		body: function(jq){
			return $.data(jq[0], 'panel').panel.children('.panel-body');
		},
		setTitle: function(jq, title){
			return jq.each(function(){
				setTitle(this, title);
			});
		},
		open: function(jq, forceOpen){
			return jq.each(function(){
				openPanel(this, forceOpen);
			});
		},
		close: function(jq, forceClose){
			return jq.each(function(){
				closePanel(this, forceClose);
			});
		},
		destroy: function(jq, forceDestroy){
			return jq.each(function(){
				destroyPanel(this, forceDestroy);
			});
		},
		clear: function(jq, type){
			return jq.each(function(){
				clearPanel(type=='footer' ? $(this).panel('footer') : this);
				// clearPanel(this);
			});
		},
		refresh: function(jq, href){
			return jq.each(function(){
				var state = $.data(this, 'panel');
				state.isLoaded = false;
				if (href){
					if (typeof href == 'string'){
						state.options.href = href;
					} else {
						state.options.queryParams = href;
					}
				}
				loadData(this);
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		doLayout: function(jq, all){
			return jq.each(function(){
				_layout(this, 'body');
				_layout($(this).siblings('.panel-footer')[0], 'footer');

				function _layout(target, type){
					if (!target){return}
					var isBody = target == $('body')[0];
					var s = $(target).find('div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.easyui-fluid:visible').filter(function(index, el){
						var p = $(el).parents('.panel-'+type+':first');
						return isBody ? p.length==0 : p[0]==target;
					});
//					s.trigger('_resize', [all||false]);
					s.each(function(){
						$(this).triggerHandler('_resize', [all||false]);
					});
				}
			});
		},
		move: function(jq, param){
			return jq.each(function(){
				movePanel(this, param);
			});
		},
		maximize: function(jq){
			return jq.each(function(){
				maximizePanel(this);
			});
		},
		minimize: function(jq){
			return jq.each(function(){
				minimizePanel(this);
			});
		},
		restore: function(jq){
			return jq.each(function(){
				restorePanel(this);
			});
		},
		collapse: function(jq, animate){
			return jq.each(function(){
				collapsePanel(this, animate);
			});
		},
		expand: function(jq, animate){
			return jq.each(function(){
				expandPanel(this, animate);
			});
		}
	};
	
	$.fn.panel.parseOptions = function(target){
		var t = $(target);
		var hh = t.children('.panel-header,header');
		var ff = t.children('.panel-footer,footer');
		return $.extend({}, $.parser.parseOptions(target, ['id','width','height','left','top',
		        'title','iconCls','cls','headerCls','bodyCls','tools','href','method','header','footer',
		        {cache:'boolean',fit:'boolean',border:'boolean',noheader:'boolean'},
		        {collapsible:'boolean',minimizable:'boolean',maximizable:'boolean'},
		        {closable:'boolean',collapsed:'boolean',minimized:'boolean',maximized:'boolean',closed:'boolean'},
		        'openAnimation','closeAnimation',
		        {openDuration:'number',closeDuration:'number'},
		]), {
			loadingMessage: (t.attr('loadingMessage')!=undefined ? t.attr('loadingMessage') : undefined),
			header: (hh.length ? hh.removeClass('panel-header') : undefined),
			footer: (ff.length ? ff.removeClass('panel-footer') : undefined)
		});
	};
	
	$.fn.panel.defaults = {
		id: null,
		title: null,
		iconCls: null,
		width: 'auto',
		height: 'auto',
		left: null,
		top: null,
		cls: null,
		headerCls: null,
		bodyCls: null,
		style: {},
		href: null,
		cache: true,
		fit: false,
		border: true,
		doSize: true,	// true to set size and do layout
		noheader: false,
		content: null,	// the body content if specified
		
		collapsible: false,
		minimizable: false,
		maximizable: false,
		closable: false,
		collapsed: false,
		minimized: false,
		maximized: false,
		closed: false,
		
		openAnimation: false,
		openDuration: 400,
		closeAnimation: false,
		closeDuration: 400,
		
		// custom tools, every tool can contain two properties: iconCls and handler
		// iconCls is a icon CSS class
		// handler is a function, which will be run when tool button is clicked
		tools: null,
		footer: null,
		header: null,
		
		queryParams: {},
		method: 'get',
		href: null,
		loadingMessage: 'Loading...',
		loader: function(param, success, error){
			var opts = $(this).panel('options');
			if (!opts.href){return false}
			$.ajax({
				type: opts.method,
				url: opts.href,
				cache: false,
				data: param,
				dataType: 'html',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		extractor: function(data){	// define how to extract the content from ajax response, return extracted data
			var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var matches = pattern.exec(data);
			if (matches){
				return matches[1];	// only extract body content
			} else {
				return data;
			}
		},
		
		onBeforeLoad: function(param){},
		onLoad: function(){},
		onLoadError: function(){},
		onBeforeOpen: function(){},
		onOpen: function(){},
		onBeforeClose: function(){},
		onClose: function(){},
		onBeforeDestroy: function(){},
		onDestroy: function(){},
		onResize: function(width,height){},
		onMove: function(left,top){},
		onMaximize: function(){},
		onRestore: function(){},
		onMinimize: function(){},
		onBeforeCollapse: function(){},
		onBeforeExpand: function(){},
		onCollapse: function(){},
		onExpand: function(){}
	};
})(jQuery);
/**
 * window - jQuery EasyUI
 * 
 * Dependencies:
 * 	 panel
 *   draggable
 *   resizable
 * 
 */
(function($){
	function moveWindow(target, param){
		var state = $.data(target, 'window');
		if (param){
			if (param.left != null) state.options.left = param.left;
			if (param.top != null) state.options.top = param.top;
		}
		$(target).panel('move', state.options);
		if (state.shadow){
			state.shadow.css({
				left: state.options.left,
				top: state.options.top
			});
		}
	}
	
	/**
	 *  center the window only horizontally
	 */
	function hcenter(target, tomove){
		var opts = $.data(target, 'window').options;
		var pp = $(target).window('panel');
		var width = pp._outerWidth();
		if (opts.inline){
			var parent = pp.parent();
			opts.left = Math.ceil((parent.width() - width) / 2 + parent.scrollLeft());
		} else {
			opts.left = Math.ceil(($(window)._outerWidth() - width) / 2 + $(document).scrollLeft());
		}
		if (tomove){moveWindow(target);}
	}
	
	/**
	 * center the window only vertically
	 */
	function vcenter(target, tomove){
		var opts = $.data(target, 'window').options;
		var pp = $(target).window('panel');
		var height = pp._outerHeight();
		if (opts.inline){
			var parent = pp.parent();
			opts.top = Math.ceil((parent.height() - height) / 2 + parent.scrollTop());
		} else {
			opts.top = Math.ceil(($(window)._outerHeight() - height) / 2 + $(document).scrollTop());
		}
		if (tomove){moveWindow(target);}
	}
	
	function create(target){
		var state = $.data(target, 'window');
		var opts = state.options;
		var win = $(target).panel($.extend({}, state.options, {
			border: false,
			doSize: true,	// size the panel, the property undefined in window component
			closed: true,	// close the panel
			cls: 'window',
			headerCls: 'window-header',
			bodyCls: 'window-body ' + (opts.noheader ? 'window-body-noheader' : ''),
			
			onBeforeDestroy: function(){
				if (opts.onBeforeDestroy.call(target) == false){return false;}
				if (state.shadow){state.shadow.remove();}
				if (state.mask){state.mask.remove();}
			},
			onClose: function(){
				if (state.shadow){state.shadow.hide();}
				if (state.mask){state.mask.hide();}
				opts.onClose.call(target);
			},
			onOpen: function(){
				if (state.mask){
					state.mask.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++
					});
				}
				if (state.shadow){
					state.shadow.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++,
						left: opts.left,
						top: opts.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				opts.onOpen.call(target);
			},
			onResize: function(width, height){
				var popts = $(this).panel('options');
				$.extend(opts, {
					width: popts.width,
					height: popts.height,
					left: popts.left,
					top: popts.top
				});
				if (state.shadow){
					state.shadow.css({
						left: opts.left,
						top: opts.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				opts.onResize.call(target, width, height);
			},
			onMinimize: function(){
				if (state.shadow){state.shadow.hide();}
				if (state.mask){state.mask.hide();}
				state.options.onMinimize.call(target);
			},
			onBeforeCollapse: function(){
				if (opts.onBeforeCollapse.call(target) == false){return false;}
				if (state.shadow){state.shadow.hide();}
			},
			onExpand: function(){
				if (state.shadow){state.shadow.show();}
				opts.onExpand.call(target);
			}
		}));
		
		state.window = win.panel('panel');
		
		// create mask
		if (state.mask){state.mask.remove();}
		if (opts.modal == true){
			state.mask = $('<div class="window-mask"></div>').insertAfter(state.window);
			state.mask.css({
				width: (opts.inline ? state.mask.parent().width() : getPageArea().width),
				height: (opts.inline ? state.mask.parent().height() : getPageArea().height),
				display: 'none'
			});
		}
		
		// create shadow
		if (state.shadow){state.shadow.remove();}
		if (opts.shadow == true){
			state.shadow = $('<div class="window-shadow"></div>').insertAfter(state.window);
			state.shadow.css({
				display: 'none'
			});
		}
		
		// if require center the window
		if (opts.left == null){hcenter(target);}
		if (opts.top == null){vcenter(target);}
		moveWindow(target);
		
		if (!opts.closed){
			win.window('open');	// open the window
		}
	}
	
	
	/**
	 * set window drag and resize property
	 */
	function setProperties(target){
		var state = $.data(target, 'window');
		
		state.window.draggable({
			handle: '>div.panel-header>div.panel-title',
			disabled: state.options.draggable == false,
			onStartDrag: function(e){
				if (state.mask) state.mask.css('z-index', $.fn.window.defaults.zIndex++);
				if (state.shadow) state.shadow.css('z-index', $.fn.window.defaults.zIndex++);
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					display:'none',
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(state.window._outerWidth());
				state.proxy._outerHeight(state.window._outerHeight());
				setTimeout(function(){
					if (state.proxy) state.proxy.show();
				}, 500);
			},
			onDrag: function(e){
				state.proxy.css({
					display:'block',
					left: e.data.left,
					top: e.data.top
				});
				return false;
			},
			onStopDrag: function(e){
				state.options.left = e.data.left;
				state.options.top = e.data.top;
				$(target).window('move');
				state.proxy.remove();
				state.proxy = null;
			}
		});
		
		state.window.resizable({
			disabled: state.options.resizable == false,
			onStartResize:function(e){
				if (state.pmask){state.pmask.remove();}
				state.pmask = $('<div class="window-proxy-mask"></div>').insertAfter(state.window);
				state.pmask.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: state.window._outerWidth(),
					height: state.window._outerHeight()
				});
				if (state.proxy){state.proxy.remove();}
				state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				state.proxy.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width)._outerHeight(e.data.height);
			},
			onResize: function(e){
				state.proxy.css({
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width);
				state.proxy._outerHeight(e.data.height);
				return false;
			},
			onStopResize: function(e){
				$(target).window('resize', e.data);
				state.pmask.remove();
				state.pmask = null;
				state.proxy.remove();
				state.proxy = null;
			}
		});
	}
	
	function getPageArea() {
		if (document.compatMode == 'BackCompat') {
			return {
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)
			}
		} else {
			return {
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}
		}
	}
	
	// when window resize, reset the width and height of the window's mask
	$(window).resize(function(){
		$('body>div.window-mask').css({
			width: $(window)._outerWidth(),
			height: $(window)._outerHeight()
		});
		setTimeout(function(){
			$('body>div.window-mask').css({
				width: getPageArea().width,
				height: getPageArea().height
			});
		}, 50);
	});
	
	$.fn.window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.window.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.panel(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'window');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'window', {
					options: $.extend({}, $.fn.window.defaults, $.fn.window.parseOptions(this), options)
				});
				if (!state.options.inline){
//					$(this).appendTo('body');
					document.body.appendChild(this);
				}
			}
			create(this);
			setProperties(this);
		});
	};
	
	$.fn.window.methods = {
		options: function(jq){
			var popts = jq.panel('options');
			var wopts = $.data(jq[0], 'window').options;
			return $.extend(wopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
		},
		window: function(jq){
			return $.data(jq[0], 'window').window;
		},
		move: function(jq, param){
			return jq.each(function(){
				moveWindow(this, param);
			});
		},
		hcenter: function(jq){
			return jq.each(function(){
				hcenter(this, true);
			});
		},
		vcenter: function(jq){
			return jq.each(function(){
				vcenter(this, true);
			});
		},
		center: function(jq){
			return jq.each(function(){
				hcenter(this);
				vcenter(this);
				moveWindow(this);
			});
		}
	};
	
	$.fn.window.parseOptions = function(target){
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			{draggable:'boolean',resizable:'boolean',shadow:'boolean',modal:'boolean',inline:'boolean'}
		]));
	};
	
	// Inherited from $.fn.panel.defaults
	$.fn.window.defaults = $.extend({}, $.fn.panel.defaults, {
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: true,
		modal: false,
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		
		// window's property which difference from panel
		title: 'New Window',
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false
	});
})(jQuery);
/**
 * dialog - jQuery EasyUI
 * 
 * Dependencies:
 * 	 window
 *   linkbutton
 * 
 */
(function($){
	/**
	 * build the dialog
	 */
	function buildDialog(target){
		var opts = $.data(target, 'dialog').options;
		opts.inited = false;
		$(target).window($.extend({}, opts, {
			onResize: function(w,h){
				if (opts.inited){
					setContentSize(this);
					opts.onResize.call(this, w, h);
				}
			}
		}));
		var win = $(target).window('window');
		
		if (opts.toolbar){
			if ($.isArray(opts.toolbar)){
				$(target).siblings('div.dialog-toolbar').remove();
				var toolbar = $('<div class="dialog-toolbar"><table cellspacing="0" cellpadding="0"><tr></tr></table></div>').appendTo(win);
				var tr = toolbar.find('tr');
				for(var i=0; i<opts.toolbar.length; i++){
					var btn = opts.toolbar[i];
					if (btn == '-'){
						$('<td><div class="dialog-tool-separator"></div></td>').appendTo(tr);
					} else {
						var td = $('<td></td>').appendTo(tr);
						var tool = $('<a href="javascript:void(0)"></a>').appendTo(td);
						tool[0].onclick = eval(btn.handler || function(){});
						tool.linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			} else {
				$(opts.toolbar).addClass('dialog-toolbar').appendTo(win);
				$(opts.toolbar).show();
			}
		} else {
			$(target).siblings('div.dialog-toolbar').remove();
		}
		
		if (opts.buttons){
			if ($.isArray(opts.buttons)){
				$(target).siblings('div.dialog-button').remove();
				var buttons = $('<div class="dialog-button"></div>').appendTo(win);
				for(var i=0; i<opts.buttons.length; i++){
					var p = opts.buttons[i];
					var button = $('<a href="javascript:void(0)"></a>').appendTo(buttons);
					if (p.handler) button[0].onclick = p.handler;
					button.linkbutton(p);
				}
			} else {
				$(opts.buttons).addClass('dialog-button').appendTo(win);
				$(opts.buttons).show();
			}
		} else {
			$(target).siblings('div.dialog-button').remove();
		}
		
		opts.inited = true;
		var closed = opts.closed;
		win.show();
		$(target).window('resize');
		if (closed){
			win.hide();
		}
	}
	
	function setContentSize(target, param){
		var t = $(target);
		var opts = t.dialog('options');
		var noheader = opts.noheader;
		var tb = t.siblings('.dialog-toolbar');
		var bb = t.siblings('.dialog-button');
		
		tb.insertBefore(target).css({
			position:'relative',
			borderTopWidth: (noheader?1:0),
			top: (noheader?tb.length:0)
		});
		bb.insertAfter(target).css({
			position:'relative',
			top: -1
		});
		
		tb.add(bb)._outerWidth(t._outerWidth()).find('.easyui-fluid:visible').each(function(){
			$(this).triggerHandler('_resize');
		});
		
		if (!isNaN(parseInt(opts.height))){
			t._outerHeight(t._outerHeight()-tb._outerHeight()-bb._outerHeight());
		}

		var shadow = $.data(target, 'window').shadow;
		if (shadow){
			var cc = t.panel('panel');
			shadow.css({
				width: cc._outerWidth(),
				height: cc._outerHeight()
			});
		}
	}
	
	$.fn.dialog = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.dialog.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.window(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'dialog');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'dialog', {
					options: $.extend({}, $.fn.dialog.defaults, $.fn.dialog.parseOptions(this), options)
				});
			}
			buildDialog(this);
		});
	};
	
	$.fn.dialog.methods = {
		options: function(jq){
			var dopts = $.data(jq[0], 'dialog').options;
			var popts = jq.panel('options');
			$.extend(dopts, {
				width: popts.width,
				height: popts.height,
				left: popts.left,
				top: popts.top,
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
			return dopts;
		},
		dialog: function(jq){
			return jq.window('window');
		}
	};
	
	$.fn.dialog.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.window.parseOptions(target), $.parser.parseOptions(target,['toolbar','buttons']), {
			toolbar: (t.children('.dialog-toolbar').length ? t.children('.dialog-toolbar').removeClass('dialog-toolbar') : undefined),
			buttons: (t.children('.dialog-button').length ? t.children('.dialog-button').removeClass('dialog-button') : undefined)
		});
	};
	
	// Inherited from $.fn.window.defaults.
	$.fn.dialog.defaults = $.extend({}, $.fn.window.defaults, {
		title: 'New Dialog',
		collapsible: false,
		minimizable: false,
		maximizable: false,
		resizable: false,
		
		toolbar:null,
		buttons:null
	});
})(jQuery);
/**
 * messager - jQuery EasyUI
 * 
 * Dependencies:
 * 	linkbutton
 *  window
 *  progressbar
 */
(function($){
	function bindEvents(){
		$(document).unbind('.messager').bind('keydown.messager', function(e){
			if (e.keyCode == 27){	//ESC
				$('body').children('div.messager-window').children('div.messager-body').each(function(){
					$(this).window('close');
				});
			} else if (e.keyCode == 9){	//TAB
				var win = $('body').children('div.messager-window').children('div.messager-body');
				if (!win.length){return}
				var buttons = win.find('.messager-input,.messager-button .l-btn');
				for(var i=0; i<buttons.length; i++){
					if ($(buttons[i]).is(':focus')){
						$(buttons[i>=buttons.length-1?0:i+1]).focus();
						return false;
					}
				}
			}
		});
	}

	function unbindEvents(){
		$(document).unbind('.messager');
	}
	
	/**
	 * create the message window
	 */
	function createWindow(options){
		var opts = $.extend({}, $.messager.defaults, {
			modal: false,
			shadow: false,
			draggable: false,
			resizable: false,
			closed: true,
			// set the message window to the right bottom position
			style: {
				left: '',
				top: '',
				right: 0,
				zIndex: $.fn.window.defaults.zIndex++,
				bottom: -document.body.scrollTop-document.documentElement.scrollTop
			},
			title: '',
			width: 250,
			height: 100,
			showType: 'slide',
			showSpeed: 600,
			msg: '',
			timeout: 4000
		}, options);
		
		var win = $('<div class="messager-body"></div>').html(opts.msg).appendTo('body');
		win.window($.extend({}, opts, {
			openAnimation: (opts.showType),
			closeAnimation: (opts.showType=='show'?'hide':opts.showType),
			openDuration: opts.showSpeed,
			closeDuration: opts.showSpeed,
			onOpen: function(){
				win.window('window').hover(
						function(){
							if (opts.timer){clearTimeout(opts.timer);}
						},
						function(){
							closeMe();
						}
				);
				closeMe();
				function closeMe(){
					if (opts.timeout > 0){
						opts.timer = setTimeout(function(){
							if (win.length && win.data('window')){
								win.window('close');
							}
						}, opts.timeout);
					}
				}
				if (options.onOpen){
					options.onOpen.call(this);
				} else {
					opts.onOpen.call(this);
				}
			},
			onClose: function(){
				if (opts.timer){clearTimeout(opts.timer);}
				if (options.onClose){
					options.onClose.call(this);
				} else {
					opts.onClose.call(this);
				}
				win.window('destroy');
			}
		}));
		win.window('window').css(opts.style);
		win.window('open');
		return win;
	}
	
	/**
	 * create a dialog, when dialog is closed destroy it
	 */
	function createDialog(options){
		bindEvents();
		var win = $('<div class="messager-body"></div>').appendTo('body');
		win.window($.extend({}, options, {
			doSize: false,
			noheader: (options.title?false:true),
			onClose: function(){
				unbindEvents();
				if (options.onClose){
					options.onClose.call(this);
				}
				setTimeout(function(){
					win.window('destroy');
				}, 100);
			}
		}));
		if (options.buttons && options.buttons.length){
			var tb = $('<div class="messager-button"></div>').appendTo(win);
			$.map(options.buttons, function(btn){
				$('<a href="javascript:void(0)" style="margin-left:10px"></a>').appendTo(tb).linkbutton(btn);
			});
		}
		win.window('window').addClass('messager-window');
		win.window('resize');
		win.children('div.messager-button').children('a:first').focus();
		return win;
	}
	
	$.messager = {
		show: function(options){
			return createWindow(options);
		},
		
		alert: function(title, msg, icon, fn) {
			var opts = typeof title == 'object' ? title : {title:title, msg:msg, icon:icon, fn:fn};
			var cls = opts.icon ? 'messager-icon messager-'+opts.icon : '';
			opts = $.extend({}, $.messager.defaults, {
				content: '<div class="' + cls + '"></div>'
						+ '<div>' + opts.msg + '</div>'
						+ '<div style="clear:both;"/>',
				buttons: [{
					text: $.messager.defaults.ok,
					onClick: function(){
						win.window('close');
						opts.fn();
					}
				}]
			}, opts);
            if(icon == 'success'){
                delete opts.buttons;
            }
			var win = createDialog(opts);
            if(icon == 'success'){
                setTimeout(function () {
                    win.window("close");
                }, 1500);
            }
			return win;
		},
		
		confirm: function(title, msg, fn) {
			var opts = typeof title == 'object' ? title : {title:title, msg:msg, fn:fn};
			opts = $.extend({}, $.messager.defaults, {
				content: '<div class="messager-icon messager-question"></div>'
						+ '<div>' + opts.msg + '</div>'
						+ '<div style="clear:both;"/>',
				buttons: [{
					text: $.messager.defaults.ok,
					onClick: function(){
						win.window('close');
						opts.fn(true);
					}
				},{
					text: $.messager.defaults.cancel,
					onClick: function(){
						win.window('close');
						opts.fn(false);
					}
				}]
			}, opts);

			var win = createDialog(opts);
			return win;
		},
		
		prompt: function(title, msg, fn) {
			var opts = typeof title == 'object' ? title : {title:title, msg:msg, fn:fn};
			opts = $.extend({}, $.messager.defaults, {
				content: '<div class="messager-icon messager-question"></div>'
						+ '<div>' + opts.msg + '</div>'
						+ '<br/>'
						+ '<div style="clear:both;"/>'
						+ '<div><input class="messager-input" type="text"/></div>',
				buttons: [{
					text: $.messager.defaults.ok,
					onClick: function(){
						win.window('close');
						opts.fn(win.find('.messager-input').val());
					}
				},{
					text: $.messager.defaults.cancel,
					onClick: function(){
						win.window('close');
						opts.fn();
					}
				}]
			}, opts);

			var win = createDialog(opts);
			win.find('input.messager-input').focus();
			return win;
		},
		
		progress: function(options){
			var methods = {
				bar: function(){	// get the progress bar object
					return $('body>div.messager-window').find('div.messager-p-bar');
				},
				close: function(){	// close the progress window
					var win = $('body>div.messager-window>div.messager-body:has(div.messager-progress)');
					if (win.length){
						win.window('close');
					}
				}
			};
			
			if (typeof options == 'string'){
				var method = methods[options];
				return method();
			}
			
			var opts = $.extend({}, {
				title: '',
				content: undefined,
				msg: '',	// The message box body text
				text: undefined,	// The text to display in the progress bar
				interval: 300	// The length of time in milliseconds between each progress update
			}, options||{});

			var win = createDialog($.extend({}, $.messager.defaults, {
				content: '<div class="messager-progress"><div class="messager-p-msg">' + opts.msg + '</div><div class="messager-p-bar"></div></div>',
				closable: false,
				doSize: false
			}, opts, {
				onClose: function(){
					if (this.timer){
						clearInterval(this.timer);
					}
					if (options.onClose){
						options.onClose.call(this);
					} else {
						$.messager.defaults.onClose.call(this);
					}
				}				
			}));
			var bar = win.find('div.messager-p-bar');
			bar.progressbar({
				text: opts.text
			});
			win.window('resize');
			
			if (opts.interval){
				win[0].timer = setInterval(function(){
					var v = bar.progressbar('getValue');
					v += 10;
					if (v > 100) v = 0;
					bar.progressbar('setValue', v);
				}, opts.interval);
			}
			return win;
		}
	};
	
	$.messager.defaults = $.extend({}, $.fn.window.defaults, {
		ok: 'Ok',
		cancel: 'Cancel',
		width: 300,
		height: 'auto',
		modal: true,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		resizable: false,
		fn: function(){}
	});
	
})(jQuery);
/**
 * accordion - jQuery EasyUI
 * 
 * Dependencies:
 * 	 panel
 * 
 */
(function($){
	
	function setSize(container, param){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		var cc = $(container);
		
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		cc._size(opts);
		var headerHeight = 0;
		var bodyHeight = 'auto';
		var headers = cc.find('>.panel>.accordion-header');
		if (headers.length){
			headerHeight = $(headers[0]).css('height', '')._outerHeight();
		}
		if (!isNaN(parseInt(opts.height))){
			bodyHeight = cc.height() - headerHeight*headers.length;
		}
		
		_resize(true, bodyHeight - _resize(false) + 1);
		
		function _resize(collapsible, height){
			var totalHeight = 0;
			for(var i=0; i<panels.length; i++){
				var p = panels[i];
				var h = p.panel('header')._outerHeight(headerHeight);
				if (p.panel('options').collapsible == collapsible){
					var pheight = isNaN(height) ? undefined : (height+headerHeight*h.length);
					p.panel('resize', {
						width: cc.width(),
						height: (collapsible ? pheight : undefined)
					});
					totalHeight += p.panel('panel').outerHeight()-headerHeight*h.length;
				}
			}
			return totalHeight;
		}
	}
	
	/**
	 * find a panel by specified property, return the panel object or panel index.
	 */
	function findBy(container, property, value, all){
		var panels = $.data(container, 'accordion').panels;
		var pp = [];
		for(var i=0; i<panels.length; i++){
			var p = panels[i];
			if (property){
				if (p.panel('options')[property] == value){
					pp.push(p);
				}
			} else {
				if (p[0] == $(value)[0]){
					return i;
				}
			}
		}
		if (property){
			return all ? pp : (pp.length ? pp[0] : null);
		} else {
			return -1;
		}
	}
	
	function getSelections(container){
		return findBy(container, 'collapsed', false, true);
	}
	
	function getSelected(container){
		var pp = getSelections(container);
		return pp.length ? pp[0] : null;
	}
	
	/**
	 * get panel index, start with 0
	 */
	function getPanelIndex(container, panel){
		return findBy(container, null, panel);
	}
	
	/**
	 * get the specified panel.
	 */
	function getPanel(container, which){
		var panels = $.data(container, 'accordion').panels;
		if (typeof which == 'number'){
			if (which < 0 || which >= panels.length){
				return null;
			} else {
				return panels[which];
			}
		}
		return findBy(container, 'title', which);
	}
	
	function setProperties(container){
		var opts = $.data(container, 'accordion').options;
		var cc = $(container);
		if (opts.border){
			cc.removeClass('accordion-noborder');
		} else {
			cc.addClass('accordion-noborder');
		}
	}
	
	function init(container){
		var state = $.data(container, 'accordion');
		var cc = $(container);
		cc.addClass('accordion');
		
		state.panels = [];
		cc.children('div').each(function(){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			state.panels.push(pp);
			createPanel(container, pp, opts);
		});
		
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(container);
			}
			return false;
		});
	}
	
	function createPanel(container, pp, options){
		var opts = $.data(container, 'accordion').options;
		pp.panel($.extend({}, {
			collapsible: true,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
			collapsed: true,
			headerCls: 'accordion-header',
			bodyCls: 'accordion-body'
		}, options, {
			onBeforeExpand: function(){
				if (options.onBeforeExpand){
					if (options.onBeforeExpand.call(this) == false){return false}
				}
				if (!opts.multiple){
					// get all selected panel
					var all = $.grep(getSelections(container), function(p){
						return p.panel('options').collapsible;
					});
					for(var i=0; i<all.length; i++){
						unselect(container, getPanelIndex(container, all[i]));
					}
				}
				var header = $(this).panel('header');
				header.addClass('accordion-header-selected');
				header.find('.accordion-collapse').removeClass('accordion-expand');
			},
			onExpand: function(){
				if (options.onExpand){options.onExpand.call(this)}
				opts.onSelect.call(container, $(this).panel('options').title, getPanelIndex(container, this));
			},
			onBeforeCollapse: function(){
				if (options.onBeforeCollapse){
					if (options.onBeforeCollapse.call(this) == false){return false}
				}
				var header = $(this).panel('header');
				header.removeClass('accordion-header-selected');
				header.find('.accordion-collapse').addClass('accordion-expand');
			},
			onCollapse: function(){
				if (options.onCollapse){options.onCollapse.call(this)}
				opts.onUnselect.call(container, $(this).panel('options').title, getPanelIndex(container, this));
			}
		}));
		
		var header = pp.panel('header');
		var tool = header.children('div.panel-tool');
		tool.children('a.panel-tool-collapse').hide();	// hide the old collapse button
		var t = $('<a href="javascript:void(0)"></a>').addClass('accordion-collapse accordion-expand').appendTo(tool);
		t.bind('click', function(){
			togglePanel(pp);
			return false;
		});
		pp.panel('options').collapsible ? t.show() : t.hide();
		
		header.click(function(){
			togglePanel(pp);
			return false;
		});
		
		function togglePanel(p){
			var popts = p.panel('options');
			if (popts.collapsible){
				var index = getPanelIndex(container, p);
				if (popts.collapsed){
					select(container, index);
				} else {
					unselect(container, index);
				}
			}
		}
	}
	
	/**
	 * select and set the specified panel active
	 */
	function select(container, which){
		var p = getPanel(container, which);
		if (!p){return}
		stopAnimate(container);
		var opts = $.data(container, 'accordion').options;
		p.panel('expand', opts.animate);
	}
	
	function unselect(container, which){
		var p = getPanel(container, which);
		if (!p){return}
		stopAnimate(container);
		var opts = $.data(container, 'accordion').options;
		p.panel('collapse', opts.animate);
	}
	
	function doFirstSelect(container){
		var opts = $.data(container, 'accordion').options;
		var p = findBy(container, 'selected', true);
		if (p){
			_select(getPanelIndex(container, p));
		} else {
			_select(opts.selected);
		}
		
		function _select(index){
			var animate = opts.animate;
			opts.animate = false;
			select(container, index);
			opts.animate = animate;
		}
	}
	
	/**
	 * stop the animation of all panels
	 */
	function stopAnimate(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			panels[i].stop(true,true);
		}
	}
	
	function add(container, options){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		if (options.selected == undefined) options.selected = true;

		stopAnimate(container);
		
		var pp = $('<div></div>').appendTo(container);
		panels.push(pp);
		createPanel(container, pp, options);
		setSize(container);
		
		opts.onAdd.call(container, options.title, panels.length-1);
		
		if (options.selected){
			select(container, panels.length-1);
		}
	}
	
	function remove(container, which){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		
		stopAnimate(container);
		
		var panel = getPanel(container, which);
		var title = panel.panel('options').title;
		var index = getPanelIndex(container, panel);
		
		if (!panel){return}
		if (opts.onBeforeRemove.call(container, title, index) == false){return}
		
		panels.splice(index, 1);
		panel.panel('destroy');
		if (panels.length){
			setSize(container);
			var curr = getSelected(container);
			if (!curr){
				select(container, 0);
			}
		}
		
		opts.onRemove.call(container, title, index);
	}
	
	$.fn.accordion = function(options, param){
		if (typeof options == 'string'){
			return $.fn.accordion.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'accordion');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'accordion', {
					options: $.extend({}, $.fn.accordion.defaults, $.fn.accordion.parseOptions(this), options),
					accordion: $(this).addClass('accordion'),
					panels: []
				});
				init(this);
			}
			
			setProperties(this);
			setSize(this);
			doFirstSelect(this);
		});
	};
	
	$.fn.accordion.methods = {
		options: function(jq){
			return $.data(jq[0], 'accordion').options;
		},
		panels: function(jq){
			return $.data(jq[0], 'accordion').panels;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getSelections: function(jq){
			return getSelections(jq[0]);
		},
		getSelected: function(jq){
			return getSelected(jq[0]);
		},
		getPanel: function(jq, which){
			return getPanel(jq[0], which);
		},
		getPanelIndex: function(jq, panel){
			return getPanelIndex(jq[0], panel);
		},
		select: function(jq, which){
			return jq.each(function(){
				select(this, which);
			});
		},
		unselect: function(jq, which){
			return jq.each(function(){
				unselect(this, which);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				add(this, options);
			});
		},
		remove: function(jq, which){
			return jq.each(function(){
				remove(this, which);
			});
		}
	};
	
	$.fn.accordion.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',
			{fit:'boolean',border:'boolean',animate:'boolean',multiple:'boolean',selected:'number'}
		]));
	};
	
	$.fn.accordion.defaults = {
		width: 'auto',
		height: 'auto',
		fit: false,
		border: true,
		animate: true,
		multiple: false,
		selected: 0,
		
		onSelect: function(title, index){},
		onUnselect: function(title, index){},
		onAdd: function(title, index){},
		onBeforeRemove: function(title, index){},
		onRemove: function(title, index){}
	};
})(jQuery);
/**
 * tabs - jQuery EasyUI
 * 
 * Dependencies:
 * 	 panel
 *   linkbutton
 * 
 */
(function($){
	function getContentWidth(c){
		var w = 0;
		$(c).children().each(function(){
			w += $(this).outerWidth(true);
		});
		return w;
	}
	/**
	 * set the tabs scrollers to show or not,
	 * dependent on the tabs count and width
	 */
	function setScrollers(container) {
		var opts = $.data(container, 'tabs').options;
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right' || !opts.showHeader){return}
		
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap');
		
		// set the tool height
		var tHeight = header.outerHeight();
		if (opts.plain){
			tHeight -= tHeight - header.height();
		}
		tool._outerHeight(tHeight);
		
		var tabsWidth = getContentWidth(header.find('ul.tabs'));
		var cWidth = header.width() - tool._outerWidth();
		
		if (tabsWidth > cWidth) {
			sLeft.add(sRight).show()._outerHeight(tHeight);
			if (opts.toolPosition == 'left'){
				tool.css({
					left: sLeft.outerWidth(),
					right: ''
				});
				wrap.css({
					marginLeft: sLeft.outerWidth() + tool._outerWidth(),
					marginRight: sRight._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			} else {
				tool.css({
					left: '',
					right: sRight.outerWidth()
				});
				wrap.css({
					marginLeft: sLeft.outerWidth(),
					marginRight: sRight.outerWidth() + tool._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			}
		} else {
			sLeft.add(sRight).hide();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: 0,
					right: ''
				});
				wrap.css({
					marginLeft: tool._outerWidth(),
					marginRight: 0,
					width: cWidth
				});
			} else {
				tool.css({
					left: '',
					right: 0
				});
				wrap.css({
					marginLeft: 0,
					marginRight: tool._outerWidth(),
					width: cWidth
				});
			}
		}
	}
	
	function addTools(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		if (opts.tools) {
			if (typeof opts.tools == 'string'){
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else {
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"><table cellspacing="0" cellpadding="0" style="height:100%"><tr></tr></table></div>').appendTo(header);
				var tr = tools.find('tr');
				for(var i=0; i<opts.tools.length; i++){
					var td = $('<td></td>').appendTo(tr);
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(td);
					tool[0].onclick = eval(opts.tools[i].handler || function(){});
					tool.linkbutton($.extend({}, opts.tools[i], {
						plain: true
					}));
				}
			}
		} else {
			header.children('div.tabs-tool').remove();
		}
	}
	
	function setSize(container, param) {
		var state = $.data(container, 'tabs');
		var opts = state.options;
		var cc = $(container);
		
		if (!opts.doSize){return}
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		cc._size(opts);

		var header = cc.children('div.tabs-header');
		var panels = cc.children('div.tabs-panels');
		var wrap = header.find('div.tabs-wrap');
		var ul = wrap.find('.tabs');
		ul.children('li').removeClass('tabs-first tabs-last');
		ul.children('li:first').addClass('tabs-first');
		ul.children('li:last').addClass('tabs-last');
		
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){
			header._outerWidth(opts.showHeader ? opts.headerWidth : 0);
			panels._outerWidth(cc.width() - header.outerWidth());
			header.add(panels)._outerHeight(opts.height);
			wrap._outerWidth(header.width());
			ul._outerWidth(wrap.width()).css('height','');
		} else {
			header.children('div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool').css('display', opts.showHeader?'block':'none');
			header._outerWidth(cc.width()).css('height','');
			if (opts.showHeader){
				header.css('background-color','');
				wrap.css('height','');
			} else {
				header.css('background-color','transparent');
				header._outerHeight(0);
				wrap._outerHeight(0);
			}
			ul._outerHeight(opts.tabHeight).css('width','');
			ul._outerHeight(ul.outerHeight()-ul.height()-1+opts.tabHeight).css('width','');
			
			panels._size('height', isNaN(opts.height) ? '' : (opts.height-header.outerHeight()));
			panels._size('width', isNaN(opts.width) ? '' : opts.width);
		}

		if (state.tabs.length){
			var d1 = ul.outerWidth(true) - ul.width();
			var li = ul.children('li:first');
			var d2 = li.outerWidth(true) - li.width();
			var hwidth = header.width() - header.children('.tabs-tool')._outerWidth();
			var justifiedWidth = Math.floor((hwidth-d1-d2*state.tabs.length)/state.tabs.length);
			
			$.map(state.tabs, function(p){
				setTabSize(p, (opts.justified && $.inArray(opts.tabPosition,['top','bottom'])>=0) ? justifiedWidth : undefined);
			});
			if (opts.justified && $.inArray(opts.tabPosition,['top','bottom'])>=0){
				var deltaWidth = hwidth - d1 - getContentWidth(ul);
				setTabSize(state.tabs[state.tabs.length-1], justifiedWidth+deltaWidth);
			}
		}
		setScrollers(container);

		function setTabSize(p, width){
			var p_opts = p.panel('options');
			var p_t = p_opts.tab.find('a.tabs-inner');
			var width = width ? width : (parseInt(p_opts.tabWidth||opts.tabWidth||undefined));
			if (width){
				p_t._outerWidth(width);
			} else {
				p_t.css('width', '');
			}
			p_t._outerHeight(opts.tabHeight);
			p_t.css('lineHeight', p_t.height()+'px');
			p_t.find('.easyui-fluid:visible').triggerHandler('_resize');
		}
	}
	
	/**
	 * set selected tab panel size
	 */
	function setSelectedSize(container){
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab){
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width=='auto' ? 'auto' : panels.width();
			var height = opts.height=='auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	
	/**
	 * wrap the tabs header and body
	 */
	function wrapTabs(container) {
		var tabs = $.data(container, 'tabs').tabs;
		var cc = $(container).addClass('tabs-container');
		var panels = $('<div class="tabs-panels"></div>').insertBefore(cc);
		cc.children('div').each(function(){
			panels[0].appendChild(this);
		});
		cc[0].appendChild(panels[0]);
		$('<div class="tabs-header">'
				+ '<div class="tabs-scroller-left"></div>'
				+ '<div class="tabs-scroller-right"></div>'
				+ '<div class="tabs-wrap">'
				+ '<ul class="tabs"></ul>'
				+ '</div>'
				+ '</div>').prependTo(container);
		
		cc.children('div.tabs-panels').children('div').each(function(i){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			createTab(container, opts, $(this));
		});
		
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(
				function(){$(this).addClass('tabs-scroller-over');},
				function(){$(this).removeClass('tabs-scroller-over');}
		);
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
	}
	
	function bindEvents(container){
		var state = $.data(container, 'tabs')
		var opts = state.options;
		$(container).children('div.tabs-header').unbind().bind('click', function(e){
			if ($(e.target).hasClass('tabs-scroller-left')){
				$(container).tabs('scrollBy', -opts.scrollIncrement);
			} else if ($(e.target).hasClass('tabs-scroller-right')){
				$(container).tabs('scrollBy', opts.scrollIncrement);
			} else {
				var li = $(e.target).closest('li');
				if (li.hasClass('tabs-disabled')){return false;}
				var a = $(e.target).closest('a.tabs-close');
				if (a.length){
					closeTab(container, getLiIndex(li));
				} else if (li.length){
//					selectTab(container, getLiIndex(li));
					var index = getLiIndex(li);
					var popts = state.tabs[index].panel('options');
					if (popts.collapsible){
						popts.closed ? selectTab(container, index) : unselectTab(container, index);
					} else {
						selectTab(container, index);
					}
				}
				return false;
			}
		}).bind('contextmenu', function(e){
			var li = $(e.target).closest('li');
			if (li.hasClass('tabs-disabled')){return;}
			if (li.length){
				opts.onContextMenu.call(container, e, li.find('span.tabs-title').html(), getLiIndex(li));
			}
		});
		
		function getLiIndex(li){
			var index = 0;
			li.parent().children('li').each(function(i){
				if (li[0] == this){
					index = i;
					return false;
				}
			});
			return index;
		}
	}
	
	function setProperties(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right');
		panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right');
		if (opts.tabPosition == 'top'){
			header.insertBefore(panels);
		} else if (opts.tabPosition == 'bottom'){
			header.insertAfter(panels);
			header.addClass('tabs-header-bottom');
			panels.addClass('tabs-panels-top');
		} else if (opts.tabPosition == 'left'){
			header.addClass('tabs-header-left');
			panels.addClass('tabs-panels-right');
		} else if (opts.tabPosition == 'right'){
			header.addClass('tabs-header-right');
			panels.addClass('tabs-panels-left');
		}
		
		if (opts.plain == true) {
			header.addClass('tabs-header-plain');
		} else {
			header.removeClass('tabs-header-plain');
		}
		header.removeClass('tabs-header-narrow').addClass(opts.narrow?'tabs-header-narrow':'');
		var tabs = header.find('.tabs');
		tabs.removeClass('tabs-pill').addClass(opts.pill?'tabs-pill':'');
		tabs.removeClass('tabs-narrow').addClass(opts.narrow?'tabs-narrow':'');
		tabs.removeClass('tabs-justified').addClass(opts.justified?'tabs-justified':'');
		if (opts.border == true){
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else {
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
		opts.doSize = true;
	}
	
	function createTab(container, options, pp) {
		options = options || {};
		var state = $.data(container, 'tabs');
		var tabs = state.tabs;
		if (options.index == undefined || options.index > tabs.length){options.index = tabs.length}
		if (options.index < 0){options.index = 0}
		
		var ul = $(container).children('div.tabs-header').find('ul.tabs');
		var panels = $(container).children('div.tabs-panels');
		var tab = $(
				'<li>' +
				'<a href="javascript:void(0)" class="tabs-inner">' +
				'<span class="tabs-title"></span>' +
				'<span class="tabs-icon"></span>' +
				'</a>' +
				'</li>');
		if (!pp){pp = $('<div></div>');}
		if (options.index >= tabs.length){
			tab.appendTo(ul);
			pp.appendTo(panels);
			tabs.push(pp);
		} else {
			tab.insertBefore(ul.children('li:eq('+options.index+')'));
			pp.insertBefore(panels.children('div.panel:eq('+options.index+')'));
			tabs.splice(options.index, 0, pp);
		}
		
		// create panel
		pp.panel($.extend({}, options, {
			tab: tab,
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			},
			onBeforeOpen: function(){
				if (options.onBeforeOpen){
					if (options.onBeforeOpen.call(this) == false){return false;}
				}
				var p = $(container).tabs('getSelected');
				if (p){
					if (p[0] != this){
						$(container).tabs('unselect', getTabIndex(container, p));
						p = $(container).tabs('getSelected');
						if (p){
							return false;
						}
					} else {
						setSelectedSize(container);
						return false;
					}
				}
				
				var popts = $(this).panel('options');
				popts.tab.addClass('tabs-selected');
				// scroll the tab to center position if required.
				var wrap = $(container).find('>div.tabs-header>div.tabs-wrap');
				var left = popts.tab.position().left;
				var right = left + popts.tab.outerWidth();
				if (left < 0 || right > wrap.width()){
					var deltaX = left - (wrap.width()-popts.tab.width()) / 2;
					$(container).tabs('scrollBy', deltaX);
				} else {
					$(container).tabs('scrollBy', 0);
				}
				
				var panel = $(this).panel('panel');
				panel.css('display','block');
				setSelectedSize(container);
				panel.css('display','none');
			},
			onOpen: function(){
				if (options.onOpen){
					options.onOpen.call(this);
				}
				var popts = $(this).panel('options');
				state.selectHis.push(popts.title);
				state.options.onSelect.call(container, popts.title, getTabIndex(container, this));
			},
			onBeforeClose: function(){
				if (options.onBeforeClose){
					if (options.onBeforeClose.call(this) == false){return false;}
				}
				$(this).panel('options').tab.removeClass('tabs-selected');
			},
			onClose: function(){
				if (options.onClose){
					options.onClose.call(this);
				}
				var popts = $(this).panel('options');
				state.options.onUnselect.call(container, popts.title, getTabIndex(container, this));
			}
		}));
		
		// only update the tab header
		$(container).tabs('update', {
			tab: pp,
			options: pp.panel('options'),
			type: 'header'
		});
	}
	
	function addTab(container, options) {
		var state = $.data(container, 'tabs');
		var opts = state.options;
		if (options.selected == undefined) options.selected = true;
		
		createTab(container, options);
		opts.onAdd.call(container, options.title, options.index);
		if (options.selected){
			selectTab(container, options.index);	// select the added tab panel
		}
	}
	
	/**
	 * update tab panel, param has following properties:
	 * tab: the tab panel to be updated
	 * options: the tab panel options
	 * type: the update type, possible values are: 'header','body','all'
	 */
	function updateTab(container, param){
		param.type = param.type || 'all';
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab;	// the tab panel
		var oldTitle = pp.panel('options').title;
		
		if (param.type == 'all' || param == 'body'){
			pp.panel($.extend({}, param.options, {
				iconCls: (param.options.icon ? param.options.icon : undefined)
			}));
		}
		if (param.type == 'all' || param.type == 'header'){
			var opts = pp.panel('options');	// get the tab panel options
			var tab = opts.tab;
			
			if (opts.header){
				tab.find('.tabs-inner').html($(opts.header));
			} else {
				var s_title = tab.find('span.tabs-title');
				var s_icon = tab.find('span.tabs-icon');
				s_title.html(opts.title);
				s_icon.attr('class', 'tabs-icon');
				
				tab.find('a.tabs-close').remove();
				if (opts.closable){
					s_title.addClass('tabs-closable');
					$('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
				} else{
					s_title.removeClass('tabs-closable');
				}
				if (opts.iconCls){
					s_title.addClass('tabs-with-icon');
					s_icon.addClass(opts.iconCls);
				} else {
					s_title.removeClass('tabs-with-icon');
				}
				if (opts.tools){
					var p_tool = tab.find('span.tabs-p-tool');
					if (!p_tool.length){
						var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(tab.find('a.tabs-inner'));
					}
					if ($.isArray(opts.tools)){
						for(var i=0; i<opts.tools.length; i++){
							var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
							t.addClass(opts.tools[i].iconCls);
							if (opts.tools[i].handler){
								t.bind('click', {handler:opts.tools[i].handler}, function(e){
									if ($(this).parents('li').hasClass('tabs-disabled')){return;}
									e.data.handler.call(this);
								});
							}
						}
					} else {
						$(opts.tools).children().appendTo(p_tool);
					}
					var pr = p_tool.children().length * 12;
					if (opts.closable) {
						pr += 8;
					} else {
						pr -= 3;
						p_tool.css('right','5px');
					}
					s_title.css('padding-right', pr+'px');
				} else {
					tab.find('span.tabs-p-tool').remove();
					s_title.css('padding-right', '');
				}
			}
			if (oldTitle != opts.title){
				for(var i=0; i<selectHis.length; i++){
					if (selectHis[i] == oldTitle){
						selectHis[i] = opts.title;
					}
				}
			}
		}
		
		setSize(container);
		
		$.data(container, 'tabs').options.onUpdate.call(container, opts.title, getTabIndex(container, pp));
	}
	
	/**
	 * close a tab with specified index or title
	 */
	function closeTab(container, which) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (!exists(container, which)) return;
		
		var tab = getTab(container, which);
		var title = tab.panel('options').title;
		var index = getTabIndex(container, tab);
		
		if (opts.onBeforeClose.call(container, title, index) == false) return;
		
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		
		opts.onClose.call(container, title, index);
		
//		setScrollers(container);
		setSize(container);
		
		// remove the select history item
		for(var i=0; i<selectHis.length; i++){
			if (selectHis[i] == title){
				selectHis.splice(i, 1);
				i --;
			}
		}
		
		// select the nearest tab panel
		var hisTitle = selectHis.pop();
		if (hisTitle){
			selectTab(container, hisTitle);
		} else if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	/**
	 * get the specified tab panel
	 */
	function getTab(container, which, removeit){
		var tabs = $.data(container, 'tabs').tabs;
		if (typeof which == 'number'){
			if (which < 0 || which >= tabs.length){
				return null;
			} else {
				var tab = tabs[which];
				if (removeit) {
					tabs.splice(which, 1);
				}
				return tab;
			}
		}
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').title == which){
				if (removeit){
					tabs.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	}
	
	function getTabIndex(container, tab){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i][0] == $(tab)[0]){
				return i;
			}
		}
		return -1;
	}
	
	function getSelectedTab(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').tab.hasClass('tabs-selected')){
				return tab;
			}
		}
		return null;
	}
	
	/**
	 * do first select action, if no tab is setted the first tab will be selected.
	 */
	function doFirstSelect(container){
		var state = $.data(container, 'tabs')
		var tabs = state.tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i].panel('options').selected){
				selectTab(container, i);
				return;
			}
		}
//		if (tabs.length){
//			selectTab(container, 0);
//		}
		selectTab(container, state.options.selected);
	}
	
	function selectTab(container, which){
		var p = getTab(container, which);
		if (p && !p.is(':visible')){
			stopAnimate(container);
			p.panel('open');
		}
	}
	
	function unselectTab(container, which){
		var p = getTab(container, which);
		if (p && p.is(':visible')){
			stopAnimate(container);
			p.panel('close');
		}
	}

	function stopAnimate(container){
		$(container).children('div.tabs-panels').each(function(){
			$(this).stop(true, true);
		});
	}
	
	function exists(container, which){
		return getTab(container, which) != null;
	}
	
	function showHeader(container, visible){
		var opts = $.data(container, 'tabs').options;
		opts.showHeader = visible;
		$(container).tabs('resize');
	}
	
	
	$.fn.tabs = function(options, param){
		if (typeof options == 'string') {
			return $.fn.tabs.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tabs');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'tabs', {
					options: $.extend({},$.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: [],
					selectHis: []
				});
				wrapTabs(this);
			}
			
			addTools(this);
			setProperties(this);
			setSize(this);
			bindEvents(this);
			
			doFirstSelect(this);
		});
	};
	
	$.fn.tabs.methods = {
		options: function(jq){
			var cc = jq[0];
			var opts = $.data(cc, 'tabs').options;
			var s = getSelectedTab(cc);
			opts.selected = s ? getTabIndex(cc, s) : -1;
			return opts;
		},
		tabs: function(jq){
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
				setSelectedSize(this);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			});
		},
		close: function(jq, which){
			return jq.each(function(){
				closeTab(this, which);
			});
		},
		getTab: function(jq, which){
			return getTab(jq[0], which);
		},
		getTabIndex: function(jq, tab){
			return getTabIndex(jq[0], tab);
		},
		getSelected: function(jq){
			return getSelectedTab(jq[0]);
		},
		select: function(jq, which){
			return jq.each(function(){
				selectTab(this, which);
			});
		},
		unselect: function(jq, which){
			return jq.each(function(){
				unselectTab(this, which);
			});
		},
		exists: function(jq, which){
			return exists(jq[0], which);
		},
		update: function(jq, options){
			return jq.each(function(){
				updateTab(this, options);
			});
		},
		enableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.removeClass('tabs-disabled');
			});
		},
		disableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.addClass('tabs-disabled');
			});
		},
		showHeader: function(jq){
			return jq.each(function(){
				showHeader(this, true);
			});
		},
		hideHeader: function(jq){
			return jq.each(function(){
				showHeader(this, false);
			});
		},
		scrollBy: function(jq, deltaX){	// scroll the tab header by the specified amount of pixels
			return jq.each(function(){
				var opts = $(this).tabs('options');
				var wrap = $(this).find('>div.tabs-header>div.tabs-wrap');
				var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
				wrap.animate({scrollLeft: pos}, opts.scrollDuration);
				
				function getMaxScrollWidth(){
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			});
		}
	};
	
	$.fn.tabs.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
			'tools','toolPosition','tabPosition',
			{fit:'boolean',border:'boolean',plain:'boolean'},
			{headerWidth:'number',tabWidth:'number',tabHeight:'number',selected:'number'},
			{showHeader:'boolean',justified:'boolean',narrow:'boolean',pill:'boolean'}
		]));
	};
	
	$.fn.tabs.defaults = {
		width: 'auto',
		height: 'auto',
		headerWidth: 150,	// the tab header width, it is valid only when tabPosition set to 'left' or 'right' 
		tabWidth: 'auto',	// the tab width
		tabHeight: 27,		// the tab height
		selected: 0,		// the initialized selected tab index
		showHeader: true,
		plain: false,
		fit: false,
		border: true,
		justified: false,
		narrow: false,
		pill: false,
		tools: null,
		toolPosition: 'right',	// left,right
		tabPosition: 'top',		// possible values: top,bottom
		scrollIncrement: 100,
		scrollDuration: 400,
		onLoad: function(panel){},
		onSelect: function(title, index){},
		onUnselect: function(title, index){},
		onBeforeClose: function(title, index){},
		onClose: function(title, index){},
		onAdd: function(title, index){},
		onUpdate: function(title, index){},
		onContextMenu: function(e, title, index){}
	};
})(jQuery);
/**
 * layout - jQuery EasyUI
 * 
 * Dependencies:
 *   resizable
 *   panel
 */
(function($){
	var resizing = false;	// indicate if the region panel is being resized
	
	function setSize(container, param){
		var state = $.data(container, 'layout');
		var opts = state.options;
		var panels = state.panels;
		var cc = $(container);
		
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		if (container.tagName.toLowerCase() == 'body'){
			// opts.fit = true;
			// cc._size(opts, $('body'))._size('clear');
			cc._size('fit');
		} else {
			cc._size(opts);
		}
		
		var cpos = {
			top:0,
			left:0,
			width:cc.width(),
			height:cc.height()
		};
		
		setVSize(isVisible(panels.expandNorth) ? panels.expandNorth : panels.north, 'n');
		setVSize(isVisible(panels.expandSouth) ? panels.expandSouth : panels.south, 's');
		setHSize(isVisible(panels.expandEast) ? panels.expandEast : panels.east, 'e');
		setHSize(isVisible(panels.expandWest) ? panels.expandWest : panels.west, 'w');
		
		panels.center.panel('resize', cpos);
		
		function setVSize(pp, type){
			if (!pp.length || !isVisible(pp)){return}
			var opts = pp.panel('options');
			pp.panel('resize', {
				width: cc.width(),
				height: opts.height
			});
			var height = pp.panel('panel').outerHeight();
			pp.panel('move', {
				left: 0,
				top: (type=='n' ? 0 : cc.height()-height)
			});
			cpos.height -= height;
			if (type == 'n'){
				cpos.top += height;
				if (!opts.split && opts.border){cpos.top--;}
			}
			if (!opts.split && opts.border){
				cpos.height++;
			}
		}
		function setHSize(pp, type){
			if (!pp.length || !isVisible(pp)){return}
			var opts = pp.panel('options');
			pp.panel('resize', {
				width: opts.width,
				height: cpos.height
			});
			var width = pp.panel('panel').outerWidth();
			pp.panel('move', {
				left: (type=='e' ? cc.width()-width : 0),
				top: cpos.top
			});
			cpos.width -= width;
			if (type == 'w'){
				cpos.left += width;
				if (!opts.split && opts.border){cpos.left--;}
			}
			if (!opts.split && opts.border){cpos.width++;}
		}
	}
	
	/**
	 * initialize and wrap the layout
	 */
	function init(container){
		var cc = $(container);
		
		cc.addClass('layout');
		
		function _add(cc){
			cc.children('div').each(function(){
				var opts = $.fn.layout.parsePanelOptions(this);
				if ('north,south,east,west,center'.indexOf(opts.region) >= 0){
					addPanel(container, opts, this);
				}
			});
		}
		
		cc.children('form').length ? _add(cc.children('form')) : _add(cc);
		
		cc.append('<div class="layout-split-proxy-h"></div><div class="layout-split-proxy-v"></div>');
		
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(container);
			}
//			var opts = $.data(container, 'layout').options;
//			if (opts.fit == true || force){
//				setSize(container);
//			}
			return false;
		});
	}
	
	/**
	 * Add a new region panel on specified element
	 */
	function addPanel(container, param, el){
		param.region = param.region || 'center';
		var panels = $.data(container, 'layout').panels;
		var cc = $(container);
		var dir = param.region;
		
		if (panels[dir].length) return;	// the region panel is already exists
		
		var pp = $(el);
		if (!pp.length){
			pp = $('<div></div>').appendTo(cc);	// the predefined panel isn't exists, create a new panel instead
		}
		
		var popts = $.extend({}, $.fn.layout.paneldefaults, {
			width: (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : 'auto'),
			height: (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : 'auto'),
			doSize: false,
			collapsible: true,
			cls: ('layout-panel layout-panel-' + dir),
			bodyCls: 'layout-body',
			onOpen: function(){
				var tool = $(this).panel('header').children('div.panel-tool');
				tool.children('a.panel-tool-collapse').hide();	// hide the old collapse button
				
				var buttonDir = {north:'up',south:'down',east:'right',west:'left'};
				if (!buttonDir[dir]) return;
				
				var iconCls = 'layout-button-' + buttonDir[dir];
				// add collapse tool to panel header
				var t = tool.children('a.' + iconCls);
				if (!t.length){
					t = $('<a href="javascript:void(0)"></a>').addClass(iconCls).appendTo(tool);
					t.bind('click', {dir:dir}, function(e){
						collapsePanel(container, e.data.dir);
						return false;
					});
				}
				$(this).panel('options').collapsible ? t.show() : t.hide();
			}
		}, param);
		
		pp.panel(popts);	// create region panel
		panels[dir] = pp;
		
		var handles = {north:'s',south:'n',east:'w',west:'e'};
		var panel = pp.panel('panel');
		if (pp.panel('options').split){
			panel.addClass('layout-split-' + dir);
		}
		panel.resizable($.extend({}, {
			handles: (handles[dir]||''),
			disabled: (!pp.panel('options').split),
			onStartResize: function(e){
				resizing = true;
				
				if (dir == 'north' || dir == 'south'){
					var proxy = $('>div.layout-split-proxy-v', container);
				} else {
					var proxy = $('>div.layout-split-proxy-h', container);
				}
				var top=0,left=0,width=0,height=0;
				var pos = {display: 'block'};
				if (dir == 'north'){
					pos.top = parseInt(panel.css('top')) + panel.outerHeight() - proxy.height();
					pos.left = parseInt(panel.css('left'));
					pos.width = panel.outerWidth();
					pos.height = proxy.height();
				} else if (dir == 'south'){
					pos.top = parseInt(panel.css('top'));
					pos.left = parseInt(panel.css('left'));
					pos.width = panel.outerWidth();
					pos.height = proxy.height();
				} else if (dir == 'east'){
					pos.top = parseInt(panel.css('top')) || 0;
					pos.left = parseInt(panel.css('left')) || 0;
					pos.width = proxy.width();
					pos.height = panel.outerHeight();
				} else if (dir == 'west'){
					pos.top = parseInt(panel.css('top')) || 0;
					pos.left = panel.outerWidth() - proxy.width();
					pos.width = proxy.width();
					pos.height = panel.outerHeight();
				}
				proxy.css(pos);
				
				$('<div class="layout-mask"></div>').css({
					left:0,
					top:0,
					width:cc.width(),
					height:cc.height()
				}).appendTo(cc);
			},
			onResize: function(e){
				if (dir == 'north' || dir == 'south'){
					var proxy = $('>div.layout-split-proxy-v', container);
					proxy.css('top', e.pageY - $(container).offset().top - proxy.height()/2);
				} else {
					var proxy = $('>div.layout-split-proxy-h', container);
					proxy.css('left', e.pageX - $(container).offset().left - proxy.width()/2);
				}
				return false;
			},
			onStopResize: function(e){
				cc.children('div.layout-split-proxy-v,div.layout-split-proxy-h').hide();
				pp.panel('resize',e.data);
				
				setSize(container);
				resizing = false;
				
				cc.find('>div.layout-mask').remove();
			}
		}, param));
	}
	
	/**
	 * remove a region panel
	 */
	function removePanel(container, region){
		var panels = $.data(container, 'layout').panels;
		if (panels[region].length){
			panels[region].panel('destroy');
			panels[region] = $();
			var expandP = 'expand' + region.substring(0,1).toUpperCase() + region.substring(1);
			if (panels[expandP]){
				panels[expandP].panel('destroy');
				panels[expandP] = undefined;
			}
		}
	}
	
	function collapsePanel(container, region, animateSpeed){
		if (animateSpeed == undefined){animateSpeed = 'normal';}
		var panels = $.data(container, 'layout').panels;
		
		var p = panels[region];
		var popts = p.panel('options');
		if (popts.onBeforeCollapse.call(p) == false) return;
		
		// expand panel name: expandNorth, expandSouth, expandWest, expandEast
		var expandP = 'expand' + region.substring(0,1).toUpperCase() + region.substring(1);
		if (!panels[expandP]){
			panels[expandP] = createExpandPanel(region);
			panels[expandP].panel('panel').bind('click', function(){
				p.panel('expand',false).panel('open');
				var copts = getOption();
				p.panel('resize', copts.collapse);
				p.panel('panel').animate(copts.expand, function(){
					$(this).unbind('.layout').bind('mouseleave.layout', {region:region}, function(e){
						if (resizing == true){return;}
						if ($('body>div.combo-p>div.combo-panel:visible').length){return;}
						collapsePanel(container, e.data.region);
					});
				});
				
				return false;
			});
		}
		
		var copts = getOption();
		if (!isVisible(panels[expandP])){
			panels.center.panel('resize', copts.resizeC);
		}
		p.panel('panel').animate(copts.collapse, animateSpeed, function(){
			p.panel('collapse',false).panel('close');
			panels[expandP].panel('open').panel('resize', copts.expandP);
			
			$(this).unbind('.layout');
		});
		
		/**
		 * create expand panel
		 */
		function createExpandPanel(dir){
			var icon;
			if (dir == 'east') icon = 'layout-button-left'
			else if (dir == 'west') icon = 'layout-button-right'
			else if (dir == 'north') icon = 'layout-button-down'
			else if (dir == 'south') icon = 'layout-button-up';
			
			var p = $('<div></div>').appendTo(container);
			p.panel($.extend({}, $.fn.layout.paneldefaults, {
				cls: ('layout-expand layout-expand-' + dir),
				title: '&nbsp;',
				closed: true,
				minWidth: 0,
				minHeight: 0,
				doSize: false,
				tools: [{
					iconCls: icon,
					handler:function(){
						expandPanel(container, region);
						return false;
					}
				}]
			}));
			p.panel('panel').hover(
				function(){$(this).addClass('layout-expand-over');},
				function(){$(this).removeClass('layout-expand-over');}
			);
			return p;
		}
		
		/**
		 * get collapse option:{
		 *   resizeC:{},
		 *   expand:{},
		 *   expandP:{},	// the expand holder panel
		 *   collapse:{}
		 * }
		 */
		function getOption(){
			var cc = $(container);
			var copts = panels.center.panel('options');
			var csize = popts.collapsedSize;
			
			if (region == 'east'){
				var pwidth = p.panel('panel')._outerWidth();
				var cwidth = copts.width + pwidth - csize;
				if (popts.split || !popts.border){cwidth++;}
				return {
					resizeC:{
						width: cwidth
					},
					expand:{
						left: cc.width() - pwidth
					},
					expandP:{
						top: copts.top,
						left: cc.width() - csize,
						width: csize,
						height: copts.height
					},
					collapse:{
						left: cc.width(),
						top: copts.top,
						height: copts.height
					}
				};
			} else if (region == 'west'){
				var pwidth = p.panel('panel')._outerWidth();
				var cwidth = copts.width + pwidth - csize;
				if (popts.split || !popts.border){cwidth++;}
				return {
					resizeC:{
						width: cwidth,
						left: csize - 1
					},
					expand:{
						left: 0
					},
					expandP:{
						left: 0,
						top: copts.top,
						width: csize,
						height: copts.height
					},
					collapse:{
						left: -pwidth,
						top: copts.top,
						height: copts.height
					}
				};
			} else if (region == 'north'){
				var pheight = p.panel('panel')._outerHeight();
				var hh = copts.height;
				if (!isVisible(panels.expandNorth)){
					hh += pheight - csize + ((popts.split || !popts.border)?1:0);
				}
				panels.east.add(panels.west).add(panels.expandEast).add(panels.expandWest).panel('resize', {
					top: csize - 1,
					height: hh
				});
				
				return {
					resizeC:{
						top: csize - 1,
						height: hh
					},
					expand:{
						top:0
					},
					expandP:{
						top: 0,
						left: 0,
						width: cc.width(),
						height: csize
					},
					collapse:{
						top: -pheight,
						width: cc.width()
					}
				};
			} else if (region == 'south'){
				var pheight = p.panel('panel')._outerHeight();
				var hh = copts.height;
				if (!isVisible(panels.expandSouth)){
					hh += pheight - csize + ((popts.split || !popts.border)?1:0);
				}
				panels.east.add(panels.west).add(panels.expandEast).add(panels.expandWest).panel('resize', {
					height: hh
				});
				
				return {
					resizeC:{
						height: hh
					},
					expand:{
						top: cc.height()-pheight
					},
					expandP:{
						top: cc.height() - csize,
						left: 0,
						width: cc.width(),
						height: csize
					},
					collapse:{
						top: cc.height(),
						width: cc.width()
					}
				};
			}
		}
	}
	
	function expandPanel(container, region){
		var panels = $.data(container, 'layout').panels;
		
		var p = panels[region];
		var popts = p.panel('options');
		if (popts.onBeforeExpand.call(p) == false){return;}
		
		var expandP = 'expand' + region.substring(0,1).toUpperCase() + region.substring(1);
		if (panels[expandP]){
			panels[expandP].panel('close');
			p.panel('panel').stop(true,true);
			p.panel('expand',false).panel('open');
			var eopts = getOption();
			p.panel('resize', eopts.collapse);
			p.panel('panel').animate(eopts.expand, function(){
				setSize(container);
			});
		}
		
		/**
		 * get expand option: {
		 *   collapse:{},
		 *   expand:{}
		 * }
		 */
		function getOption(){
			var cc = $(container);
			var copts = panels.center.panel('options');
			
			if (region == 'east' && panels.expandEast){
				return {
					collapse:{
						left: cc.width(),
						top: copts.top,
						height: copts.height
					},
					expand:{
						left: cc.width() - p.panel('panel')._outerWidth()
					}
				};
			} else if (region == 'west' && panels.expandWest){
				return {
					collapse:{
						left: -p.panel('panel')._outerWidth(),
						top: copts.top,
						height: copts.height
					},
					expand:{
						left: 0
					}
				};
			} else if (region == 'north' && panels.expandNorth){
				return {
					collapse:{
						top: -p.panel('panel')._outerHeight(),
						width: cc.width()
					},
					expand:{
						top: 0
					}
				};
			} else if (region == 'south' && panels.expandSouth){
				return {
					collapse:{
						top: cc.height(),
						width: cc.width()
					},
					expand:{
						top: cc.height()-p.panel('panel')._outerHeight()
					}
				};
			}
		}
	}
	
//	function bindEvents(container){
//		var panels = $.data(container, 'layout').panels;
//		var cc = $(container);
//		
//		// bind east panel events
//		if (panels.east.length){
//			panels.east.panel('panel').bind('mouseover','east',_collapse);
//		}
//		
//		// bind west panel events
//		if (panels.west.length){
//			panels.west.panel('panel').bind('mouseover','west',_collapse);
//		}
//		
//		// bind north panel events
//		if (panels.north.length){
//			panels.north.panel('panel').bind('mouseover','north',_collapse);
//		}
//		
//		// bind south panel events
//		if (panels.south.length){
//			panels.south.panel('panel').bind('mouseover','south',_collapse);
//		}
//		
//		panels.center.panel('panel').bind('mouseover','center',_collapse);
//		
//		function _collapse(e){
//			if (resizing == true) return;
//			
//			if (e.data != 'east' && isVisible(panels.east) && isVisible(panels.expandEast)){
//				collapsePanel(container, 'east');
//			}
//			if (e.data != 'west' && isVisible(panels.west) && isVisible(panels.expandWest)){
//				collapsePanel(container, 'west');
//			}
//			if (e.data != 'north' && isVisible(panels.north) && isVisible(panels.expandNorth)){
//				collapsePanel(container, 'north');
//			}
//			if (e.data != 'south' && isVisible(panels.south) && isVisible(panels.expandSouth)){
//				collapsePanel(container, 'south');
//			}
//			return false;
//		}
//	}
	
	function isVisible(pp){
		if (!pp) return false;
		if (pp.length){
			return pp.panel('panel').is(':visible');
		} else {
			return false;
		}
	}
	
	function initCollapse(container){
		var panels = $.data(container, 'layout').panels;
		_collapse('east');
		_collapse('west');
		_collapse('north');
		_collapse('south');
		
		function _collapse(region){
			var p = panels[region];
			if (p.length && p.panel('options').collapsed){
				collapsePanel(container, region, 0);
			}
		}
	}
	
	function setSplit(container, region, isSplit){
		var p = $(container).layout('panel', region);
		p.panel('options').split = isSplit;
		var cls = 'layout-split-' + region;
		var panel = p.panel('panel').removeClass(cls);
		if (isSplit){panel.addClass(cls);}
		panel.resizable({disabled:(!isSplit)});
		setSize(container);
	}
	
	$.fn.layout = function(options, param){
		if (typeof options == 'string'){
			return $.fn.layout.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'layout');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.layout.defaults, $.fn.layout.parseOptions(this), options);
				$.data(this, 'layout', {
					options: opts,
					panels: {center:$(), north:$(), south:$(), east:$(), west:$()}
				});
				init(this);
//				bindEvents(this);
			}
			setSize(this);
			initCollapse(this);
		});
	};
	
	$.fn.layout.methods = {
		options: function(jq){
			return $.data(jq[0], 'layout').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		panel: function(jq, region){
			return $.data(jq[0], 'layout').panels[region];
		},
		collapse: function(jq, region){
			return jq.each(function(){
				collapsePanel(this, region);
			});
		},
		expand: function(jq, region){
			return jq.each(function(){
				expandPanel(this, region);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addPanel(this, options);
				setSize(this);
				if ($(this).layout('panel', options.region).panel('options').collapsed){
					collapsePanel(this, options.region, 0);
				}
			});
		},
		remove: function(jq, region){
			return jq.each(function(){
				removePanel(this, region);
				setSize(this);
			});
		},
		split: function(jq, region){
			return jq.each(function(){
				setSplit(this, region, true);
			});
		},
		unsplit: function(jq, region){
			return jq.each(function(){
				setSplit(this, region, false);
			});
		}
	};
	
	$.fn.layout.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target,[{fit:'boolean'}]));
	};
	
	$.fn.layout.defaults = {
		fit: false
	};
	
	$.fn.layout.parsePanelOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.panel.parseOptions(target), 
				$.parser.parseOptions(target, [
					'region',{split:'boolean',collpasedSize:'number',minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number'}
				]));
	};
	
	$.fn.layout.paneldefaults = $.extend({}, $.fn.panel.defaults, {
		region:null,	// possible values are: 'north','south','east','west','center'
		split:false,
		collapsedSize:28,
		minWidth:10,
		minHeight:10,
		maxWidth:10000,
		maxHeight:10000
	});
})(jQuery);
/**
 * menu - jQuery EasyUI
 * 
 */
(function($){
	$(function(){
		$(document).unbind('.menu').bind('mousedown.menu', function(e){
			var m = $(e.target).closest('div.menu,div.combo-p');
			if (m.length){return}
			$('body>div.menu-top:visible').not('.menu-inline').menu('hide');
			hideMenu($('body>div.menu:visible').not('.menu-inline'));
		});
	});
	
	/**
	 * initialize the target menu, the function can be invoked only once
	 */
	function init(target){
		var opts = $.data(target, 'menu').options;
		$(target).addClass('menu-top');	// the top menu
		opts.inline ? $(target).addClass('menu-inline') : $(target).appendTo('body');
		$(target).bind('_resize', function(e, force){
			if ($(this).hasClass('easyui-fluid') || force){
				$(target).menu('resize', target);
			}
			return false;
		});
		
		var menus = splitMenu($(target));
		for(var i=0; i<menus.length; i++){
			createMenu(menus[i]);
		}
		
		function splitMenu(menu){
			var menus = [];
			menu.addClass('menu');
			menus.push(menu);
			if (!menu.hasClass('menu-content')){
				menu.children('div').each(function(){
					var submenu = $(this).children('div');
					if (submenu.length){
//						submenu.insertAfter(target);
						submenu.appendTo('body');
						this.submenu = submenu;		// point to the sub menu
						var mm = splitMenu(submenu);
						menus = menus.concat(mm);
					}
				});
			}
			return menus;
		}
		
		function createMenu(menu){
			var wh = $.parser.parseOptions(menu[0], ['width','height']);
			menu[0].originalHeight = wh.height || 0;
			if (menu.hasClass('menu-content')){
				menu[0].originalWidth = wh.width || menu._outerWidth();
			} else {
				menu[0].originalWidth = wh.width || 0;
				menu.children('div').each(function(){
					var item = $(this);
					var itemOpts = $.extend({}, $.parser.parseOptions(this,['name','iconCls','href',{separator:'boolean'}]), {
						disabled: (item.attr('disabled') ? true : undefined)
					});
					if (itemOpts.separator){
						item.addClass('menu-sep');
					}
					if (!item.hasClass('menu-sep')){
						item[0].itemName = itemOpts.name || '';
						item[0].itemHref = itemOpts.href || '';
						
						var text = item.addClass('menu-item').html();
						item.empty().append($('<div class="menu-text"></div>').html(text));
						if (itemOpts.iconCls){
							$('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
						}
						if (itemOpts.disabled){
							setDisabled(target, item[0], true);
						}
						if (item[0].submenu){
							$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
						}
						
						bindMenuItemEvent(target, item);
					}
				});
				$('<div class="menu-line"></div>').prependTo(menu);
			}
			setMenuSize(target, menu);
			if (!menu.hasClass('menu-inline')){
				menu.hide();
			}
			
			bindMenuEvent(target, menu);
		}
	}
	
	function setMenuSize(target, menu){
		var opts = $.data(target, 'menu').options;
		var style = menu.attr('style') || '';
		menu.css({
			display: 'block',
			left:-10000,
			height: 'auto',
			overflow: 'hidden'
		});
		menu.find('.menu-item').each(function(){
			$(this)._outerHeight(opts.itemHeight);
			$(this).find('.menu-text').css({
				height: (opts.itemHeight-2)+'px',
				lineHeight: (opts.itemHeight-2)+'px'
			});
		});
		menu.removeClass('menu-noline').addClass(opts.noline?'menu-noline':'');
		
		var width = menu[0].originalWidth || 'auto';
		if (isNaN(parseInt(width))){
			width = 0;
			menu.find('div.menu-text').each(function(){
				if (width < $(this)._outerWidth()){
					width = $(this)._outerWidth();
				}
			});
			width += 40;
		}
		
		var autoHeight = menu.outerHeight();
		var height = menu[0].originalHeight || 'auto';
		if (isNaN(parseInt(height))){
			height = autoHeight;
			
			if (menu.hasClass('menu-top') && opts.alignTo){
				var at = $(opts.alignTo);
				var h1 = at.offset().top - $(document).scrollTop();
				var h2 = $(window)._outerHeight() + $(document).scrollTop() - at.offset().top - at._outerHeight();
				height = Math.min(height, Math.max(h1, h2));
			} else if (height > $(window)._outerHeight()){
				height = $(window).height();
			}
		}
		
		menu.attr('style', style);	// restore the original style
		menu._size({
			fit: (menu[0]==target?opts.fit:false),
			width: width,
			minWidth: opts.minWidth,
			height: height
		});
		menu.css('overflow', menu.outerHeight() < autoHeight ? 'auto' : 'hidden');
		menu.children('div.menu-line')._outerHeight(autoHeight-2);
	}
	
	/**
	 * bind menu event
	 */
	function bindMenuEvent(target, menu){
		if (menu.hasClass('menu-inline')){return}
		var state = $.data(target, 'menu');
		menu.unbind('.menu').bind('mouseenter.menu', function(){
			if (state.timer){
				clearTimeout(state.timer);
				state.timer = null;
			}
		}).bind('mouseleave.menu', function(){
			if (state.options.hideOnUnhover){
				state.timer = setTimeout(function(){
					hideAll(target, $(target).hasClass('menu-inline'));
				}, state.options.duration);
			}
		});
	}
	
	/**
	 * bind menu item event
	 */
	function bindMenuItemEvent(target, item){
		if (!item.hasClass('menu-item')){return}
		item.unbind('.menu');
		item.bind('click.menu', function(){
			if ($(this).hasClass('menu-item-disabled')){
				return;
			}
			// only the sub menu clicked can hide all menus
			if (!this.submenu){
				hideAll(target, $(target).hasClass('menu-inline'));
				var href = this.itemHref;
				if (href){
					location.href = href;
				}
			}
			$(this).trigger('mouseenter');
			var item = $(target).menu('getItem', this);
			$.data(target, 'menu').options.onClick.call(target, item);
		}).bind('mouseenter.menu', function(e){
			// hide other menu
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			
			if ($(this).hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			
			var submenu = item[0].submenu;
			if (submenu){
				$(target).menu('show', {
					menu: submenu,
					parent: item
				});
			}
		}).bind('mouseleave.menu', function(e){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
				
			} else {
				item.removeClass('menu-active');
			}
		});
	}
	
	/**
	 * hide top menu and it's all sub menus
	 */
	function hideAll(target, inline){
		var state = $.data(target, 'menu');
		if (state){
			if ($(target).is(':visible')){
				hideMenu($(target));
				if (inline){
					$(target).show();
				} else {
					state.options.onHide.call(target);
				}
			}
		}
		return false;
	}
	
	/**
	 * show the menu, the 'param' object has one or more properties:
	 * left: the left position to display
	 * top: the top position to display
	 * menu: the menu to display, if not defined, the 'target menu' is used
	 * parent: the parent menu item to align to
	 * alignTo: the element object to align to
	 */
	function showMenu(target, param){
		var left,top;
		param = param || {};
		var menu = $(param.menu || target);
		$(target).menu('resize', menu[0]);
		if (menu.hasClass('menu-top')){
			var opts = $.data(target, 'menu').options;
			$.extend(opts, param);
			left = opts.left;
			top = opts.top;
			if (opts.alignTo){
				var at = $(opts.alignTo);
				left = at.offset().left;
				top = at.offset().top + at._outerHeight();
				if (opts.align == 'right'){
					left += at.outerWidth() - menu.outerWidth();
				}
			}
			if (left + menu.outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - menu.outerWidth() - 5;
			}
			if (left < 0){left = 0;}
			top = _fixTop(top, opts.alignTo);
		} else {
			var parent = param.parent;	// the parent menu item
			left = parent.offset().left + parent.outerWidth() - 2;
			if (left + menu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()){
				left = parent.offset().left - menu.outerWidth() + 2;
			}
			top = _fixTop(parent.offset().top - 3);
		}
		
		function _fixTop(top, alignTo){
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				if (alignTo){
					top = $(alignTo).offset().top - menu._outerHeight();
				} else {
					top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight();
				}
			}
			if (top < 0){top = 0;}
			return top;
		}
		
		menu.css({left:left,top:top});
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:(menu.hasClass('menu-inline')?'none':'block'),
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			if (menu.hasClass('menu-top')){
				$.data(menu[0], 'menu').options.onShow.call(menu[0]);
			}
		});
	}
	
	function hideMenu(menu){
		if (menu && menu.length){
			hideit(menu);
			menu.find('div.menu-item').each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
		}
		
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		if (!t.hasClass('menu-item')){return}
		
		if (disabled){
			t.addClass('menu-item-disabled');
			if (itemEl.onclick){
				itemEl.onclick1 = itemEl.onclick;
				itemEl.onclick = null;
			}
		} else {
			t.removeClass('menu-item-disabled');
			if (itemEl.onclick1){
				itemEl.onclick = itemEl.onclick1;
				itemEl.onclick1 = null;
			}
		}
	}
	
	function appendItem(target, param){
		var opts = $.data(target, 'menu').options;
		var menu = $(target);
		if (param.parent){
			if (!param.parent.submenu){
				var submenu = $('<div class="menu"><div class="menu-line"></div></div>').appendTo('body');
				submenu.hide();
				param.parent.submenu = submenu;
				$('<div class="menu-rightarrow"></div>').appendTo(param.parent);
			}
			menu = param.parent.submenu;
		}
		if (param.separator){
			var item = $('<div class="menu-sep"></div>').appendTo(menu);
		} else {
			var item = $('<div class="menu-item"></div>').appendTo(menu);
			$('<div class="menu-text"></div>').html(param.text).appendTo(item);
		}
		if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
		if (param.id) item.attr('id', param.id);
		if (param.name){item[0].itemName = param.name}
		if (param.href){item[0].itemHref = param.href}
		if (param.onclick){
			if (typeof param.onclick == 'string'){
				item.attr('onclick', param.onclick);
			} else {
				item[0].onclick = eval(param.onclick);
			}
		}
		if (param.handler){item[0].onclick = eval(param.handler)}
		if (param.disabled){setDisabled(target, item[0], true)}
		
		bindMenuItemEvent(target, item);
		bindMenuEvent(target, menu);
		setMenuSize(target, menu);
	}
	
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		var menu = $(itemEl).parent();
		removeit(itemEl);
		setMenuSize(target, menu);
	}
	
	function setVisible(target, itemEl, visible){
		var menu = $(itemEl).parent();
		if (visible){
			$(itemEl).show();
		} else {
			$(itemEl).hide();
		}
		setMenuSize(target, menu);
	}
	
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	
	$.fn.menu.methods = {
		options: function(jq){
			return $.data(jq[0], 'menu').options;
		},
		show: function(jq, pos){
			return jq.each(function(){
				showMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		/**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
		setText: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		/**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
		setIcon: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-icon').remove();
				if (param.iconCls){
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		/**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
		getItem: function(jq, itemEl){
			var t = $(itemEl);
			var item = {
				target: itemEl,
				id: t.attr('id'),
				text: $.trim(t.children('div.menu-text').html()),
				disabled: t.hasClass('menu-item-disabled'),
//				href: t.attr('href'),
//				name: t.attr('name'),
				name: itemEl.itemName,
				href: itemEl.itemHref,
				onclick: itemEl.onclick
			}
			var icon = t.children('div.menu-icon');
			if (icon.length){
				var cc = [];
				var aa = icon.attr('class').split(' ');
				for(var i=0; i<aa.length; i++){
					if (aa[i] != 'menu-icon'){
						cc.push(aa[i]);
					}
				}
				item.iconCls = cc.join(' ');
			}
			return item;
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		/**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		},
		showItem: function(jq, itemEl){
			return jq.each(function(){
				setVisible(this, itemEl, true);
			});
		},
		hideItem: function(jq, itemEl){
			return jq.each(function(){
				setVisible(this, itemEl, false);
			});
		},
		resize: function(jq, menuEl){
			return jq.each(function(){
				setMenuSize(this, $(menuEl));
			});
		}
	};
	
	$.fn.menu.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
		     {minWidth:'number',itemHeight:'number',duration:'number',hideOnUnhover:'boolean'},
		     {fit:'boolean',inline:'boolean',noline:'boolean'}
		]));
	};
	
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		alignTo: null,
		align: 'left',
		minWidth: 120,
		itemHeight: 22,
		duration: 100,	// Defines duration time in milliseconds to hide when the mouse leaves the menu.
		hideOnUnhover: true,	// Automatically hides the menu when mouse exits it
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		fit: false,
		noline: false,
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);
/**
 * menubutton - jQuery EasyUI
 * 
 * Dependencies:
 *   linkbutton
 *   menu
 */
(function($){
	
	function init(target){
		var opts = $.data(target, 'menubutton').options;
		var btn = $(target);
		btn.linkbutton(opts);
		if (opts.hasDownArrow){
			btn.removeClass(opts.cls.btn1+' '+opts.cls.btn2).addClass('m-btn');
			btn.removeClass('m-btn-small m-btn-medium m-btn-large').addClass('m-btn-'+opts.size);
			var inner = btn.find('.l-btn-left');
			$('<span></span>').addClass(opts.cls.arrow).appendTo(inner);
			$('<span></span>').addClass('m-btn-line').appendTo(inner);
		}
		$(target).menubutton('resize');
		
		if (opts.menu){
			$(opts.menu).menu({duration:opts.duration});
			var mopts = $(opts.menu).menu('options');
			var onShow = mopts.onShow;
			var onHide = mopts.onHide;
			$.extend(mopts, {
				onShow: function(){
					var mopts = $(this).menu('options');
					var btn = $(mopts.alignTo);
					var opts = btn.menubutton('options');
					btn.addClass((opts.plain==true) ? opts.cls.btn2 : opts.cls.btn1);
					onShow.call(this);
				},
				onHide: function(){
					var mopts = $(this).menu('options');
					var btn = $(mopts.alignTo);
					var opts = btn.menubutton('options');
					btn.removeClass((opts.plain==true) ? opts.cls.btn2 : opts.cls.btn1);
					onHide.call(this);
				}
			});
		}
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'menubutton').options;
		var btn = $(target);
		var t = btn.find('.'+opts.cls.trigger);
		if (!t.length){t = btn}
		t.unbind('.menubutton');
		var timeout = null;
		t.bind('click.menubutton', function(){
			if (!isDisabled()){
				showMenu(target);
				return false;
			}
		}).bind('mouseenter.menubutton', function(){
			if (!isDisabled()){
				timeout = setTimeout(function(){
					showMenu(target);
				}, opts.duration);
				return false;
			}
		}).bind('mouseleave.menubutton', function(){
			if (timeout){
				clearTimeout(timeout);
			}
			$(opts.menu).triggerHandler('mouseleave');
		});
		
		function isDisabled(){
			return $(target).linkbutton('options').disabled;
		}
	}
	
	function showMenu(target){
//		var opts = $.data(target, 'menubutton').options;
		var opts = $(target).menubutton('options');
		if (opts.disabled || !opts.menu){return}
		$('body>div.menu-top').menu('hide');
		var btn = $(target);
		var mm = $(opts.menu);
		if (mm.length){
			mm.menu('options').alignTo = btn;
			mm.menu('show', {alignTo:btn,align:opts.menuAlign});
		}
		btn.blur();
	}
	
	$.fn.menubutton = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.menubutton.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.linkbutton(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menubutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'menubutton', {
					options: $.extend({}, $.fn.menubutton.defaults, $.fn.menubutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			init(this);
			bindEvents(this);
		});
	};
	
	$.fn.menubutton.methods = {
		options: function(jq){
			var bopts = jq.linkbutton('options');
			return $.extend($.data(jq[0], 'menubutton').options, {
				toggle: bopts.toggle,
				selected: bopts.selected,
				disabled: bopts.disabled
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var opts = $(this).menubutton('options');
				if (opts.menu){
					$(opts.menu).menu('destroy');
				}
				$(this).remove();
			});
		}
	};
	
	$.fn.menubutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.linkbutton.parseOptions(target), $.parser.parseOptions(target, [
		    'menu',{plain:'boolean',hasDownArrow:'boolean',duration:'number'}
		]));
	};
	
	$.fn.menubutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain: true,
		hasDownArrow: true,
		menu: null,
		menuAlign: 'left',	// the top level menu alignment
		duration: 100,
		cls: {
			btn1: 'm-btn-active',
			btn2: 'm-btn-plain-active',
			arrow: 'm-btn-downarrow',
			trigger: 'm-btn'
		}
	});
})(jQuery);
/**
 * splitbutton - jQuery EasyUI
 * 
 * Dependencies:
 *   menubutton
 */
(function($){
	
	function init(target){
		var opts = $.data(target, 'splitbutton').options;
		$(target).menubutton(opts);
		$(target).addClass('s-btn');
	}
	
	$.fn.splitbutton = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.splitbutton.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.menubutton(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'splitbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'splitbutton', {
					options: $.extend({}, $.fn.splitbutton.defaults, $.fn.splitbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			init(this);
		});
	};
	
	$.fn.splitbutton.methods = {
		options: function(jq){
			var mopts = jq.menubutton('options');
			var sopts = $.data(jq[0], 'splitbutton').options;
			$.extend(sopts, {
				disabled: mopts.disabled,
				toggle: mopts.toggle,
				selected: mopts.selected
			});
			return sopts;
		}
	};
	
	$.fn.splitbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.linkbutton.parseOptions(target), 
				$.parser.parseOptions(target, ['menu',{plain:'boolean',duration:'number'}]));
	};
	
	$.fn.splitbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain: true,
		menu: null,
		duration: 100,
		cls: {
			btn1: 'm-btn-active s-btn-active',
			btn2: 'm-btn-plain-active s-btn-plain-active',
			arrow: 'm-btn-downarrow',
			trigger: 'm-btn-line'
		}
	});
})(jQuery);
/**
 * validatebox - jQuery EasyUI
 * 
 * Dependencies:
 * 	 tooltip
 * 
 */
(function($){
	
	function init(target){
		$(target).addClass('validatebox-text');
	}
	
	/**
	 * destroy the box, including it's tip object.
	 */
	function destroyBox(target){
		var state = $.data(target, 'validatebox');
		state.validating = false;
		if (state.timer){
			clearTimeout(state.timer);
		}
		$(target).tooltip('destroy');
		$(target).unbind();
		$(target).remove();
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'validatebox').options;
		var box = $(target);
		box.unbind('.validatebox');
		if (opts.novalidate || box.is(':disabled')){return;}
		for(var event in opts.events){
			$(target).bind(event+'.validatebox', {target:target}, opts.events[event]);
		}
	}
	
	function focusEventHandler(e){
		var target = e.data.target;
		var state = $.data(target, 'validatebox');
		var box = $(target);
		if ($(target).attr('readonly')){
            $(target).keydown(function(e) {
                e.preventDefault();
            });
            return;
        }
		state.validating = true;
		state.value = undefined;
		(function(){
			if (state.validating){
				if (state.value != box.val()){	// when box value changed, validate it
					state.value = box.val();
					if (state.timer){
						clearTimeout(state.timer);
					}
					state.timer = setTimeout(function(){
						$(target).validatebox('validate');
					}, state.options.delay);
				} else {
					fixTipPosition(target);	// correct the tip position
				}
				setTimeout(arguments.callee, 200);
			}
		})();
	}
	function blurEventHandler(e){
		var target = e.data.target;
		var state = $.data(target, 'validatebox');
		if (state.timer){
			clearTimeout(state.timer);
			state.timer = undefined;
		}
		state.validating = false;
		hideTip(target);
	}
	function mouseenterEventHandler(e){
		var target = e.data.target;
		if ($(target).hasClass('validatebox-invalid')){
			showTip(target);
		}
	}
	function mouseleaveEventHandler(e){
		var target = e.data.target;
		var state = $.data(target, 'validatebox');
		if (!state.validating){
			hideTip(target);
		}
	}
	
	/**
	 * show tip message.
	 */
	function showTip(target){
		var state = $.data(target, 'validatebox');
		var opts = state.options;
		$(target).tooltip($.extend({}, opts.tipOptions, {
			content: state.message,
			position: opts.tipPosition,
			deltaX: opts.deltaX
		})).tooltip('show');
		state.tip = true;
	}
	
	function fixTipPosition(target){
		var state = $.data(target, 'validatebox');
		if (state && state.tip){
			$(target).tooltip('reposition');
		}
	}
	
	/**
	 * hide tip message.
	 */
	function hideTip(target){
		var state = $.data(target, 'validatebox');
		state.tip = false;
		$(target).tooltip('hide');
	}
	
	/**
	 * do validate action
	 */
	function validate(target){
		var state = $.data(target, 'validatebox');
		var opts = state.options;
		var box = $(target);
		
		opts.onBeforeValidate.call(target);
		var result = _validate();
		opts.onValidate.call(target, result);
		return result;
		
		function setTipMessage(msg){
			state.message = msg;
		}
		function doValidate(vtype, vparam){
			var value = box.val();
			var result = /([a-zA-Z_]+)(.*)/.exec(vtype);
			var rule = opts.rules[result[1]];
			if (rule && value){
				var param = vparam || opts.validParams || eval(result[2]);
				if (!rule['validator'].call(target, value, param)){
					box.addClass('validatebox-invalid');
					
					var message = rule['message'];
					if (param){
						for(var i=0; i<param.length; i++){
							message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
						}
					}
					setTipMessage(opts.invalidMessage || message);
					if (state.validating){
						showTip(target);
					}
					return false;
				}
			}
			return true;
		}
		function _validate(){
			box.removeClass('validatebox-invalid');
			hideTip(target);
			if (opts.novalidate || box.is(':disabled')){return true}	// do not need to do validation
			if (opts.required){
				if (box.val() == ''){
					box.addClass('validatebox-invalid');
					setTipMessage(opts.missingMessage);
					if (state.validating){
						showTip(target);
					}
					return false;
				}
			}
			if (opts.validType){
				if ($.isArray(opts.validType)){
					for(var i=0; i<opts.validType.length; i++){
						if (!doValidate(opts.validType[i])){return false;}
					}
				} else if (typeof opts.validType == 'string'){
					if (!doValidate(opts.validType)){return false;};
				} else {
					for(var vtype in opts.validType){
						var vparam = opts.validType[vtype];
						if (!doValidate(vtype, vparam)){return false;}
					}
				}
			}
			
			return true;
		}
		
	}
	
	function setValidation(target, novalidate){
		var opts = $.data(target, 'validatebox').options;
		if (novalidate != undefined){opts.novalidate = novalidate}
		if (opts.novalidate){
			$(target).removeClass('validatebox-invalid');
			hideTip(target);
		}
		validate(target);
		bindEvents(target);
	}
	
	$.fn.validatebox = function(options, param){
		if (typeof options == 'string'){
			return $.fn.validatebox.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'validatebox');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'validatebox', {
					options: $.extend({}, $.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), options)
				});
			}
			
			setValidation(this);
//			bindEvents(this);
			validate(this);
		});
	};
	
	$.fn.validatebox.methods = {
		options: function(jq){
			return $.data(jq[0], 'validatebox').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyBox(this);
			});
		},
		validate: function(jq){
			return jq.each(function(){
				validate(this);
			});
		},
		isValid: function(jq){
			return validate(jq[0]);
		},
		enableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, false);
			});
		},
		disableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, true);
			});
		}
	};
	
	$.fn.validatebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
		    'validType','missingMessage','invalidMessage','tipPosition',{delay:'number',deltaX:'number'}
		]), {
			required: (t.attr('required') ? true : undefined),
			novalidate: (t.attr('novalidate') != undefined ? true : undefined)
		});
	};
	
	$.fn.validatebox.defaults = {
		required: false,
		validType: null,
		validParams: null,	// []
		delay: 200,	// delay to validate from the last inputting value.
		missingMessage: 'This field is required.',
		invalidMessage: null,
		tipPosition: 'right',	// Possible values: 'left','right'.
		deltaX: 0,
		novalidate: false,
		
		events: {
			focus: focusEventHandler,
			blur: blurEventHandler,
			mouseenter: mouseenterEventHandler,
			mouseleave: mouseleaveEventHandler,
			click: function(e){
				var t = $(e.data.target);
				if (!t.is(':focus')){
					t.trigger('focus');
				}
			}
		},
		
		tipOptions: {	// the options to create tooltip
			showEvent: 'none',
			hideEvent: 'none',
			showDelay: 0,
			hideDelay: 0,
			zIndex: '',
			onShow: function(){
				$(this).tooltip('tip').css({
					color: '#000',
					borderColor: '#CC9933',
					backgroundColor: '#FFFFCC'
				});
			},
			onHide: function(){
				$(this).tooltip('destroy');
			}
		},
		
		rules: {
			email:{
				validator: function(value){
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
				},
				message: 'Please enter a valid email address.'
			},
			url: {
				validator: function(value){
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
				},
				message: 'Please enter a valid URL.'
			},
			length: {
				validator: function(value, param){
					var len = $.trim(value).length;
					return len >= param[0] && len <= param[1]
				},
				message: 'Please enter a value between {0} and {1}.'
			},
			remote: {
				validator: function(value, param){
					var data = {};
					data[param[1]] = value;
					var response = $.ajax({
						url:param[0],
						dataType:'json',
						data:data,
						async:false,
						cache:false,
						type:'post'
					}).responseText;
					return response == 'true';
				},
				message: 'Please fix this field.'
			}
		},
		
		onBeforeValidate: function(){},
		onValidate: function(valid){}	// fires when validation completes
	};
})(jQuery);
/**
 * textbox - jQuery EasyUI
 * 
 * Dependencies:
 * 	 validatebox
 *   linkbutton
 * 
 */
(function($){
	function init(target){
		$(target).addClass('textbox-f').hide();
		var span = $(
				'<span class="textbox">' +
				'<input class="textbox-text" autocomplete="off">' +
				'<input type="hidden" class="textbox-value">' +
				'</span>'
				).insertAfter(target);
		
		var name = $(target).attr('name');
		if (name){
			span.find('input.textbox-value').attr('name', name);
			$(target).removeAttr('name').attr('textboxName', name);
		}
		
		return span;
	}
	
	/**
	 * build textbox component
	 */
	function buildTextBox(target){
		var state = $.data(target, 'textbox');
		var opts = state.options;
		var tb = state.textbox;
		
		tb.find('.textbox-text').remove();
		if (opts.multiline){
			$('<textarea class="textbox-text" autocomplete="off"></textarea>').prependTo(tb);
		} else {
			$('<input type="'+opts.type+'" class="textbox-text" autocomplete="off">').prependTo(tb);
		}
		
		tb.find('.textbox-addon').remove();
		var bb = opts.icons ? $.extend(true, [], opts.icons) : [];
		if (opts.iconCls){
			bb.push({
				iconCls: opts.iconCls,
				disabled: true
			});
		}
		if (bb.length){
			var bc = $('<span class="textbox-addon"></span>').prependTo(tb);
			bc.addClass('textbox-addon-'+opts.iconAlign);
			for(var i=0; i<bb.length; i++){
				bc.append('<a href="javascript:void(0)" class="textbox-icon '+bb[i].iconCls+'" icon-index="'+i+'" tabindex="-1"></a>');
			}
		}
		
		tb.find('.textbox-button').remove();
		if (opts.buttonText || opts.buttonIcon){
			var btn = $('<a href="javascript:void(0)" class="textbox-button"></a>').prependTo(tb);
			btn.addClass('textbox-button-'+opts.buttonAlign).linkbutton({
				text: opts.buttonText,
				iconCls: opts.buttonIcon
			});
		}
		
		setDisabled(target, opts.disabled);
		setReadonly(target, opts.readonly);
	}
	
	function destroy(target){
		var tb = $.data(target, 'textbox').textbox;
		tb.find('.textbox-text').validatebox('destroy');
		tb.remove();
		$(target).remove();
	}
	
	function setSize(target, width){
		var state = $.data(target, 'textbox');
		var opts = state.options;
		var tb = state.textbox;
		var parent = tb.parent();	// the parent container
		if (width){opts.width = width;}
		if (isNaN(parseInt(opts.width))){
			var c = $(target).clone();
			c.css('visibility','hidden');
			c.insertAfter(target);
			opts.width = c.outerWidth();
			c.remove();
		}
		
		var isVisible = tb.is(':visible');
		if (!isVisible){
			tb.appendTo('body');			
		}
		
		var input = tb.find('.textbox-text');
		var btn = tb.find('.textbox-button');
		var addon = tb.find('.textbox-addon');
		var icons = addon.find('.textbox-icon');
		
		tb._size(opts, parent);
		
		btn.linkbutton('resize', {height: tb.height()});
		btn.css({
			left: (opts.buttonAlign=='left'?0:''),
			right: (opts.buttonAlign=='right'?0:'')
		});
		addon.css({
			left: (opts.iconAlign=='left' ? (opts.buttonAlign=='left'?btn._outerWidth():0) : ''),
			right: (opts.iconAlign=='right' ? (opts.buttonAlign=='right'?btn._outerWidth():0) : '')
		});
		icons.css({
			width: opts.iconWidth+'px',
			height: tb.height()+'px'
		});
		input.css({
			paddingLeft: (target.style.paddingLeft || ''),
			paddingRight: (target.style.paddingRight || ''),
			marginLeft: getInputMargin('left'),
			marginRight: getInputMargin('right')
		});
		if (opts.multiline){
			input.css({
				paddingTop: (target.style.paddingTop || ''),
				paddingBottom: (target.style.paddingBottom || '')
			});
			input._outerHeight(tb.height());
		} else {
			var padding = Math.floor((tb.height() - input.height())/2);
			input.css({
				paddingTop: padding+'px',
				paddingBottom: padding+'px'
			});
		}
		input._outerWidth(tb.width() - icons.length * opts.iconWidth - btn._outerWidth());
		
		if (!isVisible){
			tb.insertAfter(target);
		}
		
		opts.onResize.call(target, opts.width, opts.height);
		
		function getInputMargin(align){
			return (opts.iconAlign==align ? addon._outerWidth() : 0) + (opts.buttonAlign==align ? btn._outerWidth() : 0);
		}
	}
	
	/**
	 * create validation on the textbox
	 */
	function validate(target){
		var opts = $(target).textbox('options');
		var input = $(target).textbox('textbox');
		input.validatebox($.extend({}, opts, {
			deltaX: $(target).textbox('getTipX'),
			onBeforeValidate: function(){
				var box = $(this);
				if (!box.is(':focus')){
					opts.oldInputValue = box.val();
					box.val(opts.value);
				}
			},
			onValidate: function(valid){
				var box = $(this);
				if (opts.oldInputValue != undefined){
					box.val(opts.oldInputValue);
					opts.oldInputValue = undefined;
				}
				var tb = box.parent();
				if (valid){
					tb.removeClass('textbox-invalid');
				} else {
					tb.addClass('textbox-invalid');
				}
			}
		}));
	}
	
	function bindEvents(target){
		var state = $.data(target, 'textbox');
		var opts = state.options;
		var tb = state.textbox;
		var input = tb.find('.textbox-text');
		input.attr('placeholder', opts.prompt);
		input.unbind('.textbox');
		if (!opts.disabled && !opts.readonly){
			input.bind('blur.textbox', function(e){
				if (!tb.hasClass('textbox-focused')){return;}
				opts.value = $(this).val();
				if (opts.value == ''){
					$(this).val(opts.prompt).addClass('textbox-prompt');
				} else {
					$(this).removeClass('textbox-prompt');
				}
				tb.removeClass('textbox-focused');
			}).bind('focus.textbox', function(e){
				if (tb.hasClass('textbox-focused')){return;}
				if ($(this).val() != opts.value){
					$(this).val(opts.value);
				}
				$(this).removeClass('textbox-prompt');
				tb.addClass('textbox-focused');
			});
			for(var event in opts.inputEvents){
				input.bind(event+'.textbox', {target:target}, opts.inputEvents[event]);
			}
		}
		
		var addon = tb.find('.textbox-addon');
		addon.unbind().bind('click', {target:target}, function(e){
			var icon = $(e.target).closest('a.textbox-icon:not(.textbox-icon-disabled)');
			if (icon.length){
				var iconIndex = parseInt(icon.attr('icon-index'));
				var conf = opts.icons[iconIndex];
				if (conf && conf.handler){
					conf.handler.call(icon[0], e);
					opts.onClickIcon.call(target, iconIndex);
				}
			}
		});
		addon.find('.textbox-icon').each(function(index){
			var conf = opts.icons[index];
			var icon = $(this);
			if (!conf || conf.disabled || opts.disabled || opts.readonly){
				icon.addClass('textbox-icon-disabled');
			} else {
				icon.removeClass('textbox-icon-disabled');
			}
		});
		
		var btn = tb.find('.textbox-button');
		btn.unbind('.textbox').bind('click.textbox', function(){
			if (!btn.linkbutton('options').disabled){
				opts.onClickButton.call(target);
			}
		});
		btn.linkbutton((opts.disabled || opts.readonly) ? 'disable' : 'enable');
		
		tb.unbind('.textbox').bind('_resize.textbox', function(e, force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(target);
			}
			return false;
		});
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'textbox');
		var opts = state.options;
		var tb = state.textbox;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', 'disabled');
			tb.addClass('textbox-disabled');
			tb.find('.textbox-text,.textbox-value').attr('disabled', 'disabled');
		} else {
			opts.disabled = false;
			tb.removeClass('textbox-disabled');
			$(target).removeAttr('disabled');
			tb.find('.textbox-text,.textbox-value').removeAttr('disabled');
		}
	}
	
	function setReadonly(target, mode){
		var state = $.data(target, 'textbox');
		var opts = state.options;
		opts.readonly = mode==undefined ? true : mode;
		state.textbox.removeClass('textbox-readonly').addClass(opts.readonly ? 'textbox-readonly' : '');
		var input = state.textbox.find('.textbox-text');
		input.removeAttr('readonly');
		if (opts.readonly || !opts.editable){
			input.attr('readonly', 'readonly');
		}
	}
	
//	function initValue(target){
//		var opts = $(target).textbox('options');
//		var onChange = opts.onChange;
//		opts.onChange = function(){};
//		value = opts.value;
//		$(target).textbox('clear').textbox('setValue', value);
//		opts.onChange = onChange;
//	}
	
	$.fn.textbox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.textbox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.each(function(){
					var input = $(this).textbox('textbox');
					input.validatebox(options, param);
				});
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'textbox');
			if (state){
				$.extend(state.options, options);
				if (options.value != undefined){
					state.options.originalValue = options.value;
				}
			} else {
				state = $.data(this, 'textbox', {
					options: $.extend({}, $.fn.textbox.defaults, $.fn.textbox.parseOptions(this), options),
					textbox: init(this)
				});
				state.options.originalValue = state.options.value;
			}
			
			buildTextBox(this);
			bindEvents(this);
			setSize(this);
			validate(this);
			$(this).textbox('initValue', state.options.value);
		});
	}
	
	$.fn.textbox.methods = {
		options: function(jq){
			return $.data(jq[0], 'textbox').options;
		},
		cloneFrom: function(jq, from){
			return jq.each(function(){
				var t = $(this);
				if (t.data('textbox')){return}
				if (!$(from).data('textbox')){
					$(from).textbox();
				}
				var name = t.attr('name') || '';
				t.addClass('textbox-f').hide();
				t.removeAttr('name').attr('textboxName', name);
				var span = $(from).next().clone().insertAfter(t);
				span.find('input.textbox-value').attr('name', name);

				$.data(this, 'textbox', {
					options: $.extend(true, {}, $(from).textbox('options')),
					textbox: span
				});
				var srcBtn = $(from).textbox('button');
				if (srcBtn.length){
					t.textbox('button').linkbutton($.extend(true, {}, srcBtn.linkbutton('options')));
				}

				bindEvents(this);
				validate(this);
			});
		},
		textbox: function(jq){
			return $.data(jq[0], 'textbox').textbox.find('.textbox-text');
		},
		button: function(jq){
			return $.data(jq[0], 'textbox').textbox.find('.textbox-button');
		},
		destroy: function(jq){
			return jq.each(function(){
				destroy(this);
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
				bindEvents(this);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
				bindEvents(this);
			});
		},
		readonly: function(jq, mode){
			return jq.each(function(){
				setReadonly(this, mode);
				bindEvents(this);
			});
		},
		isValid: function(jq){
			return jq.textbox('textbox').validatebox('isValid');
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).textbox('setValue', '');
			});
		},
		setText: function(jq, value){
			return jq.each(function(){
				var opts = $(this).textbox('options');
				var input = $(this).textbox('textbox');
				if ($(this).textbox('getText') != value){
					opts.value = value;
					input.val(value);
				}
				if (!input.is(':focus')){
					if (value){
						input.removeClass('textbox-prompt');
					} else {
						input.val(opts.prompt).addClass('textbox-prompt');
					}
				}
				$(this).textbox('validate');
			});
		},
		initValue: function(jq, value){
			return jq.each(function(){
				var state = $.data(this, 'textbox');
				state.options.value = '';
				$(this).textbox('setText', value);
				state.textbox.find('.textbox-value').val(value);
				$(this).val(value);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				var opts = $.data(this, 'textbox').options;
				var oldValue = $(this).textbox('getValue');
				$(this).textbox('initValue', value);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
					$(this).closest('form').trigger('_change', [this]);
				}
			});
		},
		getText: function(jq){
			var input = jq.textbox('textbox');
			if (input.is(':focus')){
				return input.val();
			} else {
				return jq.textbox('options').value;
			}
		},
		getValue: function(jq){
			return jq.data('textbox').textbox.find('.textbox-value').val();
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).textbox('options');
				$(this).textbox('setValue', opts.originalValue);
			});
		},
		getIcon: function(jq, index){
			return jq.data('textbox').textbox.find('.textbox-icon:eq('+index+')');
		},
		getTipX: function(jq){
			var state = jq.data('textbox');
			var opts = state.options;
			var tb = state.textbox;
			var input = tb.find('.textbox-text');
			var iconWidth = tb.find('.textbox-addon')._outerWidth();
			var btnWidth = tb.find('.textbox-button')._outerWidth();
			if (opts.tipPosition == 'right'){
				return (opts.iconAlign=='right' ? iconWidth : 0) + (opts.buttonAlign=='right' ? btnWidth : 0) + 1;
			} else if (opts.tipPosition == 'left'){
				return (opts.iconAlign=='left' ? -iconWidth : 0) + (opts.buttonAlign=='left' ? -btnWidth : 0) - 1;
			} else {
				return iconWidth/2*(opts.iconAlign=='right'?1:-1);
			}
		}
	}
	
	$.fn.textbox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), 
			$.parser.parseOptions(target, [
			     'prompt','iconCls','iconAlign','buttonText','buttonIcon','buttonAlign',
			     {multiline:'boolean',editable:'boolean',iconWidth:'number'}
		    ]), {
			value: (t.val() || undefined),
			type: (t.attr('type') ? t.attr('type') : undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			readonly: (t.attr('readonly') ? true : undefined)
		});
	}
	
	$.fn.textbox.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width:'auto',
		height:22,
		prompt:'',
		value:'',
		type:'text',
		multiline:false,
		editable:true,
		disabled:false,
		readonly:false,
		icons:[],	// {iconCls:'icon-clear',disabled:true,handler:function(e){}}
		iconCls:null,
		iconAlign:'right',	// 'left' or 'right'
		iconWidth:18,
		buttonText:'',
		buttonIcon:null,
		buttonAlign:'right',
		inputEvents:{
			blur: function(e){
				var t = $(e.data.target);
				var opts = t.textbox('options');
				t.textbox('setValue', opts.value);
			},
			keydown: function(e){
				if (e.keyCode == 13){
					var t = $(e.data.target);
					t.textbox('setValue', t.textbox('getText'));
				}
			}
		},
		onChange: function(newValue, oldValue){},
		onResize: function(width, height){},
		onClickButton: function(){},
		onClickIcon: function(index){}
	});
})(jQuery);
/**
 * filebox - jQuery EasyUI
 * 
 * Dependencies:
 *  textbox
 * 
 */
(function($){
	var FILE_INDEX = 0;
	function buildFileBox(target){
		var state = $.data(target, 'filebox');
		var opts = state.options;
		var id = 'filebox_file_id_' + (++FILE_INDEX);
		//$(target).addClass('filebox-f').textbox(opts);
		$(target).addClass('filebox-f').textbox($.extend({},opts,{buttonText:opts.buttonText?("<label for=\""+id+"\">"+opts.buttonText+"</label>"):""}));
		$(target).textbox('textbox').attr('readonly','readonly');
		state.filebox = $(target).next().addClass('filebox');
		state.filebox.find('.textbox-value').remove();
		opts.oldValue = "";
		var file = $('<input type="file" class="textbox-value">').appendTo(state.filebox);
		file.attr('id', id).attr('name', $(target).attr('textboxName')||'');
		file.change(function(){
			$(target).filebox('setText', this.value);
			opts.onChange.call(target, this.value, opts.oldValue);
			opts.oldValue = this.value;
		});
		var btn = $(target).filebox('button');
		if (btn.length){
			//$('<label class="filebox-label" for="'+id+'"></label>').appendTo(btn);
			if (btn.linkbutton('options').disabled){
				file.attr('disabled', 'disabled');
			} else {
				file.removeAttr('disabled');
			}			
		}
	}
	
	$.fn.filebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.filebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'filebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'filebox', {
					options: $.extend({}, $.fn.filebox.defaults, $.fn.filebox.parseOptions(this), options)
				});
			}
			buildFileBox(this);
		});
	};
	
	$.fn.filebox.methods = {
		options: function(jq){
			var opts = jq.textbox('options');
			return $.extend($.data(jq[0], 'filebox').options, {
				width: opts.width,
				value: opts.value,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		}
	};
	
	$.fn.filebox.parseOptions = function(target){
		return $.extend({}, $.fn.textbox.parseOptions(target), {
			
		});
	};
	
	$.fn.filebox.defaults = $.extend({}, $.fn.textbox.defaults, {
		buttonIcon: null,
		buttonText: 'Choose File',
		buttonAlign: 'right',
		inputEvents: {}
	});
	
	
})(jQuery);
/**
 * searchbox - jQuery EasyUI
 * 
 * Dependencies:
 *  textbox
 * 	menubutton
 * 
 */
(function($){
	
	function buildSearchBox(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		var icons = $.extend(true, [], opts.icons);
		icons.push({
			iconCls:'searchbox-button',
			handler:function(e){
				var t = $(e.data.target);
				var opts = t.searchbox('options');
				opts.searcher.call(e.data.target, t.searchbox('getValue'), t.searchbox('getName'));
			}
		});
		
		buildMenu();
		var menuItem = getSelectedItem();
		
		$(target).addClass('searchbox-f').textbox($.extend({}, opts, {
			icons: icons,
			buttonText: (menuItem ? menuItem.text : '')
		}));
		$(target).attr('searchboxName', $(target).attr('textboxName'));
		state.searchbox = $(target).next();
		state.searchbox.addClass('searchbox');
		
		attachMenuItem(menuItem);
		
		function buildMenu(){
			if (opts.menu){
				state.menu = $(opts.menu).menu();
				var menuOpts = state.menu.menu('options');
				var onClick = menuOpts.onClick;
				menuOpts.onClick = function(item){
					attachMenuItem(item);
					onClick.call(this, item);
				}
			} else {
				if (state.menu){state.menu.menu('destroy');}
				state.menu = null;
			}
		}
		function getSelectedItem(){
			if (state.menu){
				var item = state.menu.children('div.menu-item:first');
				state.menu.children('div.menu-item').each(function(){
					var itemOpts = $.extend({}, $.parser.parseOptions(this), {
						selected: ($(this).attr('selected') ? true : undefined)
					});
					if (itemOpts.selected) {
						item = $(this);
						return false;
					}
				});
				return state.menu.menu('getItem', item[0]);
			} else {
				return null;
			}
		}
		function attachMenuItem(item){
			if (!item){return;}
			$(target).textbox('button').menubutton({
				text:item.text,
				iconCls:(item.iconCls||null),
				menu:state.menu,
				menuAlign:opts.buttonAlign,
				plain:false
			});
			state.searchbox.find('input.textbox-value').attr('name', item.name || item.text);
			$(target).searchbox('resize');
		}
	}
	
	$.fn.searchbox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.searchbox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'searchbox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'searchbox', {
					options: $.extend({}, $.fn.searchbox.defaults, $.fn.searchbox.parseOptions(this), options)
				});
			}
			buildSearchBox(this);
		});
	}
	
	$.fn.searchbox.methods = {
		options: function(jq){
			var opts = jq.textbox('options');
			return $.extend($.data(jq[0], 'searchbox').options, {
				width: opts.width,
				value: opts.value,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		},
		menu: function(jq){
			return $.data(jq[0], 'searchbox').menu;
		},
		getName: function(jq){
			return $.data(jq[0], 'searchbox').searchbox.find('input.textbox-value').attr('name');
		},
		selectName: function(jq, name){
			return jq.each(function(){
				var menu = $.data(this, 'searchbox').menu;
				if (menu){
					menu.children('div.menu-item').each(function(){
						var item = menu.menu('getItem', this);
						if (item.name == name){
							$(this).triggerHandler('click');
							return false;
						}
					});
				}
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var menu = $(this).searchbox('menu');
				if (menu){
					menu.menu('destroy');
				}
				$(this).textbox('destroy');
			});
		}
	};
	
	$.fn.searchbox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.textbox.parseOptions(target), $.parser.parseOptions(target, ['menu']), {
			searcher: (t.attr('searcher') ? eval(t.attr('searcher')) : undefined)
		});
	};
	
	$.fn.searchbox.defaults = $.extend({}, $.fn.textbox.defaults, {
		inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
			keydown: function(e){
				if (e.keyCode == 13){
					e.preventDefault();
					var t = $(e.data.target);
					var opts = t.searchbox('options');
					t.searchbox('setValue', $(this).val());
					opts.searcher.call(e.data.target, t.searchbox('getValue'), t.searchbox('getName'));
					return false;
				}
			}
		}),
		
		buttonAlign:'left',
		menu:null,
		searcher:function(value,name){}
	});
})(jQuery);
/**
 * form - jQuery EasyUI
 * 
 */
(function($){
	/**
	 * submit the form
	 */
	function ajaxSubmit(target, options){
		var opts = $.data(target, 'form').options;
		$.extend(opts, options||{});
		
		var param = $.extend({}, opts.queryParams);
		if (opts.onSubmit.call(target, param) == false){return;}
		$(target).find('.textbox-text:focus').blur();
		
		var frameId = 'easyui_frame_' + (new Date().getTime());
		var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>').appendTo('body')
		frame.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank');
		frame.css({
			position:'absolute',
			top:-1000,
			left:-1000
		});
		frame.bind('load', cb);
		
		submit(param);
		
		function submit(param){
			var form = $(target);
			if (opts.url){
				form.attr('action', opts.url);
			}
			var t = form.attr('target'), a = form.attr('action');
			form.attr('target', frameId);
			var paramFields = $();
			try {
				for(var n in param){
					var field = $('<input type="hidden" name="' + n + '">').val(param[n]).appendTo(form);
					paramFields = paramFields.add(field);
				}
				checkState();
				form[0].submit();
			} finally {
				form.attr('action', a);
				t ? form.attr('target', t) : form.removeAttr('target');
				paramFields.remove();
			}
		}
		
		function checkState(){
			var f = $('#'+frameId);
			if (!f.length){return}
			try{
				var s = f.contents()[0].readyState;
				if (s && s.toLowerCase() == 'uninitialized'){
					setTimeout(checkState, 100);
				}
			} catch(e){
				cb();
			}
		}
		
		var checkCount = 10;
		function cb(){
			var f = $('#'+frameId);
			if (!f.length){return}
			f.unbind();
			var data = '';
			try{
				var body = f.contents().find('body');
				data = body.html();
				if (data == ''){
					if (--checkCount){
						setTimeout(cb, 100);
						return;
					}
				}
				var ta = body.find('>textarea');
				if (ta.length){
					data = ta.val();
				} else {
					var pre = body.find('>pre');
					if (pre.length){
						data = pre.html();
					}
				}
			} catch(e){
			}
			opts.success(data);
			setTimeout(function(){
				f.unbind();
				f.remove();
			}, 100);
		}
	}
	
	/**
	 * load form data
	 * if data is a URL string type load from remote site, 
	 * otherwise load from local data object. 
	 */
	function load(target, data){
		var opts = $.data(target, 'form').options;
		
		if (typeof data == 'string'){
			var param = {};
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$.ajax({
				url: data,
				data: param,
				dataType: 'json',
				success: function(data){
					_load(data);
				},
				error: function(){
					opts.onLoadError.apply(target, arguments);
				}
			});
		} else {
			_load(data);
		}
		
		function _load(data){
			var form = $(target);
			for(var name in data){
				var val = data[name];
				if (!_checkField(name, val)){
					if (!_loadBox(name, val)){
						form.find('input[name="'+name+'"]').val(val);
						form.find('textarea[name="'+name+'"]').val(val);
						form.find('select[name="'+name+'"]').val(val);
					}
				}
			}
			opts.onLoadSuccess.call(target, data);
			form.form('validate');
		}
		
		/**
		 * check the checkbox and radio fields
		 */
		function _checkField(name, val){
			var cc = $(target).find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
			if (cc.length){
				cc._propAttr('checked', false);
				cc.each(function(){
					var f = $(this);
					if (f.val() == String(val) || $.inArray(f.val(), $.isArray(val)?val:[val]) >= 0){
						f._propAttr('checked', true);
					}
				});
				return true;
			}
			return false;
		}
		
		function _loadBox(name, val){
			var field = $(target).find('[textboxName="'+name+'"],[sliderName="'+name+'"]');
			if (field.length){
				for(var i=0; i<opts.fieldTypes.length; i++){
					var type = opts.fieldTypes[i];
					var state = field.data(type);
					if (state){
						if (state.options.multiple || state.options.range){
							field[type]('setValues', val);
						} else {
							field[type]('setValue', val);
						}
						return true;
					}
				}
			}
			return false;
		}
	}
	
	/**
	 * clear the form fields
	 */
	function clear(target){
		$('input,select,textarea', target).each(function(){
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
				this.value = '';
			} else if (t == 'file'){
				var file = $(this);
				if (!file.hasClass('textbox-value')){
					var newfile = file.clone().val('');
					newfile.insertAfter(file);
					if (file.data('validatebox')){
						file.validatebox('destroy');
						newfile.validatebox();
					} else {
						file.remove();
					}
				}
			} else if (t == 'checkbox' || t == 'radio'){
				this.checked = false;
			} else if (tag == 'select'){
				this.selectedIndex = -1;
			}
			
		});
		
		var form = $(target);
		var opts = $.data(target, 'form').options;
		for(var i=opts.fieldTypes.length-1; i>=0; i--){
			var type = opts.fieldTypes[i];
			var field = form.find('.'+type+'-f');
			if (field.length && field[type]){
				field[type]('clear');
			}
		}
		form.form('validate');
	}
	
	function reset(target){
		target.reset();
		var form = $(target);
		var opts = $.data(target, 'form').options;
		for(var i=opts.fieldTypes.length-1; i>=0; i--){
			var type = opts.fieldTypes[i];
			var field = form.find('.'+type+'-f');
			if (field.length && field[type]){
				field[type]('reset');
			}
		}
		form.form('validate');
	}
	
	/**
	 * set the form to make it can submit with ajax.
	 */
	function setForm(target){
		var options = $.data(target, 'form').options;
		$(target).unbind('.form');
		if (options.ajax){
			$(target).bind('submit.form', function(){
				setTimeout(function(){
					ajaxSubmit(target, options);
				}, 0);
				return false;
			});
		}
		$(target).bind('_change.form', function(e, t){
			options.onChange.call(this, t);
		}).bind('change.form', function(e){
			var t = e.target;
			if (!$(t).hasClass('textbox-text')){
				options.onChange.call(this, t);
			}
		});
		setValidation(target, options.novalidate);
	}
	
	function initForm(target, options){
		options = options || {};
		var state = $.data(target, 'form');
		if (state){
			$.extend(state.options, options);
		} else {
			$.data(target, 'form', {
				options: $.extend({}, $.fn.form.defaults, $.fn.form.parseOptions(target), options)
			});
		}
	}
	
	function validate(target){
		if ($.fn.validatebox){
			var t = $(target);
			t.find('.validatebox-text:not(:disabled)').validatebox('validate');
			var invalidbox = t.find('.validatebox-invalid');
			invalidbox.filter(':not(:disabled):first').focus();
			return invalidbox.length == 0;
		}
		return true;
	}
	
	function setValidation(target, novalidate){
		var opts = $.data(target, 'form').options;
		opts.novalidate = novalidate;
		$(target).find('.validatebox-text:not(:disabled)').validatebox(novalidate ? 'disableValidation' : 'enableValidation');
	}
	
	$.fn.form = function(options, param){
		if (typeof options == 'string'){
			this.each(function(){
				initForm(this);
			});
			return $.fn.form.methods[options](this, param);
		}
		
		return this.each(function(){
			initForm(this, options);
			setForm(this);
		});
	};
	
	$.fn.form.methods = {
		options: function(jq){
			return $.data(jq[0], 'form').options;
		},
		submit: function(jq, options){
			return jq.each(function(){
				ajaxSubmit(this, options);
			});
		},
		load: function(jq, data){
			return jq.each(function(){
				load(this, data);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				reset(this);
			});
		},
		validate: function(jq){
			return validate(jq[0]);
		},
		disableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, true);
			});
		},
		enableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, false);
			});
		}
	};
	
	$.fn.form.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [{ajax:'boolean'}]), {
			url: (t.attr('action') ? t.attr('action') : undefined)
		});
	};
	
	$.fn.form.defaults = {
		fieldTypes: ['combobox','combotree','combogrid','datetimebox','datebox','combo',
		        'datetimespinner','timespinner','numberspinner','spinner',
		        'slider','searchbox','numberbox','textbox'],
		novalidate: false,
		ajax: true,
		url: null,
		queryParams: {},
		onSubmit: function(param){return $(this).form('validate');},
		success: function(data){},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(data){},
		onLoadError: function(){},
		onChange: function(target){}
	};
})(jQuery);
/**
 * numberbox - jQuery EasyUI
 * 
 * Dependencies:
 * 	 textbox
 * 
 */
(function($){
	function buildNumberBox(target){
		var state = $.data(target, 'numberbox');
		var opts = state.options;
		$(target).addClass('numberbox-f').textbox(opts);
		$(target).textbox('textbox').css({imeMode:"disabled"});
		$(target).attr('numberboxName', $(target).attr('textboxName'));
		state.numberbox = $(target).next();
		state.numberbox.addClass('numberbox');
		
		var initValue = opts.parser.call(target, opts.value);
		var initText = opts.formatter.call(target, initValue);
		$(target).numberbox('initValue', initValue).numberbox('setText', initText);
	}
	
	function setValue(target, value){
		var state = $.data(target, 'numberbox');
		var opts = state.options;
		var value = opts.parser.call(target, value);
		var text = opts.formatter.call(target, value);
		opts.value = value;
		$(target).textbox('setText', text).textbox('setValue', value);
		text = opts.formatter.call(target, $(target).textbox('getValue'));
		$(target).textbox('setText', text);
	}
	
	$.fn.numberbox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.numberbox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'numberbox');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'numberbox', {
					options: $.extend({}, $.fn.numberbox.defaults, $.fn.numberbox.parseOptions(this), options)
				});
			}
			buildNumberBox(this);
		});
	};
	
	$.fn.numberbox.methods = {
		options: function(jq){
			var opts = jq.data('textbox') ? jq.textbox('options') : {};
			return $.extend($.data(jq[0], 'numberbox').options, {
				width: opts.width,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		},
		fix: function(jq){
			return jq.each(function(){
				$(this).numberbox('setValue', $(this).numberbox('getText'));
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).textbox('clear');
				$(this).numberbox('options').value = '';
			});
		},
		reset: function(jq){
			return jq.each(function(){
				$(this).textbox('reset');
				$(this).numberbox('setValue', $(this).numberbox('getValue'));
			});
		}
	};
	
	$.fn.numberbox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.textbox.parseOptions(target), $.parser.parseOptions(target, [
			'decimalSeparator','groupSeparator','suffix',
			{min:'number',max:'number',precision:'number'}
		]), {
			prefix: (t.attr('prefix') ? t.attr('prefix') : undefined)
		});
	};
	
	// Inherited from $.fn.textbox.defaults
	$.fn.numberbox.defaults = $.extend({}, $.fn.textbox.defaults, {
		inputEvents: {
			keypress:function(e){
				var target = e.data.target;
				var opts = $(target).numberbox('options');
				return opts.filter.call(target, e);
			},
			blur:function(e){
				var target = e.data.target;
				$(target).numberbox('setValue', $(target).numberbox('getText'));
			},
			keydown: function(e){
				if (e.keyCode == 13){
					var target = e.data.target;
					$(target).numberbox('setValue', $(target).numberbox('getText'));
				}
			}
		},
		min: null,
		max: null,
		precision: 0,
		decimalSeparator: '.',
		groupSeparator: '',
		prefix: '',
		suffix: '',
		
		filter: function(e){
			var opts = $(this).numberbox('options');
			var s = $(this).numberbox('getText');
			if (e.which == 13){	// ENTER
				return true;
			}
			if (e.which == 45){	//-
				return (s.indexOf('-') == -1 ? true : false);
			}
			var c = String.fromCharCode(e.which);
			if (c == opts.decimalSeparator){
				return (s.indexOf(c) == -1 ? true : false);
			} else if (c == opts.groupSeparator){
				return true;
			} else if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
				return true;
			} else if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
				return true;
			} else {
				return false;
			}
		},
		formatter: function(value){
			if (!value) return value;
			
			value = value + '';
			var opts = $(this).numberbox('options');
			var s1 = value, s2 = '';
			var dpos = value.indexOf('.');
			if (dpos >= 0){
				s1 = value.substring(0, dpos);
				s2 = value.substring(dpos+1, value.length);
			}
			if (opts.groupSeparator){
				var p = /(\d+)(\d{3})/;
				while(p.test(s1)){
					s1 = s1.replace(p, '$1' + opts.groupSeparator + '$2');
				}
			}
			if (s2){
				return opts.prefix + s1 + opts.decimalSeparator + s2 + opts.suffix;
			} else {
				return opts.prefix + s1 + opts.suffix;
			}
		},
		parser: function(s){
			s = s + '';
			var opts = $(this).numberbox('options');
			if (parseFloat(s) != s){
				if (opts.prefix) s = $.trim(s.replace(new RegExp('\\'+$.trim(opts.prefix),'g'), ''));
				if (opts.suffix) s = $.trim(s.replace(new RegExp('\\'+$.trim(opts.suffix),'g'), ''));
				if (opts.groupSeparator) s = $.trim(s.replace(new RegExp('\\'+opts.groupSeparator,'g'), ''));
				if (opts.decimalSeparator) s = $.trim(s.replace(new RegExp('\\'+opts.decimalSeparator,'g'), '.'));
				s = s.replace(/\s/g,'');
			}
			var val = parseFloat(s).toFixed(opts.precision);
			if (isNaN(val)) {
				val = '';
			} else if (typeof(opts.min) == 'number' && val < opts.min) {
				val = opts.min.toFixed(opts.precision);
			} else if (typeof(opts.max) == 'number' && val > opts.max) {
				val = opts.max.toFixed(opts.precision);
			}
			return val;
		}
	});
})(jQuery);
/**
 * calendar - jQuery EasyUI
 * 
 */
(function($){
	
	function setSize(target, param){
		var opts = $.data(target, 'calendar').options;
		var t = $(target);
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		t._size(opts, t.parent());
		t.find('.calendar-body')._outerHeight(t.height() - t.find('.calendar-header')._outerHeight());
		if (t.find('.calendar-menu').is(':visible')){
			showSelectMenus(target);
		}
	}
	
	function init(target){
		$(target).addClass('calendar').html(
				'<div class="calendar-header">' +
					'<div class="calendar-nav calendar-prevmonth"></div>' +
					'<div class="calendar-nav calendar-nextmonth"></div>' +
					'<div class="calendar-nav calendar-prevyear"></div>' +
					'<div class="calendar-nav calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span class="calendar-text"></span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-nav calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-nav calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
		);
		
		
		$(target).bind('_resize', function(e,force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(target);
			}
			return false;
		});
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'calendar').options;
		var menu = $(target).find('.calendar-menu');
		menu.find('.calendar-menu-year').unbind('.calendar').bind('keypress.calendar', function(e){
			if (e.keyCode == 13){
				setDate(true);
			}
		});
		$(target).unbind('.calendar').bind('mouseover.calendar', function(e){
			var t = toTarget(e.target);
			if (t.hasClass('calendar-nav') || t.hasClass('calendar-text') || (t.hasClass('calendar-day') && !t.hasClass('calendar-disabled'))){
				t.addClass('calendar-nav-hover');
			}
		}).bind('mouseout.calendar', function(e){
			var t = toTarget(e.target);
			if (t.hasClass('calendar-nav') || t.hasClass('calendar-text') || (t.hasClass('calendar-day') && !t.hasClass('calendar-disabled'))){
				t.removeClass('calendar-nav-hover');
			}
		}).bind('click.calendar', function(e){
			var t = toTarget(e.target);
			if (t.hasClass('calendar-menu-next') || t.hasClass('calendar-nextyear')){
				showYear(1);
			} else if (t.hasClass('calendar-menu-prev') || t.hasClass('calendar-prevyear')){
				showYear(-1);
			} else if (t.hasClass('calendar-menu-month')){
				menu.find('.calendar-selected').removeClass('calendar-selected');
				t.addClass('calendar-selected');
				setDate(true);
			} else if (t.hasClass('calendar-prevmonth')){
				showMonth(-1);
			} else if (t.hasClass('calendar-nextmonth')){
				showMonth(1);
			} else if (t.hasClass('calendar-text')){
				if (menu.is(':visible')){
					menu.hide();
				} else {
					showSelectMenus(target);
				}
			} else if (t.hasClass('calendar-day')){
				if (t.hasClass('calendar-disabled')){return}
				var oldValue = opts.current;
				t.closest('div.calendar-body').find('.calendar-selected').removeClass('calendar-selected');
				t.addClass('calendar-selected');
				var parts = t.attr('abbr').split(',');
				var y = parseInt(parts[0]);
				var m = parseInt(parts[1]);
				var d = parseInt(parts[2]);
				opts.current = new Date(y, m-1, d);
				opts.onSelect.call(target, opts.current);
				if (!oldValue || oldValue.getTime() != opts.current.getTime()){
					opts.onChange.call(target, opts.current, oldValue);
				}
				if (opts.year != y || opts.month != m){
					opts.year = y;
					opts.month = m;
					show(target);
				}
			}
		});
		function toTarget(t){
			var day = $(t).closest('.calendar-day');
			if (day.length){
				return day;
			} else {
				return $(t);
			}
		}
		function setDate(hideMenu){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			if (hideMenu){menu.hide()}
		}
		function showYear(delta){
			opts.year += delta;
			show(target);
			menu.find('.calendar-menu-year').val(opts.year);
		}
		function showMonth(delta){
			opts.month += delta;
			if (opts.month > 12){
				opts.year++;
				opts.month = 1;
			} else if (opts.month < 1){
				opts.year--;
				opts.month = 12;
			}
			show(target);
			
			menu.find('td.calendar-selected').removeClass('calendar-selected');
			menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
		}
	}
	
	/**
	 * show the select menu that can change year or month, if the menu is not be created then create it.
	 */
	function showSelectMenus(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-menu').show();
		
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table class="calendar-mtable"></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-nav calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
		}
		
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		
		sele._outerWidth(body._outerWidth());
		sele._outerHeight(body._outerHeight());
		seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
	}
	
	/**
	 * get weeks data.
	 */
	function getWeeks(target, year, month){
		var opts = $.data(target, 'calendar').options;
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		
		// group date by week
		var weeks = [], week = [];
		var memoDay = -1;
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			var day = new Date(date[0],date[1]-1,date[2]).getDay();
			if (memoDay == day){
				day = 0;
			} else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
				weeks.push(week);
				week = [];
			}
			memoDay = day;
		}
		if (week.length){
			weeks.push(week);
		}
		
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		
		return weeks;
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = $.data(target, 'calendar').options;
		if (opts.current && !opts.validator.call(target, opts.current)){
			opts.current = null;
		}
		
		var now = new Date();
		var todayInfo = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
		var currentInfo = opts.current ? (opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate()) : '';
		// calulate the saturday and sunday index
		var saIndex = 6 - opts.firstDay;
		var suIndex = saIndex + 1;
		if (saIndex >= 7) saIndex -= 7;
		if (suIndex >= 7) suIndex -= 7;
		
		$(target).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		
		var body = $(target).find('div.calendar-body');
		body.children('table').remove();
		
		var data = ['<table class="calendar-dtable" cellspacing="0" cellpadding="0" border="0">'];
		data.push('<thead><tr>');
		for(var i=opts.firstDay; i<opts.weeks.length; i++){
			data.push('<th>'+opts.weeks[i]+'</th>');
		}
		for(var i=0; i<opts.firstDay; i++){
			data.push('<th>'+opts.weeks[i]+'</th>');
		}
		data.push('</tr></thead>');
		
		data.push('<tbody>');
		var weeks = getWeeks(target, opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var cls = '';
			if (i == 0){cls = 'calendar-first';}
			else if (i == weeks.length - 1){cls = 'calendar-last';}
			data.push('<tr class="' + cls + '">');
			for(var j=0; j<week.length; j++){
				var day = week[j];
				var s = day[0]+','+day[1]+','+day[2];
				var dvalue = new Date(day[0], parseInt(day[1])-1, day[2]);
				var d = opts.formatter.call(target, dvalue);
				var css = opts.styler.call(target, dvalue);
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				
				var cls = 'calendar-day';
				if (!(opts.year == day[0] && opts.month == day[1])){
					cls += ' calendar-other-month';
				}
				if (s == todayInfo){cls += ' calendar-today';}
				if (s == currentInfo){cls += ' calendar-selected';}
				if (j == saIndex){cls += ' calendar-saturday';}
				else if (j == suIndex){cls += ' calendar-sunday';}
				if (j == 0){cls += ' calendar-first';}
				else if (j == week.length-1){cls += ' calendar-last';}
				
				cls += ' ' + classValue;
				if (!opts.validator.call(target, dvalue)){
					cls += ' calendar-disabled';
				}
				
				data.push('<td class="' + cls + '" abbr="' + s + '" style="' + styleValue + '">' + d + '</td>');
			}
			data.push('</tr>');
		}
		data.push('</tbody>');
		data.push('</table>');
		
		body.append(data.join(''));
		body.children('table.calendar-dtable').prependTo(body);

		opts.onNavigate.call(target, opts.year, opts.month);
	}
	
	$.fn.calendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.calendar.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'calendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'calendar', {
					options:$.extend({}, $.fn.calendar.defaults, $.fn.calendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('calendar-noborder');
			}
			setSize(this);
			bindEvents(this);
			show(this);
			$(this).find('div.calendar-menu').hide();	// hide the calendar menu
		});
	};
	
	$.fn.calendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'calendar').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				if (!date){
					var now = new Date();
					$(this).calendar({
						year: now.getFullYear(),
						month: now.getMonth()+1,
						current: date
					});
					return;
				}
				var opts = $(this).calendar('options');
				if (opts.validator.call(this, date)){
					var oldValue = opts.current;
					$(this).calendar({
						year: date.getFullYear(),
						month: date.getMonth()+1,
						current: date
					});
					if (!oldValue || oldValue.getTime() != date.getTime()){
						opts.onChange.call(this, opts.current, oldValue);
					}
				}
			});
		}
	};
	
	$.fn.calendar.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			{firstDay:'number',fit:'boolean',border:'boolean'}
		]));
	};
	
	$.fn.calendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		firstDay:0,
		weeks:['S','M','T','W','T','F','S'],
		months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:(function(){
			var d = new Date();
			return new Date(d.getFullYear(), d.getMonth(), d.getDate());
		})(),
		
		formatter:function(date){return date.getDate()},
		styler:function(date){return ''},
		validator:function(date){return true},
		
		onSelect: function(date){},
		onChange: function(newDate, oldDate){},
		onNavigate: function(year, month){}
	};
})(jQuery);
/**
 * spinner - jQuery EasyUI
 * 
 * Dependencies:
 *   textbox
 * 
 */
(function($){
	function buildSpinner(target){
		var state = $.data(target, 'spinner');
		var opts = state.options;
		var icons = $.extend(true, [], opts.icons);
		icons.push({
			iconCls:'spinner-arrow',
			handler:function(e){
				doSpin(e);
			}
		});
		$(target).addClass('spinner-f').textbox($.extend({}, opts, {
			icons: icons
		}));
		var arrowIcon = $(target).textbox('getIcon', icons.length-1);
		arrowIcon.append('<a href="javascript:void(0)" class="spinner-arrow-up" tabindex="-1"></a>');
		arrowIcon.append('<a href="javascript:void(0)" class="spinner-arrow-down" tabindex="-1"></a>');
		
		$(target).attr('spinnerName', $(target).attr('textboxName'));
		state.spinner = $(target).next();
		state.spinner.addClass('spinner');
	}
	
	function doSpin(e){
		var target = e.data.target;
		var opts = $(target).spinner('options');
		var up = $(e.target).closest('a.spinner-arrow-up');
		if (up.length){
			opts.spin.call(target, false);
			opts.onSpinUp.call(target);
			$(target).spinner('validate');
		}
		var down = $(e.target).closest('a.spinner-arrow-down');
		if (down.length){
			opts.spin.call(target, true);
			opts.onSpinDown.call(target);
			$(target).spinner('validate');
		}
	}
	
	$.fn.spinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.spinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'spinner');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'spinner', {
					options: $.extend({}, $.fn.spinner.defaults, $.fn.spinner.parseOptions(this), options)
				});
			}
			buildSpinner(this);
		});
	};
	
	$.fn.spinner.methods = {
		options: function(jq){
			var opts = jq.textbox('options');
			return $.extend($.data(jq[0], 'spinner').options, {
				width: opts.width,
				value: opts.value,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		}
	};
	
	$.fn.spinner.parseOptions = function(target){
		return $.extend({}, $.fn.textbox.parseOptions(target), $.parser.parseOptions(target, [
			'min','max',{increment:'number'}
		]));
	};
	
	$.fn.spinner.defaults = $.extend({}, $.fn.textbox.defaults, {
		min: null,
		max: null,
		increment: 1,
		spin: function(down){},	// the function to implement the spin button clicking
		onSpinUp: function(){},
		onSpinDown: function(){}
	});
})(jQuery);
/**
 * numberspinner - jQuery EasyUI
 * 
 * Dependencies:
 * 	 spinner
 * 	 numberbox
 */
(function($){
	function create(target){
		$(target).addClass('numberspinner-f');
		var opts = $.data(target, 'numberspinner').options;
		$(target).numberbox(opts).spinner(opts);
		$(target).numberbox('setValue', opts.value);
	}
	
	function doSpin(target, down){
		var opts = $.data(target, 'numberspinner').options;
		var v = parseFloat($(target).numberbox('getValue') || opts.value) || 0;
		if (down){
			v -= opts.increment;
		} else {
			v += opts.increment;
		}
		$(target).numberbox('setValue', v);
	}
	
	$.fn.numberspinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.numberspinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.numberbox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'numberspinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'numberspinner', {
					options: $.extend({}, $.fn.numberspinner.defaults, $.fn.numberspinner.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	$.fn.numberspinner.methods = {
		options: function(jq){
			var opts = jq.numberbox('options');
			return $.extend($.data(jq[0], 'numberspinner').options, {
				width: opts.width,
				value: opts.value,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		}
	};
	
	$.fn.numberspinner.parseOptions = function(target){
		return $.extend({}, $.fn.spinner.parseOptions(target), $.fn.numberbox.parseOptions(target), {
		});
	};
	
	$.fn.numberspinner.defaults = $.extend({}, $.fn.spinner.defaults, $.fn.numberbox.defaults, {
		spin: function(down){doSpin(this, down);}
	});
})(jQuery);
/**
 * timespinner - jQuery EasyUI
 * 
 * Dependencies:
 *   spinner
 * 
 */
(function($){
	function getSelectionStart(target){
		var start = 0;
		if (target.selectionStart){
			start = target.selectionStart;
		} else if (target.createTextRange){
			var range = target.createTextRange();
			var s = document.selection.createRange();
			s.setEndPoint("StartToStart", range);
			start = s.text.length;
		}
		return start;
	}
	
	function setSelectionRange(target, start, end){
		if (target.selectionStart){
			target.setSelectionRange(start, end);
		} else if (target.createTextRange){
			var range = target.createTextRange();
			range.collapse();
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	}
	
	function create(target){
		var opts = $.data(target, 'timespinner').options;
		$(target).addClass('timespinner-f').spinner(opts);
		var initValue = opts.formatter.call(target, opts.parser.call(target, opts.value));
		$(target).timespinner('initValue', initValue);
	}
	
	function clickHandler(e){
		var target = e.data.target;
		var opts = $.data(target, 'timespinner').options;
		var start = getSelectionStart(this);
		for(var i=0; i<opts.selections.length; i++){
			var range = opts.selections[i];
			if (start >= range[0] && start <= range[1]){
				highlight(target, i);
				return;
			}
		}
	}
	
	/**
	 * highlight the hours or minutes or seconds.
	 */
	function highlight(target, index){
		var opts = $.data(target, 'timespinner').options;
		if (index != undefined){
			opts.highlight = index;
		}
		var range = opts.selections[opts.highlight];
		if (range){
			var tb = $(target).timespinner('textbox');
			setSelectionRange(tb[0], range[0], range[1]);
			tb.focus();
		}
	}
	
	function setValue(target, value){
		var opts = $.data(target, 'timespinner').options;
		var value = opts.parser.call(target, value);
		var text = opts.formatter.call(target, value);
		$(target).spinner('setValue', text);
	}
	
	function doSpin(target, down){
		var opts = $.data(target, 'timespinner').options;
		var s = $(target).timespinner('getValue');
		var range = opts.selections[opts.highlight];
		var s1 = s.substring(0, range[0]);
		var s2 = s.substring(range[0], range[1]);
		var s3 = s.substring(range[1]);
		var v = s1 + ((parseInt(s2)||0) + opts.increment*(down?-1:1)) + s3;
		$(target).timespinner('setValue', v);
		highlight(target);
	}
	
	$.fn.timespinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.timespinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.spinner(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'timespinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'timespinner', {
					options: $.extend({}, $.fn.timespinner.defaults, $.fn.timespinner.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	$.fn.timespinner.methods = {
		options: function(jq){
			var opts = jq.data('spinner') ? jq.spinner('options') : {};
			return $.extend($.data(jq[0], 'timespinner').options, {
				width: opts.width,
				value: opts.value,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		getHours: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.timespinner('getValue').split(opts.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.timespinner('getValue').split(opts.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.timespinner('getValue').split(opts.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	
	$.fn.timespinner.parseOptions = function(target){
		return $.extend({}, $.fn.spinner.parseOptions(target), $.parser.parseOptions(target,[
			'separator',{showSeconds:'boolean',highlight:'number'}
		]));
	};
	
	$.fn.timespinner.defaults = $.extend({}, $.fn.spinner.defaults, {
		inputEvents: $.extend({}, $.fn.spinner.defaults.inputEvents, {
			click: function(e){
				clickHandler.call(this, e);
			},
			blur: function(e){
				var t = $(e.data.target);
				t.timespinner('setValue', t.timespinner('getText'));
			},
			keydown: function(e){
				if (e.keyCode == 13){
					var t = $(e.data.target);
					t.timespinner('setValue', t.timespinner('getText'));
				}
			}
		}),
		formatter: function(date){
			if (!date){return '';}
			var opts = $(this).timespinner('options');
			var tt = [formatN(date.getHours()), formatN(date.getMinutes())];
			if (opts.showSeconds){
				tt.push(formatN(date.getSeconds()));
			}
			return tt.join(opts.separator);
			
			function formatN(value){
				return (value < 10 ? '0' : '') + value;
			}
		},
		parser: function(s){
			var opts = $(this).timespinner('options');
			var date = parseD(s);
			if (date){
				var min = parseD(opts.min);
				var max = parseD(opts.max);
				if (min && min > date){date = min;}
				if (max && max < date){date = max;}
			}
			return date;
			
			function parseD(s){
				if (!s){return null;}
				var tt = s.split(opts.separator);
				return new Date(1900, 0, 0, parseInt(tt[0],10)||0, parseInt(tt[1],10)||0, parseInt(tt[2],10)||0);
			}
			if (!s){return null;}
			var tt = s.split(opts.separator);
			return new Date(1900, 0, 0, parseInt(tt[0],10)||0, parseInt(tt[1],10)||0, parseInt(tt[2],10)||0);
		},
		selections:[[0,2],[3,5],[6,8]],
		separator: ':',
		showSeconds: false,
		highlight: 0,	// The field to highlight initially, 0 = hours, 1 = minutes, ...
		spin: function(down){doSpin(this, down);}
	});
})(jQuery);
/**
 * datetimespinner - jQuery EasyUI
 * 
 * Dependencies:
 *   timespinner
 * 
 */
(function($){
	function create(target){
		var opts = $.data(target, 'datetimespinner').options;
		$(target).addClass('datetimespinner-f').timespinner(opts);
	}
	
	$.fn.datetimespinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datetimespinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.timespinner(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datetimespinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datetimespinner', {
					options: $.extend({}, $.fn.datetimespinner.defaults, $.fn.datetimespinner.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	$.fn.datetimespinner.methods = {
		options: function(jq){
			var opts = jq.timespinner('options');
			return $.extend($.data(jq[0], 'datetimespinner').options, {
				width: opts.width,
				value: opts.value,
				originalValue: opts.originalValue,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		}
	};
	
	$.fn.datetimespinner.parseOptions = function(target){
		return $.extend({}, $.fn.timespinner.parseOptions(target), $.parser.parseOptions(target, [
		]));
	};
	
	$.fn.datetimespinner.defaults = $.extend({}, $.fn.timespinner.defaults, {
		formatter:function(date){
			if (!date){return '';}
			return $.fn.datebox.defaults.formatter.call(this, date) + ' ' + $.fn.timespinner.defaults.formatter.call(this, date);
		},
		parser:function(s){
			s = $.trim(s);
			if (!s){return null;}
			var dt = s.split(' ');
			var date1 = $.fn.datebox.defaults.parser.call(this, dt[0]);
			if (dt.length < 2){
				return date1;
			}
			var date2 = $.fn.timespinner.defaults.parser.call(this, dt[1]);
			return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds());
		},
		selections:[[0,2],[3,5],[6,10],[11,13],[14,16],[17,19]]
	});
})(jQuery);
/**
 * datagrid - jQuery EasyUI
 * 
 * Dependencies:
 *  panel
 * 	resizable
 * 	linkbutton
 * 	pagination
 * 
 */
(function($){
	var DATAGRID_SERNO = 0;

	/**
	 * Get the index of array item, return -1 when the item is not found.
	 */
	function indexOfArray(a,o){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i] == o) return i;
		}
		return -1;
	}
	/**
	 * Remove array item, 'o' parameter can be item object or id field name.
	 * When 'o' parameter is the id field name, the 'id' parameter is valid.
	 */
	function removeArrayItem(a,o,id){
		if (typeof o == 'string'){
			for(var i=0,len=a.length; i<len; i++){
				if (a[i][o] == id){
					a.splice(i, 1);
					return;
				}
			}
		} else {
			var index = indexOfArray(a,o);
			if (index != -1){
				a.splice(index, 1);
			}
		}
	}
	/**
	 * Add un-duplicate array item, 'o' parameter is the id field name, if the 'r' object is exists, deny the action.
	 */
	function addArrayItem(a,o,r){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i][o] == r[o]){return;}
		}
		a.push(r);
	}
	
	function getArguments(target, aa){
		return $.data(target, 'treegrid') ? aa.slice(1) : aa;
	}
	
	function createStyleSheet(target){
		var dgState = $.data(target, 'datagrid');
		var opts = dgState.options;
		var panel = dgState.panel;
		var dc = dgState.dc;
		
		var ss = null;
		if (opts.sharedStyleSheet){
			ss = typeof opts.sharedStyleSheet == 'boolean' ? 'head' : opts.sharedStyleSheet;
		} else {
			ss = panel.closest('div.datagrid-view');
			if (!ss.length){ss = dc.view};
		}
		
		var cc = $(ss);
		var state = $.data(cc[0], 'ss');
		if (!state){
			state = $.data(cc[0], 'ss', {
				cache: {},
				dirty: []
			});
		}
		return {
			add: function(lines){
				var ss = ['<style type="text/css" easyui="true">'];
				for(var i=0; i<lines.length; i++){
					state.cache[lines[i][0]] = {width: lines[i][1]};
				}
				var index = 0;
				for(var s in state.cache){
					var item = state.cache[s];
					item.index = index++;
					ss.push(s + '{width:' + item.width + '}');
				}
				ss.push('</style>');
				$(ss.join('\n')).appendTo(cc);
				cc.children('style[easyui]:not(:last)').remove();
//				setTimeout(function(){
//					cc.children('style[easyui]:not(:last)').remove();
//				}, 0);
			},
			getRule: function(index){
				var style = cc.children('style[easyui]:last')[0];
				var styleSheet = style.styleSheet ? style.styleSheet : (style.sheet || document.styleSheets[document.styleSheets.length-1]);
				var rules = styleSheet.cssRules || styleSheet.rules;
				return rules[index];
			},
			set: function(selector, width){
				var item = state.cache[selector];
				if (item){
					item.width = width;
					var rule = this.getRule(item.index);
					if (rule){
						rule.style['width'] = width;
					}
				}
			},
			remove: function(selector){
				var tmp = [];
				for(var s in state.cache){
					if (s.indexOf(selector) == -1){
						tmp.push([s, state.cache[s].width]);
					}
				}
				state.cache = {};
				this.add(tmp);
			},
			dirty: function(selector){
				if (selector){
					state.dirty.push(selector);
				}
			},
			clean: function(){
				for(var i=0; i<state.dirty.length; i++){
					this.remove(state.dirty[i]);
				}
				state.dirty = [];
			}
		}
	}
	
	
	function setSize(target, param) {
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var panel = state.panel;
		
		if (param){
			$.extend(opts, param);
		}
		
		if (opts.fit == true){
			var p = panel.panel('panel').parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		
		panel.panel('resize', opts);
	}
	
	function setBodySize(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var wrap = state.panel;
		var innerWidth = wrap.width();
		var innerHeight = wrap.height();
		
		var view = dc.view;
		var view1 = dc.view1;
		var view2 = dc.view2;
		var header1 = view1.children('div.datagrid-header');
		var header2 = view2.children('div.datagrid-header');
		var table1 = header1.find('table');
		var table2 = header2.find('table');
		
		// set view width
		view.width(innerWidth);
		var headerInner = header1.children('div.datagrid-header-inner').show();
		view1.width(headerInner.find('table').width());
		if (!opts.showHeader) headerInner.hide();
		view2.width(innerWidth - view1._outerWidth());
		view1.children()._outerWidth(view1.width());
		view2.children()._outerWidth(view2.width());
		
		// set header height
		var all = header1.add(header2).add(table1).add(table2);
		all.css('height', '');
		var hh = Math.max(table1.height(), table2.height());
		all._outerHeight(hh);
		
		// set body height
		dc.body1.add(dc.body2).children('table.datagrid-btable-frozen').css({
			position: 'absolute',
			top: dc.header2._outerHeight()
		});
		var frozenHeight = dc.body2.children('table.datagrid-btable-frozen')._outerHeight();
		var fixedHeight = frozenHeight + header2._outerHeight() + view2.children('.datagrid-footer')._outerHeight();
		wrap.children(':not(.datagrid-view)').each(function(){
			fixedHeight += $(this)._outerHeight();
		});
		
		var distance = wrap.outerHeight() - wrap.height();
		var minHeight = wrap._size('minHeight') || '';
		var maxHeight = wrap._size('maxHeight') || '';
		view1.add(view2).children('div.datagrid-body').css({
			marginTop: frozenHeight,
			height: (isNaN(parseInt(opts.height)) ? '' : (innerHeight-fixedHeight)),
			minHeight: (minHeight ? minHeight-distance-fixedHeight : ''),
			maxHeight: (maxHeight ? maxHeight-distance-fixedHeight : '')
		});
		
		view.height(view2.height());
	}
	
	function fixRowHeight(target, index, forceFix){
		var rows = $.data(target, 'datagrid').data.rows;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		if (!dc.body1.is(':empty') && (!opts.nowrap || opts.autoRowHeight || forceFix)){
			if (index != undefined){
				var tr1 = opts.finder.getTr(target, index, 'body', 1);
				var tr2 = opts.finder.getTr(target, index, 'body', 2);
				setHeight(tr1, tr2);
			} else {
				var tr1 = opts.finder.getTr(target, 0, 'allbody', 1);
				var tr2 = opts.finder.getTr(target, 0, 'allbody', 2);
				setHeight(tr1, tr2);
				if (opts.showFooter){
					var tr1 = opts.finder.getTr(target, 0, 'allfooter', 1);
					var tr2 = opts.finder.getTr(target, 0, 'allfooter', 2);
					setHeight(tr1, tr2);
				}
			}
		}
		
		setBodySize(target);
		if (opts.height == 'auto'){
			var body1 = dc.body1.parent();
			var body2 = dc.body2;
			var csize = getContentSize(body2);
			var height = csize.height;
			if (csize.width > body2.width()){
				height += 18;
			}
			height -= parseInt(body2.css('marginTop')) || 0;
			body1.height(height);
			body2.height(height);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler('scroll');
		
		// set body row or footer row height
		function setHeight(trs1, trs2){
			for(var i=0; i<trs2.length; i++){
				var tr1 = $(trs1[i]);
				var tr2 = $(trs2[i]);
				tr1.css('height', '');
				tr2.css('height', '');
				var height = Math.max(tr1.height(), tr2.height());
				tr1.css('height', height);
				tr2.css('height', height);
			}
		}
		// get content size of a container(div)
		function getContentSize(cc){
			var width = 0;
			var height = 0;
			$(cc).children().each(function(){
				var c = $(this);
				if (c.is(':visible')){
					height += c._outerHeight();
					if (width < c._outerWidth()){
						width = c._outerWidth();
					}
				}
			});
			return {width:width,height:height};
		}
	}
	
	function freezeRow(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		if (!dc.body2.children('table.datagrid-btable-frozen').length){
			dc.body1.add(dc.body2).prepend('<table class="datagrid-btable datagrid-btable-frozen" cellspacing="0" cellpadding="0"></table>');
		}
		moveTr(true);
		moveTr(false);
		setBodySize(target);
		function moveTr(frozen){
			var serno = frozen ? 1 : 2;
			var tr = opts.finder.getTr(target, index, 'body', serno);
			(frozen ? dc.body1 : dc.body2).children('table.datagrid-btable-frozen').append(tr);
		}
	}
	
	/**
	 * wrap and return the grid object, fields and columns
	 */
	function wrapGrid(target, rownumbers) {
		function getColumns(){
			var frozenColumns = [];
			var columns = [];
			$(target).children('thead').each(function(){
				var opt = $.parser.parseOptions(this, [{frozen:'boolean'}]);
				$(this).find('tr').each(function(){
					var cols = [];
					$(this).find('th').each(function(){
						var th = $(this);
						var col = $.extend({}, $.parser.parseOptions(this, [
    						'field','align','halign','order','width',
    						{sortable:'boolean',checkbox:'boolean',resizable:'boolean',fixed:'boolean'},
    						{rowspan:'number',colspan:'number'}
    					]), {
    						title: (th.html() || undefined),
    						hidden: (th.attr('hidden') ? true : undefined),
    						formatter: (th.attr('formatter') ? eval(th.attr('formatter')) : undefined),
    						styler: (th.attr('styler') ? eval(th.attr('styler')) : undefined),
    						sorter: (th.attr('sorter') ? eval(th.attr('sorter')) : undefined)
    					});
						if (col.width && String(col.width).indexOf('%')==-1){
							col.width = parseInt(col.width);
						}
//    					if (!col.align) col.align = 'left';
    					if (th.attr('editor')){
    						var s = $.trim(th.attr('editor'));
    						if (s.substr(0,1) == '{'){
    							col.editor = eval('(' + s + ')');
    						} else {
    							col.editor = s;
    						}
    					}
    					
    					cols.push(col);
					});
					
					opt.frozen ? frozenColumns.push(cols) : columns.push(cols);
				});
			});
			return [frozenColumns, columns];
		}
		
		var panel = $(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner"></div>' +
							'</div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body"></div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
//						'<div class="datagrid-resize-proxy"></div>' +
					'</div>' +
				'</div>'
		).insertAfter(target);
		
		panel.panel({
			doSize:false,
			cls:'datagrid'
		});
		
		$(target).addClass('datagrid-f').hide().appendTo(panel.children('div.datagrid-view'));
		
		var cc = getColumns();
		var view = panel.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		
		return {
			panel: panel,
			frozenColumns: cc[0],
			columns: cc[1],
			dc: {	// some data container
				view: view,
				view1: view1,
				view2: view2,
				header1: view1.children('div.datagrid-header').children('div.datagrid-header-inner'),
				header2: view2.children('div.datagrid-header').children('div.datagrid-header-inner'),
				body1: view1.children('div.datagrid-body').children('div.datagrid-body-inner'),
				body2: view2.children('div.datagrid-body'),
				footer1: view1.children('div.datagrid-footer').children('div.datagrid-footer-inner'),
				footer2: view2.children('div.datagrid-footer').children('div.datagrid-footer-inner')
			}
		};
	}
	
	function buildGrid(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var panel = state.panel;
		
		state.ss = $(target).datagrid('createStyleSheet');
		
		panel.panel($.extend({}, opts, {
			id: null,
			doSize: false,
			onResize: function(width, height){
				if ($.data(target, 'datagrid')){
					setBodySize(target);
//					fitColumns(target);
					$(target).datagrid('fitColumns');
					opts.onResize.call(panel, width, height);
				}
//				setTimeout(function(){
//				}, 0);
			},
			onExpand: function(){
				//setBodySize(target);
				fixRowHeight(target);
				opts.onExpand.call(panel);
			}
		}));
		
		state.rowIdPrefix = 'datagrid-row-r' + (++DATAGRID_SERNO);
		state.cellClassPrefix = 'datagrid-cell-c' + DATAGRID_SERNO;
		createColumnHeader(dc.header1, opts.frozenColumns, true);
		createColumnHeader(dc.header2, opts.columns, false);
		createColumnStyle();
		
		dc.header1.add(dc.header2).css('display', opts.showHeader ? 'block' : 'none');
		dc.footer1.add(dc.footer2).css('display', opts.showFooter ? 'block' : 'none');
		
		if (opts.toolbar) {
			if ($.isArray(opts.toolbar)){
				$('div.datagrid-toolbar', panel).remove();
				var tb = $('<div class="datagrid-toolbar"><table cellspacing="0" cellpadding="0"><tr></tr></table></div>').prependTo(panel);
				var tr = tb.find('tr');
				for(var i=0; i<opts.toolbar.length; i++) {
					var btn = opts.toolbar[i];
					if (btn == '-') {
						$('<td><div class="datagrid-btn-separator"></div></td>').appendTo(tr);
					} else {
						var td = $('<td></td>').appendTo(tr);
						var tool = $('<a href="javascript:void(0)"></a>').appendTo(td);
						tool[0].onclick = eval(btn.handler || function(){});
						tool.linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			} else {
				$(opts.toolbar).addClass('datagrid-toolbar').prependTo(panel);
				$(opts.toolbar).show();
			}
		} else {
			$('div.datagrid-toolbar', panel).remove();
		}
		
		$('div.datagrid-pager', panel).remove();
		if (opts.pagination) {
			var pager = $('<div class="datagrid-pager"></div>');
			if (opts.pagePosition == 'bottom'){
				pager.appendTo(panel);
			} else if (opts.pagePosition == 'top'){
				pager.addClass('datagrid-pager-top').prependTo(panel);
			} else {
				var ptop = $('<div class="datagrid-pager datagrid-pager-top"></div>').prependTo(panel);
				pager.appendTo(panel);
				pager = pager.add(ptop);
			}
			pager.pagination({
//				total:0,
				total:(opts.pageNumber*opts.pageSize),
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum || 1;
					opts.pageSize = pageSize;
					pager.pagination('refresh',{
						pageNumber:pageNum,
						pageSize:pageSize
					});
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
		
		function createColumnHeader(container, columns, frozen){
			if (!columns) return;
			$(container).show();
			$(container).empty();
			var names = [];
			var orders = [];
			if (opts.sortName){
				names = opts.sortName.split(',');
				orders = opts.sortOrder.split(',');
			}
			var t = $('<table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0"><tbody></tbody></table>').appendTo(container);
			for(var i=0; i<columns.length; i++) {
				var tr = $('<tr class="datagrid-header-row"></tr>').appendTo($('tbody', t));
				var cols = columns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					
					var attr = '';
					if (col.rowspan) attr += 'rowspan="' + col.rowspan + '" ';
					if (col.colspan) attr += 'colspan="' + col.colspan + '" ';
					var td = $('<td ' + attr + '></td>').appendTo(tr);
					
					if (col.checkbox){
						td.attr('field', col.field);
						$('<div class="datagrid-header-check"></div>').html('<input type="checkbox"/>').appendTo(td);
					} else if (col.field){
						td.attr('field', col.field);
						td.append('<div class="datagrid-cell"><span></span><span class="datagrid-sort-icon"></span></div>');
						$('span', td).html(col.title);
						$('span.datagrid-sort-icon', td).html('&nbsp;');
						var cell = td.find('div.datagrid-cell');
//						if (opts.sortName == col.field){
//							cell.addClass('datagrid-sort-'+opts.sortOrder);
//						}
//						var pos = names.indexOf(col.field);
						var pos = indexOfArray(names, col.field);
						if (pos >= 0){
							cell.addClass('datagrid-sort-' + orders[pos]);
						}
						if (col.resizable == false){
							cell.attr('resizable', 'false');
						}
						if (col.width){
							var value = $.parser.parseValue('width',col.width,dc.view,opts.scrollbarSize);
							cell._outerWidth(value-1);
							col.boxWidth = parseInt(cell[0].style.width);
							col.deltaWidth = value - col.boxWidth;
						} else {
							col.auto = true;
						}
//						cell.css('text-align', (col.align || 'left'));
//						if (col.align){cell.css('text-align', col.align)}
						cell.css('text-align', (col.halign || col.align || ''));
						
						// define the cell class
						col.cellClass = state.cellClassPrefix + '-' + col.field.replace(/[\.|\s]/g,'-');
//						col.cellSelector = '.' + col.cellClass;
						cell.addClass(col.cellClass).css('width', '');
					} else {
						$('<div class="datagrid-cell-group"></div>').html(col.title).appendTo(td);
					}
					
					if (col.hidden){
						td.hide();
					}
				}
				
			}
			if (frozen && opts.rownumbers){
				var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-rownumber"></div></td>');
				if ($('tr',t).length == 0){
					td.wrap('<tr class="datagrid-header-row"></tr>').parent().appendTo($('tbody',t));
				} else {
					td.prependTo($('tr:first', t));
				}
			}
		}
		
		function createColumnStyle(){
			var lines = [];
			var fields = getColumnFields(target,true).concat(getColumnFields(target));
			for(var i=0; i<fields.length; i++){
				var col = getColumnOption(target, fields[i]);
				if (col && !col.checkbox){
					lines.push(['.'+col.cellClass, col.boxWidth ? col.boxWidth + 'px' : 'auto']);
				}
			}
			state.ss.add(lines);
			state.ss.dirty(state.cellSelectorPrefix);	// mark the old selector as dirty that will be removed
			state.cellSelectorPrefix = '.' + state.cellClassPrefix;
		}
	}
	
	/**
	 * bind the datagrid events
	 */
	function bindEvents(target) {
		var state = $.data(target, 'datagrid');
		var panel = state.panel;
		var opts = state.options;
		var dc = state.dc;
		
		var header = dc.header1.add(dc.header2);
		header.find('input[type=checkbox]').unbind('.datagrid').bind('click.datagrid', function(e){
			if (opts.singleSelect && opts.selectOnCheck) return false;
			if ($(this).is(':checked')){
				checkAll(target);
			} else {
				uncheckAll(target);
			}
			e.stopPropagation();
		});
		
		var cells = header.find('div.datagrid-cell');
		cells.closest('td').unbind('.datagrid').bind('mouseenter.datagrid', function(){
			if (state.resizing){return;}
			$(this).addClass('datagrid-header-over');
		}).bind('mouseleave.datagrid', function(){
			$(this).removeClass('datagrid-header-over');
		}).bind('contextmenu.datagrid', function(e){
			var field = $(this).attr('field');
			opts.onHeaderContextMenu.call(target, e, field);
		});
		
		cells.unbind('.datagrid').bind('click.datagrid', function(e){
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			if (e.pageX < p2 && e.pageX > p1){
				sortGrid(target, $(this).parent().attr('field'));
			}
		}).bind('dblclick.datagrid', function(e){
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			var cond = opts.resizeHandle == 'right' ? (e.pageX > p2) : (opts.resizeHandle == 'left' ? (e.pageX < p1) : (e.pageX < p1 || e.pageX > p2));
			if (cond){
				var field = $(this).parent().attr('field');
				var col = getColumnOption(target, field);
				if (col.resizable == false) return;
				$(target).datagrid('autoSizeColumn', field);
				col.auto = false;
			}
		});
		
		var resizeHandle = opts.resizeHandle == 'right' ? 'e' : (opts.resizeHandle == 'left' ? 'w' : 'e,w');
		cells.each(function(){
			$(this).resizable({
				handles:resizeHandle,
				disabled:($(this).attr('resizable') ? $(this).attr('resizable')=='false' : false),
				minWidth:25,
				onStartResize: function(e){
					state.resizing = true;
//					header.css('cursor', 'e-resize');
					header.css('cursor', $('body').css('cursor'));
					if (!state.proxy){
						state.proxy = $('<div class="datagrid-resize-proxy"></div>').appendTo(dc.view);
					}
					state.proxy.css({
						left:e.pageX - $(panel).offset().left - 1,
						display:'none'
					});
					setTimeout(function(){
						if (state.proxy) state.proxy.show();
					}, 500);
				},
				onResize: function(e){
					state.proxy.css({
						left:e.pageX - $(panel).offset().left - 1,
						display:'block'
					});
					return false;
				},
				onStopResize: function(e){
					header.css('cursor', '');
					$(this).css('height','');
					var field = $(this).parent().attr('field');
					var col = getColumnOption(target, field);
					col.width = $(this)._outerWidth();
					col.boxWidth = col.width - col.deltaWidth;
					col.auto = undefined;
					$(this).css('width', '');
					// fixColumnSize(target, field);
					$(target).datagrid('fixColumnSize', field);
					state.proxy.remove();
					state.proxy = null;
					if ($(this).parents('div:first.datagrid-header').parent().hasClass('datagrid-view1')){
						setBodySize(target);
					}
//					fitColumns(target);
					$(target).datagrid('fitColumns');
					opts.onResizeColumn.call(target, field, col.width);
					setTimeout(function(){
						state.resizing = false;
					}, 0);
				}
			});
		});
		
		var bb = dc.body1.add(dc.body2);
		bb.unbind();
		for(var event in opts.rowEvents){
			bb.bind(event, opts.rowEvents[event]);
		}
		dc.body1.bind('mousewheel DOMMouseScroll', function(e){
			var e1 = e.originalEvent || window.event;
			var delta = e1.wheelDelta || e1.detail*(-1);
			var dg = $(e.target).closest('div.datagrid-view').children('.datagrid-f');
			var dc = dg.data('datagrid').dc;
			dc.body2.scrollTop(dc.body2.scrollTop() - delta);
		});
		dc.body2.bind('scroll', function(){
			var b1 = dc.view1.children('div.datagrid-body');
			b1.scrollTop($(this).scrollTop());
			var c1 = dc.body1.children(':first');
			var c2 = dc.body2.children(':first');
			if (c1.length && c2.length){
				var top1 = c1.offset().top;
				var top2 = c2.offset().top;
				if (top1 != top2){
					b1.scrollTop(b1.scrollTop()+top1-top2);
				}
			}
			
//			dc.view1.children('div.datagrid-body').scrollTop($(this).scrollTop());
			dc.view2.children('div.datagrid-header,div.datagrid-footer')._scrollLeft($(this)._scrollLeft());
			dc.body2.children('table.datagrid-btable-frozen').css('left', -$(this)._scrollLeft());
		});
	}
	
	function hoverEventHandler(isOver){
		return function(e){
			var tr = getClosestTr(e.target);
			if (!tr){return}
			var target = getTableTarget(tr);
			if ($.data(target, 'datagrid').resizing){return}
			var index = getTrIndex(tr);
			if (isOver){
				highlightRow(target, index);
				// $(target).datagrid('highlightRow', index);
			} else {
				var opts = $.data(target, 'datagrid').options;
				opts.finder.getTr(target, index).removeClass('datagrid-row-over');
			}
		}
	}
	function clickEventHandler(e){
		var tr = getClosestTr(e.target);
		if (!tr){return}
		var target = getTableTarget(tr);
		var opts = $.data(target, 'datagrid').options;
		var index = getTrIndex(tr);
		var tt = $(e.target);
		if (tt.parent().hasClass('datagrid-cell-check')){	// click the checkbox
			if (opts.singleSelect && opts.selectOnCheck){
//				if (!opts.checkOnSelect) {
//					uncheckAll(target, true);
//				}
				tt._propAttr('checked', !tt.is(':checked'));
				checkRow(target, index);
			} else {
				if (tt.is(':checked')){
					tt._propAttr('checked', false);
					checkRow(target, index);
				} else {
					tt._propAttr('checked', true);
					uncheckRow(target, index);
				}
			}
		} else {
			var row = opts.finder.getRow(target, index);
			var td = tt.closest('td[field]',tr);
			if (td.length){
				var field = td.attr('field');
				opts.onClickCell.call(target, index, field, row[field]);
			}
			
			if (opts.singleSelect == true){
				selectRow(target, index);
			} else {
				if (opts.ctrlSelect){
					if (e.ctrlKey){
						if (tr.hasClass('datagrid-row-selected')){
							unselectRow(target, index);
						} else {
							selectRow(target, index);
						}
					} else if (e.shiftKey){
						$(target).datagrid('clearSelections');
						var fromIndex = Math.min(opts.lastSelectedIndex||0, index);
						var toIndex = Math.max(opts.lastSelectedIndex||0, index);
						for(var i=fromIndex; i<=toIndex; i++){
							selectRow(target, i);
						}
					} else {
						$(target).datagrid('clearSelections');
						selectRow(target, index);
						opts.lastSelectedIndex = index;
					}
				} else {
					if (tr.hasClass('datagrid-row-selected')){
						unselectRow(target, index);
					} else {
						selectRow(target, index);
					}
				}
			}
			opts.onClickRow.apply(target, getArguments(target, [index, row]));
		}
	}
	function dblclickEventHandler(e){
		var tr = getClosestTr(e.target);
		if (!tr){return}
		var target = getTableTarget(tr);
		var opts = $.data(target, 'datagrid').options;
		var index = getTrIndex(tr);
		var row = opts.finder.getRow(target, index);
		var td = $(e.target).closest('td[field]',tr);
		if (td.length){
			var field = td.attr('field');
			opts.onDblClickCell.call(target, index, field, row[field]);
		}
		opts.onDblClickRow.apply(target, getArguments(target, [index, row]));
	}
	function contextmenuEventHandler(e){
		var tr = getClosestTr(e.target);
		if (!tr){return;}
		var target = getTableTarget(tr);
		var opts = $.data(target, 'datagrid').options;
		var index = getTrIndex(tr);
		var row = opts.finder.getRow(target, index);
		opts.onRowContextMenu.call(target, e, index, row);
	}
	function getTableTarget(t){
		return $(t).closest('div.datagrid-view').children('.datagrid-f')[0];
	}
	function getClosestTr(t){
		var tr = $(t).closest('tr.datagrid-row');
		if (tr.length && tr.parent().length){
			return tr;
		} else {
			return undefined;
		}
	}
	function getTrIndex(tr){
		if (tr.attr('datagrid-row-index')){
			return parseInt(tr.attr('datagrid-row-index'));
		} else {
			return tr.attr('node-id');
		}
	}
	
	function sortGrid(target, param){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		param = param || {};
		var sparam = {sortName: opts.sortName, sortOrder:opts.sortOrder};
		if (typeof param == 'object'){
			$.extend(sparam, param);
		}
		var names = [];
		var orders = [];
		if (sparam.sortName){
			names = sparam.sortName.split(',');
			orders = sparam.sortOrder.split(',');
		}
		if (typeof param == 'string'){
			var field = param;
			var col = getColumnOption(target, field);
			if (!col.sortable || state.resizing){return}
			var originalOrder = col.order || 'asc';
			var pos = indexOfArray(names, field);
			if (pos >= 0){
				var nextOrder = orders[pos] == 'asc' ? 'desc' : 'asc';
				if (opts.multiSort && nextOrder == originalOrder){
					names.splice(pos,1);
					orders.splice(pos,1);
				} else {
					orders[pos] = nextOrder;
				}
			} else {
				if (opts.multiSort){
					names.push(field);
					orders.push(originalOrder);
				} else {
					names = [field];
					orders = [originalOrder];
				}
			}
			sparam.sortName = names.join(',');
			sparam.sortOrder = orders.join(',');
		}
		
		if (opts.onBeforeSortColumn.call(target, sparam.sortName, sparam.sortOrder) == false){return}
		$.extend(opts, sparam);

		var dc = state.dc;
		var header = dc.header1.add(dc.header2);
		header.find('div.datagrid-cell').removeClass('datagrid-sort-asc datagrid-sort-desc');
		for(var i=0; i<names.length; i++){
			var col = getColumnOption(target, names[i]);
			header.find('div.'+col.cellClass).addClass('datagrid-sort-'+orders[i]);
		}
		if (opts.remoteSort){
			request(target);
		} else {
			loadData(target, $(target).datagrid('getData'));
		}
		
		opts.onSortColumn.call(target, opts.sortName, opts.sortOrder);
	}
	
	/**
	 * expand the columns to fit the grid width
	 */
	function fitColumns(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var header = dc.view2.children('div.datagrid-header');
		dc.body2.css('overflow-x', '');
		
		setGroupWidth();
		setPercentWidth();
		fillWidth();
		setGroupWidth(true);
		
		if (header.width() >= header.find('table').width()){
			dc.body2.css('overflow-x', 'hidden');
		}
		
		function fillWidth(){
			if (!opts.fitColumns){return;}
			if (!state.leftWidth){state.leftWidth = 0;}
			
			var fieldWidths = 0;
			var cc = [];
			var fields = getColumnFields(target, false);
			for(var i=0; i<fields.length; i++){
				var col = getColumnOption(target, fields[i]);
				if (canResize(col)){
					fieldWidths += col.width;
					cc.push({field:col.field, col:col, addingWidth:0});
				}
			}
			if (!fieldWidths){return;}
			cc[cc.length-1].addingWidth -= state.leftWidth;
			
			var headerInner = header.children('div.datagrid-header-inner').show();
			var leftWidth = header.width() - header.find('table').width() - opts.scrollbarSize + state.leftWidth;
			var rate = leftWidth / fieldWidths;
			if (!opts.showHeader){headerInner.hide();}
			for(var i=0; i<cc.length; i++){
				var c = cc[i];
				var width = parseInt(c.col.width * rate);
				c.addingWidth += width;
				leftWidth -= width;
			}
			cc[cc.length-1].addingWidth += leftWidth;
			for(var i=0; i<cc.length; i++){
				var c = cc[i];
				if (c.col.boxWidth + c.addingWidth > 0){
					c.col.boxWidth += c.addingWidth;
					c.col.width += c.addingWidth;
				}
			}
			state.leftWidth = leftWidth;
			
			// fixColumnSize(target);
			$(target).datagrid('fixColumnSize');
		}
		function setPercentWidth(){
			var changed = false;
			var fields = getColumnFields(target, true).concat(getColumnFields(target, false));
			$.map(fields, function(field){
				var col = getColumnOption(target, field);
				if (String(col.width||'').indexOf('%') >= 0){
					var width = $.parser.parseValue('width',col.width,dc.view,opts.scrollbarSize) - col.deltaWidth;
					if (width > 0){
						col.boxWidth = width;
						changed = true;
					}
				}
			});
			if (changed){
				// fixColumnSize(target);
				$(target).datagrid('fixColumnSize');
			}
		}
		function setGroupWidth(fit){
			var groups = dc.header1.add(dc.header2).find('.datagrid-cell-group');
			if (groups.length){
				groups.each(function(){
					$(this)._outerWidth(fit ? $(this).parent().width() : 10);
				});
				if (fit){
					setBodySize(target);
				}
			}
		}
		function canResize(col){
			if (String(col.width||'').indexOf('%') >= 0){return false;}
			if (!col.hidden && !col.checkbox && !col.auto && !col.fixed){return true;}
		}
	}
	
	/**
	 * adjusts the column width to fit the contents.
	 */
	function autoSizeColumn(target, field){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var tmp = $('<div class="datagrid-cell" style="position:absolute;left:-9999px"></div>').appendTo('body');
		if (field){
			setSize(field);
			if (opts.fitColumns){
				setBodySize(target);
//				fitColumns(target);
				$(target).datagrid('fitColumns');
			}
		} else {
			var canFitColumns = false;
			var fields = getColumnFields(target,true).concat(getColumnFields(target,false));
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = getColumnOption(target, field);
				if (col.auto){
					setSize(field);
					canFitColumns = true;
				}
			}
			if (canFitColumns && opts.fitColumns){
				setBodySize(target);
//				fitColumns(target);
				$(target).datagrid('fitColumns');
			}
		}
		tmp.remove();
		
		function setSize(field){
			var headerCell = dc.view.find('div.datagrid-header td[field="' + field + '"] div.datagrid-cell');
			headerCell.css('width', '');
			var col = $(target).datagrid('getColumnOption', field);
			col.width = undefined;
			col.boxWidth = undefined;
			col.auto = true;
			$(target).datagrid('fixColumnSize', field);
			var width = Math.max(getWidth('header'), getWidth('allbody'), getWidth('allfooter'))+1;
			headerCell._outerWidth(width-1);
			col.width = width;
			col.boxWidth = parseInt(headerCell[0].style.width);
			col.deltaWidth = width-col.boxWidth;
			headerCell.css('width', '');
			$(target).datagrid('fixColumnSize', field);
			opts.onResizeColumn.call(target, field, col.width);
			
			// get cell width of specified type(body or footer)
			function getWidth(type){
				var width = 0;
				if (type == 'header'){
					width = getCellWidth(headerCell);
				} else {
					opts.finder.getTr(target,0,type).find('td[field="' + field + '"] div.datagrid-cell').each(function(){
						var w = getCellWidth($(this));
						if (width < w){
							width = w;
						}
					});
				}
				return width;
				
				function getCellWidth(cell){
					return cell.is(':visible') ? cell._outerWidth() : tmp.html(cell.html())._outerWidth();
				}
			}
		}
	}
	
	
	/**
	 * fix column size for the specified field
	 */
	function fixColumnSize(target, field){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var table = dc.view.find('table.datagrid-btable,table.datagrid-ftable');
		table.css('table-layout','fixed');
		if (field) {
			fix(field);
		} else {
			var ff = getColumnFields(target, true).concat(getColumnFields(target, false));	// get all fields
			for(var i=0; i<ff.length; i++){
				fix(ff[i]);
			}
		}
		table.css('table-layout','');
		fixMergedSize(target);
		fixRowHeight(target);
		fixEditableSize(target);
		
		function fix(field){
			var col = getColumnOption(target, field);
			if (col.cellClass){
				state.ss.set('.'+col.cellClass, col.boxWidth ? col.boxWidth + 'px' : 'auto');
			}
		}
	}
	
	function fixMergedSize(target){
		var dc = $.data(target, 'datagrid').dc;
		dc.view.find('td.datagrid-td-merged').each(function(){
			var td = $(this);
			var colspan = td.attr('colspan') || 1;
			var col = getColumnOption(target, td.attr('field'));
			var width = col.boxWidth + col.deltaWidth - 1;
			for(var i=1; i<colspan; i++){
				td = td.next();
				col = getColumnOption(target, td.attr('field'));
				width += col.boxWidth + col.deltaWidth;
			}
			$(this).children('div.datagrid-cell')._outerWidth(width);
		});
	}
	
	function fixEditableSize(target){
		var dc = $.data(target, 'datagrid').dc;
		dc.view.find('div.datagrid-editable').each(function(){
			var cell = $(this);
			var field = cell.parent().attr('field');
			var col = $(target).datagrid('getColumnOption', field);
			cell._outerWidth(col.boxWidth+col.deltaWidth-1);
			var ed = $.data(this, 'datagrid.editor');
			if (ed.actions.resize) {
				ed.actions.resize(ed.target, cell.width());
			}
		});
	}
	
	function getColumnOption(target, field){
		function find(columns){
			if (columns) {
				for(var i=0; i<columns.length; i++){
					var cc = columns[i];
					for(var j=0; j<cc.length; j++){
						var c = cc[j];
						if (c.field == field){
							return c;
						}
					}
				}
			}
			return null;
		}
		
		var opts = $.data(target, 'datagrid').options;
		var col = find(opts.columns);
		if (!col){
			col = find(opts.frozenColumns);
		}
		return col;
	}
	
	/**
	 * get column fields which will be show in row
	 */
	function getColumnFields(target, frozen){
		var opts = $.data(target, 'datagrid').options;
		var columns = (frozen==true) ? (opts.frozenColumns || [[]]) : opts.columns;
		if (columns.length == 0) return [];
		
		var aa = [];
		var count = getCount();	// the fields count
		for(var i=0; i<columns.length; i++){
			aa[i] = new Array(count);
		}
		for(var rowIndex=0; rowIndex<columns.length; rowIndex++){
			$.map(columns[rowIndex], function(col){
				var colIndex = getIndex(aa[rowIndex]);	// get the column index
				if (colIndex >= 0){
					var value = col.field || '';
					for(var c=0; c<(col.colspan||1); c++){
						for(var r=0; r<(col.rowspan||1); r++){
							aa[rowIndex + r][colIndex] = value;
						}
						colIndex++;
					}
				}
			});
		}
		return aa[aa.length-1]
		
		function getCount(){
			var count = 0;
			$.map(columns[0], function(col){
				count += col.colspan || 1;
			});
			return count;
		}
		function getIndex(a){
			for(var i=0; i<a.length; i++){
				if (a[i] == undefined){return i;}
			}
			return -1;
		}
	}
	
	/**
	 * load data to the grid
	 */
	function loadData(target, data){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		data = opts.loadFilter.call(target, data);
		data.total = parseInt(data.total);
		state.data = data;
		if (data.footer){
			state.footer = data.footer;
		}
		
		if (!opts.remoteSort && opts.sortName){
			var names = opts.sortName.split(',');
			var orders = opts.sortOrder.split(',');
			data.rows.sort(function(r1,r2){
				var r = 0;
				for(var i=0; i<names.length; i++){
					var sn = names[i];
					var so = orders[i];
					var col = getColumnOption(target, sn);
					var sortFunc = col.sorter || function(a,b){
						return a==b ? 0 : (a>b?1:-1);
					};
					r = sortFunc(r1[sn], r2[sn]) * (so=='asc'?1:-1);
					if (r != 0){
						return r;
					}
				}
				return r;
			});
		}
		
		// render datagrid view
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, data.rows);
		}
		opts.view.render.call(opts.view, target, dc.body2, false);
		opts.view.render.call(opts.view, target, dc.body1, true);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		state.ss.clean();
		
//		opts.onLoadSuccess.call(target, data);
		
		var pager = $(target).datagrid('getPager');
		if (pager.length){
			var popts = pager.pagination('options');
			if (popts.total != data.total){
				pager.pagination('refresh',{total:data.total});
				if (opts.pageNumber != popts.pageNumber && popts.pageNumber > 0){
					opts.pageNumber = popts.pageNumber;
					request(target);
				}
			}
		}
		
		fixRowHeight(target);
		dc.body2.triggerHandler('scroll');
		
		$(target).datagrid('setSelectionState');
		$(target).datagrid('autoSizeColumn');
		
		opts.onLoadSuccess.call(target, data);
	}
	
	/**
	 * set row selection that previously selected
	 */
	function setSelectionState(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		dc.header1.add(dc.header2).find('input[type=checkbox]')._propAttr('checked', false);
		if (opts.idField){
			var isTreeGrid = $.data(target, 'treegrid') ? true : false;
			var onSelect = opts.onSelect;
			var onCheck = opts.onCheck;
			opts.onSelect = opts.onCheck = function(){};
			var rows = opts.finder.getRows(target);
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var index = isTreeGrid ? row[opts.idField] : i;
				if (contains(state.selectedRows, row)){
					selectRow(target, index, true);
				}
				if (contains(state.checkedRows, row)){
					checkRow(target, index, true);
				}
			}
			opts.onSelect = onSelect;
			opts.onCheck = onCheck;
		}
		function contains(a,r){
			for(var i=0; i<a.length; i++){
				if (a[i][opts.idField] == r[opts.idField]){
					a[i] = r;
					return true;
				}
			}
			return false;
		}
	}
	
	/**
	 * Return the index of specified row or -1 if not found.
	 * row: id value or row record
	 */
	function getRowIndex(target, row){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		if (typeof row == 'object'){
			return indexOfArray(rows, row);
		} else {
			for(var i=0; i<rows.length; i++){
				if (rows[i][opts.idField] == row){
					return i;
				}
			}
			return -1;
		}
	}
	
	function getSelectedRows(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var data = state.data;
		
		if (opts.idField){
			return state.selectedRows;
		} else {
			var rows = [];
			opts.finder.getTr(target, '', 'selected', 2).each(function(){
				rows.push(opts.finder.getRow(target, $(this)));
			});
			return rows;
		}
	}
	
	function getCheckedRows(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		if (opts.idField){
			return state.checkedRows;
		} else {
			var rows = [];
			opts.finder.getTr(target, '', 'checked', 2).each(function(){
				rows.push(opts.finder.getRow(target, $(this)));
			});
			return rows;
		}
	}
	
	function scrollTo(target, index){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var tr = opts.finder.getTr(target, index);
		if (tr.length){
			if (tr.closest('table').hasClass('datagrid-btable-frozen')){return;}
			var headerHeight = dc.view2.children('div.datagrid-header')._outerHeight();
			var body2 = dc.body2;
			var frozenHeight = body2.outerHeight(true) - body2.outerHeight();
			var top = tr.position().top - headerHeight - frozenHeight;
			if (top < 0){
				body2.scrollTop(body2.scrollTop() + top);
			} else if (top + tr._outerHeight() > body2.height() - 18){
				body2.scrollTop(body2.scrollTop() + top + tr._outerHeight() - body2.height() + 18);
			}
		}
	}
	
	function highlightRow(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		opts.finder.getTr(target, state.highlightIndex).removeClass('datagrid-row-over');
		opts.finder.getTr(target, index).addClass('datagrid-row-over');
		state.highlightIndex = index;
//		scrollTo(target, index);
	}
	
	/**
	 * select a row, the row index start with 0
	 */
	function selectRow(target, index, notCheck){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var row = opts.finder.getRow(target, index);
		
		if (opts.onBeforeSelect.apply(target, getArguments(target, [index, row])) == false){return}
		if (opts.singleSelect){
			unselectAll(target, true);
			state.selectedRows = [];
		}
		if (!notCheck && opts.checkOnSelect){
			checkRow(target, index, true);	// don't select the row again
		}
		
		if (opts.idField){
			addArrayItem(state.selectedRows, opts.idField, row);
		}
		opts.finder.getTr(target, index).addClass('datagrid-row-selected');
		opts.onSelect.apply(target, getArguments(target, [index, row]));
		scrollTo(target, index);
	}
	/**
	 * unselect a row
	 */
	function unselectRow(target, index, notCheck){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var row = opts.finder.getRow(target, index);
		
		if (opts.onBeforeUnselect.apply(target, getArguments(target, [index, row])) == false){return}
		if (!notCheck && opts.checkOnSelect){
			uncheckRow(target, index, true);	// don't unselect the row again
		}
		opts.finder.getTr(target, index).removeClass('datagrid-row-selected');
		if (opts.idField){
			removeArrayItem(state.selectedRows, opts.idField, row[opts.idField]);
		}
		opts.onUnselect.apply(target, getArguments(target, [index, row]));
	}
	/**
	 * select all rows on current page
	 */
	function selectAll(target, notCheck){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = opts.finder.getRows(target);
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (!notCheck && opts.checkOnSelect){
			checkAll(target, true);	// don't select rows again
		}
		opts.finder.getTr(target, '', 'allbody').addClass('datagrid-row-selected');
		if (opts.idField){
			for(var index=0; index<rows.length; index++){
				addArrayItem(selectedRows, opts.idField, rows[index]);
			}
		}
		opts.onSelectAll.call(target, rows);
	}
	/**
	 * unselect all rows on current page
	 */
	function unselectAll(target, notCheck){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = opts.finder.getRows(target);
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (!notCheck && opts.checkOnSelect){
			uncheckAll(target, true);	// don't unselect rows again
		}
		opts.finder.getTr(target, '', 'selected').removeClass('datagrid-row-selected');
		if (opts.idField){
			for(var index=0; index<rows.length; index++){
				removeArrayItem(selectedRows, opts.idField, rows[index][opts.idField]);
			}
		}
		opts.onUnselectAll.call(target, rows);
	}
	
	/**
	 * check a row, the row index start with 0
	 */
	function checkRow(target, index, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var row = opts.finder.getRow(target, index);
		
		if (opts.onBeforeCheck.apply(target, getArguments(target, [index, row])) == false){return}
		if (opts.singleSelect && opts.selectOnCheck){
			uncheckAll(target, true);
			state.checkedRows = [];
		}
		if (!notSelect && opts.selectOnCheck){
			selectRow(target, index, true);	// don't check the row again
		}
		var tr = opts.finder.getTr(target, index).addClass('datagrid-row-checked');
		tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
		tr = opts.finder.getTr(target, '', 'checked', 2);
		if (tr.length == opts.finder.getRows(target).length){
			var dc = state.dc;
			dc.header1.add(dc.header2).find('input[type=checkbox]')._propAttr('checked', true);
		}
		if (opts.idField){
			addArrayItem(state.checkedRows, opts.idField, row);
		}
		opts.onCheck.apply(target, getArguments(target, [index, row]));
	}
	/**
	 * uncheck a row
	 */
	function uncheckRow(target, index, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var row = opts.finder.getRow(target, index);
		
		if (opts.onBeforeUncheck.apply(target, getArguments(target, [index, row])) == false){return}
		if (!notSelect && opts.selectOnCheck){
			unselectRow(target, index, true);	// don't uncheck the row again
		}
		var tr = opts.finder.getTr(target, index).removeClass('datagrid-row-checked');
		tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', false);
		var dc = state.dc;
		var header = dc.header1.add(dc.header2);
		header.find('input[type=checkbox]')._propAttr('checked', false);
		if (opts.idField){
			removeArrayItem(state.checkedRows, opts.idField, row[opts.idField]);
		}
		opts.onUncheck.apply(target, getArguments(target, [index, row]));
	}
	/**
	 * check all checkbox on current page
	 */
	function checkAll(target, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = opts.finder.getRows(target);
		if (!notSelect && opts.selectOnCheck){
			selectAll(target, true);	// don't check rows again
		}
		var dc = state.dc;
		var hck = dc.header1.add(dc.header2).find('input[type=checkbox]');
		var bck = opts.finder.getTr(target, '', 'allbody').addClass('datagrid-row-checked').find('div.datagrid-cell-check input[type=checkbox]');
		hck.add(bck)._propAttr('checked', true);
		if (opts.idField){
			for(var i=0; i<rows.length; i++){
				addArrayItem(state.checkedRows, opts.idField, rows[i]);
			}
		}
		opts.onCheckAll.call(target, rows);
	}
	/**
	 * uncheck all checkbox on current page
	 */
	function uncheckAll(target, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = opts.finder.getRows(target);
		if (!notSelect && opts.selectOnCheck){
			unselectAll(target, true);	// don't uncheck rows again
		}
		var dc = state.dc;
		var hck = dc.header1.add(dc.header2).find('input[type=checkbox]');
		var bck = opts.finder.getTr(target, '', 'checked').removeClass('datagrid-row-checked').find('div.datagrid-cell-check input[type=checkbox]');
//		var bck = opts.finder.getTr(target, '', 'allbody').find('div.datagrid-cell-check input[type=checkbox]');
		hck.add(bck)._propAttr('checked', false);
		if (opts.idField){
			for(var i=0; i<rows.length; i++){
				removeArrayItem(state.checkedRows, opts.idField, rows[i][opts.idField]);
			}
		}
		opts.onUncheckAll.call(target, rows);
	}
	
	
	/**
	 * Begin edit a row
	 */
	function beginEdit(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (tr.hasClass('datagrid-row-editing')) return;
		if (opts.onBeforeEdit.apply(target, getArguments(target, [index, row])) == false){return}
		
		tr.addClass('datagrid-row-editing');
		createEditor(target, index);
		fixEditableSize(target);
		
		tr.find('div.datagrid-editable').each(function(){
			var field = $(this).parent().attr('field');
			var ed = $.data(this, 'datagrid.editor');
			ed.actions.setValue(ed.target, row[field]);
		});
		validateRow(target, index);	// validate the row data
		opts.onBeginEdit.apply(target, getArguments(target, [index, row]));
	}
	
	/**
	 * Stop edit a row.
	 * index: the row index.
	 * cancel: if true, restore the row data.
	 */
	function endEdit(target, index, cancel){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var updatedRows = state.updatedRows;
		var insertedRows = state.insertedRows;
		
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (!tr.hasClass('datagrid-row-editing')) {
			return;
		}
		
		if (!cancel){
			if (!validateRow(target, index)) return;	// invalid row data
			
			var changed = false;
			var changes = {};
			tr.find('div.datagrid-editable').each(function(){
				var field = $(this).parent().attr('field');
				var ed = $.data(this, 'datagrid.editor');
				var t = $(ed.target);
				var input = t.data('textbox') ? t.textbox('textbox') : t;
				input.triggerHandler('blur');
				var value = ed.actions.getValue(ed.target);
				if (row[field] != value){
					row[field] = value;
					changed = true;
					changes[field] = value;
				}
			});
			if (changed){
				if (indexOfArray(insertedRows, row) == -1){
					if (indexOfArray(updatedRows, row) == -1){
						updatedRows.push(row);
					}
				}
			}
			opts.onEndEdit.apply(target, getArguments(target, [index, row, changes]));
		}
		
		tr.removeClass('datagrid-row-editing');
		
		destroyEditor(target, index);
		$(target).datagrid('refreshRow', index);
		
		if (!cancel){
			opts.onAfterEdit.apply(target, getArguments(target, [index, row, changes]));
		} else {
			opts.onCancelEdit.apply(target, getArguments(target, [index, row]));
		}
	}
	
	/**
	 * get the specified row editors
	 */
	function getEditors(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var editors = [];
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				editors.push(ed);
			}
		});
		return editors;
	}
	
	/**
	 * get the cell editor
	 * param contains two parameters: index and field
	 */
	function getEditor(target, param){
		var editors = getEditors(target, param.index!=undefined ? param.index : param.id);
		for(var i=0; i<editors.length; i++){
			if (editors[i].field == param.field){
				return editors[i];
			}
		}
		return null;
	}
	
	/**
	 * create the row editor and adjust the row height.
	 */
	function createEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-cell');
			var field = $(this).attr('field');
			
			var col = getColumnOption(target, field);
			if (col && col.editor){
				// get edit type and options
				var edittype,editoptions;
				if (typeof col.editor == 'string'){
					edittype = col.editor;
				} else {
					edittype = col.editor.type;
					editoptions = col.editor.options;
				}
				
				// get the specified editor
				var editor = opts.editors[edittype];
				if (editor){
					var oldHtml = cell.html();
					var width = cell._outerWidth();
					cell.addClass('datagrid-editable');
					cell._outerWidth(width);
					cell.html('<table border="0" cellspacing="0" cellpadding="1"><tr><td></td></tr></table>');
					cell.children('table').bind('click dblclick contextmenu',function(e){
						e.stopPropagation();
					});
					$.data(cell[0], 'datagrid.editor', {
						actions: editor,
						target: editor.init(cell.find('td'), editoptions),
						field: field,
						type: edittype,
						oldHtml: oldHtml
					});
				}
			}
		});
		fixRowHeight(target, index, true);
	}
	
	/**
	 * destroy the row editor and restore the row height.
	 */
	function destroyEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], 'datagrid.editor');
				
				cell.removeClass('datagrid-editable');
				cell.css('width','');
			}
		});
	}
	
	/**
	 * Validate while editing, if valid return true.
	 */
	function validateRow(target, index){
		var tr = $.data(target, 'datagrid').options.finder.getTr(target, index);
		if (!tr.hasClass('datagrid-row-editing')){
			return true;
		}
		
		var vbox = tr.find('.validatebox-text');
		vbox.validatebox('validate');
		vbox.trigger('mouseleave');
		var invalidbox = tr.find('.validatebox-invalid');
		return invalidbox.length == 0;
	}
	
	/**
	 * Get changed rows, if state parameter is not assigned, return all changed.
	 * state: inserted,deleted,updated
	 */
	function getChanges(target, state){
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		
		if (!state){
			var rows = [];
			rows = rows.concat(insertedRows);
			rows = rows.concat(deletedRows);
			rows = rows.concat(updatedRows);
			return rows;
		} else if (state == 'inserted'){
			return insertedRows;
		} else if (state == 'deleted'){
			return deletedRows;
		} else if (state == 'updated'){
			return updatedRows;
		}
		
		return [];
	}
	
	function deleteRow(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var data = state.data;
		var insertedRows = state.insertedRows;
		var deletedRows = state.deletedRows;
		
		$(target).datagrid('cancelEdit', index);
		
		var row = opts.finder.getRow(target, index);
		if (indexOfArray(insertedRows, row) >= 0){
			removeArrayItem(insertedRows, row);
		} else {
			deletedRows.push(row);
		}
		removeArrayItem(state.selectedRows, opts.idField, row[opts.idField]);
		removeArrayItem(state.checkedRows, opts.idField, row[opts.idField]);
		
		opts.view.deleteRow.call(opts.view, target, index);
		if (opts.height == 'auto'){
			fixRowHeight(target);	// adjust the row height
		}
		$(target).datagrid('getPager').pagination('refresh', {total:data.total});
	}
	
	function insertRow(target, param){
		var data = $.data(target, 'datagrid').data;
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, param.index, param.row);
//		bindRowEvents(target);
		insertedRows.push(param.row);
		$(target).datagrid('getPager').pagination('refresh', {total:data.total});
	}
	
	function appendRow(target, row){
		var data = $.data(target, 'datagrid').data;
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, null, row);
		insertedRows.push(row);
		$(target).datagrid('getPager').pagination('refresh', {total:data.total});
	}
	
	function initChanges(target){
		var state = $.data(target, 'datagrid');
		var data = state.data;
		var rows = data.rows;
		var originalRows = [];
		for(var i=0; i<rows.length; i++){
			originalRows.push($.extend({}, rows[i]));
		}
		state.originalRows = originalRows;
		state.updatedRows = [];
		state.insertedRows = [];
		state.deletedRows = [];
	}
	
	function acceptChanges(target){
		var data = $.data(target, 'datagrid').data;
		var ok = true;
		for(var i=0,len=data.rows.length; i<len; i++){
			if (validateRow(target, i)){
//				endEdit(target, i, false);
				$(target).datagrid('endEdit', i);
			} else {
				ok = false;
			}
		}
		if (ok){
			initChanges(target);
		}
	}
	
	function rejectChanges(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var originalRows = state.originalRows;
		var insertedRows = state.insertedRows;
		var deletedRows = state.deletedRows;
		var selectedRows = state.selectedRows;
		var checkedRows = state.checkedRows;
		var data = state.data;
		
		function getIds(a){
			var ids = [];
			for(var i=0; i<a.length; i++){
				ids.push(a[i][opts.idField]);
			}
			return ids;
		}
		function doSelect(ids, action){
			for(var i=0; i<ids.length; i++){
				var index = getRowIndex(target, ids[i]);
				if (index >= 0){
					(action=='s'?selectRow:checkRow)(target, index, true);
				}
			}
		}
		
		for(var i=0; i<data.rows.length; i++){
//			endEdit(target, i, true);
			$(target).datagrid('cancelEdit', i);
		}
		
		var selectedIds = getIds(selectedRows);
		var checkedIds = getIds(checkedRows);
		selectedRows.splice(0, selectedRows.length);
		checkedRows.splice(0, checkedRows.length);
		
		data.total += deletedRows.length - insertedRows.length;
		data.rows = originalRows;
		loadData(target, data);
		
		doSelect(selectedIds, 's');
		doSelect(checkedIds, 'c');
		
		initChanges(target);
	}
	
	/**
	 * request remote data
	 */
	function request(target, params){
		var opts = $.data(target, 'datagrid').options;
		
		if (params) opts.queryParams = params;
		
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber||1,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		if (opts.onBeforeLoad.call(target, param) == false) return;
		
		$(target).datagrid('loading');
		var result = opts.loader.call(target, param, function(data){
			$(target).datagrid('loaded');
			$(target).datagrid('loadData', data);
		}, function(){
			$(target).datagrid('loaded');
			opts.onLoadError.apply(target, arguments);
		});
		if (result == false){
			$(target).datagrid('loaded');
		}
	}
	
	function mergeCells(target, param){
		var opts = $.data(target, 'datagrid').options;
		
		param.type = param.type || 'body';
		param.rowspan = param.rowspan || 1;
		param.colspan = param.colspan || 1;
		
		if (param.rowspan == 1 && param.colspan == 1){return;}
		
		var tr = opts.finder.getTr(target, (param.index!=undefined ? param.index : param.id), param.type);
		if (!tr.length){return;}
		var td = tr.find('td[field="'+param.field+'"]');
		td.attr('rowspan', param.rowspan).attr('colspan', param.colspan);
		td.addClass('datagrid-td-merged');
		_hidecell(td.next(), param.colspan-1);
		for(var i=1; i<param.rowspan; i++){
			tr = tr.next();
			if (!tr.length){break;}
			td = tr.find('td[field="'+param.field+'"]');
			_hidecell(td, param.colspan);
		}
		
		fixMergedSize(target);
		
		function _hidecell(td, count){
			for(var i=0; i<count; i++){
				td.hide();
				td = td.next();
			}
		}
	}
	
	$.fn.datagrid = function(options, param){
		if (typeof options == 'string'){
			return $.fn.datagrid.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datagrid');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.extend({},$.fn.datagrid.defaults,{queryParams:{}}), $.fn.datagrid.parseOptions(this), options);
				$(this).css('width', '').css('height', '');
				
				var wrapResult = wrapGrid(this, opts.rownumbers);
				if (!opts.columns) opts.columns = wrapResult.columns;
				if (!opts.frozenColumns) opts.frozenColumns = wrapResult.frozenColumns;
				opts.columns = $.extend(true, [], opts.columns);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.view = $.extend({}, opts.view);
				$.data(this, 'datagrid', {
					options: opts,
					panel: wrapResult.panel,
					dc: wrapResult.dc,
					ss: null,
					selectedRows: [],
					checkedRows: [],
					data: {total:0,rows:[]},
					originalRows: [],
					updatedRows: [],
					insertedRows: [],
					deletedRows: []
				});
			}
			
			buildGrid(this);
			bindEvents(this);
			setSize(this);
			
			if (opts.data){
				loadData(this, opts.data);
				initChanges(this);
			} else {
				var data = $.fn.datagrid.parseData(this);
				if (data.total > 0){
					loadData(this, data);
					initChanges(this);
				} else {
					opts.view.renderEmptyRow(this);
				}
			}
			
			request(this);
		});
	};
	
	function getDefaultEditors(names){
		var editors = {};
		$.map(names, function(name){
			editors[name] = getEditorConf(name);
		});
		return editors;
		
		function getEditorConf(name){
			function isA(target){
				return $.data($(target)[0], name) != undefined;
			}
			return {
				init: function(container, options){
					var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
					if (input[name] && name != 'text'){
						return input[name](options);
					} else {
						return input;
					}
				},
				destroy: function(target){
					if (isA(target, name)){
						$(target)[name]('destroy');
					}
				},
				getValue: function(target){
					if (isA(target, name)){
						var opts = $(target)[name]('options');
						if (opts.multiple){
							return $(target)[name]('getValues').join(opts.separator);
						} else {
							return $(target)[name]('getValue');
						}
					} else {
						return $(target).val();
					}
				},
				setValue: function(target, value){
					if (isA(target, name)){
						var opts = $(target)[name]('options');
						if (opts.multiple){
							if (value){
								$(target)[name]('setValues', value.split(opts.separator));
							} else {
								$(target)[name]('clear');
							}
						} else {
							$(target)[name]('setValue', value);
						}
					} else {
						$(target).val(value);
					}
				},
				resize: function(target, width){
					if (isA(target, name)){
						$(target)[name]('resize', width);
					} else {
						$(target)._outerWidth(width)._outerHeight(22);
					}
				}
			}
		}
	}
	
	var editors = $.extend({}, 
			getDefaultEditors([
				'text','textbox','numberbox','numberspinner',
				'combobox','combotree','combogrid','datebox','datetimebox',
				'timespinner','datetimespinner'
			]), {
		textarea: {
			init: function(container, options){
				var input = $('<textarea class="datagrid-editable-input"></textarea>').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				$(target)._outerWidth(width);
			}
		},
		checkbox: {
			init: function(container, options){
				var input = $('<input type="checkbox">').appendTo(container);
				input.val(options.on);
				input.attr('offval', options.off);
				return input;
			},
			getValue: function(target){
				if ($(target).is(':checked')){
					return $(target).val();
				} else {
					return $(target).attr('offval');
				}
			},
			setValue: function(target, value){
				var checked = false;
				if ($(target).val() == value){
					checked = true;
				}
				$(target)._propAttr('checked', checked);
			}
		},
		validatebox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.validatebox(options);
				return input;
			},
			destroy: function(target){
				$(target).validatebox('destroy');
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				$(target)._outerWidth(width)._outerHeight(22);
			}
		}
	});
	
	
	$.fn.datagrid.methods = {
		options: function(jq){
			var gopts = $.data(jq[0], 'datagrid').options;
			var popts = $.data(jq[0], 'datagrid').panel.panel('options');
			var opts = $.extend(gopts, {
				width: popts.width,
				height: popts.height,
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
//			var pager = jq.datagrid('getPager');
//			if (pager.length){
//				var pagerOpts = pager.pagination('options');
//				$.extend(opts, {
//					pageNumber: pagerOpts.pageNumber,
//					pageSize: pagerOpts.pageSize
//				});
//			}
			return opts;
		},
		setSelectionState: function(jq){
			return jq.each(function(){
				setSelectionState(this);
			});
		},
		createStyleSheet: function(jq){
			return createStyleSheet(jq[0]);
		},
		getPanel: function(jq){
			return $.data(jq[0], 'datagrid').panel;
		},
		getPager: function(jq){
			return $.data(jq[0], 'datagrid').panel.children('div.datagrid-pager');
		},
		getColumnFields: function(jq, frozen){
			return getColumnFields(jq[0], frozen);
		},
		getColumnOption: function(jq, field){
			return getColumnOption(jq[0], field);
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		load: function(jq, params){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				if (typeof params == 'string'){
					opts.url = params;
					params = null;
				}
				opts.pageNumber = 1;
				var pager = $(this).datagrid('getPager');
//				pager.pagination({pageNumber:1});
				pager.pagination('refresh', {pageNumber:1});
				request(this, params);
			});
		},
		reload: function(jq, params){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				if (typeof params == 'string'){
					opts.url = params;
					params = null;
				}
				request(this, params);
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				var dc = $.data(this, 'datagrid').dc;
				if (footer){
					$.data(this, 'datagrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, dc.footer2, false);
					opts.view.renderFooter.call(opts.view, this, dc.footer1, true);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).datagrid('fixRowHeight');
				}
			});
		},
		loading: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				$(this).datagrid('getPager').pagination('loading');
				if (opts.loadMsg){
					var panel = $(this).datagrid('getPanel');
					if (!panel.children('div.datagrid-mask').length){
						$('<div class="datagrid-mask" style="display:block"></div>').appendTo(panel);
						var msg = $('<div class="datagrid-mask-msg" style="display:block;left:50%"></div>').html(opts.loadMsg).appendTo(panel);
//						msg.css('marginLeft', -msg.outerWidth()/2);
						msg._outerHeight(40);
						msg.css({
							marginLeft: (-msg.outerWidth()/2),
							lineHeight: (msg.height()+'px')
						});
					}
				}
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				$(this).datagrid('getPager').pagination('loaded');
				var panel = $(this).datagrid('getPanel');
				panel.children('div.datagrid-mask-msg').remove();
				panel.children('div.datagrid-mask').remove();
			});
		},
		fitColumns: function(jq){
			return jq.each(function(){
				fitColumns(this);
			});
		},
		fixColumnSize: function(jq, field){
			return jq.each(function(){
				fixColumnSize(this, field);
			});
		},
		fixRowHeight: function(jq, index){
			return jq.each(function(){
				fixRowHeight(this, index);
			});
		},
		freezeRow: function(jq, index){
			return jq.each(function(){
				freezeRow(this, index);
			});
		},
		autoSizeColumn: function(jq, field){	// adjusts the column width to fit the contents.
			return jq.each(function(){
				autoSizeColumn(this, field);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
				initChanges(this);
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'datagrid').data;
		},
		getRows: function(jq){
			return $.data(jq[0], 'datagrid').data.rows;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'datagrid').footer;
		},
		getRowIndex: function(jq, id){	// id or row record
			return getRowIndex(jq[0], id);
		},
		getChecked: function(jq){
			return getCheckedRows(jq[0]);
		},
		getSelected: function(jq){
			var rows = getSelectedRows(jq[0]);
			return rows.length>0 ? rows[0] : null;
		},
		getSelections: function(jq){
			return getSelectedRows(jq[0]);
		},
		clearSelections: function(jq){
			return jq.each(function(){
				var state = $.data(this, 'datagrid');
				var selectedRows = state.selectedRows;
				var checkedRows = state.checkedRows;
				selectedRows.splice(0, selectedRows.length);
				unselectAll(this);
				if (state.options.checkOnSelect){
					checkedRows.splice(0, checkedRows.length);
				}
			});
		},
		clearChecked: function(jq){
			return jq.each(function(){
				var state = $.data(this, 'datagrid');
				var selectedRows = state.selectedRows;
				var checkedRows = state.checkedRows;
				checkedRows.splice(0, checkedRows.length);
				uncheckAll(this);
				if (state.options.selectOnCheck){
					selectedRows.splice(0, selectedRows.length);
				}
			});
		},
		scrollTo: function(jq, index){
			return jq.each(function(){
				scrollTo(this, index);
			});
		},
		highlightRow: function(jq, index){
			return jq.each(function(){
				highlightRow(this, index);
				scrollTo(this, index);
			});
		},
		selectAll: function(jq){
			return jq.each(function(){
				selectAll(this);
			});
		},
		unselectAll: function(jq){
			return jq.each(function(){
				unselectAll(this);
			});
		},
		selectRow: function(jq, index){
			return jq.each(function(){
				selectRow(this, index);
			});
		},
		selectRecord: function(jq, id){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				if (opts.idField){
					var index = getRowIndex(this, id);
					if (index >= 0){
						$(this).datagrid('selectRow', index);
					}
				}
			});
		},
		unselectRow: function(jq, index){
			return jq.each(function(){
				unselectRow(this, index);
			});
		},
		checkRow: function(jq, index){
			return jq.each(function(){
				checkRow(this, index);
			});
		},
		uncheckRow: function(jq, index){
			return jq.each(function(){
				uncheckRow(this, index);
			});
		},
		checkAll: function(jq){
			return jq.each(function(){
				checkAll(this);
			});
		},
		uncheckAll: function(jq){
			return jq.each(function(){
				uncheckAll(this);
			});
		},
		beginEdit: function(jq, index){
			return jq.each(function(){
				beginEdit(this, index);
			});
		},
		endEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, false);
			});
		},
		cancelEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, true);
			});
		},
		getEditors: function(jq, index){
			return getEditors(jq[0], index);
		},
		getEditor: function(jq, param){	// param: {index:0, field:'name'}
			return getEditor(jq[0], param);
		},
		refreshRow: function(jq, index){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.refreshRow.call(opts.view, this, index);
			});
		},
		validateRow: function(jq, index){
			return validateRow(jq[0], index);
		},
		updateRow: function(jq, param){	// param: {index:1,row:{code:'code1',name:'name1'}}
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.updateRow.call(opts.view, this, param.index, param.row);
			});
		},
		appendRow: function(jq, row){
			return jq.each(function(){
				appendRow(this, row);
			});
		},
		insertRow: function(jq, param){
			return jq.each(function(){
				insertRow(this, param);
			});
		},
		deleteRow: function(jq, index){
			return jq.each(function(){
				deleteRow(this, index);
			});
		},
		getChanges: function(jq, state){
			return getChanges(jq[0], state);	// state: inserted,deleted,updated
		},
		acceptChanges: function(jq){
			return jq.each(function(){
				acceptChanges(this);
			});
		},
		rejectChanges: function(jq){
			return jq.each(function(){
				rejectChanges(this);
			});
		},
		mergeCells: function(jq, param){
			return jq.each(function(){
				mergeCells(this, param);
			});
		},
		showColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').show();
				$(this).datagrid('getColumnOption', field).hidden = false;
				$(this).datagrid('fitColumns');
			});
		},
		hideColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').hide();
				$(this).datagrid('getColumnOption', field).hidden = true;
				$(this).datagrid('fitColumns');
			});
		},
		sort: function(jq, param){
			return jq.each(function(){
				sortGrid(this, param);
			});
		}
	};
	
	$.fn.datagrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			'url','toolbar','idField','sortName','sortOrder','pagePosition','resizeHandle',
			{sharedStyleSheet:'boolean',fitColumns:'boolean',autoRowHeight:'boolean',striped:'boolean',nowrap:'boolean'},
			{rownumbers:'boolean',singleSelect:'boolean',ctrlSelect:'boolean',checkOnSelect:'boolean',selectOnCheck:'boolean'},
			{pagination:'boolean',pageSize:'number',pageNumber:'number'},
			{multiSort:'boolean',remoteSort:'boolean',showHeader:'boolean',showFooter:'boolean'},
			{scrollbarSize:'number'}
		]), {
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined),
			loadMsg: (t.attr('loadMsg')!=undefined ? t.attr('loadMsg') : undefined),
			rowStyler: (t.attr('rowStyler') ? eval(t.attr('rowStyler')) : undefined)
		});
	};
	
	$.fn.datagrid.parseData = function(target){
		var t = $(target);
		var data = {
			total:0,
			rows:[]
		};
		var fields = t.datagrid('getColumnFields',true).concat(t.datagrid('getColumnFields',false));
		t.find('tbody tr').each(function(){
			data.total++;
			var row = {};
			$.extend(row, $.parser.parseOptions(this,['iconCls','state']));
			for(var i=0; i<fields.length; i++){
				row[fields[i]] = $(this).find('td:eq('+i+')').html();
			}
			data.rows.push(row);
		});
		return data;
	};
	
	var defaultView = {
		render: function(target, container, frozen){
			var rows = $(target).datagrid('getRows');
			$(container).html(this.renderTable(target, 0, rows, frozen));
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			var table = ['<table class="datagrid-ftable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				table.push('<tr class="datagrid-row" datagrid-row-index="' + i + '">');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},

		renderTable: function(target, index, rows, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;

			if (frozen){
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
					return '';
				}
			}
			
			var fields = $(target).datagrid('getColumnFields', frozen);
			var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				// get the class and style attributes for this row
				var css = opts.rowStyler ? opts.rowStyler.call(target, index, row) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				
				var cls = 'class="datagrid-row ' + (index % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
				table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, index, row));
				table.push('</tr>');

				index++;
			}
			table.push('</tbody></table>');
			return table.join('');
		},
		
		renderRow: function(target, fields, frozen, rowIndex, rowData){
			var opts = $.data(target, 'datagrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				var rownumber = rowIndex + 1;
				if (opts.pagination){
					rownumber += (opts.pageNumber-1)*opts.pageSize;
				}
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var value = rowData[field];	// the field value
					var css = col.styler ? (col.styler(value, rowData, rowIndex)||'') : '';
					var classValue = '';
					var styleValue = '';
					if (typeof css == 'string'){
						styleValue = css;
					} else if (css){
						classValue = css['class'] || '';
						styleValue = css['style'] || '';
					}
					var cls = classValue ? 'class="' + classValue + '"' : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + cls + ' ' + style + '>');
					
					var style = '';
					if (!col.checkbox){
						if (col.align){style += 'text-align:' + col.align + ';'}
						if (!opts.nowrap){
							style += 'white-space:normal;height:auto;';
						} else if (opts.autoRowHeight){
							style += 'height:auto;';
						}
					}
					
					cc.push('<div style="' + style + '" ');
					cc.push(col.checkbox ? 'class="datagrid-cell-check"' : 'class="datagrid-cell ' + col.cellClass + '"');
					cc.push('>');
					
					if (col.checkbox){
						cc.push('<input type="checkbox" ' + (rowData.checked ? 'checked="checked"' : ''));
						cc.push(' name="' + field + '" value="' + (value!=undefined ? value : '') + '">');
					} else if (col.formatter){
						cc.push(col.formatter(value, rowData, rowIndex));
					} else {
						cc.push(value);
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, rowIndex){
			this.updateRow.call(this, target, rowIndex, {});
		},
		
		updateRow: function(target, rowIndex, row){
			var opts = $.data(target, 'datagrid').options;
			var rows = $(target).datagrid('getRows');
			
			var oldStyle = _getRowStyle(rowIndex);
			$.extend(rows[rowIndex], row);
			var newStyle = _getRowStyle(rowIndex);
			var oldClassValue = oldStyle.c;
			var styleValue = newStyle.s;
			var classValue = 'datagrid-row ' + (rowIndex % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + newStyle.c;
			
			function _getRowStyle(rowIndex){
				var css = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				return {c:classValue, s:styleValue};
			}
			function _update(frozen){
				var fields = $(target).datagrid('getColumnFields', frozen);
				var tr = opts.finder.getTr(target, rowIndex, 'body', (frozen?1:2));
				var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
				tr.html(this.renderRow.call(this, target, fields, frozen, rowIndex, rows[rowIndex]));
				tr.attr('style', styleValue).removeClass(oldClassValue).addClass(classValue);
				if (checked){
					tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
				}
			}
			
			_update.call(this, true);
			_update.call(this, false);
			$(target).datagrid('fixRowHeight', rowIndex);
		},
		
		insertRow: function(target, index, row){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var data = state.data;
			
			if (index == undefined || index == null) index = data.rows.length;
			if (index > data.rows.length) index = data.rows.length;
			
			function _incIndex(frozen){
				var serno = frozen?1:2;
				for(var i=data.rows.length-1; i>=index; i--){
					var tr = opts.finder.getTr(target, i, 'body', serno);
					tr.attr('datagrid-row-index', i+1);
					tr.attr('id', state.rowIdPrefix + '-' + serno + '-' + (i+1));
					if (frozen && opts.rownumbers){
						var rownumber = i+2;
						if (opts.pagination){
							rownumber += (opts.pageNumber-1)*opts.pageSize;
						}
						tr.find('div.datagrid-cell-rownumber').html(rownumber);
					}
					if (opts.striped){
						tr.removeClass('datagrid-row-alt').addClass((i+1)%2 ? 'datagrid-row-alt' : '');
					}
				}
			}
			
			function _insert(frozen){
				var serno = frozen?1:2;
				var fields = $(target).datagrid('getColumnFields', frozen);
				var rowId = state.rowIdPrefix + '-' + serno + '-' + index;
				var tr = '<tr id="' + rowId + '" class="datagrid-row" datagrid-row-index="' + index + '"></tr>';
//				var tr = '<tr id="' + rowId + '" class="datagrid-row" datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields, frozen, index, row) + '</tr>';
				if (index >= data.rows.length){	// append new row
					if (data.rows.length){	// not empty
						opts.finder.getTr(target, '', 'last', serno).after(tr);
					} else {
						var cc = frozen ? dc.body1 : dc.body2;
						cc.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr + '</tbody></table>');
					}
				} else {	// insert new row
					opts.finder.getTr(target, index+1, 'body', serno).before(tr);
				}
			}
			
			_incIndex.call(this, true);
			_incIndex.call(this, false);
			_insert.call(this, true);
			_insert.call(this, false);
			
			data.total += 1;
			data.rows.splice(index, 0, row);
			
			this.refreshRow.call(this, target, index);
		},
		
		deleteRow: function(target, index){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var data = state.data;
			
			function _decIndex(frozen){
				var serno = frozen?1:2;
				for(var i=index+1; i<data.rows.length; i++){
					var tr = opts.finder.getTr(target, i, 'body', serno);
					tr.attr('datagrid-row-index', i-1);
					tr.attr('id', state.rowIdPrefix + '-' + serno + '-' + (i-1));
					if (frozen && opts.rownumbers){
						var rownumber = i;
						if (opts.pagination){
							rownumber += (opts.pageNumber-1)*opts.pageSize;
						}
						tr.find('div.datagrid-cell-rownumber').html(rownumber);
					}
					if (opts.striped){
						tr.removeClass('datagrid-row-alt').addClass((i-1)%2 ? 'datagrid-row-alt' : '');
					}
				}
			}
			
			opts.finder.getTr(target, index).remove();
			_decIndex.call(this, true);
			_decIndex.call(this, false);
			
			data.total -= 1;
			data.rows.splice(index,1);
		},
		
		onBeforeRender: function(target, rows){},
		onAfterRender: function(target){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			if (opts.showFooter){
				var footer = $(target).datagrid('getPanel').find('div.datagrid-footer');
				footer.find('div.datagrid-cell-rownumber,div.datagrid-cell-check').css('visibility', 'hidden');
			}
			if (opts.finder.getRows(target).length == 0){
				this.renderEmptyRow(target);
			}
		},
		renderEmptyRow: function(target){
        	var dc = $.data(target, 'datagrid').dc;
        	dc.body2.html(this.renderTable(target, 0, [{}], false));
        	dc.body2.find('.datagrid-row').removeClass('datagrid-row').removeAttr('datagrid-row-index');
        	dc.body2.find('tbody *').css({
        		height: 1,
        		borderColor: 'transparent',
        		background: 'transparent'
        	});
		}
	};
	
	$.fn.datagrid.defaults = $.extend({}, $.fn.panel.defaults, {
		sharedStyleSheet: false,
		frozenColumns: undefined,
		columns: undefined,
		fitColumns: false,
		resizeHandle: 'right',	// left,right,both
		autoRowHeight: true,
		toolbar: null,
		striped: false,
		method: 'get',  //post edit get
		nowrap: true,
		idField: null,
		url: null,
		data: null,
		loadMsg: 'Processing, please wait ...',
		rownumbers: false,
		singleSelect: false,
		ctrlSelect: false,	// only allows multi-selection when ctrl+click is used
		selectOnCheck: true,
		checkOnSelect: true,
		pagination: false,
		pagePosition: 'bottom',	// top,bottom,both
		pageNumber: 1,
		pageSize: 10,
		pageList: [10,20,30,40,50],
		queryParams: {},
		sortName: null,
		sortOrder: 'asc',
		multiSort: false,
		remoteSort: true,
		showHeader: true,
		showFooter: false,
		scrollbarSize: 18,
		rowEvents: {
			mouseover: hoverEventHandler(true),
			mouseout: hoverEventHandler(false),
			click: clickEventHandler,
			dblclick: dblclickEventHandler,
			contextmenu: contextmenuEventHandler
		},
		rowStyler: function(rowIndex, rowData){},	// return style such as 'background:red'
		loader: function(param, success, error){
			var opts = $(this).datagrid('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data){
			if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
				return {
					total: data.length,
					rows: data
				};
			} else {
				return data;
			}
		},
		
		editors: editors,
		finder:{
			getTr:function(target, index, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var state = $.data(target, 'datagrid');
				var dc = state.dc;	// data container
				var opts = state.options;
				if (serno == 0){
					var tr1 = opts.finder.getTr(target, index, type, 1);
					var tr2 = opts.finder.getTr(target, index, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						var tr = $('#' + state.rowIdPrefix + '-' + serno + '-' + index);
						if (!tr.length){
							tr = (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index='+index+']');
						}
						return tr;
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index='+index+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-selected');
					} else if (type == 'highlight'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-over');
					} else if (type == 'checked'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-checked');
//						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row:has(div.datagrid-cell-check input:checked)');
					} else if (type == 'editing'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-editing');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index]:last');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index]');
					}
				}
			},
			getRow:function(target, p){	// p can be row index or tr object
				var index = (typeof p == 'object') ? p.attr('datagrid-row-index') : p;
				return $.data(target, 'datagrid').data.rows[parseInt(index)];
			},
			getRows:function(target){
				return $(target).datagrid('getRows');
			}
		},
		view: defaultView,
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onClickRow: function(rowIndex, rowData){},
		onDblClickRow: function(rowIndex, rowData){},
		onClickCell: function(rowIndex, field, value){},
		onDblClickCell: function(rowIndex, field, value){},
		onBeforeSortColumn: function(sort, order){},
		onSortColumn: function(sort, order){},
		onResizeColumn: function(field, width){},
		onBeforeSelect: function(rowIndex, rowData){},
		onSelect: function(rowIndex, rowData){},
		onBeforeUnselect: function(rowIndex, rowData){},
		onUnselect: function(rowIndex, rowData){},
		onSelectAll: function(rows){},
		onUnselectAll: function(rows){},
		onBeforeCheck: function(rowIndex, rowData){},
		onCheck: function(rowIndex, rowData){},
		onBeforeUncheck: function(rowIndex, rowData){},
		onUncheck: function(rowIndex, rowData){},
		onCheckAll: function(rows){},
		onUncheckAll: function(rows){},
		onBeforeEdit: function(rowIndex, rowData){},
		onBeginEdit: function(rowIndex, rowData){},
		onEndEdit: function(rowIndex, rowData, changes){},
		onAfterEdit: function(rowIndex, rowData, changes){},
		onCancelEdit: function(rowIndex, rowData){},
		onHeaderContextMenu: function(e, field){},
		onRowContextMenu: function(e, rowIndex, rowData){}
	});
})(jQuery);
/**
 * propertygrid - jQuery EasyUI
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	var currTarget;
	$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
		var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
		if (p.length){return;}
		stopEditing(currTarget);
		currTarget = undefined;
	});
	
	function buildGrid(target){
		var state = $.data(target, 'propertygrid');
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			cls:'propertygrid',
			view:(opts.showGroup ? opts.groupView : opts.view),
			onBeforeEdit:function(index, row){
				if (opts.onBeforeEdit.call(target, index, row) == false){return false;}
				var dg = $(this);
				var row = dg.datagrid('getRows')[index];
				var col = dg.datagrid('getColumnOption', 'value');
				col.editor = row.editor;
			},
			onClickCell:function(index, field, value){
				if (currTarget != this){
					stopEditing(currTarget);
					currTarget = this;
				}
				if (opts.editIndex != index){
					stopEditing(currTarget);
					$(this).datagrid('beginEdit', index);
					var ed = $(this).datagrid('getEditor', {index:index,field:field});
					if (!ed){
						ed = $(this).datagrid('getEditor', {index:index,field:'value'});
					}
					if (ed){
						var t = $(ed.target);
						var input = t.data('textbox') ? t.textbox('textbox') : t;
						input.focus();
						opts.editIndex = index;
					}
				}
				opts.onClickCell.call(target, index, field, value);
			},
			loadFilter:function(data){
				stopEditing(this);
				return opts.loadFilter.call(this, data);
			}
		}));
	}
	
	function stopEditing(target){
		var t = $(target);
		if (!t.length){return}
		var opts = $.data(target, 'propertygrid').options;
		opts.finder.getTr(target, null, 'editing').each(function(){
			var index = parseInt($(this).attr('datagrid-row-index'));
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		});
		opts.editIndex = undefined;
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.columns = $.extend(true, [], opts.columns);
				$.data(this, 'propertygrid', {
					options: opts
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'propertygrid').options;
		}
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,[{showGroup:'boolean'}]));
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var table = [];
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				table.push(this.renderGroup.call(this, target, i, groups[i], frozen));
			}
			$(container).html(table.join(''));
		},
		
		renderGroup: function(target, groupIndex, group, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			table.push('<div class="datagrid-group" group-index=' + groupIndex + '>');
			table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
			table.push('<tr>');
			if ((frozen && (opts.rownumbers || opts.frozenColumns.length)) ||
					(!frozen && !(opts.rownumbers || opts.frozenColumns.length))){
				table.push('<td style="border:0;text-align:center;width:25px"><span class="datagrid-row-expander datagrid-row-collapse" style="display:inline-block;width:16px;height:16px;cursor:pointer">&nbsp;</span></td>');
			}
			table.push('<td style="border:0;">');
			if (!frozen){
				table.push('<span class="datagrid-group-title">');
				table.push(opts.groupFormatter.call(target, group.value, group.rows));
				table.push('</span>');
			}
			table.push('</td>');
			table.push('</tr>');
			table.push('</tbody></table>');
			table.push('</div>');
			
			table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
			var index = group.startIndex;
			for(var j=0; j<group.rows.length; j++) {
				var css = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				
				var cls = 'class="datagrid-row ' + (index % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
				table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
				table.push('</tr>');
				index++;
			}
			table.push('</tbody></table>');
			return table.join('');
		},
		
		bindEvents: function(target){
			var state = $.data(target, 'datagrid');
			var dc = state.dc;
			var body = dc.body1.add(dc.body2);
			var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
			body.unbind('click').bind('click', function(e){
				var tt = $(e.target);
				var expander = tt.closest('span.datagrid-row-expander');
				if (expander.length){
					var gindex = expander.closest('div.datagrid-group').attr('group-index');
					if (expander.hasClass('datagrid-row-collapse')){
						$(target).datagrid('collapseGroup', gindex);
					} else {
						$(target).datagrid('expandGroup', gindex);
					}
				} else {
					clickHandler(e);
				}
				e.stopPropagation();
			});
		},
		
		onBeforeRender: function(target, rows){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			
			initCss();
			
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						value: row[opts.groupField],
						rows: [row]
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			var index = 0;
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				group.startIndex = index;
				index += group.rows.length;
				newRows = newRows.concat(group.rows);
			}
			
			state.data.rows = newRows;
			this.groups = groups;
			
			var that = this;
			setTimeout(function(){
				that.bindEvents(target);
			},0);
			
			function getGroup(value){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.value == value){
						return group;
					}
				}
				return null;
			}
			function initCss(){
				if (!$('#datagrid-group-style').length){
					$('head').append(
						'<style id="datagrid-group-style">' +
						'.datagrid-group{height:25px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}' +
						'</style>'
					);
				}
			}
		}
	});

	$.extend($.fn.datagrid.methods, {
	    expandGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-expand')){
	                expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
	                group.next('table').show();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    },
	    collapseGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-collapse')){
	                expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
	                group.next('table').hide();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    }
	});

	$.extend(groupview, {
		refreshGroupTitle: function(target, groupIndex){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var group = this.groups[groupIndex];
			var span = dc.body2.children('div.datagrid-group[group-index=' + groupIndex + ']').find('span.datagrid-group-title');
			span.html(opts.groupFormatter.call(target, group.value, group.rows));
		},
		
		insertRow: function(target, index, row){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var group = null;
			var groupIndex;
			
			for(var i=0; i<this.groups.length; i++){
				if (this.groups[i].value == row[opts.groupField]){
					group = this.groups[i];
					groupIndex = i;
					break;
				}
			}
			if (group){
				if (index == undefined || index == null){
					index = state.data.rows.length;
				}
				if (index < group.startIndex){
					index = group.startIndex;
				} else if (index > group.startIndex + group.rows.length){
					index = group.startIndex + group.rows.length;
				}
				$.fn.datagrid.defaults.view.insertRow.call(this, target, index, row);
				
				if (index >= group.startIndex + group.rows.length){
					_moveTr(index, true);
					_moveTr(index, false);
				}
				group.rows.splice(index - group.startIndex, 0, row);
			} else {
				group = {
					value: row[opts.groupField],
					rows: [row],
					startIndex: state.data.rows.length
				}
				groupIndex = this.groups.length;
				dc.body1.append(this.renderGroup.call(this, target, groupIndex, group, true));
				dc.body2.append(this.renderGroup.call(this, target, groupIndex, group, false));
				this.groups.push(group);
				state.data.rows.push(row);
			}
			
			this.refreshGroupTitle(target, groupIndex);
			
			function _moveTr(index,frozen){
				var serno = frozen?1:2;
				var prevTr = opts.finder.getTr(target, index-1, 'body', serno);
				var tr = opts.finder.getTr(target, index, 'body', serno);
				tr.insertAfter(prevTr);
			}
		},
		
		updateRow: function(target, index, row){
			var opts = $.data(target, 'datagrid').options;
			$.fn.datagrid.defaults.view.updateRow.call(this, target, index, row);
			var tb = opts.finder.getTr(target, index, 'body', 2).closest('table.datagrid-btable');
			var groupIndex = parseInt(tb.prev().attr('group-index'));
			this.refreshGroupTitle(target, groupIndex);
		},
		
		deleteRow: function(target, index){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var body = dc.body1.add(dc.body2);
			
			var tb = opts.finder.getTr(target, index, 'body', 2).closest('table.datagrid-btable');
			var groupIndex = parseInt(tb.prev().attr('group-index'));
			
			$.fn.datagrid.defaults.view.deleteRow.call(this, target, index);
			
			var group = this.groups[groupIndex];
			if (group.rows.length > 1){
				group.rows.splice(index-group.startIndex, 1);
				this.refreshGroupTitle(target, groupIndex);
			} else {
				body.children('div.datagrid-group[group-index='+groupIndex+']').remove();
				for(var i=groupIndex+1; i<this.groups.length; i++){
					body.children('div.datagrid-group[group-index='+i+']').attr('group-index', i-1);
				}
				this.groups.splice(groupIndex, 1);
			}
			
			var index = 0;
			for(var i=0; i<this.groups.length; i++){
				var group = this.groups[i];
				group.startIndex = index;
				index += group.rows.length;
			}
		}
	});

	// end of group view definition
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupView:groupview,
		groupField:'group',
		groupFormatter:function(fvalue,rows){return fvalue}
	});
})(jQuery);
/**
 * treegrid - jQuery EasyUI
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	
	function buildGrid(target){
		var state = $.data(target, 'treegrid')
		var opts = state.options;
		$(target).datagrid($.extend({}, opts, {
			url: null,
			data: null,
			loader: function(){
				return false;
			},
			onBeforeLoad: function(){return false},
			onLoadSuccess: function(){},
			onResizeColumn: function(field, width){
				setRowHeight(target);
				opts.onResizeColumn.call(target, field, width);
			},
			onBeforeSortColumn: function(sort,order){
				if (opts.onBeforeSortColumn.call(target,sort,order) == false){return false}
			},
			onSortColumn: function(sort,order){
				opts.sortName = sort;
				opts.sortOrder = order;
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $(target).treegrid('getData');
					loadData(target, 0, data);
				}
				opts.onSortColumn.call(target, sort, order);
			},
			onClickCell:function(index,field){
				opts.onClickCell.call(target, field, find(target, index));
			},
			onDblClickCell:function(index,field){
				opts.onDblClickCell.call(target, field, find(target, index));
			},
			onRowContextMenu:function(e,index){
				opts.onContextMenu.call(target, e, find(target, index));
			}
		}));
		var dgOpts = $.data(target, 'datagrid').options;
		opts.columns = dgOpts.columns;
		opts.frozenColumns = dgOpts.frozenColumns;
		state.dc = $.data(target, 'datagrid').dc;
		if (opts.pagination){
			var pager = $(target).datagrid('getPager');
			pager.pagination({
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
	}
	
	function setRowHeight(target, idValue){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		if (!dc.body1.is(':empty') && (!opts.nowrap || opts.autoRowHeight)){
			if (idValue != undefined){
				var children = getChildren(target, idValue);
				for(var i=0; i<children.length; i++){
					setHeight(children[i][opts.idField]);
				}
			}
		}
		$(target).datagrid('fixRowHeight', idValue);
		
		function setHeight(idValue){
			var tr1 = opts.finder.getTr(target, idValue, 'body', 1);
			var tr2 = opts.finder.getTr(target, idValue, 'body', 2);
			tr1.css('height', '');
			tr2.css('height', '');
			var height = Math.max(tr1.height(), tr2.height());
			tr1.css('height', height);
			tr2.css('height', height);
		}
	}
	
	function setRowNumbers(target){
		var dc = $.data(target, 'datagrid').dc;
		var opts = $.data(target, 'treegrid').options;
		if (!opts.rownumbers) return;
		dc.body1.find('div.datagrid-cell-rownumber').each(function(i){
			$(this).html(i+1);
		});
	}
	
	function hoverEventHandler(isOver){
		return function(e){
			$.fn.datagrid.defaults.rowEvents[isOver ? 'mouseover' : 'mouseout'](e);
			var tt = $(e.target);
			var fn = isOver ? 'addClass' : 'removeClass';
			if (tt.hasClass('tree-hit')){
				tt.hasClass('tree-expanded') ? tt[fn]('tree-expanded-hover') : tt[fn]('tree-collapsed-hover');
			}
		}
	}
	function clickEventHandler(e){
		var tt = $(e.target);
		if (tt.hasClass('tree-hit')){
			var tr = tt.closest('tr.datagrid-row');
			var target = tr.closest('div.datagrid-view').children('.datagrid-f')[0];
			toggle(target, tr.attr('node-id'));
		} else {
			$.fn.datagrid.defaults.rowEvents.click(e);
		}
	}
	
	/**
	 * create sub tree
	 * parentId: the node id value
	 */
	function createSubTree(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var tr1 = opts.finder.getTr(target, parentId, 'body', 1);
		var tr2 = opts.finder.getTr(target, parentId, 'body', 2);
		var colspan1 = $(target).datagrid('getColumnFields', true).length + (opts.rownumbers?1:0);
		var colspan2 = $(target).datagrid('getColumnFields', false).length;

		_create(tr1, colspan1);
		_create(tr2, colspan2);
		
		function _create(tr, colspan){
			$('<tr class="treegrid-tr-tree">' +
					'<td style="border:0px" colspan="' + colspan + '">' +
					'<div></div>' +
					'</td>' +
				'</tr>').insertAfter(tr);
		}
	}
	
	/**
	 * load data to specified node.
	 */
	function loadData(target, parentId, data, append){
		var state = $.data(target, 'treegrid');
		var opts = state.options;
		var dc = state.dc;
		data = opts.loadFilter.call(target, data, parentId);
		
		var node = find(target, parentId);
		if (node){
			var node1 = opts.finder.getTr(target, parentId, 'body', 1);
			var node2 = opts.finder.getTr(target, parentId, 'body', 2);
			var cc1 = node1.next('tr.treegrid-tr-tree').children('td').children('div');
			var cc2 = node2.next('tr.treegrid-tr-tree').children('td').children('div');
			if (!append){node.children = [];}
		} else {
			var cc1 = dc.body1;
			var cc2 = dc.body2;
			if (!append){state.data = [];}
		}
		if (!append){
//			state.data = [];
			cc1.empty();
			cc2.empty();
		}
		
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, parentId, data);
		}
		opts.view.render.call(opts.view, target, cc1, true);
		opts.view.render.call(opts.view, target, cc2, false);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
//		opts.onLoadSuccess.call(target, node, data);
		
		// reset the pagination
		if (!parentId && opts.pagination){
			var total = $.data(target, 'treegrid').total;
			var pager = $(target).datagrid('getPager');
			if (pager.pagination('options').total != total){
				pager.pagination({total:total});
			}
		}
		
		setRowHeight(target);
		setRowNumbers(target);
		$(target).treegrid('showLines');
		$(target).treegrid('setSelectionState');
		$(target).treegrid('autoSizeColumn');
		
		opts.onLoadSuccess.call(target, node, data);
	}
	
	function request(target, parentId, params, append, callback){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		
		if (params) opts.queryParams = params;
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		var row = find(target, parentId);
		
		if (opts.onBeforeLoad.call(target, row, param) == false) return;
//		if (!opts.url) return;
		
		var folder = body.find('tr[node-id="' + parentId + '"] span.tree-folder');
		folder.addClass('tree-loading');
		$(target).treegrid('loading');
		var result = opts.loader.call(target, param, function(data){
			folder.removeClass('tree-loading');
			$(target).treegrid('loaded');
			loadData(target, parentId, data, append);
			if (callback) {
				callback();
			}
		}, function(){
			folder.removeClass('tree-loading');
			$(target).treegrid('loaded');
			opts.onLoadError.apply(target, arguments);
			if (callback){
				callback();
			}
		});
		if (result == false){
			folder.removeClass('tree-loading');
			$(target).treegrid('loaded');
		}
	}
	
	function getRoot(target){
		var rows = getRoots(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getRoots(target){
		return $.data(target, 'treegrid').data;
	}
	
	function getParent(target, idValue){
		var row = find(target, idValue);
		if (row._parentId){
			return find(target, row._parentId);
		} else {
			return null;
		}
	}
	
	function getChildren(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-view2 div.datagrid-body');
		var nodes = [];
		if (parentId){
			getNodes(parentId);
		} else {
			var roots = getRoots(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes(roots[i][opts.idField]);
			}
		}
		
		function getNodes(parentId){
			var pnode = find(target, parentId);
			if (pnode && pnode.children){
				for(var i=0,len=pnode.children.length; i<len; i++){
					var cnode = pnode.children[i];
					nodes.push(cnode);
					getNodes(cnode[opts.idField]);
				}
			}
		}
		
		return nodes;
	}
	
//	function getSelected(target){
//		var rows = getSelections(target);
//		if (rows.length){
//			return rows[0];
//		} else {
//			return null;
//		}
//	}
//	
//	function getSelections(target){
//		var rows = [];
//		var panel = $(target).datagrid('getPanel');
//		panel.find('div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected').each(function(){
//			var id = $(this).attr('node-id');
//			rows.push(find(target, id));
//		});
//		return rows;
//	}
	
	function getLevel(target, idValue){
		if (!idValue) return 0;
		var opts = $.data(target, 'treegrid').options;
		var view = $(target).datagrid('getPanel').children('div.datagrid-view');
		var node = view.find('div.datagrid-body tr[node-id="' + idValue + '"]').children('td[field="' + opts.treeField + '"]');
		return node.find('span.tree-indent,span.tree-hit').length;
	}
	
	function find(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var data = $.data(target, 'treegrid').data;
		var cc = [data];
		while(cc.length){
			var c = cc.shift();
			for(var i=0; i<c.length; i++){
				var node = c[i];
				if (node[opts.idField] == idValue){
					return node;
				} else if (node['children']){
					cc.push(node['children']);
				}
			}
		}
		return null;
	}
	
	function collapse(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var row = find(target, idValue);
		var tr = opts.finder.getTr(target, idValue);
		var hit = tr.find('span.tree-hit');
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		if (opts.onBeforeCollapse.call(target, row) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		row.state = 'closed';
		tr = tr.next('tr.treegrid-tr-tree');
		var cc = tr.children('td').children('div');
		if (opts.animate){
			cc.slideUp('normal', function(){
				$(target).treegrid('autoSizeColumn');
				setRowHeight(target, idValue);
				opts.onCollapse.call(target, row);
			});
		} else {
			cc.hide();
			$(target).treegrid('autoSizeColumn');
			setRowHeight(target, idValue);
			opts.onCollapse.call(target, row);
		}
	}
	
	function expand(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var tr = opts.finder.getTr(target, idValue);
		var hit = tr.find('span.tree-hit');
		var row = find(target, idValue);
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		if (opts.onBeforeExpand.call(target, row) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var subtree = tr.next('tr.treegrid-tr-tree');
		if (subtree.length){
			var cc = subtree.children('td').children('div');
			_expand(cc);
		} else {
			createSubTree(target, row[opts.idField]);
			var subtree = tr.next('tr.treegrid-tr-tree');
			var cc = subtree.children('td').children('div');
			cc.hide();
			
//			var params = opts.queryParams || {};
			var params = $.extend({}, opts.queryParams || {});
			params.id = row[opts.idField];
			request(target, row[opts.idField], params, true, function(){
				if (cc.is(':empty')){
					subtree.remove();
				} else {
					_expand(cc);
				}
			});
		}
		
		function _expand(cc){
			row.state = 'open';
			if (opts.animate){
				cc.slideDown('normal', function(){
					$(target).treegrid('autoSizeColumn');
					setRowHeight(target, idValue);
					opts.onExpand.call(target, row);
				});
			} else {
				cc.show();
				$(target).treegrid('autoSizeColumn');
				setRowHeight(target, idValue);
				opts.onExpand.call(target, row);
			}
		}
	}
	
	function toggle(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var tr = opts.finder.getTr(target, idValue);
		var hit = tr.find('span.tree-hit');
		if (hit.hasClass('tree-expanded')){
			collapse(target, idValue);
		} else {
			expand(target, idValue);
		}
	}
	
	function collapseAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			collapse(target, nodes[i][opts.idField]);
		}
	}
	
	function expandAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			expand(target, nodes[i][opts.idField]);
		}
	}
	
	function expandTo(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var ids = [];
		var p = getParent(target, idValue);
		while(p){
			var id = p[opts.idField];
			ids.unshift(id);
			p = getParent(target, id);
		}
		for(var i=0; i<ids.length; i++){
			expand(target, ids[i]);
		}
	}
	
	function append(target, param){
		var opts = $.data(target, 'treegrid').options;
		if (param.parent){
			var tr = opts.finder.getTr(target, param.parent);
			if (tr.next('tr.treegrid-tr-tree').length == 0){
				createSubTree(target, param.parent);
			}
			var cell = tr.children('td[field="' + opts.treeField + '"]').children('div.datagrid-cell');
			var nodeIcon = cell.children('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder tree-folder-open');
//				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		loadData(target, param.parent, param.data, true);
	}
	
	function insert(target, param){
		var ref = param.before || param.after;
		var opts = $.data(target, 'treegrid').options;
		var pnode = getParent(target, ref);
		append(target, {
			parent: (pnode?pnode[opts.idField]:null),
			data: [param.data]
		});
		
		// adjust the sequence of nodes
		var pdata = pnode ? pnode.children : $(target).treegrid('getRoots');
		for(var i=0; i<pdata.length; i++){
			if (pdata[i][opts.idField] == ref){
				var lastNode = pdata[pdata.length-1];
				pdata.splice(param.before ? i : (i+1), 0, lastNode);
				pdata.splice(pdata.length-1, 1);
				break;
			}
		}
		
		_move(true);
		_move(false);
		setRowNumbers(target);
		$(target).treegrid('showLines');
		
		function _move(frozen){
			var serno = frozen?1:2;
			var tr = opts.finder.getTr(target, param.data[opts.idField], 'body', serno);
			var table = tr.closest('table.datagrid-btable');
			tr = tr.parent().children();
			var dest = opts.finder.getTr(target, ref, 'body', serno);
			if (param.before){
				tr.insertBefore(dest);
			} else {
				var sub = dest.next('tr.treegrid-tr-tree');
				tr.insertAfter(sub.length?sub:dest);
			}
			table.remove();
		}
	}
	
	/**
	 * remove the specified node
	 */
	function remove(target, idValue){
		var state = $.data(target, 'treegrid');
		$(target).datagrid('deleteRow', idValue);
		setRowNumbers(target);
		state.total -= 1;
		$(target).datagrid('getPager').pagination('refresh', {total:state.total});
		$(target).treegrid('showLines');
	}
	
	function showLines(target){
		var t = $(target);
		var opts = t.treegrid('options');
		if (opts.lines){
			t.treegrid('getPanel').addClass('tree-lines');		
		} else {
			t.treegrid('getPanel').removeClass('tree-lines');		
			return;
		}
		
		t.treegrid('getPanel').find('span.tree-indent').removeClass('tree-line tree-join tree-joinbottom');
		t.treegrid('getPanel').find('div.datagrid-cell').removeClass('tree-node-last tree-root-first tree-root-one');
		
		var roots = t.treegrid('getRoots');
		if (roots.length > 1){
			_getCell(roots[0]).addClass('tree-root-first');
		} else if (roots.length == 1){
			_getCell(roots[0]).addClass('tree-root-one');
		}
		_join(roots);
		_line(roots);
		
		function _join(nodes){
			$.map(nodes, function(node){
				if (node.children && node.children.length){
					_join(node.children);
				} else {
					var cell = _getCell(node);
					cell.find('.tree-icon').prev().addClass('tree-join');
				}
			});
			if (nodes.length){
				var cell = _getCell(nodes[nodes.length-1]);
				cell.addClass('tree-node-last');
				cell.find('.tree-join').removeClass('tree-join').addClass('tree-joinbottom');
			}
		}
		function _line(nodes){
			$.map(nodes, function(node){
				if (node.children && node.children.length){
					_line(node.children);
				}
			});
			for(var i=0; i<nodes.length-1; i++){
				var node = nodes[i];
				var level = t.treegrid('getLevel', node[opts.idField]);
				var tr = opts.finder.getTr(target, node[opts.idField]);
				var cc = tr.next().find('tr.datagrid-row td[field="' + opts.treeField + '"] div.datagrid-cell');
				cc.find('span:eq('+(level-1)+')').addClass('tree-line');
			}
		}
		function _getCell(node){
			var tr = opts.finder.getTr(target, node[opts.idField]);
			var cell = tr.find('td[field="'+opts.treeField+'"] div.datagrid-cell');
			return cell;
		}
	}
	
	
	$.fn.treegrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.treegrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'treegrid');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'treegrid', {
					options: $.extend({}, $.fn.treegrid.defaults, $.fn.treegrid.parseOptions(this), options),
					data:[]
				});
			}
			
			buildGrid(this);
			
			if (state.options.data){
				$(this).treegrid('loadData', state.options.data);
			}
			
			request(this);
		});
	};
	
	$.fn.treegrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'treegrid').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				$(this).datagrid('resize', param);
			});
		},
		fixRowHeight: function(jq, idValue){
			return jq.each(function(){
				setRowHeight(this, idValue);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data.parent, data);
//				loadData(this, null, data);
			});
		},
		load: function(jq, params){
			return jq.each(function(){
				$(this).treegrid('options').pageNumber = 1;
				$(this).treegrid('getPager').pagination({pageNumber:1});
				$(this).treegrid('reload', params);
			});
		},
		reload: function(jq, id){
			return jq.each(function(){
				var opts = $(this).treegrid('options');
//				var params = typeof id == 'object' ? id : $.extend({},opts.queryParams,{id:id});
				var params = {};
				if (typeof id == 'object'){
					params = id;
				} else {
					params = $.extend({}, opts.queryParams);
					params.id = id;
				}
				
//				var params = typeof id == 'object' ? id : {id:id};
				if (params.id){
					var node = $(this).treegrid('find', params.id);
					if (node.children){
						node.children.splice(0, node.children.length);
					}
//					var opts = $(this).treegrid('options');
					opts.queryParams = params;
					var tr = opts.finder.getTr(this, params.id);
					tr.next('tr.treegrid-tr-tree').remove();
					tr.find('span.tree-hit').removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					expand(this, params.id);
				} else {
					request(this, null, params);
				}
//				if (id){
//					var node = $(this).treegrid('find', id);
//					if (node.children){
//						node.children.splice(0, node.children.length);
//					}
//					var body = $(this).datagrid('getPanel').find('div.datagrid-body');
//					var tr = body.find('tr[node-id=' + id + ']');
//					tr.next('tr.treegrid-tr-tree').remove();
//					var hit = tr.find('span.tree-hit');
//					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
//					expand(this, id);
//				} else {
//					request(this, null, {});
//				}
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				var dc = $.data(this, 'datagrid').dc;
				if (footer){
					$.data(this, 'treegrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, dc.footer1, true);
					opts.view.renderFooter.call(opts.view, this, dc.footer2, false);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).treegrid('fixRowHeight');
				}
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'treegrid').data;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'treegrid').footer;
		},
		getRoot: function(jq){
			return getRoot(jq[0]);
		},
		getRoots: function(jq){
			return getRoots(jq[0]);
		},
		getParent: function(jq, id){
			return getParent(jq[0], id);
		},
		getChildren: function(jq, id){
			return getChildren(jq[0], id);
		},
//		getSelected: function(jq){
//			return getSelected(jq[0]);
//		},
//		getSelections: function(jq){
//			return getSelections(jq[0]);
//		},
		getLevel: function(jq, id){
			return getLevel(jq[0], id);
		},
		find: function(jq, id){
			return find(jq[0], id);
		},
		isLeaf: function(jq, id){
			var opts = $.data(jq[0], 'treegrid').options;
			var tr = opts.finder.getTr(jq[0], id);
			var hit = tr.find('span.tree-hit');
			return hit.length == 0;
		},
		select: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('selectRow', id);
			});
		},
		unselect: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('unselectRow', id);
			});
		},
		collapse: function(jq, id){
			return jq.each(function(){
				collapse(this, id);
			});
		},
		expand: function(jq, id){
			return jq.each(function(){
				expand(this, id);
			});
		},
		toggle: function(jq, id){
			return jq.each(function(){
				toggle(this, id);
			});
		},
		collapseAll: function(jq, id){
			return jq.each(function(){
				collapseAll(this, id);
			});
		},
		expandAll: function(jq, id){
			return jq.each(function(){
				expandAll(this, id);
			});
		},
		expandTo: function(jq, id){
			return jq.each(function(){
				expandTo(this, id);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				append(this, param);
			});
		},
		insert: function(jq, param){
			return jq.each(function(){
				insert(this, param);
			});
		},
		remove: function(jq, id){
			return jq.each(function(){
				remove(this, id);
			});
		},
		pop: function(jq, id){
			var row = jq.treegrid('find', id);
			jq.treegrid('remove', id);
			return row;
		},
		refresh: function(jq, id){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				opts.view.refreshRow.call(opts.view, this, id);
			});
		},
		update: function(jq, param){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				opts.view.updateRow.call(opts.view, this, param.id, param.row);
			});
		},
		beginEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('beginEdit', id);
				$(this).treegrid('fixRowHeight', id);
			});
		},
		endEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('endEdit', id);
			});
		},
		cancelEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('cancelEdit', id);
			});
		},
		showLines: function(jq){
			return jq.each(function(){
				showLines(this);
			});
		}
	};
	
	$.fn.treegrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,['treeField',{animate:'boolean'}]));
	};
	
	var defaultView = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			var rowIdPrefix = $.data(target, 'datagrid').rowIdPrefix;
			
			if (frozen){
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
					return;
				}
			}
			
			var view = this;
			if (this.treeNodes && this.treeNodes.length){
				var table = getTreeData(frozen, this.treeLevel, this.treeNodes);
				$(container).append(table.join(''));
			}
			
			function getTreeData(frozen, depth, children){
				var pnode = $(target).treegrid('getParent', children[0][opts.idField]);
				var index = (pnode ? pnode.children.length : $(target).treegrid('getRoots').length) - children.length;
				
				var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
				for(var i=0; i<children.length; i++){
					var row = children[i];
					if (row.state != 'open' && row.state != 'closed'){
						row.state = 'open';
					}
					var css = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
					var classValue = '';
					var styleValue = '';
					if (typeof css == 'string'){
						styleValue = css;
					} else if (css){
						classValue = css['class'] || '';
						styleValue = css['style'] || '';
					}
					var cls = 'class="datagrid-row ' + (index++ % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					
//					var cls = (index++ % 2 && opts.striped) ? 'class="datagrid-row datagrid-row-alt"' : 'class="datagrid-row"';
//					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
//					var style = styleValue ? 'style="' + styleValue + '"' : '';
					var rowId = rowIdPrefix + '-' + (frozen?1:2) + '-' + row[opts.idField];
					table.push('<tr id="' + rowId + '" node-id="' + row[opts.idField] + '" ' + cls + ' ' + style + '>');
					table = table.concat(view.renderRow.call(view, target, fields, frozen, depth, row));
					table.push('</tr>');
					
					if (row.children && row.children.length){
						var tt = getTreeData(frozen, depth+1, row.children);
						var v = row.state == 'closed' ? 'none' : 'block';
						
						table.push('<tr class="treegrid-tr-tree"><td style="border:0px" colspan=' + (fields.length + (opts.rownumbers?1:0)) + '><div style="display:' + v + '">');
						table = table.concat(tt);
						table.push('</div></td></tr>');
					}
				}
				table.push('</tbody></table>');
				return table;
			}
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var rows = $.data(target, 'treegrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = ['<table class="datagrid-ftable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				row[opts.idField] = row[opts.idField] || ('foot-row-id'+i);
				
				table.push('<tr class="datagrid-row" node-id="' + row[opts.idField] + '">');
				table.push(this.renderRow.call(this, target, fields, frozen, 0, row));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, depth, row){
			var opts = $.data(target, 'treegrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">0</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var css = col.styler ? (col.styler(row[field], row)||'') : '';
					var classValue = '';
					var styleValue = '';
					if (typeof css == 'string'){
						styleValue = css;
					} else if (cc){
						classValue = css['class'] || '';
						styleValue = css['style'] || '';
					}
					var cls = classValue ? 'class="' + classValue + '"' : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + cls + ' ' + style + '>');
					
					var style = '';
					if (!col.checkbox){
						if (col.align){style += 'text-align:' + col.align + ';'}
						if (!opts.nowrap){
							style += 'white-space:normal;height:auto;';
						} else if (opts.autoRowHeight){
							style += 'height:auto;';
						}
					}
					
					cc.push('<div style="' + style + '" ');
					if (col.checkbox){
						cc.push('class="datagrid-cell-check ');
					} else {
						cc.push('class="datagrid-cell ' + col.cellClass);
					}
					cc.push('">');
					
					if (col.checkbox){
						if (row.checked){
							cc.push('<input type="checkbox" checked="checked"');
						} else {
							cc.push('<input type="checkbox"');
						}
						cc.push(' name="' + field + '" value="' + (row[field]!=undefined ? row[field] : '') + '">');
					} else {
						var val = null;
						if (col.formatter){
							val = col.formatter(row[field], row);
						} else {
							val = row[field];
//							val = row[field] || '&nbsp;';
						}
						if (field == opts.treeField){
							for(var j=0; j<depth; j++){
								cc.push('<span class="tree-indent"></span>');
							}
							if (row.state == 'closed'){
                                //添加tree-empty 空组判断 2051-5-12
                                if(row.iconCls=='tree-empty') {
                                    cc.push('<span class="tree-indent"></span>');
                                    cc.push('<span class="tree-icon tree-folder ' + (row.iconCls?row.iconCls:'') + '"></span>');
                                } else {
                                    cc.push('<span class="tree-hit tree-collapsed"></span>');
                                    cc.push('<span class="tree-icon tree-folder ' + (row.iconCls?row.iconCls:'') + '"></span>');
                                }
							} else {
								if (row.children && row.children.length){
									cc.push('<span class="tree-hit tree-expanded"></span>');
									cc.push('<span class="tree-icon tree-folder tree-folder-open ' + (row.iconCls?row.iconCls:'') + '"></span>');
								} else {
                                    //添加tree-empty 空组判断 2051-5-12
                                    if(row.iconCls=='tree-empty') {
                                        cc.push('<span class="tree-indent"></span>');
                                        cc.push('<span class="tree-icon tree-folder ' + (row.iconCls?row.iconCls:'') + '"></span>');
                                    } else {
                                        cc.push('<span class="tree-indent"></span>');
                                        cc.push('<span class="tree-icon tree-file ' + (row.iconCls?row.iconCls:'') + '"></span>');
                                    }
								}
							}
							cc.push('<span class="tree-title">' + val + '</span>');
						} else {
							cc.push(val);
						}
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, id){
			this.updateRow.call(this, target, id, {});
		},
		
		updateRow: function(target, id, row){
			var opts = $.data(target, 'treegrid').options;
			var rowData = $(target).treegrid('find', id);
			$.extend(rowData, row);
			var depth = $(target).treegrid('getLevel', id) - 1;
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, rowData) : '';
			var rowIdPrefix = $.data(target, 'datagrid').rowIdPrefix;
			var newId = rowData[opts.idField];
			
			function _update(frozen){
				var fields = $(target).treegrid('getColumnFields', frozen);
				var tr = opts.finder.getTr(target, id, 'body', (frozen?1:2));
				var rownumber = tr.find('div.datagrid-cell-rownumber').html();
				var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
				tr.html(this.renderRow(target, fields, frozen, depth, rowData));
				tr.attr('style', styleValue || '');
				tr.find('div.datagrid-cell-rownumber').html(rownumber);
				if (checked){
					tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
				}
				if (newId != id){
					tr.attr('id', rowIdPrefix + '-' + (frozen?1:2) + '-' + newId);
					tr.attr('node-id', newId);
				}
			}
			
			_update.call(this, true);
			_update.call(this, false);
			$(target).treegrid('fixRowHeight', id);
		},
		
		deleteRow: function(target, id){
			var opts = $.data(target, 'treegrid').options;
			var tr = opts.finder.getTr(target, id);
			tr.next('tr.treegrid-tr-tree').remove();
			tr.remove();
			
			var pnode = del(id);
			if (pnode){
				if (pnode.children.length == 0){
					tr = opts.finder.getTr(target, pnode[opts.idField]);
					tr.next('tr.treegrid-tr-tree').remove();
					var cell = tr.children('td[field="' + opts.treeField + '"]').children('div.datagrid-cell');
					cell.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
					cell.find('.tree-hit').remove();
					$('<span class="tree-indent"></span>').prependTo(cell);
				}
			}
			
			function del(id){
				var cc;
				var pnode = $(target).treegrid('getParent', id);
				if (pnode){
					cc = pnode.children;
				} else {
					cc = $(target).treegrid('getData');
				}
				for(var i=0; i<cc.length; i++){
					if (cc[i][opts.idField] == id){
						cc.splice(i, 1);
						break;
					}
				}
				return pnode;
			}
		},
		
		onBeforeRender: function(target, parentId, data){
			if ($.isArray(parentId)){
				data = {total:parentId.length, rows:parentId};
				parentId = null;
			}
			if (!data) return false;
			
			var state = $.data(target, 'treegrid');
			var opts = state.options;
			if (data.length == undefined){
				if (data.footer){
					state.footer = data.footer;
				}
				if (data.total){
					state.total = data.total;
				}
				data = this.transfer(target, parentId, data.rows);
			} else {
				function setParent(children, parentId){
					for(var i=0; i<children.length; i++){
						var row = children[i];
						row._parentId = parentId;
						if (row.children && row.children.length){
							setParent(row.children, row[opts.idField]);
						}
					}
				}
				setParent(data, parentId);
			}
			
			var node = find(target, parentId);
			if (node){
				if (node.children){
					node.children = node.children.concat(data);
				} else {
					node.children = data;
				}
			} else {
				state.data = state.data.concat(data);
			}
			
			this.sort(target, data);
			this.treeNodes = data;
			this.treeLevel = $(target).treegrid('getLevel', parentId);
		},
		
		sort: function(target, data){
			var opts = $.data(target, 'treegrid').options;
			if (!opts.remoteSort && opts.sortName){
				var names = opts.sortName.split(',');
				var orders = opts.sortOrder.split(',');
				_sort(data);
			}
			function _sort(rows){
				rows.sort(function(r1,r2){
					var r = 0;
					for(var i=0; i<names.length; i++){
						var sn = names[i];
						var so = orders[i];
						var col = $(target).treegrid('getColumnOption', sn);
						var sortFunc = col.sorter || function(a,b){
							return a==b ? 0 : (a>b?1:-1);
						};
						r = sortFunc(r1[sn], r2[sn]) * (so=='asc'?1:-1);
						if (r != 0){
							return r;
						}
					}
					return r;
				});
				for(var i=0; i<rows.length; i++){
					var children = rows[i].children;
					if (children && children.length){
						_sort(children);
					}
				}
			}
		},
		
		transfer: function(target, parentId, data){
			var opts = $.data(target, 'treegrid').options;
			
			// clone the original data rows
			var rows = [];
			for(var i=0; i<data.length; i++){
				rows.push(data[i]);
			}
			
			var nodes = [];
			// get the top level nodes
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				if (!parentId){
					if (!row._parentId){
						nodes.push(row);
//						removeArrayItem(rows,row);
						rows.splice(i, 1);
						i--;
					}
				} else {
					if (row._parentId == parentId){
						nodes.push(row);
//						removeArrayItem(rows,row);
						rows.splice(i, 1);
						i--;
					}
				}
			}
			
			var toDo = [];
			for(var i=0; i<nodes.length; i++){
				toDo.push(nodes[i]);
			}
			while(toDo.length){
				var node = toDo.shift();	// the parent node
				// get the children nodes
				for(var i=0; i<rows.length; i++){
					var row = rows[i];
					if (row._parentId == node[opts.idField]){
						if (node.children){
							node.children.push(row);
						} else {
							node.children = [row];
						}
						toDo.push(row);
//						removeArrayItem(rows,row);
						rows.splice(i, 1);
						i--;
					}
				}
			}
			return nodes;
		}
	});
	
	$.fn.treegrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		treeField:null,
		lines: false,
		animate: false,
		singleSelect: true,
		view: defaultView,
		rowEvents: $.extend({}, $.fn.datagrid.defaults.rowEvents, {
			mouseover: hoverEventHandler(true),
			mouseout: hoverEventHandler(false),
			click: clickEventHandler
		}),
		loader: function(param, success, error){
			var opts = $(this).treegrid('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data, parentId){
			return data;
		},
		finder:{
			getTr:function(target, id, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var dc = $.data(target, 'datagrid').dc;	// data container
				if (serno == 0){
					var opts = $.data(target, 'treegrid').options;
					var tr1 = opts.finder.getTr(target, id, type, 1);
					var tr2 = opts.finder.getTr(target, id, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						var tr = $('#' + $.data(target, 'datagrid').rowIdPrefix + '-' + serno + '-' + id);
						if (!tr.length){
							tr = (serno==1?dc.body1:dc.body2).find('tr[node-id="'+id+'"]');
						}
						return tr;
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id="'+id+'"]');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-selected');
					} else if (type == 'highlight'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-over');
					} else if (type == 'checked'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-checked');
//						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row:has(div.datagrid-cell-check input:checked)');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('tr:last[node-id]');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('tr[node-id]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id]');
					}
				}
			},
			getRow:function(target, p){	// p can be the row id or tr object
				var id = (typeof p == 'object') ? p.attr('node-id') : p;
				return $(target).treegrid('find', id);
			},
			getRows:function(target){
				return $(target).treegrid('getChildren');
			}
		},
		
		onBeforeLoad: function(row, param){},
		onLoadSuccess: function(row, data){},
		onLoadError: function(){},
		onBeforeCollapse: function(row){},
		onCollapse: function(row){},
		onBeforeExpand: function(row){},
		onExpand: function(row){},
		onClickRow: function(row){},
		onDblClickRow: function(row){},
		onClickCell: function(field, row){},
		onDblClickCell: function(field, row){},
		onContextMenu: function(e, row){},
		onBeforeEdit: function(row){},
		onAfterEdit: function(row, changes){},
		onCancelEdit: function(row){}
	});
})(jQuery);
/**
 * datalist - jQuery EasyUI
 * 
 * Dependencies:
 *   datagrid
 * 
 */
(function($){
	function create(target){
		var opts = $.data(target, 'datalist').options;
		$(target).datagrid($.extend({}, opts, {
			cls: 'datalist'+(opts.lines?' datalist-lines':''),
			frozenColumns: (opts.frozenColumns && opts.frozenColumns.length) ? opts.frozenColumns : (opts.checkbox ? [[{field:'_ck',checkbox:true}]] : undefined),
			columns: (opts.columns && opts.columns.length) ? opts.columns : [[
			     {field:opts.textField,width:'100%',
			     	formatter:function(value,row,index){
			     		return opts.textFormatter ? opts.textFormatter(value,row,index) : value;
			     	}
			     }
			]]
		}));
	}

    var listview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			if (opts.groupField){
				var g = this.groupRows(target, state.data.rows);
				this.groups = g.groups;
				state.data.rows = g.rows;

				var table = [];
				for(var i=0; i<g.groups.length; i++){
					table.push(this.renderGroup.call(this, target, i, g.groups[i], frozen));
				}
				$(container).html(table.join(''));
			} else {
				$(container).html(this.renderTable(target, 0, state.data.rows, frozen));
			}
		},
		renderGroup: function(target, groupIndex, group, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			table.push('<div class="datagrid-group" group-index=' + groupIndex + '>');
			if (!frozen){
				table.push('<span class="datagrid-group-title">');
				table.push(opts.groupFormatter.call(target, group.value, group.rows));
				table.push('</span>');
			}
			table.push('</div>');

			table.push(this.renderTable(target, group.startIndex, group.rows, frozen));
			return table.join('');
		},
		groupRows: function(target, rows){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						value: row[opts.groupField],
						rows: [row]
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			var index = 0;
			var rows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				group.startIndex = index;
				index += group.rows.length;
				rows = rows.concat(group.rows);
			}

			return {
				groups: groups,
				rows: rows
			};
			
			function getGroup(value){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.value == value){
						return group;
					}
				}
				return null;
			}
		}
    });
	
	$.fn.datalist = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datalist.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datalist');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.datalist.defaults, $.fn.datalist.parseOptions(this), options);
				opts.columns = $.extend(true, [], opts.columns);
				state = $.data(this, 'datalist', {
					options: opts
				});
			}
			create(this);
			if (!state.options.data){
				var data = $.fn.datalist.parseData(this);
				if (data.total){
					$(this).datalist('loadData', data);
				}
			}
		});
	}
	
	$.fn.datalist.methods = {
		options: function(jq){
			return $.data(jq[0], 'datalist').options;
		}
	}
	
	$.fn.datalist.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target, [
		    'valueField','textField','groupField',{checkbox:'boolean',lines:'boolean'}
		]));
	}

	$.fn.datalist.parseData = function(target){
		var opts = $.data(target, 'datalist').options;
		var data = {
			total:0,
			rows:[]
		};
		$(target).children().each(function(){
			var itemOpts = $.parser.parseOptions(this, ['value','group']);
			var row = {};
			var html = $(this).html();
			row[opts.valueField] = itemOpts.value != undefined ? itemOpts.value : html;
			row[opts.textField] = html;
			if (opts.groupField){
				row[opts.groupField] = itemOpts.group;				
			}
			data.total ++;
			data.rows.push(row);
		});
		return data;
	};
	
	$.fn.datalist.defaults = $.extend({}, $.fn.datagrid.defaults, {
		fitColumns: true,
		singleSelect: true,
		showHeader: false,
		checkbox: false,
		lines: false,
		valueField: 'value',
		textField: 'text',
		groupField: '',
		view: listview,
		textFormatter: function(value,row){return value},
		groupFormatter: function(fvalue,rows){return fvalue}
	});
})(jQuery);
/**
 * combo - jQuery EasyUI
 * 
 * Dependencies:
 *   panel
 *   textbox
 * 
 */
(function($){
	$(function(){
		$(document).unbind('.combo').bind('mousedown.combo mousewheel.combo', function(e){
			var p = $(e.target).closest('span.combo,div.combo-p,div.menu');
			if (p.length){
				hideInnerPanel(p);
				return;
			}
			$('body>div.combo-p>div.combo-panel:visible').panel('close');
		});
	});
	
	/**
	 * create the combo component.
	 */
	function buildCombo(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		if (!state.panel){
			state.panel = $('<div class="combo-panel"></div>').appendTo('body');
			state.panel.panel({
				minWidth: opts.panelMinWidth,
				maxWidth: opts.panelMaxWidth,
				minHeight: opts.panelMinHeight,
				maxHeight: opts.panelMaxHeight,
				doSize:false,
				closed:true,
				cls:'combo-p',
				style:{
					position:'absolute',
					zIndex:10
				},
				onOpen:function(){
					var target = $(this).panel('options').comboTarget;
					var state = $.data(target, 'combo');
					if (state){
						state.options.onShowPanel.call(target);
					}
				},
				onBeforeClose:function(){
					hideInnerPanel(this);
				},
				onClose:function(){
					var target = $(this).panel('options').comboTarget;
					var state = $(target).data('combo');
					// var state = $.data(target, 'combo');
					if (state){
						state.options.onHidePanel.call(target);
					}
				}
			});
		}
		
		var icons = $.extend(true, [], opts.icons);
		if (opts.hasDownArrow){
			icons.push({
				iconCls: 'combo-arrow',
				handler: function(e){
					togglePanel(e.data.target);
				}
			});
		}
		$(target).addClass('combo-f').textbox($.extend({}, opts, {
			icons: icons,
			onChange: function(){}
		}));
		$(target).attr('comboName', $(target).attr('textboxName'));
		state.combo = $(target).next();
		state.combo.addClass('combo');
	}
	
	function destroy(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var p = state.panel;
		if (p.is(':visible')){p.panel('close')}
		if (!opts.cloned){p.panel('destroy')}
		$(target).textbox('destroy');
	}
	
	function togglePanel(target){
		var panel = $.data(target, 'combo').panel;
		if (panel.is(':visible')){
			hidePanel(target);
		} else {
			var p = $(target).closest('div.combo-panel');	// the parent combo panel
			$('div.combo-panel:visible').not(panel).not(p).panel('close');
			$(target).combo('showPanel');
		}
		$(target).combo('textbox').focus();
	}
	
	/**
	 * hide inner drop-down panels of a specified container
	 */
	function hideInnerPanel(container){
		$(container).find('.combo-f').each(function(){
			var p = $(this).combo('panel');
			if (p.is(':visible')){
				p.panel('close');
			}
		});
	}

	/**
	 * The click event handler on input box
	 */
	function inputClickHandler(e){
		var target = e.data.target;
		var state = $.data(target, 'combo');
		var opts = state.options;
		var panel = state.panel;
		if (!opts.editable){
			togglePanel(target);
		} else {
			var p = $(target).closest('div.combo-panel');	// the parent combo panel
			$('div.combo-panel:visible').not(panel).not(p).panel('close');
		}
	}
	
	/** 
	 * The key event handler on input box
	 */
	function inputEventHandler(e){
		var target = e.data.target;
		var t = $(target);
		var state = t.data('combo');
		var opts = t.combo('options');
		
		switch(e.keyCode){
		case 38:	// up
			opts.keyHandler.up.call(target, e);
			break;
		case 40:	// down
			opts.keyHandler.down.call(target, e);
			break;
		case 37:	// left
			opts.keyHandler.left.call(target, e);
			break;
		case 39:	// right
			opts.keyHandler.right.call(target, e);
			break;
		case 13:	// enter
			e.preventDefault();
			opts.keyHandler.enter.call(target, e);
			return false;
		case 9:		// tab
		case 27:	// esc
			hidePanel(target);
			break;
		default:
			if (opts.editable){
				if (state.timer){
					clearTimeout(state.timer);
				}
				state.timer = setTimeout(function(){
					var q = t.combo('getText');
					if (state.previousText != q){
						state.previousText = q;
						t.combo('showPanel');
						opts.keyHandler.query.call(target, q, e);
						t.combo('validate');
					}
				}, opts.delay);
			}
		}
	}
	
	/**
	 * show the drop down panel.
	 */
	function showPanel(target){
		var state = $.data(target, 'combo');
		var combo = state.combo;
		var panel = state.panel;
		var opts = $(target).combo('options');
		var palOpts = panel.panel('options');
		
		palOpts.comboTarget = target;	// store the target combo element
		if (palOpts.closed){
			panel.panel('panel').show().css({
				zIndex: ($.fn.menu ? $.fn.menu.defaults.zIndex++ : $.fn.window.defaults.zIndex++),
				left: -999999
			});
			panel.panel('resize', {
				width: (opts.panelWidth ? opts.panelWidth : combo._outerWidth()),
				height: opts.panelHeight
			});
			panel.panel('panel').hide();
			panel.panel('open');
		}
		
		(function(){
			if (panel.is(':visible')){
				panel.panel('move', {
					left:getLeft(),
					top:getTop()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		
		function getLeft(){
			var left = combo.offset().left;
			if (opts.panelAlign == 'right'){
				left += combo._outerWidth() - panel._outerWidth();
			}
			if (left + panel._outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - panel._outerWidth();
			}
			if (left < 0){
				left = 0;
			}
			return left;
		}
		function getTop(){
			var top = combo.offset().top + combo._outerHeight();
			if (top + panel._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top = combo.offset().top - panel._outerHeight();
			}
			if (top < $(document).scrollTop()){
				top = combo.offset().top + combo._outerHeight();
			}
			return top;
		}
	}
	
	/**
	 * hide the drop down panel.
	 */
	function hidePanel(target){
		var panel = $.data(target, 'combo').panel;
		panel.panel('close');
	}
	
//	function clear(target){
//		var state = $.data(target, 'combo');
//		var opts = state.options;
//		var combo = state.combo;
//		$(target).textbox('clear');
//		if (opts.multiple){
//			combo.find('.textbox-value').remove();
//		} else {
//			combo.find('.textbox-value').val('');
//		}
//	}
	
	function setText(target, text){
		var state = $.data(target, 'combo');
		var oldText = $(target).textbox('getText');
		if (oldText != text){
			$(target).textbox('setText', text);
			state.previousText = text;
		}
	}
	
	function getValues(target){
		var values = [];
		var combo = $.data(target, 'combo').combo;
		combo.find('.textbox-value').each(function(){
			values.push($(this).val());
		});
		return values;
	}
	
	function setValues(target, values){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (!$.isArray(values)){values = values.split(opts.separator)}
		
		var oldValues = getValues(target);
		combo.find('.textbox-value').remove();
		var name = $(target).attr('textboxName') || '';
		for(var i=0; i<values.length; i++){
			var input = $('<input type="hidden" class="textbox-value">').appendTo(combo);
			input.attr('name', name);
			if (opts.disabled){
				input.attr('disabled', 'disabled');
			}
			input.val(values[i]);
		}
		
		var changed = (function(){
			if (oldValues.length != values.length){return true;}
			var a1 = $.extend(true, [], oldValues);
			var a2 = $.extend(true, [], values);
			a1.sort();
			a2.sort();
			for(var i=0; i<a1.length; i++){
				if (a1[i] != a2[i]){return true;}
			}
			return false;
		})();
		
		if (changed){
			if (opts.multiple){
				opts.onChange.call(target, values, oldValues);
			} else {
				opts.onChange.call(target, values[0], oldValues[0]);
			}
			$(target).closest('form').trigger('_change', [target]);
		}
	}
	
	function getValue(target){
		var values = getValues(target);
		return values[0];
	}
	
	function setValue(target, value){
		setValues(target, [value]);
	}
	
	/**
	 * set the initialized value
	 */
	function initValue(target){
		var opts = $.data(target, 'combo').options;
		var onChange = opts.onChange;
		opts.onChange = function(){};
		if (opts.multiple){
			setValues(target, opts.value ? opts.value : []);
		} else {
			setValue(target, opts.value);	// set initialize value
		}
		opts.onChange = onChange;
	}
	
	$.fn.combo = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combo.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combo');
			if (state){
				$.extend(state.options, options);
				if (options.value != undefined){
					state.options.originalValue = options.value;
				}
			} else {
				state = $.data(this, 'combo', {
					options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options),
					previousText: ''
				});
				state.options.originalValue = state.options.value;
			}
			
			buildCombo(this);
			initValue(this);
		});
	};
	
	$.fn.combo.methods = {
		options: function(jq){
			var opts = jq.textbox('options');
			return $.extend($.data(jq[0], 'combo').options, {
				width: opts.width,
				height: opts.height,
				disabled: opts.disabled,
				readonly: opts.readonly
			});
		},
		cloneFrom: function(jq, from){
			return jq.each(function(){
				$(this).textbox('cloneFrom', from);
				$.data(this, 'combo', {
					options: $.extend(true, {cloned:true}, $(from).combo('options')),
					combo: $(this).next(),
					panel: $(from).combo('panel')
				});
				$(this).addClass('combo-f').attr('comboName', $(this).attr('textboxName'));
			});
		},
		panel: function(jq){
			return $.data(jq[0], 'combo').panel;
		},
		destroy: function(jq){
			return jq.each(function(){
				destroy(this);
			});
		},
		showPanel: function(jq){
			return jq.each(function(){
				showPanel(this);
			});
		},
		hidePanel: function(jq){
			return jq.each(function(){
				hidePanel(this);
			});
		},
		clear: function(jq){
			return jq.each(function(){
//				clear(this);
				$(this).textbox('setText', '');
				var opts = $.data(this, 'combo').options;
				if (opts.multiple){
					$(this).combo('setValues', []);
				} else {
					$(this).combo('setValue', '');
				}
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'combo').options;
				if (opts.multiple){
					$(this).combo('setValues', opts.originalValue);
				} else {
					$(this).combo('setValue', opts.originalValue);
				}
			});
		},
		setText: function(jq, text){
			return jq.each(function(){
				setText(this, text);
			});
		},
		getValues: function(jq){
			return getValues(jq[0]);
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		getValue: function(jq){
			return getValue(jq[0]);
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		}
	};
	
	$.fn.combo.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.textbox.parseOptions(target), $.parser.parseOptions(target, [
			'separator','panelAlign',
			{panelWidth:'number',hasDownArrow:'boolean',delay:'number',selectOnNavigation:'boolean'},
			{panelMinWidth:'number',panelMaxWidth:'number',panelMinHeight:'number',panelMaxHeight:'number'}
		]), {
			panelHeight: (t.attr('panelHeight')=='auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
			multiple: (t.attr('multiple') ? true : undefined)
		});
	};
	
	// Inherited from $.fn.textbox.defaults
	$.fn.combo.defaults = $.extend({}, $.fn.textbox.defaults, {
		inputEvents: {
			click: inputClickHandler,
			keyup: inputEventHandler, //keydown 改为keyup
			paste: inputEventHandler,
			drop: inputEventHandler
		},
		
		panelWidth: null,
		panelHeight: 200,
		panelMinWidth: null,
		panelMaxWidth: null,
		panelMinHeight: null,
		panelMaxHeight: null,
		panelAlign: 'left',
		multiple: false,
		selectOnNavigation: true,
		separator: ',',
		hasDownArrow: true,
		delay: 200,	// delay to do searching from the last key input event.
		
		keyHandler: {
			up: function(e){},
			down: function(e){},
			left: function(e){},
			right: function(e){},
			enter: function(e){},
			query: function(q,e){}
		},
		
		onShowPanel: function(){},
		onHidePanel: function(){},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);
/**
 * combobox - jQuery EasyUI
 * 
 * Dependencies:
 *   combo
 * 
 */
(function($){
	var COMBOBOX_SERNO = 0;
	
	function getRowIndex(target, value){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		var data = state.data;
		for(var i=0; i<data.length; i++){
			if (data[i][opts.valueField] == value){
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * scroll panel to display the specified item
	 */
	function scrollTo(target, value){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		var item = opts.finder.getEl(target, value);
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	}
	
	function nav(target, dir){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (!item.length){
			item = panel.children('div.combobox-item-selected');
		}
		item.removeClass('combobox-item-hover');
		var firstSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):first';
		var lastSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):last';
		if (!item.length){
			item = panel.children(dir=='next' ? firstSelector : lastSelector);
//			item = panel.children('div.combobox-item:visible:' + (dir=='next'?'first':'last'));
		} else {
			if (dir == 'next'){
				item = item.nextAll(firstSelector);
//				item = item.nextAll('div.combobox-item:visible:first');
				if (!item.length){
					item = panel.children(firstSelector);
//					item = panel.children('div.combobox-item:visible:first');
				}
			} else {
				item = item.prevAll(firstSelector);
//				item = item.prevAll('div.combobox-item:visible:first');
				if (!item.length){
					item = panel.children(lastSelector);
//					item = panel.children('div.combobox-item:visible:last');
				}
			}
		}
		if (item.length){
			item.addClass('combobox-item-hover');
			var row = opts.finder.getRow(target, item);
			if (row){
				scrollTo(target, row[opts.valueField]);
				if (opts.selectOnNavigation){
					select(target, row[opts.valueField]);
				}
			}
		}
	}
	
	/**
	 * select the specified value
	 */
	function select(target, value){
		var opts = $.data(target, 'combobox').options;
		var values = $(target).combo('getValues');
		if ($.inArray(value+'', values) == -1){
			if (opts.multiple){
				values.push(value);
			} else {
				values = [value];
			}
			setValues(target, values);
			opts.onSelect.call(target, opts.finder.getRow(target, value));
		}
	}
	
	/**
	 * unselect the specified value
	 */
	function unselect(target, value){
		var opts = $.data(target, 'combobox').options;
		var values = $(target).combo('getValues');
		var index = $.inArray(value+'', values);
		if (index >= 0){
			values.splice(index, 1);
			setValues(target, values);
			opts.onUnselect.call(target, opts.finder.getRow(target, value));
		}
	}
	
	/**
	 * set values
	 */
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		
		if (!$.isArray(values)){values = values.split(opts.separator)}
		panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			opts.finder.getEl(target, v).addClass('combobox-item-selected');
			var row = opts.finder.getRow(target, v);
			if (row){
				s = row[opts.textField];
			}
			vv.push(v);
			ss.push(s);
		}
		
		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
		$(target).combo('setValues', vv);
	}
	
	/**
	 * load data, the old list items will be removed.
	 */
	function loadData(target, data, remainText){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		state.data = opts.loadFilter.call(target, data);
		state.groups = [];
		data = state.data;
		
		var selected = $(target).combobox('getValues');
		var dd = [];
		var group = undefined;
		for(var i=0; i<data.length; i++){
			var row = data[i];
			var v = row[opts.valueField]+'';
			var s = row[opts.textField];
			var g = row[opts.groupField];
			
			if (g){
				if (group != g){
					group = g;
					state.groups.push(g);
					dd.push('<div id="' + (state.groupIdPrefix+'_'+(state.groups.length-1)) + '" class="combobox-group">');
					dd.push(opts.groupFormatter ? opts.groupFormatter.call(target, g) : g);
					dd.push('</div>');
				}
			} else {
				group = undefined;
			}
			
			var cls = 'combobox-item' + (row.disabled ? ' combobox-item-disabled' : '') + (g ? ' combobox-gitem' : '');
			dd.push('<div id="' + (state.itemIdPrefix+'_'+i) + '" class="' + cls + '">');
			dd.push(opts.formatter ? opts.formatter.call(target, row) : s);
			dd.push('</div>');
			
//			if (item['selected']){
//				(function(){
//					for(var i=0; i<selected.length; i++){
//						if (v == selected[i]) return;
//					}
//					selected.push(v);
//				})();
//			}
			if (row['selected'] && $.inArray(v, selected) == -1){
				selected.push(v);
			}
		}
		$(target).combo('panel').html(dd.join(''));
		
		if (opts.multiple){
			setValues(target, selected, remainText);
		} else {
			setValues(target, selected.length ? [selected[selected.length-1]] : [], remainText);
		}
		
		opts.onLoadSuccess.call(target, data);
	}
	
	/**
	 * request remote data if the url property is setted.
	 */
	function request(target, url, param, remainText){
		var opts = $.data(target, 'combobox').options;
		if (url){
			opts.url = url;
		}
		param = $.extend({}, opts.queryParams, param||{});
//		param = param || {};
		
		if (opts.onBeforeLoad.call(target, param) == false) return;

		opts.loader.call(target, param, function(data){
			loadData(target, data, remainText);
		}, function(){
			opts.onLoadError.apply(this, arguments);
		});
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		
		var qq = opts.multiple ? q.split(opts.separator) : [q];
		if (opts.mode == 'remote'){
			_setValues(qq);
			request(target, null, {q:q}, true);
		} else {
			var panel = $(target).combo('panel');
			panel.find('div.combobox-item-selected,div.combobox-item-hover').removeClass('combobox-item-selected combobox-item-hover');
			panel.find('div.combobox-item,div.combobox-group').hide();
			var data = state.data;
			var vv = [];
			$.map(qq, function(q){
				q = $.trim(q);
				var value = q;
				var group = undefined;
				for(var i=0; i<data.length; i++){
					var row = data[i];
					if (opts.filter.call(target, q, row)){
						var v = row[opts.valueField];
						var s = row[opts.textField];
						var g = row[opts.groupField];
						var item = opts.finder.getEl(target, v).show();
						if (s.toLowerCase() == q.toLowerCase()){
							value = v;
							item.addClass('combobox-item-selected');
						}
						if (opts.groupField && group != g){
							$('#'+state.groupIdPrefix+'_'+$.inArray(g, state.groups)).show();
							group = g;
						}
					}
				}
				vv.push(value);
			});
			_setValues(vv);
		}
		function _setValues(vv){
			setValues(target, opts.multiple ? (q?vv:[]) : vv, true);
		}
	}
	
	function doEnter(target){
		var t = $(target);
		var opts = t.combobox('options');
		var panel = t.combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (item.length){
			var row = opts.finder.getRow(target, item);
			var value = row[opts.valueField];
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					t.combobox('unselect', value);
				} else {
					t.combobox('select', value);
				}
			} else {
				t.combobox('select', value);
			}
		}
		var vv = [];
		$.map(t.combobox('getValues'), function(v){
			if (getRowIndex(target, v) >= 0){
				vv.push(v);
			}
		});
		t.combobox('setValues', vv);
		if (!opts.multiple){
			t.combobox('hidePanel');
		}
	}
	
	/**
	 * create the component
	 */
	function create(target){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		
		COMBOBOX_SERNO++;
		state.itemIdPrefix = '_easyui_combobox_i' + COMBOBOX_SERNO;
		state.groupIdPrefix = '_easyui_combobox_g' + COMBOBOX_SERNO;
		
		$(target).addClass('combobox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel: function(){
				$(target).combo('panel').find('div.combobox-item,div.combobox-group').show();
				scrollTo(target, $(target).combobox('getValue'));
				opts.onShowPanel.call(target);
			}
		}));
		
		$(target).combo('panel').unbind().bind('mouseover', function(e){
			$(this).children('div.combobox-item-hover').removeClass('combobox-item-hover');
			var item = $(e.target).closest('div.combobox-item');
			if (!item.hasClass('combobox-item-disabled')){
				item.addClass('combobox-item-hover');
			}
			e.stopPropagation();
		}).bind('mouseout', function(e){
			$(e.target).closest('div.combobox-item').removeClass('combobox-item-hover');
			e.stopPropagation();
		}).bind('click', function(e){
			var item = $(e.target).closest('div.combobox-item');
			if (!item.length || item.hasClass('combobox-item-disabled')){return}
			var row = opts.finder.getRow(target, item);
			if (!row){return}
			var value = row[opts.valueField];
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					unselect(target, value);
				} else {
					select(target, value);
				}
			} else {
				select(target, value);
				$(target).combo('hidePanel');
			}
			e.stopPropagation();
		});
	}
	
	$.fn.combobox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combobox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combobox');
			if (state){
				$.extend(state.options, options);
				create(this);
			} else {
				state = $.data(this, 'combobox', {
					options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options),
					data: []
				});
				create(this);
				var data = $.fn.combobox.parseData(this);
				if (data.length){
					loadData(this, data);
				}
			}
			if (state.options.data){
				loadData(this, state.options.data);
			}
			request(this);
		});
	};
	
	
	$.fn.combobox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combobox').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'combobox').data;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combo('clear');
				var panel = $(this).combo('panel');
				panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combobox('options');
				if (opts.multiple){
					$(this).combobox('setValues', opts.originalValue);
				} else {
					$(this).combobox('setValue', opts.originalValue);
				}
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				if (typeof url == 'string'){
					request(this, url);
				} else {
					if (url){
						var opts = $(this).combobox('options');
						opts.queryParams = url;
					}
					request(this);
				}
			});
		},
		select: function(jq, value){
			return jq.each(function(){
				select(this, value);
			});
		},
		unselect: function(jq, value){
			return jq.each(function(){
				unselect(this, value);
			});
		}
	};
	
	$.fn.combobox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target,[
			'valueField','textField','groupField','mode','method','url'
		]));
	};
	
	$.fn.combobox.parseData = function(target){
		var data = [];
		var opts = $(target).combobox('options');
		$(target).children().each(function(){
			if (this.tagName.toLowerCase() == 'optgroup'){
				var group = $(this).attr('label');
				$(this).children().each(function(){
					_parseItem(this, group);
				});
			} else {
				_parseItem(this);
			}
		});
		return data;
		
		function _parseItem(el, group){
			var t = $(el);
			var row = {};
			row[opts.valueField] = t.attr('value')!=undefined ? t.attr('value') : t.text();
			row[opts.textField] = t.text();
			row['selected'] = t.is(':selected');
			row['disabled'] = t.is(':disabled');
			if (group){
				opts.groupField = opts.groupField || 'group';
				row[opts.groupField] = group;
			}
			data.push(row);
		}
	};
	
	$.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		groupField: null,
		groupFormatter: function(group){return group;},
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		queryParams: {},
		
		keyHandler: {
			up: function(e){nav(this,'prev');e.preventDefault()},
			down: function(e){nav(this,'next');e.preventDefault()},
			left: function(e){},
			right: function(e){},
			enter: function(e){doEnter(this)},
			query: function(q,e){doQuery(this, q)}
		},
		filter: function(q, row){
			var opts = $(this).combobox('options');
			return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) >= 0; //==改为>=
		},
		formatter: function(row){
			var opts = $(this).combobox('options');
			return row[opts.textField];
		},
		loader: function(param, success, error){
			var opts = $(this).combobox('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data){
			return data;
		},
		finder:{
			getEl:function(target, value){
				var index = getRowIndex(target, value);
				var id = $.data(target, 'combobox').itemIdPrefix + '_' + index;
				return $('#'+id);
			},
			getRow:function(target, p){
				var state = $.data(target, 'combobox');
				var index = (p instanceof jQuery) ? p.attr('id').substr(state.itemIdPrefix.length+1) : getRowIndex(target, p);
				return state.data[parseInt(index)];
			}
		},
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){}
	});
})(jQuery);
/**
 * combotree - jQuery EasyUI
 * 
 * Dependencies:
 *   combo
 * 	 tree
 * 
 */
(function($){
	/**
	 * create the combotree component.
	 */
	function create(target){
		var state = $.data(target, 'combotree');
		var opts = state.options;
		var tree = state.tree;
		
		$(target).addClass('combotree-f');
		$(target).combo(opts);
		var panel = $(target).combo('panel');
		if (!tree){
			tree = $('<ul></ul>').appendTo(panel);
			$.data(target, 'combotree').tree = tree;
		}
		
		tree.tree($.extend({}, opts, {
			checkbox: opts.multiple,
			onLoadSuccess: function(node, data){
				var values = $(target).combotree('getValues');
				if (opts.multiple){
					var nodes = tree.tree('getChecked');
					for(var i=0; i<nodes.length; i++){
						var id = nodes[i].id;
						(function(){
							for(var i=0; i<values.length; i++){
								if (id == values[i]) return;
							}
							values.push(id);
						})();
					}
				}
				$(target).combotree('setValues', values);				
				opts.onLoadSuccess.call(this, node, data);
			},
			onClick: function(node){
				if (opts.multiple){
					$(this).tree(node.checked ? 'uncheck' : 'check', node.target);
				} else {
                    if (opts.parent_checked == false) {     //add 2015-5-15父节点不可选。
                        var pnode = tree.tree('getParent', node.target);
                        if (pnode != null)
                            $(target).combo("hidePanel");
                    } else {
                        $(target).combo('hidePanel');
                    }
				}
				retrieveValues(target);
				opts.onClick.call(this, node);
			},
			onCheck: function(node, checked){
				retrieveValues(target);
				opts.onCheck.call(this, node, checked);
			}
		}));
	}
	
	/**
	 * retrieve values from tree panel.
	 */
	function retrieveValues(target){
		var state = $.data(target, 'combotree');
		var opts = state.options;
		var tree = state.tree;
		var vv = [], ss = [];
		if (opts.multiple){
			var nodes = tree.tree('getChecked');
            if(opts.parent_checked == false) {  //add 2015-5-15父节点不可选。
                for(var i=0; i<nodes.length; i++){
                    var pnode = tree.tree('getParent', nodes[i].target);
                    if(pnode != null) {
                        vv.push(nodes[i].id);
                        ss.push(nodes[i].text);
                    }
                }
            } else {
                for(var i=0; i<nodes.length; i++){
                    vv.push(nodes[i].id);
                    ss.push(nodes[i].text);
                }
            }
		} else {
			var node = tree.tree('getSelected');
			if (node){
                if(opts.parent_checked == false) {  //add 2015-5-15父节点不可选。
                    var pnode = tree.tree('getParent', node.target);
                    if(pnode != null) {
                        vv.push(node.id);
                        ss.push(node.text);
                    }
                } else {
                    vv.push(node.id);
                    ss.push(node.text);
                }
			}
		}
		$(target).combo('setText', ss.join(opts.separator)).combo('setValues', opts.multiple?vv:(vv.length?vv:['']));
	}
	
	function setValues(target, values){
		var state = $.data(target, 'combotree');
		var opts = state.options;
		var tree = state.tree;
		var topts = tree.tree('options');
		var onCheck = topts.onCheck;
		var onSelect = topts.onSelect;
		topts.onCheck = topts.onSelect = function(){};
		
		tree.find('span.tree-checkbox').addClass('tree-checkbox0').removeClass('tree-checkbox1 tree-checkbox2');
		if (!$.isArray(values)){values = values.split(opts.separator)}
		var vv = $.map(values, function(value){return String(value)});
		var ss = [];
		$.map(vv, function(v){
			var node = tree.tree('find', v);
			if (node){
				tree.tree('check', node.target).tree('select', node.target);
				ss.push(node.text);
			} else {
				ss.push(v);
			}
		});
		if (opts.multiple){
			var nodes = tree.tree('getChecked');
			$.map(nodes, function(node){
				var id = String(node.id);
				if ($.inArray(id, vv) == -1){
					vv.push(id);
					ss.push(node.text);
				}
			});
		}
		topts.onCheck = onCheck;
		topts.onSelect = onSelect;
//		retrieveValues(target);
		$(target).combo('setText', ss.join(opts.separator)).combo('setValues', opts.multiple?vv:(vv.length?vv:['']));
	}
	
	$.fn.combotree = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combotree.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combotree');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'combotree', {
					options: $.extend({}, $.fn.combotree.defaults, $.fn.combotree.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	
	$.fn.combotree.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combotree').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		clone: function(jq, container){
			var t = jq.combo('clone', container);
			t.data('combotree', {
				options: $.extend(true, {}, jq.combotree('options')),
				tree: jq.combotree('tree')
			});
			return t;
		},
		tree: function(jq){
			return $.data(jq[0], 'combotree').tree;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				opts.data = data;
				var tree = $.data(this, 'combotree').tree;
				tree.tree('loadData', data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				var tree = $.data(this, 'combotree').tree;
				if (url) opts.url = url;
				tree.tree({url:opts.url});
			});
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var tree = $.data(this, 'combotree').tree;
				tree.find('div.tree-node-selected').removeClass('tree-node-selected');
				var cc = tree.tree('getChecked');
				for(var i=0; i<cc.length; i++){
					tree.tree('uncheck', cc[i].target);
				}
				$(this).combo('clear');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combotree('options');
				if (opts.multiple){
					$(this).combotree('setValues', opts.originalValue);
				} else {
					$(this).combotree('setValue', opts.originalValue);
				}
			});
		}
	};
	
	$.fn.combotree.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.tree.parseOptions(target));
	};
	
	$.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, $.fn.tree.defaults, {
		editable: false
	});
})(jQuery);
/**
 * combogrid - jQuery EasyUI
 * 
 * Dependencies:
 *   combo
 *   datagrid
 * 
 */
(function($){
	/**
	 * create this component.
	 */
	function create(target){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		
		$(target).addClass('combogrid-f').combo($.extend({}, opts, {
			onShowPanel: function(){
				var p = $(this).combogrid('panel');
				var distance = p.outerHeight() - p.height();
				var minHeight = p._size('minHeight');
				var maxHeight = p._size('maxHeight');
				var dg = $(this).combogrid('grid');
				dg.datagrid('resize', {
					width: '100%',
					height: (isNaN(parseInt(opts.panelHeight)) ? 'auto' : '100%'),
					minHeight: (minHeight ? minHeight-distance : ''),
					maxHeight: (maxHeight ? maxHeight-distance : '')
				});
				var row = dg.datagrid('getSelected');
				if (row){
					dg.datagrid('scrollTo', dg.datagrid('getRowIndex', row));
				}
				opts.onShowPanel.call(this);
			}
		}));
		var panel = $(target).combo('panel');
		if (!grid){
			grid = $('<table></table>').appendTo(panel);
			state.grid = grid;
		}
		grid.datagrid($.extend({}, opts, {
			border: false,
			singleSelect: (!opts.multiple),
			onLoadSuccess: function(data){
				var values = $(target).combo('getValues');
				// prevent from firing onSelect event.
				var oldOnSelect = opts.onSelect;
				opts.onSelect = function(){};
				setValues(target, values, state.remainText);
				opts.onSelect = oldOnSelect;
				
				opts.onLoadSuccess.apply(target, arguments);
			},
			onClickRow: onClickRow,
			onSelect: function(index, row){retrieveValues(); opts.onSelect.call(this, index, row);},
			onUnselect: function(index, row){retrieveValues(); opts.onUnselect.call(this, index, row);},
			onSelectAll: function(rows){retrieveValues(); opts.onSelectAll.call(this, rows);},
			onUnselectAll: function(rows){
				if (opts.multiple) retrieveValues(); 
				opts.onUnselectAll.call(this, rows);
			}
		}));
		
		function onClickRow(index, row){
			state.remainText = false;
			retrieveValues();
			if (!opts.multiple){
				$(target).combo('hidePanel');
			}
			opts.onClickRow.call(this, index, row);
		}
		
		/**
		 * retrieve values from datagrid panel.
		 */
		function retrieveValues(){
			var rows = grid.datagrid('getSelections');
			var vv = [],ss = [];
			for(var i=0; i<rows.length; i++){
				vv.push(rows[i][opts.idField]);
				ss.push(rows[i][opts.textField]);
			}
			if (!opts.multiple){
				$(target).combo('setValues', (vv.length ? vv : ['']));
			} else {
				$(target).combo('setValues', vv);
			}
//			$(target).combo('setValues', vv);
//			if (!vv.length && !opts.multiple){
//				$(target).combo('setValues', ['']);
//			}
			if (!state.remainText){
				$(target).combo('setText', ss.join(opts.separator));
			}
		}
	}
	
	function nav(target, dir){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		var rowCount = grid.datagrid('getRows').length;
		if (!rowCount){return}
		
		var tr = opts.finder.getTr(grid[0], null, 'highlight');
		if (!tr.length){
			tr = opts.finder.getTr(grid[0], null, 'selected');;
		}
		var index;
		if (!tr.length){
			index = (dir == 'next' ? 0 : rowCount-1);
		} else {
			var index = parseInt(tr.attr('datagrid-row-index'));
			index += (dir == 'next' ? 1 : -1);
			if (index < 0) {index = rowCount - 1}
			if (index >= rowCount) {index = 0}
		}
		
		grid.datagrid('highlightRow', index);
		if (opts.selectOnNavigation){
			state.remainText = false;
			grid.datagrid('selectRow', index);
		}
	}
	
	/**
	 * set combogrid values
	 */
	function setValues(target, values, remainText){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		var rows = grid.datagrid('getRows');
		var ss = [];
		
		var oldValues = $(target).combo('getValues');
		var cOpts = $(target).combo('options');
		var oldOnChange = cOpts.onChange;
		cOpts.onChange = function(){};	// prevent from triggering onChange event
		
		grid.datagrid('clearSelections');
		if (!$.isArray(values)){values = values.split(opts.separator)}
		for(var i=0; i<values.length; i++){
			var index = grid.datagrid('getRowIndex', values[i]);
			if (index >= 0){
				grid.datagrid('selectRow', index);
				ss.push(rows[index][opts.textField]);
			} else {
				ss.push(values[i]);
			}
		}
		$(target).combo('setValues', oldValues);
		cOpts.onChange = oldOnChange;	// restore to trigger onChange event
		
		if (!remainText){
			var s = ss.join(opts.separator);
			if ($(target).combo('getText') != s){
				$(target).combo('setText', s);
			}
		}
		$(target).combo('setValues', values);
		
//		if ($(target).combo('getValues').join(',') == values.join(',')){
//			return;
//		}
//		$(target).combo('setValues', values);
//		if (!remainText){
//			$(target).combo('setText', ss.join(opts.separator));
//		}
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		state.remainText = true;
		
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		
		if (opts.mode == 'remote'){
			grid.datagrid('clearSelections');
			grid.datagrid('load', $.extend({}, opts.queryParams, {q:q}));
		} else {
			if (!q) return;
			grid.datagrid('clearSelections').datagrid('highlightRow', -1);
			var rows = grid.datagrid('getRows');
			var qq = opts.multiple ? q.split(opts.separator) : [q];
			$.map(qq, function(q){
				q = $.trim(q);
				if (q){
					$.map(rows, function(row, i){
						if (q == row[opts.textField]){
							grid.datagrid('selectRow', i);
						} else if (opts.filter.call(target, q, row)){
							grid.datagrid('highlightRow', i);
						}
					});
				}
			});
		}
	}
	
	function doEnter(target){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		var tr = opts.finder.getTr(grid[0], null, 'highlight');
		state.remainText = false;
		if (tr.length){
			var index = parseInt(tr.attr('datagrid-row-index'));
			if (opts.multiple){
				if (tr.hasClass('datagrid-row-selected')){
					grid.datagrid('unselectRow', index);
				} else {
					grid.datagrid('selectRow', index);
				}
			} else {
				grid.datagrid('selectRow', index);
			}
		}
		var vv = [];
		$.map(grid.datagrid('getSelections'), function(row){
			vv.push(row[opts.idField]);
		});
		$(target).combogrid('setValues', vv);
		if (!opts.multiple){
			$(target).combogrid('hidePanel');
		}
	}
	
	$.fn.combogrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combogrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
//				return $.fn.combo.methods[options](this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combogrid');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'combogrid', {
					options: $.extend({}, $.fn.combogrid.defaults, $.fn.combogrid.parseOptions(this), options)
				});
			}
			
			create(this);
		});
	};
	
	$.fn.combogrid.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combogrid').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		// get the datagrid object.
		grid: function(jq){
			return $.data(jq[0], 'combogrid').grid;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combogrid('grid').datagrid('clearSelections');
				$(this).combo('clear');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combogrid('options');
				if (opts.multiple){
					$(this).combogrid('setValues', opts.originalValue);
				} else {
					$(this).combogrid('setValue', opts.originalValue);
				}
			});
		}
	};
	
	$.fn.combogrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.datagrid.parseOptions(target), 
				$.parser.parseOptions(target, ['idField','textField','mode']));
	};
	
	$.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults, $.fn.datagrid.defaults, {
		height:22,
		loadMsg: null,
		idField: null,
		textField: null,	// the text field to display.
		mode: 'local',	// or 'remote'
		
		keyHandler: {
			up: function(e){nav(this, 'prev');e.preventDefault()},
			down: function(e){nav(this, 'next');e.preventDefault()},
			left: function(e){},
			right: function(e){},
			enter: function(e){doEnter(this)},
			query: function(q,e){doQuery(this, q)}
		},
		filter: function(q, row){
			var opts = $(this).combogrid('options');
			return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) >= 0; //==改为>=
		}
	});
})(jQuery);
/**
 * datebox - jQuery EasyUI
 * 
 * Dependencies:
 * 	 calendar
 *   combo
 * 
 */
(function($){
	/**
	 * create date box
	 */
	function createBox(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		
		$(target).addClass('datebox-f').combo($.extend({}, opts, {
			onShowPanel:function(){
				bindEvents(this);
				setButtons(this);
				setCalendar(this);
				setValue(this, $(this).datebox('getText'), true);
				opts.onShowPanel.call(this);
			}
		}));
		
		/**
		 * if the calendar isn't created, create it.
		 */
		if (!state.calendar){
			var panel = $(target).combo('panel').css('overflow','hidden');
			panel.panel('options').onBeforeDestroy = function(){
				var c = $(this).find('.calendar-shared');
				if (c.length){
					c.insertBefore(c[0].pholder);
				}
			};
			var cc = $('<div class="datebox-calendar-inner"></div>').prependTo(panel);
			if (opts.sharedCalendar){
				var c = $(opts.sharedCalendar);
				if (!c[0].pholder){
					c[0].pholder = $('<div class="calendar-pholder" style="display:none"></div>').insertAfter(c);
				}
				c.addClass('calendar-shared').appendTo(cc);
				if (!c.hasClass('calendar')){
					c.calendar();
				}
				state.calendar = c;
			} else {
				state.calendar = $('<div></div>').appendTo(cc).calendar();
			}

			$.extend(state.calendar.calendar('options'), {
				fit:true,
				border:false,
				onSelect:function(date){
					var target = this.target;
					var opts = $(target).datebox('options');
					setValue(target, opts.formatter.call(target, date));
					$(target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
		}

		$(target).combo('textbox').parent().addClass('datebox');
		$(target).datebox('initValue', opts.value);
		
		function bindEvents(target){
			var opts = $(target).datebox('options');
			var panel = $(target).combo('panel');
			panel.unbind('.datebox').bind('click.datebox', function(e){
				if ($(e.target).hasClass('datebox-button-a')){
					var index = parseInt($(e.target).attr('datebox-button-index'));
					opts.buttons[index].handler.call(e.target, target);
				}
			});
		}
		function setButtons(target){
			var panel = $(target).combo('panel');
			if (panel.children('div.datebox-button').length){return}
			var button = $('<div class="datebox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(panel);
			var tr = button.find('tr');
			for(var i=0; i<opts.buttons.length; i++){
				var td = $('<td></td>').appendTo(tr);
				var btn = opts.buttons[i];
				var t = $('<a class="datebox-button-a" href="javascript:void(0)"></a>').html($.isFunction(btn.text) ? btn.text(target) : btn.text).appendTo(td);
				t.attr('datebox-button-index', i);
			}
			tr.find('td').css('width', (100/opts.buttons.length)+'%');
		}
		function setCalendar(target){
			var panel = $(target).combo('panel');
			var cc = panel.children('div.datebox-calendar-inner');
			panel.children()._outerWidth(panel.width());
			state.calendar.appendTo(cc);
			state.calendar[0].target = target;
			if (opts.panelHeight != 'auto'){
				var height = panel.height();
				panel.children().not(cc).each(function(){
					height -= $(this).outerHeight();
				});
				cc._outerHeight(height);
			}
			state.calendar.calendar('resize');
		}
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q, true);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var current = state.calendar.calendar('options').current;
		if (current){
			setValue(target, opts.formatter.call(target, current));
			$(target).combo('hidePanel');
		}
	}
	
	function setValue(target, value, remainText){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var calendar = state.calendar;
		calendar.calendar('moveTo', opts.parser.call(target, value));
		if (remainText){
			$(target).combo('setValue', value);
		} else {
			if (value){
				value = opts.formatter.call(target, calendar.calendar('options').current);
			}
			$(target).combo('setText', value).combo('setValue', value);
		}
	}
	
	$.fn.datebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datebox', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.datebox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'datebox').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		cloneFrom: function(jq, from){
			return jq.each(function(){
				$(this).combo('cloneFrom', from);
				$.data(this, 'datebox', {
					options: $.extend(true, {}, $(from).datebox('options')),
					calendar: $(from).datebox('calendar')
				});
				$(this).addClass('datebox-f');
			});
		},
		calendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'datebox').calendar;
		},
		initValue: function(jq, value){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				var value = opts.value;
				if (value){
					value = opts.formatter.call(this, opts.parser.call(this, value));
				}
				$(this).combo('initValue', value).combo('setText', value);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				$(this).datebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.datebox.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target, ['sharedCalendar']));
	};
	
	$.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		sharedCalendar:null,
		
		keyHandler: {
			up:function(e){},
			down:function(e){},
			left: function(e){},
			right: function(e){},
			enter:function(e){doEnter(this)},
			query:function(q,e){doQuery(this, q)}
		},
		
		currentText:'Today',
		closeText:'Close',
		okText:'Ok',
		
		buttons:[{
			text: function(target){return $(target).datebox('options').currentText;},
			handler: function(target){
				var now = new Date();
				$(target).datebox('calendar').calendar({
					year:now.getFullYear(),
					month:now.getMonth()+1,
					current:new Date(now.getFullYear(), now.getMonth(), now.getDate())
				});
				doEnter(target);
			}
		},{
			text: function(target){return $(target).datebox('options').closeText;},
			handler: function(target){
				$(this).closest('div.combo-panel').panel('close');
			}
		}],
		
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return (m<10?('0'+m):m)+'/'+(d<10?('0'+d):d)+'/'+y;
		},
		parser:function(s){
			if (!s) return new Date();
			var ss = s.split('/');
			var m = parseInt(ss[0],10);
			var d = parseInt(ss[1],10);
			var y = parseInt(ss[2],10);
			if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
				return new Date(y,m-1,d);
			} else {
				return new Date();
			}
		},
		
		onSelect:function(date){}
	});
})(jQuery);
/**
 * datetimebox - jQuery EasyUI
 * 
 * Dependencies:
 * 	 datebox
 *   timespinner
 * 
 */
(function($){
	function createBox(target){
		var state = $.data(target, 'datetimebox');
		var opts = state.options;
		
		$(target).datebox($.extend({}, opts, {
			onShowPanel:function(){
				var value = $(this).datetimebox('getValue');
				setValue(this, value, true);
				opts.onShowPanel.call(this);
			},
			formatter: $.fn.datebox.defaults.formatter,
			parser: $.fn.datebox.defaults.parser
		}));
		$(target).removeClass('datebox-f').addClass('datetimebox-f');
		
		// override the calendar onSelect event, don't close panel when selected
		$(target).datebox('calendar').calendar({
			onSelect:function(date){
				opts.onSelect.call(this.target, date);
			}
		});
		
		if (!state.spinner){
			var panel = $(target).datebox('panel');
			var p = $('<div style="padding:2px"><input></div>').insertAfter(panel.children('div.datebox-calendar-inner'));
			state.spinner = p.children('input');
		}
		state.spinner.timespinner({
			width: opts.spinnerWidth,
			showSeconds: opts.showSeconds,
			separator: opts.timeSeparator
		});
		$(target).datetimebox('initValue', opts.value);
	}
	
	/**
	 * get current date, including time
	 */
	function getCurrentDate(target){
		var c = $(target).datetimebox('calendar');
		var t = $(target).datetimebox('spinner');
		var date = c.calendar('options').current;
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), t.timespinner('getHours'), t.timespinner('getMinutes'), t.timespinner('getSeconds'));
	}
	
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q, true);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var opts = $.data(target, 'datetimebox').options;
		var date = getCurrentDate(target);
		setValue(target, opts.formatter.call(target, date));
		$(target).combo('hidePanel');
	}
	
	/**
	 * set value, if remainText is assigned, don't change the text value
	 */
	function setValue(target, value, remainText){
		var opts = $.data(target, 'datetimebox').options;
		
		$(target).combo('setValue', value);
		if (!remainText){
			if (value){
				var date = opts.parser.call(target, value);
				$(target).combo('setText', opts.formatter.call(target, date));
				$(target).combo('setValue', opts.formatter.call(target, date));
			} else {
				$(target).combo('setText', value);
			}
		}
		var date = opts.parser.call(target, value);
		$(target).datetimebox('calendar').calendar('moveTo', date);
		$(target).datetimebox('spinner').timespinner('setValue', getTimeS(date));
		
		/**
		 * get the time formatted string such as '03:48:02'
		 */
		function getTimeS(date){
			function formatNumber(value){
				return (value < 10 ? '0' : '') + value;
			}
			
			var tt = [formatNumber(date.getHours()), formatNumber(date.getMinutes())];
			if (opts.showSeconds){
				tt.push(formatNumber(date.getSeconds()));
			}
			return tt.join($(target).datetimebox('spinner').timespinner('options').separator);
		}
	}
	
	$.fn.datetimebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datetimebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datetimebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datetimebox', {
					options: $.extend({}, $.fn.datetimebox.defaults, $.fn.datetimebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	}
	
	$.fn.datetimebox.methods = {
		options: function(jq){
			var copts = jq.datebox('options');
			return $.extend($.data(jq[0], 'datetimebox').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		cloneFrom: function(jq, from){
			return jq.each(function(){
				$(this).datebox('cloneFrom', from);
				$.data(this, 'datetimebox', {
					options: $.extend(true, {}, $(from).datetimebox('options')),
					spinner: $(from).datetimebox('spinner')
				});
				$(this).removeClass('datebox-f').addClass('datetimebox-f');
			});
		},
		spinner: function(jq){
			return $.data(jq[0], 'datetimebox').spinner;
		},
		initValue: function(jq, value){
			return jq.each(function(){
				var opts = $(this).datetimebox('options');
				var value = opts.value;
				if (value){
					value = opts.formatter.call(this, opts.parser.call(this, value));
				}
				$(this).combo('initValue', value).combo('setText', value);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datetimebox('options');
				$(this).datetimebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.datetimebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datebox.parseOptions(target), $.parser.parseOptions(target, [
			'timeSeparator','spinnerWidth',{showSeconds:'boolean'}
		]));
	};
	
	$.fn.datetimebox.defaults = $.extend({}, $.fn.datebox.defaults, {
		spinnerWidth:'100%',
		showSeconds:true,
		timeSeparator:':',
		
		keyHandler: {
			up:function(e){},
			down:function(e){},
			left: function(e){},
			right: function(e){},
			enter:function(e){doEnter(this)},
			query:function(q,e){doQuery(this, q);}
		},
		buttons:[{
			text: function(target){return $(target).datetimebox('options').currentText;},
			handler: function(target){
				var opts = $(target).datetimebox('options');
				setValue(target, opts.formatter.call(target, new Date()));
				$(target).datetimebox('hidePanel');
			}
		},{
			text: function(target){return $(target).datetimebox('options').okText;},
			handler: function(target){
				doEnter(target);
			}
		},{
			text: function(target){return $(target).datetimebox('options').closeText;},
			handler: function(target){
				$(target).datetimebox('hidePanel');
			}
		}],
		
		formatter:function(date){
			var h = date.getHours();
			var M = date.getMinutes();
			var s = date.getSeconds();
			function formatNumber(value){
				return (value < 10 ? '0' : '') + value;
			}
			var separator = $(this).datetimebox('spinner').timespinner('options').separator;
			var r = $.fn.datebox.defaults.formatter(date) + ' ' + formatNumber(h)+separator+formatNumber(M);
			if ($(this).datetimebox('options').showSeconds){
				r += separator+formatNumber(s);
			}
			return r;
		},
		parser:function(s){
			if ($.trim(s) == ''){
				return new Date();
			}
			var dt = s.split(' ');
			var d = $.fn.datebox.defaults.parser(dt[0]);
			if (dt.length < 2){
				return d;
			}
			var separator = $(this).datetimebox('spinner').timespinner('options').separator;
			var tt = dt[1].split(separator);
			var hour = parseInt(tt[0], 10) || 0;
			var minute = parseInt(tt[1], 10) || 0;
			var second = parseInt(tt[2], 10) || 0;
			return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, second);
		}
	});
})(jQuery);
/**
 * slider - jQuery EasyUI
 * 
 * Dependencies:
 *  draggable
 * 
 */
(function($){
	function init(target){
		var slider = $('<div class="slider">' +
				'<div class="slider-inner">' +
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>' +
				'</div>' +
				'<div class="slider-rule"></div>' +
				'<div class="slider-rulelabel"></div>' +
				'<div style="clear:both"></div>' +
				'<input type="hidden" class="slider-value">' +
				'</div>').insertAfter(target);
		var t = $(target);
		t.addClass('slider-f').hide();
		var name = t.attr('name');
		if (name){
			slider.find('input.slider-value').attr('name', name);
			t.removeAttr('name').attr('sliderName', name);
		}
		slider.bind('_resize', function(e,force){
			if ($(this).hasClass('easyui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		return slider;
	}
	
	/**
	 * set the slider size, for vertical slider, the height property is required
	 */
	function setSize(target, param){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		slider._size(opts);
		if (opts.mode == 'h'){
			slider.css('height', '');
			slider.children('div').css('height', '');
		} else {
			slider.css('width', '');
			slider.children('div').css('width', '');
			slider.children('div.slider-rule,div.slider-rulelabel,div.slider-inner')._outerHeight(slider._outerHeight());
		}
		initValue(target);
	}
	
	/**
	 * show slider rule if needed
	 */
	function showRule(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		var aa = opts.mode == 'h' ? opts.rule : opts.rule.slice(0).reverse();
		if (opts.reversed){
			aa = aa.slice(0).reverse();
		}
		_build(aa);
		
		function _build(aa){
			var rule = slider.find('div.slider-rule');
			var label = slider.find('div.slider-rulelabel');
			rule.empty();
			label.empty();
			for(var i=0; i<aa.length; i++){
				var distance = i*100/(aa.length-1)+'%';
				var span = $('<span></span>').appendTo(rule);
				span.css((opts.mode=='h'?'left':'top'), distance);
				
				// show the labels
				if (aa[i] != '|'){
					span = $('<span></span>').appendTo(label);
					span.html(aa[i]);
					if (opts.mode == 'h'){
						span.css({
							left: distance,
							marginLeft: -Math.round(span.outerWidth()/2)
						});
					} else {
						span.css({
							top: distance,
							marginTop: -Math.round(span.outerHeight()/2)
						});
					}
				}
			}
		}
	}
	
	/**
	 * build the slider and set some properties
	 */
	function buildSlider(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		slider.removeClass('slider-h slider-v slider-disabled');
		slider.addClass(opts.mode == 'h' ? 'slider-h' : 'slider-v');
		slider.addClass(opts.disabled ? 'slider-disabled' : '');
		
		var inner = slider.find('.slider-inner');
		inner.html(
			'<a href="javascript:void(0)" class="slider-handle"></a>' +
			'<span class="slider-tip"></span>'
		);
		if (opts.range){
			inner.append(
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>'
			);
		}
		
		slider.find('a.slider-handle').draggable({
			axis:opts.mode,
			cursor:'pointer',
			disabled: opts.disabled,
			onDrag:function(e){
				var left = e.data.left;
				var width = slider.width();
				if (opts.mode!='h'){
					left = e.data.top;
					width = slider.height();
				}
				if (left < 0 || left > width) {
					return false;
				} else {
					setPos(left);
					return false;
				}
			},
			onBeforeDrag:function(){
				state.isDragging = true;
			},
			onStartDrag:function(){
				opts.onSlideStart.call(target, opts.value);
			},
			onStopDrag:function(e){
				setPos(opts.mode=='h'?e.data.left:e.data.top);
				opts.onSlideEnd.call(target, opts.value);
				opts.onComplete.call(target, opts.value);
				state.isDragging = false;
			}
		});
		slider.find('div.slider-inner').unbind('.slider').bind('mousedown.slider', function(e){
			if (state.isDragging || opts.disabled){return}
			var pos = $(this).offset();
			setPos(opts.mode=='h'?(e.pageX-pos.left):(e.pageY-pos.top));
			opts.onComplete.call(target, opts.value);
		});
		
		function setPos(pos){
			var value = pos2value(target, pos);
			var s = Math.abs(value % opts.step);
			if (s < opts.step/2){
				value -= s;
			} else {
				value = value - s + opts.step;
			}
			if (opts.range){
				var v1 = opts.value[0];
				var v2 = opts.value[1];
				var m = parseFloat((v1+v2)/2);
				if (value < v1){
					v1 = value;
				} else if (value > v2){
					v2 = value;
				} else {
					value < m ? v1 = value : v2 = value;
				}
				$(target).slider('setValues', [v1,v2]);
			} else {
				$(target).slider('setValue', value);
			}
		}
	}
	
	/**
	 * set a specified value to slider
	 */
	function setValues(target, values){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var oldValues = $.isArray(opts.value) ? opts.value : [opts.value];
		var newValues = [];
		
		if (!$.isArray(values)){
			values = $.map(String(values).split(opts.separator), function(v){
				return parseFloat(v);
			});
		}
		
		slider.find('.slider-value').remove();
		var name = $(target).attr('sliderName') || '';
		for(var i=0; i<values.length; i++){
			var value = values[i];
			if (value < opts.min) value = opts.min;
			if (value > opts.max) value = opts.max;
			
			var input = $('<input type="hidden" class="slider-value">').appendTo(slider);
			input.attr('name', name);
			input.val(value);
			newValues.push(value);
			
			var handle = slider.find('.slider-handle:eq('+i+')');
			var tip = handle.next();
			var pos = value2pos(target, value);
			if (opts.showTip){
				tip.show();
				tip.html(opts.tipFormatter.call(target, value));
			} else {
				tip.hide();
			}
			
			if (opts.mode == 'h'){
				var style = 'left:'+pos+'px;';
				handle.attr('style', style);
				tip.attr('style', style +  'margin-left:' + (-Math.round(tip.outerWidth()/2)) + 'px');
			} else {
				var style = 'top:' + pos + 'px;';
				handle.attr('style', style);
				tip.attr('style', style + 'margin-left:' + (-Math.round(tip.outerWidth())) + 'px');
			}
		}
		opts.value = opts.range ? newValues : newValues[0];
		$(target).val(opts.range ? newValues.join(opts.separator) : newValues[0]);
		
		if (oldValues.join(',') != newValues.join(',')){
			opts.onChange.call(target, opts.value, (opts.range?oldValues:oldValues[0]));
		}
	}
	
	function initValue(target){
		var opts = $.data(target, 'slider').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValues(target, opts.value);
		opts.onChange = fn;
	}
	
	/**
	 * translate value to slider position
	 */
	function value2pos(target, value){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var size = opts.mode == 'h' ? slider.width() : slider.height();
		var pos = opts.converter.toPosition.call(target, value, size);
		if (opts.mode == 'v'){
			pos = slider.height() - pos;
		}
		if (opts.reversed){
			pos = size - pos;
		}
		return pos.toFixed(0);
	}
	
	/**
	 * translate slider position to value
	 */
	function pos2value(target, pos){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var size = opts.mode == 'h' ? slider.width() : slider.height();
		var value = opts.converter.toValue.call(target, opts.mode=='h'?(opts.reversed?(size-pos):pos):(size-pos), size);
		return value.toFixed(0);
	}
	
	$.fn.slider = function(options, param){
		if (typeof options == 'string'){
			return $.fn.slider.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'slider');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'slider', {
					options: $.extend({}, $.fn.slider.defaults, $.fn.slider.parseOptions(this), options),
					slider: init(this)
				});
				$(this).removeAttr('disabled');
			}
			
			var opts = state.options;
			opts.min = parseFloat(opts.min);
			opts.max = parseFloat(opts.max);
			if (opts.range){
				if (!$.isArray(opts.value)){
					opts.value = $.map(String(opts.value).split(opts.separator), function(v){
						return parseFloat(v);
					});
				}
				if (opts.value.length < 2){
					opts.value.push(opts.max);
				}
			} else {
				opts.value = parseFloat(opts.value);
			}
			opts.step = parseFloat(opts.step);
			opts.originalValue = opts.value;
			
			buildSlider(this);
			showRule(this);
			setSize(this);
		});
	};
	
	$.fn.slider.methods = {
		options: function(jq){
			return $.data(jq[0], 'slider').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').slider.remove();
				$(this).remove();
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getValue: function(jq){
			return jq.slider('options').value;
		},
		getValues: function(jq){
			return jq.slider('options').value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var opts = $(this).slider('options');
				setValues(this, opts.range?[opts.min,opts.max]:[opts.min]);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).slider('options');
				$(this).slider(opts.range?'setValues':'setValue', opts.originalValue);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = false;
				buildSlider(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = true;
				buildSlider(this);
			});
		}
	};
	
	$.fn.slider.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','mode',{reversed:'boolean',showTip:'boolean',range:'boolean',min:'number',max:'number',step:'number'}
		]), {
			value: (t.val() || undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			rule: (t.attr('rule') ? eval(t.attr('rule')) : undefined)
		});
	};
	
	$.fn.slider.defaults = {
		width: 'auto',
		height: 'auto',
		mode: 'h',	// 'h'(horizontal) or 'v'(vertical)
		reversed: false,
		showTip: false,
		disabled: false,
		range: false,
		value: 0,
		separator: ',',
		min: 0,
		max: 100,
		step: 1,
		rule: [],	// [0,'|',100]
		tipFormatter: function(value){return value},
		converter:{
			toPosition:function(value, size){
				var opts = $(this).slider('options');
				return (value-opts.min)/(opts.max-opts.min)*size;
			},
			toValue:function(pos, size){
				var opts = $(this).slider('options');
				return opts.min + (opts.max-opts.min)*(pos/size);
			}
		},
		onChange: function(value, oldValue){},
		onSlideStart: function(value){},
		onSlideEnd: function(value){},
		onComplete: function(value){}
	};
})(jQuery);
