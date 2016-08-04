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
