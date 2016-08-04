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

			var win = createDialog(opts);
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
