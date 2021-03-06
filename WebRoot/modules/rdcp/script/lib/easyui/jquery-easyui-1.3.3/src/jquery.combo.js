/**
 * combo - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   panel
 *   validatebox
 * 
 */
(function($){
	function setSize(target, width){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if (width) opts.width = width;
		if (isNaN(opts.width)){
			var c = $(target).clone();
			c.css('visibility','hidden');
			c.appendTo('body');
			opts.width = c.outerWidth();
			c.remove();
		}
		
		combo.appendTo('body');
		
		var input = combo.find('input.combo-text');
		var arrow = combo.find('.combo-arrow');
		var arrowWidth = opts.hasDownArrow ? arrow._outerWidth() : 0;
		
		combo._outerWidth(opts.width)._outerHeight(opts.height);
		input._outerWidth(combo.width() - arrowWidth);
		input.css({
			height: combo.height()+'px',
			lineHeight: combo.height()+'px'
		});
		arrow._outerHeight(combo.height());
		
		panel.panel('resize', {
			width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
			height: opts.panelHeight
		});
		
		combo.insertAfter(target);
	}
	
	/**
	 * create the combo component.
	 */
	function init(target){
		$(target).addClass('combo-f').hide();
		
		var span = $('<span class="combo"></span>').insertAfter(target);
		var input = $('<input type="text" class="combo-text">').appendTo(span);
		$('<span><span class="combo-arrow"></span></span>').appendTo(span);
		$('<input type="hidden" class="combo-value">').appendTo(span);
		var panel = $('<div class="combo-panel"></div>').appendTo('body');
		panel.panel({
			doSize:false,
			closed:true,
			cls:'combo-p',
			style:{
				position:'absolute',
				zIndex:10
			},
			onOpen:function(){
				$(this).panel('resize');
			},
			onClose:function(){
				var state = $.data(target, 'combo');
				if (state){
					state.options.onHidePanel.call(target);
				}
			}
		});
		
		var name = $(target).attr('name');
		if (name){
			span.find('input.combo-value').attr('name', name);
			$(target).removeAttr('name').attr('comboName', name);
		}
		input.attr('autocomplete', 'off');
		
		return {
			combo: span,
			panel: panel
		};
	}
	
	function buildCombo(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (opts.hasDownArrow){
			combo.find('.combo-arrow').show();
		} else {
			combo.find('.combo-arrow').hide();
		}
		setDisabled(target, opts.disabled);
		setReadonly(target, opts.readonly);
	}
	
	function destroy(target){
		var state = $.data(target, 'combo');
		var input = state.combo.find('input.combo-text');
		input.validatebox('destroy');
		state.panel.panel('destroy');
		state.combo.remove();
		$(target).remove();
	}
	
	function bindEvents(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var panel = state.panel;
		var combo = state.combo;
		var input = combo.find('.combo-text');
		var arrow = combo.find('.combo-arrow');
		
		$(document).unbind('.combo').bind('mousedown.combo', function(e){
			var p = $(e.target).closest('span.combo,div.combo-panel');
			if (p.length){return;}
			$('body>div.combo-p>div.combo-panel:visible').panel('close');
		});
		
//		combo.unbind('.combo');
//		panel.unbind('.combo');
		input.unbind('.combo');
		arrow.unbind('.combo');
		
		if (!opts.disabled && !opts.readonly){
			input.bind('mousedown.combo', function(e){
				$('div.combo-panel').not(panel).panel('close');
				e.stopPropagation();
			}).bind('keydown.combo', function(e){
				switch(e.keyCode){
					case 38:	// up
						opts.keyHandler.up.call(target);
						break;
					case 40:	// down
						opts.keyHandler.down.call(target);
						break;
					case 13:	// enter
						e.preventDefault();
						opts.keyHandler.enter.call(target);
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
								var q = input.val();
								if (state.previousValue != q){
									state.previousValue = q;
									$(target).combo('showPanel');
									opts.keyHandler.query.call(target, input.val());
									validate(target, true);
								}
							}, opts.delay);
						}
				}
			});
			
			arrow.bind('click.combo', function(){
				if (panel.is(':visible')){
					hidePanel(target);
				} else {
					$('div.combo-panel:visible').panel('close');
					$(target).combo('showPanel');
				}
				input.focus();
			}).bind('mouseenter.combo', function(){
				$(this).addClass('combo-arrow-hover');
			}).bind('mouseleave.combo', function(){
				$(this).removeClass('combo-arrow-hover');
			});
		}
	}
	
	/**
	 * show the drop down panel.
	 */
	function showPanel(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if ($.fn.window){
			panel.panel('panel').css('z-index', $.fn.window.defaults.zIndex++);
		}
		
		panel.panel('move', {
			left:combo.offset().left,
			top:getTop()
		});
		if (panel.panel('options').closed){
			panel.panel('open');
			opts.onShowPanel.call(target);
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
//		var opts = $.data(target, 'combo').options;
		var panel = $.data(target, 'combo').panel;
		panel.panel('close');
//		opts.onHidePanel.call(target);
	}
	
	function validate(target, doit){
		var opts = $.data(target, 'combo').options;
		var input = $.data(target, 'combo').combo.find('input.combo-text');
//		input.validatebox(opts);
		input.validatebox($.extend({}, opts, {
			deltaX: (opts.hasDownArrow ? opts.deltaX : (opts.deltaX>0?1:-1))
		}));
		if (doit){
			input.validatebox('validate');
//			input.trigger('mouseleave');
		}
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
			combo.find('.combo-value').attr('disabled', true);
			combo.find('.combo-text').attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
			combo.find('.combo-value').removeAttr('disabled');
			combo.find('.combo-text').removeAttr('disabled');
		}
	}
	
	function setReadonly(target, mode){
		var state = $.data(target, 'combo');
		var opts = state.options;
		opts.readonly = mode==undefined ? true : mode;
		state.combo.find('.combo-text').attr('readonly', opts.readonly ? true : (!opts.editable));
	}
	
	function clear(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (opts.multiple){
			combo.find('input.combo-value').remove();
		} else {
			combo.find('input.combo-value').val('');
		}
		combo.find('input.combo-text').val('');
	}
	
	function getText(target){
		var combo = $.data(target, 'combo').combo;
		return combo.find('input.combo-text').val();
	}
	
	function setText(target, text){
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-text').val(text);
		validate(target, true);
		$.data(target, 'combo').previousValue = text;
	}
	
	function getValues(target){
		var values = [];
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').each(function(){
			values.push($(this).val());
		});
		return values;
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combo').options;
		var oldValues = getValues(target);
		
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').remove();
		var name = $(target).attr('comboName');
		for(var i=0; i<values.length; i++){
			var input = $('<input type="hidden" class="combo-value">').appendTo(combo);
			if (name) input.attr('name', name);
			input.val(values[i]);
		}
		
		var tmp = [];
		for(var i=0; i<oldValues.length; i++){
			tmp[i] = oldValues[i];
		}
		var aa = [];
		for(var i=0; i<values.length; i++){
			for(var j=0; j<tmp.length; j++){
				if (values[i] == tmp[j]){
					aa.push(values[i]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		
		if (aa.length != values.length || values.length != oldValues.length){
			if (opts.multiple){
				opts.onChange.call(target, values, oldValues);
			} else {
				opts.onChange.call(target, values[0], oldValues[0]);
			}
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
		var fn = opts.onChange;
		opts.onChange = function(){};
		if (opts.multiple){
			if (opts.value){
				if (typeof opts.value == 'object'){
					setValues(target, opts.value);
				} else {
					setValue(target, opts.value);
				}
			} else {
				setValues(target, []);
			}
			opts.originalValue = getValues(target);
		} else {
			setValue(target, opts.value);	// set initialize value
			opts.originalValue = opts.value;
		}
		opts.onChange = fn;
	}
	
	$.fn.combo = function(options, param){
		if (typeof options == 'string'){
			return $.fn.combo.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combo');
			if (state){
				$.extend(state.options, options);
			} else {
				var r = init(this);
				state = $.data(this, 'combo', {
					options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options),
					combo: r.combo,
					panel: r.panel,
					previousValue: null
				});
				$(this).removeAttr('disabled');
			}
			buildCombo(this);
			
//			$('input.combo-text', state.combo).attr('readonly', !state.options.editable);
//			setDownArrow(this);
//			setDisabled(this, state.options.disabled);
			
			setSize(this);
			bindEvents(this);
			validate(this);
			initValue(this);
		});
	};
	
	$.fn.combo.methods = {
		options: function(jq){
			return $.data(jq[0], 'combo').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'combo').panel;
		},
		textbox: function(jq){
			return $.data(jq[0], 'combo').combo.find('input.combo-text');
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
		validate: function(jq){
			return jq.each(function(){
				validate(this, true);
			});
		},
		isValid: function(jq){
			var input = $.data(jq[0], 'combo').combo.find('input.combo-text');
			return input.validatebox('isValid');
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
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
		getText: function(jq){
			return getText(jq[0]);
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
		return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, [
			'width','height','separator',
			{panelWidth:'number',editable:'boolean',hasDownArrow:'boolean',delay:'number',selectOnNavigation:'boolean'}
		]), {
			panelHeight: (t.attr('panelHeight')=='auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
			multiple: (t.attr('multiple') ? true : undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			readonly: (t.attr('readonly') ? true : undefined),
			value: (t.val() || undefined)
		});
	};
	
	// Inherited from $.fn.validatebox.defaults
	$.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width: 'auto',
		height: 22,
		panelWidth: null,
		panelHeight: 200,
		multiple: false,
		selectOnNavigation: true,
		separator: ',',
		editable: true,
		disabled: false,
		readonly: false,
		hasDownArrow: true,
		value: '',
		delay: 200,	// delay to do searching from the last key input event.
		deltaX: 19,
		
		keyHandler: {
			up: function(){},
			down: function(){},
			enter: function(){},
			query: function(q){}
		},
		
		onShowPanel: function(){},
		onHidePanel: function(){},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);
