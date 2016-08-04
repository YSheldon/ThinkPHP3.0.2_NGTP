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
		$(target).addClass('filebox-f').textbox(opts);
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
			$('<label class="filebox-label" for="'+id+'"></label>').appendTo(btn);
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
