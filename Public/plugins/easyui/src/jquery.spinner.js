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
