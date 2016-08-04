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
