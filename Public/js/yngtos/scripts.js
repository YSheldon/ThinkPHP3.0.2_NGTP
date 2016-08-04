var allcookies = document.cookie;
//定义一个函数，用来读取特定的cookie值。
function getCookie(cookie_name){
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度
    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1){
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1;  
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1){
            cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        //这里就可以得到你想要的cookie的值了。。。
    }
    return value;
}

// 调用函数
var cookie_leftdiv = getCookie("leftdiv");

// $(function(){
// 	function GetQueryString(name) {
// 	   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
// 	   var r = window.location.search.substr(1).match(reg);
// 	   if (r!=null){
// 	   	return unescape(r[2]);
// 	   }  
// 	   return null;
// 	}
// 	// alert(GetQueryString("status")+"9999999999999");
// });

var Cwidth = window.innerWidth-240+'px';
// var ob = $(".tree_3over").parents(".sub-nav").attr("id");

// $(function(){
// 	alert(cookie_leftdiv);
// 	if(cookie_leftdiv == "0"){
// 		mainClose();
// 	}else{
		
//         $("#main_close").fadeIn("slow");
// 		$("#"+ob).css("display","block");
// 		$('.navigation-aside').css("width","230px");
// 		$('ul#navigation li a span.title').show("fast"); 
        
// 	}
// });

$(document).ready(function(){
	$('.menu-toggle').click(function(){
		$("ul.nav-dash").toggle();
	});
	$('.close-menu').click(function(){
		$(".dropdown-menu").css("display","none");
	});
	$('.dropdown-dash i.fa-angle-down').click(function(){
		$(".mega-menu").toggle();
	});	
	$('.dropdown').click(function(){
		$(this).find(".visible-menu").toggle();
	});	
});
$(document).ready(function() {
	// $('#sidebar').hover(function() {
	// 	var display_type=$('ul#navigation li a span.title').css("display");
	// 	var ob = $(".tree_3over").parents(".sub-nav").attr("id");
	// 	if(display_type=="none"){
	// 		$('.navigation-aside').css("width","230px");
	// 		$("#"+ob).css("display","block");

	// 		$('ul#navigation li a span.title').show("fast");
	// 		$('#main-content').css("margin-left","230px");

	// 		$('#main-content').css("width",Cwidth);

	// 		$('#sidebar').css("width","230px");
	// 	}else{
	// 		$('.navigation-aside').css("width","0px");
	// 		$("#"+ob).css("display","none");

	// 		$('ul#navigation li a span.title').hide();

	// 		$('#main-content').css("margin-left","50px");
	// 		$('#main-content').css("width","96%");

	// 		$('#sidebar').css("width","");
	// 		$(".sub-nav").css("display","none");
	// 	}
	// });
	 
	//二级菜单：收缩
	// $("#main_close").click(function(){
	// 	$("#main_close").css("display","none");
	// 	$("#main_open").css("display","block");
	// 	$('.navigation-aside').css("width","0px");
	// 	$("#"+ob).css("display","none");
	// 	$('ul#navigation li a span.title').hide();

	// 	$('#main-content').css("margin-left","50px");
	// 	$('#main-content').css("width","96%");

	// 	$('#sidebar').css("width","");
	// 	$(".sub-nav").css("display","none");
	// });

	// $("#main_open").click(function(){
	// 	$("#main_close").css("display","block");
	// 	$("#main_open").css("display","none");

	// 	$("#"+ob).css("display","block");
	// 	$('.navigation-aside').css("width","230px");
	// 	$('ul#navigation li a span.title').show("fast");

	// 	$('#main-content').css("margin-left","230px");
	// 	$('#main-content').css("width",Cwidth);

	// 	$('#sidebar').css("width","230px");
	// });

	$('.parent').click(function() {
		$(this).find('.sub-nav').toggleClass('visible');
	});
	$('.user').click(function() {
		$(this).find('.dropdown-nav').toggleClass('visible');
	});
	$('.toggle-xy').click(function() {
		
		var display_type=$('ul#navigation li a span.title').css("display");
		if(display_type=="none")
		{
			$('ul#navigation li a span.title').show("slow");
			$('#main-content').css("margin-left","230px");$('#sidebar').css("width","230px");
		}
		else
		{
			$('ul#navigation li a span.title').hide();
			$('#main-content').css("margin-left","50px");$('#sidebar').css("width","");
		}
		//$('#sidebar').css('width','230px');
		//$('#main-content').css('margin-left','230px');
	});
});


$(document).ready(function() {
	$(".username").focus(function() {
		$(".user-icon").css("left","-48px");
	});
	$(".username").blur(function() {
		$(".user-icon").css("left","0px");
	});
	
	$(".password").focus(function() {
		$(".pass-icon").css("left","-48px");
	});
	$(".password").blur(function() {
		$(".pass-icon").css("left","0px");
	});
});




// Dropdown Menu Fade    
jQuery(document).ready(function(){
		$(".dropdown-dash").hover(
        function() { $('.dropdown-menu', this).fadeIn("fast");  $(this).find("a.dropdown-toggle > i").removeClass("fa-angle-down").addClass("fa-angle-up");
        },
        function() { $('.dropdown-menu', this).fadeOut("fast");$(this).find("a.dropdown-toggle > i").removeClass("fa-angle-up").addClass("fa-angle-down");
    });
	

	
	
		
			 $(".dropdown-toggle").on("click", function(){
		
		
		 	if($(this).parent().find(".dropdown-menu").css("display")=="none")
			{
				$(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-up");
			}
			else
			{
				$(this).find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
			}
			$(this).parent().find(".dropdown-menu").toggle();
        } );
		
	
			$(".dropdown-toggle > i").on("click", function(){
					if($(this).parent().next().css("display")=="none")
					{
						$(this).removeClass("fa-angle-down").addClass("fa-angle-up");
					}
					else
					{
						$(this).removeClass("fa-angle-up").addClass("fa-angle-down");
					}
					$(this).parent().next().toggle();
 			 } );


	
	 


});	
		
	
	$(document).ready(function() {
        //Horizontal Tab
        $('#parentHorizontalTab').easyResponsiveTabs({
            type: 'default', //Types: default, vertical, accordion
            width: 'auto', //auto or any width like 600px
            fit: true, // 100% fit in a container
            tabidentify: 'hor_1', // The tab groups identifier
            activate: function(event) { // Callback function if tab is switched
                var $tab = $(this);
                var $info = $('#nested-tabInfo');
                var $name = $('span', $info);
                $name.text($tab.text());
                $info.show();
            }
        });

    });

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

