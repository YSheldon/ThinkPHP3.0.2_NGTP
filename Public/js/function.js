$(document).ready(function() {
    $("#reboot_wait").parent().css({
        "background": "#ad1d21",
        "border-color": "#8B191C"
    });

});

//验证
$(function() {
    $.extend($.fn.validatebox.defaults.rules, {
        phone: {// 验证电话号码
            validator: function(value) {
                return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message: $LANG.THE_FORMAT_IS_INCORRECT
        },
        strLengthNum: {
            validator: function(value,number) {
                return StrLengthnumber(value,number);
            },
            message: $LANG.INPUT_CHAR+'{0}'
        },
        mobile: {// 验证手机号码
            validator: function(value) {
                return /^(13|15|18|17)\d{9}$/i.test(value);
            },
            message: $LANG.MOBILE_PHONE_NUMBER_FORMAT_IS_NOT_CORRECT
        }
        ,
        intOrFloat: {// 验证整数或小数
            validator: function(value) {
                return /^\d+(\.\d+)?$/i.test(value);
            },
            message: $LANG.PLEASE_ENTER_A_NUMBER
        },
        integer: {// 验证整数
            validator: function(value) {
                return /^[+]?[-]?[1-9]+\d*$/i.test(value);
            },
            message: $LANG.PLEASE_ENTER_INTEGER
        },
        notInt: {// 验证整数
            validator: function(value) {
                return !/^[+]?[-]?[0-9]+\d*$/i.test(value);
            },
            message: $LANG.INPUT_CAN_NOT_BE_ALL_DIGITAL
        },
        notChinese: {// 验证中文
            validator: function(value) {
                return !/[\Α-\￥]+/i.test(value);
            },
            message: $LANG.CANNOT_ENTER_CHINESE
        },
        english: {// 验证英语
            validator: function(value) {
                return /^[A-Za-z]+$/i.test(value);
            },
            message: $LANG.PLEASE_ENTER_ENGLISH
        },
        unnormal: {// 验证是否包含空格和非法字符
            validator: function(value) {
                return /^[a-zA-Z0-9\u4E00-\u9FA5]+$/.test(value);
            },
            message: $LANG.THE_INPUT_VALUE_CANNOT_BE_EMPTY
        },
        unnormals: {// 验证是否包含空格和非法字符
            validator: function(value) {
                return /^[a-zA-Z0-9\u4E00-\u9FA5_.:-]+$/.test(value);
            },
            message: $LANG.THE_INPUT_VALUE_CANNOT_BE_EMPTY
        },
        eSymbols: {// 验证是否包含非法字符
            validator: function(value) {
                return !/[`~!@#$%^&*()+<>?:：！"{},.\/\\;'[\]]/im.test(value);
            },
            message: $LANG.TIVCBESIC
        },
        addrName: {// 验证是否包含非法字符
            validator: function(value) {
                return !/[`~!@#$%^&*()+<>?"{},\\;'[\]]/im.test(value);
            },
            message: $LANG.ILLEGAL_INPUT_VLAUE
        },
        disableQuot: {// 验证是否包含非法字符
            validator: function(value) {
                return !/["']/im.test(value);
            },
            message: $LANG.TIVCBESQ
        },
        nospace: {// 验证是否包含空格和非法字符
            validator: function(value) {
                return !/\s/.test(value);
            },
            message: $LANG.INPUT_VALUES_CANNOT_CONTAIN_SPACES
        },
        checkStr: {// 验证用户名
            validator: function(value) {
                return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
            },
            message: $LANG.THE_INPUT_IS_NOT_VALID
        },
        faxno: {// 验证传真
            validator: function(value) {
//            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
                return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message:$LANG.TFNINC
        },
        ipFour: {// 验证IP地址
            validator: function(value) {
                return ipvFour(value);
            },
            message: $LANG.IP_ADDRESS_FORMAT_IS_INCORRECT
        },
        ipvFourAndMask: {//验证IPv4的掩码
            validator: function(value) {
                return ipvFourMask(value);
            },
            message: '掩码不合法'
        },
        ipSix: {// 验证IPv6地址
            validator: function(value) {
                return ipvSix(value);
            },
            message: $LANG.IAFII
        },
        ipSixPrefix: {// ipv6地址/网络前缀
            validator: function(value) {
                if (!/:/.test(value)) {
                    return false;
                }
                return value.match(/:/g).length <= 7
                        && /::/.test(value)
                        ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{0,4}(\/(?:[0-9]|[1-9][0-9]|[1][0-2][0-8]|[1][0-1][0-9])){1}$/i.test(value)
                        : /^([\da-f]{1,4}:){7}[\da-f]{1,4}(\/(?:[0-9]|[1-9][0-9]|[1][0-2][0-8]|[1][0-1][0-9])){1}$/i.test(value);
            },
            message: $LANG.IAIANP
        },
        ipFourOripSix: {// 验证IPv4/IPv6地址
            validator: function(value) {
                return ipvFour(value) || ipvSix(value);
            },
            message: $LANG.IP_ADDRESS_FORMAT_IS_INCORRECT
        },
        ipSixPre: {// 网关地址
            validator: function(value) {
                return Preip(value) || PreSix(value);
            },
            message: $LANG.INPUT_IS_NOT_LEGAL
        },
        mac: {
            validator: function(value) {
                return /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/.test(value);
            },
            message:$LANG.MAC_ADDRESS_FORMAT_IS_INCORRECT
        },
        ipRangeStr: {// 验证IPv4/IPv6地址,需要和IP格式验证
            validator: function(value, param) {
                var ipArr1 = [];
                var ipArr2 = [];
                var res = false;
                if (ipvFour(value)) {
                    res = true;
                    if (ipvFour(param[0])) {
                        ipArr1 = value.split('.');
                        ipArr2 = param[0].split('.');
                        for (var i = 0; i < 4; i++) {
                            if (parseInt(ipArr1[i]) > parseInt(ipArr2[i])) {
                                return false;
                            } else if (parseInt(ipArr1[i]) < parseInt(ipArr2[i])) {
                                return true;
                            }
                        }
                    }
                }
                if (ipvSix(value)) {
                    res = true;
                    if (ipvSix(param[0])) {
                        ipArr1 = value.split(':');
                        ipArr2 = param[0].split(':');
                        for (var i = 0; i < 4; i++) {
                            if (htoi(ipArr1[i]) > htoi(ipArr2[i])) {
                                return false;
                            } else if (htoi(ipArr1[i]) < htoi(ipArr2[i])) {
                                return true;
                            }
                        }
                    }
                }
                return res;
            },
            message: $LANG.STSBLTTEOI
        },
        ipRangeEnd: {// 验证IPv4/IPv6地址
            validator: function(value, param) {
                var ipArr1 = [];
                var ipArr2 = [];
                var res = false;
                if (ipvFour(value)) {
                    res = true;
                    if (ipvFour(param[0])) {
                        ipArr1 = value.split('.');
                        ipArr2 = param[0].split('.');
                        for (var i = 0; i < 4; i++) {
                            if (parseInt(ipArr1[i]) < parseInt(ipArr2[i])) {
                                return false;
                            } else if (parseInt(ipArr1[i]) > parseInt(ipArr2[i])) {
                                return true;
                            }
                        }
                    }
                }
                if (ipvSix(value)) {
                    res = true;
                    if (ipvSix(param[0])) {
                        ipArr1 = value.split(':');
                        ipArr2 = param[0].split(':');
                        for (var i = 0; i < 4; i++) {
                            if (htoi(ipArr1[i]) < htoi(ipArr2[i])) {
                                return false;
                            } else if (htoi(ipArr1[i]) > htoi(ipArr2[i])) {
                                return true;
                            }
                        }
                    }
                }
                return res;
            },
            message: $LANG.EISBGTTSI
        },
        date: {
            validator: function(value) {
                //格式yyyy-MM-dd或yyyy-M-d
                return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
            },
            message: $LANG.PETADF
        },
        time: {
            validator: function(value) {
                //格式yyyy-MM-dd或yyyy-M-d
                return /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/.test(value);
            },
            message: $LANG.PETATF
        },
        less: {
            validator: function(value, param) {//param需传入页面元素ID
                return value < $(param[0]).val();
            },
            message: $LANG.NLT+'{0}'
        },
        greater: {
            validator: function(value, param) {//param需传入页面元素ID
                return value > $(param[0]).val();
            },
            message: $LANG.NTBGT+'{0}'
        },
        lessEquals: {
            validator: function(value, param) {//param需传入页面元素ID
                if (param[0]) {
                    return parseInt(value) <= parseInt(param[0]);
                } else {
                    return true;
                }
            },
            message: $LANG.NLTOE+'{0}'
        },
        greaterEquals: {
            validator: function(value, param) {
                if (param[0]) {
                    return parseInt(value) >= parseInt(param[0]);
                } else {
                    return true;
                }
            },
            message: $LANG.NTBGTOET+'{0}'
        },
        equals: {
            validator: function(value, param) {
                return $(param[0]).val() == value;
            },
            message: $LANG.TWO_INPUT_IS_NOT_CONSISTENT
        },
        range: {
            validator: function(value, param) {
                if (/^[0-9]\d*$/.test(value)) {
                    return value >= param[0] && value <= param[1]
                } else {
                    return false;
                }
            },
            message: ''+$LANG.ENTER_THE_NUMBER_FOR+'{0}'+$LANG.GO_TO+'{1}'+$LANG.INTEGER_BETWEEN+''
        },
        rangeOr: {
            validator: function(value, param) {
                if (/^[0-9]\d*$/.test(value)) {
                    return (value == param[0]) || (value >= param[1] && value <= param[2])
                } else {
                    return false;
                }
            },
            message: $LANG.ENTER_THE_NUMBER_FOR+'{0}'+$LANG.OR_IN+'{1}'+$LANG.GO_TO+'{2}'+$LANG.BETWEEN
        },
        minLength: {
            validator: function(value, param) {
                return value.length >= param[0]
            },
            message: $LANG.AT_LEAST_INPUT+'{0}'+$LANG.WORD
        },
        maxLength: {
            validator: function(value, param) {
                return value.length <= param[0]
            },
            message: $LANG.MAXIMUM_INPUT+'{0}'+$LANG.WORD
        },
        Length: {
            validator: function(value) {
                return value.length == 8
            },
            message: $LANG.LENGTH_EIGHT
        },
        //select即选择框的验证
        selectValid: {
            validator: function(value, param) {
                if (value == param[0]) {
                    return false;
                } else {
                    return true;
                }
            },
            message: $LANG.PLEASE_CHOOSE
        },
        mask: {
            validator: function(value) {
                var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(255|254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(255|254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/;
                return value.match(exp);
            },
            message: $LANG.MASK_IS_NOT_VALID
        },
        maskOrPrefix: {
            validator: function(value) {
                var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(255|254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(255|254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/;
                var prefix = /^([0-9]|[1-9][0-9]|[1][0-2][0-8]|[1][0-1][0-9]){1}$/;
                return value.match(exp) || value.match(prefix);
            },
            message: $LANG.INPUT_IS_NOT_LEGAL
        },
        domain:{
            validator:function(value){
                var exp = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
                return value.match(exp);
            },
            message:$LANG.DOMAIN_NAME_IS_NOT_CORRECT
        },
         domainHttps:{
            validator:function(value){
                return !/https/.test(value);
            },
            message:$LANG.SYSTEM_DIO_HTTPS
        },
        //验证是否是正确的时间格式
        His:{
            validator:function(value){
                var exp = /^([01]\d|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
                return value.match(exp);
            },
            message:$LANG.PETCTF
        },

        phoneNum:{
            //短信认证
            validator:function(value){
                return /^[0-9]{1,15}$/.test(value);
            },
            message:$LANG.NSBGTC
        },
        // 验证不以'\'结尾
        twentyLength:{
            validator:function(value){
                value = value.slice(-1);
                return !/[\\]/im.test(value);
            },
            message:"不以'\\'结尾"
        }

    });
    $.extend($.fn.datagrid.methods, {
        fixRownumber: function(jq) {
            return jq.each(function() {
                var panel = $(this).datagrid("getPanel");
                //获取最后一行的number容器,并拷贝一份
                var clone = $(".datagrid-cell-rownumber", panel).last().clone();
                //由于在某些浏览器里面,是不支持获取隐藏元素的宽度,所以取巧一下
                clone.css({
                    "position": "absolute",
                    left: -1000
                }).appendTo("body");
                var width = clone.width("auto").width();
                //默认宽度是25,所以只有大于25的时候才进行fix edit 23
                if (width > 23) {
                    //多加5个像素,保持一点边距
                    $(".datagrid-header-rownumber,.datagrid-cell-rownumber", panel).width(width + 6);   // 5
                    //修改了宽度之后,需要对容器进行重新计算,所以调用resize
                    $(this).datagrid("resize");
                    //一些清理工作
                    clone.remove();
                    clone = null;
                } else {
                    //还原成默认状态
                    $(".datagrid-header-rownumber,.datagrid-cell-rownumber", panel).removeAttr("style");
                    $(this).datagrid("resize");
                }
            });
        }
    });
    //combotree可编辑，自定义模糊查询
    $.extend($.fn.combotree.defaults.keyHandler,{
        query:function(q){
            var t = $(this).combotree('tree');
            var nodes = t.tree('getChildren');
            for(var i=0; i<nodes.length; i++){
                var node = nodes[i];
                if (node.text.indexOf(q) >= 0){
                    $(node.target).show();
                } else {
                    $(node.target).hide();
                }
            }
            var opts = $(this).combotree('options');
            if (!opts.hasSetEvents){
                opts.hasSetEvents = true;
                var onShowPanel = opts.onShowPanel;
                opts.onShowPanel = function(){
                    var nodes = t.tree('getChildren');
                    for(var i=0; i<nodes.length; i++){
                        $(nodes[i].target).show();
                    }
                    onShowPanel.call(this);
                };
                $(this).combo('options').onShowPanel = opts.onShowPanel;
            }
        }
    });
});

function ipvFour(str) {
    return /^(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/i.test(str);
}

function Preip(str) {
    return /^(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])?$/i.test(str);
}

function ipvFourMask(str) {
    if(str.indexOf(".") > 0){
        return /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/.test(str);
    }else{
        return str >= 1 && str <= 31;
    }
}

function ipvSix(str) {
    if (!/:/.test(str)) {
        return false;
    }
    return str.match(/:/g).length <= 7
            && /::/.test(str)
            ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{0,4}(\/(?:[0-9]|[1-9][0-9]|[1][0-2][0-8]|[1][0-1][0-9]))?$/i.test(str)
            : /^([\da-f]{1,4}:){7}[\da-f]{1,4}(\/(?:[0-9]|[1-9][0-9]|[1][0-2][0-8]|[1][0-1][0-9]))?$/i.test(str);
}

function PreSix(str) {
    if (!/:/.test(str)) {
        return false;
    }
    return str.match(/:/g).length <= 7
            && /::/.test(str)
            ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{0,4}?$/i.test(str)
            : /^([\da-f]{1,4}:){7}[\da-f]{1,4}?$/i.test(str);
}


//十六进制转10进制
function htoi(hex) {
    //if(hex.length !=  2){
    //	alert("参数不正常："+hex);
    //} else {
    var a = hex.toLowerCase().charCodeAt(0);
    var b = hex.toLowerCase().charCodeAt(1);
    if (a > 47 && a < 58) {
        a = (a - 48) * 16;
    } else if (a > 96 && a < 103) {
        a = (a - 87) * 16;
    } else {
        //alert("参数错误");
        return 0;
    }
    if (b > 47 && b < 58) {
        a = a + b - 48;
    } else if (b > 96 && b < 103) {
        a = a + b - 87;
    } else {
        //alert("参数错误");
        return 0;
    }
    return a;
    //}
}

//切换图片函数
function MM_findObj(n, d) { //v4.01
    var p, i, x;
    if (!d)
        d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all)
        x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++)
        x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++)
        x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById)
        x = d.getElementById(n);
    return x;
}

function MM_swapImgRestore() { //v3.0
    var i, x, a = document.MM_sr;
    for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++)
        x.src = x.oSrc;
}

function MM_swapImage() { //v3.0
    var i, j = 0,
            x, a = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (i = 0; i < (a.length - 2); i += 3)
        if ((x = MM_findObj(a[i])) != null) {
            document.MM_sr[j++] = x;
            if (!x.oSrc)
                x.oSrc = x.src;
            x.src = a[i + 2];
        }
}

//页面左右侧收缩按钮
function changebar_main() {
    if (typeof ($.cookie('left_menu_show')) != 'undefined' && $.cookie('left_menu_show') == 1) {
        changebar_main_close_state();
        left_menu_show = 0;
        $.cookie('left_menu_show', 0, {secure: true});
    } else {
        changebar_main_open_state();
        left_menu_show = 1;
        $.cookie('left_menu_show', 1, {secure: true});
    }
}
function changebar_main_close_state()
{
    $('#jt_left').attr("src", NG_PATH + "Public/images/icon/icon_arrow_03.png");
    $('.treetext').show();
    $('.tree_3over').parent().parent().parent().show();
    $('#leftdiv').css('width', '200px');
    $('#center').css('left', '200px');
    var _bodyWidth = $("body").width();
    var _leftWidth = $('#leftdiv').width();
    var _centerWidth = _bodyWidth - _leftWidth - 2;
    $('#center').css('width', _centerWidth);
    $('#pcenter').panel('resize');

    $('.treelineimg').tooltip('destroy');
    $('.treelineimg').unbind("click").bind("click", function(e) {
        //开启事件冒泡；
        e.bubbles = true;
    });
}

function changebar_main_open_state()
{
    $('#jt_left').attr("src", NG_PATH + "Public/images/icon/icon_arrow_14.png");
    $('.treetext').hide();
    $('.thirdul').hide();
    $('#leftdiv').css("width", "60px");
    var _bodyWidth = $("body").width();
    var _leftWidth = $('#leftdiv').width();
    var _centerWidth = _bodyWidth - _leftWidth - 2;
    $('#center').css('left', '60px');
    $('#center').css('width', _centerWidth);
//    if ($('.easyui-datagrid').length > 0)
//        $('.easyui-datagrid').datagrid('resize');
//if ($('.panel').length > 0)
//        $('.panel').panel('resize');
    $('#pcenter').panel('resize');
    $('.treelineimg').tooltip({
        position: 'right',
        content: function() {
            var content = '';
            if ($(this).parents('li').find('.thirdul').length > 0)
            {
                content = '<div class="secord_text_mouserover">' + $(this).parents('.treelineleft').find('.treetextline').html()
                        + '</div><div class="mouseover_space"></div><ul class="third_ul_mouseover">' + $(this).parents('li').find('.thirdul').html()
                        + '</ul><div class="mouseover_space"></div>';
            }
            else {
                content = '<div class="secord_text_mouserover">' + $(this).parents('.treelineleft').find('.treetextline').html() + '</div>';
            }
            return content;
        },
        onShow: function() {
            var t = $(this);
            t.tooltip('arrow').hide();
            t.tooltip('tip').css({
                top: $(this).offset().top - 5,
                left: '49px',
//                    backgroundColor: '#D3DAE1',
                border: '0px'
            });
            $('.tooltip').css('background-color', 'transparent');
            t.tooltip('tip').unbind().bind('mouseenter', function() {
                t.tooltip('show');
            }).bind('mouseleave', function() {
                t.tooltip('hide');
            });
            t.parents('.treelineleft').find('.treeimg').css('background-color', '#F6F7F9');
        },
        onHide: function() {
            var t = $(this);
            t.parents('.treelineleft').find('.treeimg').css('background-color', 'transparent');
        }
    });
    $('.treelineimg').unbind("click").bind("click", function(e) {
        //关闭事件冒泡；
        e.stopPropagation();
    });
}

function ulSlideSwitch(id, obj) {
    $(function(){
        mainOpen();
        $(".datagrid .datagrid-pager").css("width","85%");
    });
    
    if($("#leftdiv").css('width') != '60px'){
        if ($(obj).parent().find('.treelineup').length > 0){
            // $('.treelinedown').removeClass().addClass('treelineup');
            $(obj).parent().find('.treelineup').removeClass().addClass('treelinedown');
            $('.thirdul').slideUp('slow');
            $("#" + id).slideDown('slow');
        }else{
            $(obj).parent().find('.treelinedown').removeClass().addClass('treelineup');
            $("#" + id).slideUp('slow');
        }
    }
    // else{
    //     mainOpen();
    //     $(".datagrid .datagrid-pager").css("width","85%");
    // }
}


function ulSlideSwitch2(text, obj) {
    var silde = $("#leftdiv").css("width");
    if(silde =="60px"){
        $(obj).find("#Prompt_1").css("display","block");
        $(obj).find("#Prompt_2").html(text);
    }
    
}
function ulSlideSwitch3(obj) {
    $(obj).find("#Prompt_1").css("display","none");
}
// 二级菜单：弹出提示信息：
function changeUlSlide(id, event, obj) {
    if ($(obj).attr('class') == 'treelineup') {
        // $('.treelinedown').removeClass().addClass('treelineup');
        $(obj).removeClass().addClass('treelinedown');
        $('.thirdul').slideUp('slow');
        $("#" + id).slideDown('slow');
    }
    else
    {
        // $(obj).removeClass().addClass('treelineup');
        $("#" + id).slideUp('slow');
    }
    event.stopPropagation();
}

function checkTimeOut(type, info) {
    if (type == 1) {

        ngtosPopMessager("error", info, "login", true);
    } else if (type == 2) {
        ngtosPopMessager("error", info);
    }
}

function open_window(divid, moduleVal, actionVal, titleVal, loadFunc)
{
    if(actionVal != '') {
        var url = "?c=" + moduleVal + "&a=" + actionVal;
    } else {
        var url = "?s=Home/" + moduleVal;
    }
    document.body.style.overflow = "auto";
    eval($('#' + divid).css("display", "block"));
    eval(
            $('#' + divid).window({
        collapsible: false, //定义是否显示可折叠按钮。
        minimizable: false, //定义是否显示最小化按钮。
        maximizable: false, //定义是否显示最大化按钮。
        noheader: false, //如果设置为true，控制面板头部将不被创建。
        border: false, //定义是否显示控制面板边框。
        //        top: 20, //设置面版的顶边距。
        //href: "?c=" + moduleVal + "&a=" + actionVal,
        href: url,
        resizable: false, //定义窗口是否可以被缩放。
        shadow: false, //如果设置为true，显示窗口的时候将显示阴影。
        modal: true, //定义窗口是否带有遮罩效果。
        cache: false,
        title: '&nbsp;&nbsp;' + titleVal,
        style: {
            borderWidth: 0,
            padding: 5
        },
        onLoad: function() {
            $('#' + divid).window('center');
            if (loadFunc)
                loadFunc();
        }
    })
            );
}
function getPrivilege(module) {
    var bol = false;
    $.ajax({
        url: "?c=Home/Support&a=privilege",
        type: 'POST',
        data: {
            name: module
        },
        async: false,
        success: function(data) {
            if (data == '1') {
                bol = true;
            } else {
                bol = false;
            }
        }
    });
    return bol;
}

//头部style变化函数
function topmenuChangeStyle(){
    total_width = $('.righthead').width() + $('#topdiv_menu').width() + 210;
    sub_width = $('.righthead').width() + 210;
    var remainder_width = ($(document.body).width() - sub_width) / li_num;

    if (total_width < $(document.body).width())
    {
        if (remainder_width <= 70)
        {
//            $('#topmenu_select').show();
//            $('#topdiv_menu').hide();
        }
        else if (remainder_width > 70 && remainder_width <= 120)
        {
//            $('#topmenu_select').hide();
            if ($('#topmenu_ul_show').is(":visible") == true)
                $('#topmenu_ul_show').slideUp('slow');
//            $('#topdiv_menu').show();
            $('#topdiv_menu').find('.topmenu').css('width', remainder_width - 20);
        }
        else
        {
//            $('#topmenu_select').hide();
            if ($('#topmenu_ul_show').is(":visible") == true)
                $('#topmenu_ul_show').slideUp('slow');
//            $('#topdiv_menu').show();
            $('#topdiv_menu').find('.topmenu').css('width', 100);
        }
    }
    else
    {
//        $('#topmenu_select').show();
//        $('#topdiv_menu').hide();
    }
}

function locationTo(obj)
{
    var url = $(obj).parent().find('.threemenu:first').attr('href');
    location.href = url;
}

function page_show(page, show){
    var page = "#" + page;
    if (show == "basic") {
        var table_a = ".basic_table";
        var style_a = "#basicStyle";
        var table_b = ".super_table";
        var style_b = "#superStyle";
    } else {
        var table_a = ".super_table";
        var style_a = "#superStyle";
        var table_b = ".basic_table";
        var style_b = "#basicStyle";
    }

    if (window.navigator.userAgent.indexOf("Firefox") != -1){
        $(page).find(table_a).css("display", "");
    }else{
        $(page).find(table_a).css("display", "block");
    }
    $(page).find(table_b).css("display", "none");
    $(page).find(style_a).removeClass("ngtos_window_tab_off").addClass("ngtos_window_tab_on");
    $(page).find(style_b).removeClass("ngtos_window_tab_on").addClass("ngtos_window_tab_off");
}

/*判断该模块是否有license权限, true：有；false：无；*/
function getLicense(vsid, module) {
    if (vsid == "")
        vsid = 0;
    var bol = false;
    $.ajax({
        url: "?c=Index&a=license",
        type: 'POST',
        data: {
            vsid: vsid,
            name: module
        },
        async: false,
        success: function(data) {
            if (data == '1') {
                bol = true;
            } else {
                bol = false;
            }
        }
    });
    return bol;
}

function load_objdata(data) {
    var loadData = {rows: []};
    if (data && data.rows){
        if (data.rows.length){
            loadData.rows = data.rows
        }else{
            loadData.rows[0] = data.rows
        }

    }
    return loadData;
}

/*获取虚系统开关on/off, on：开；off：关*/
function getVsysTurn() {
    var bol = false;
    $.ajax({
        url: "?c=System/Virtual&a=vsysTurn",
        type: 'POST',
        async: false,
        success: function(data) {

            if (data == '0') {
                bol = true;
            } else {
                bol = false;
            }
        }
    });
    return bol;
}
function json_to_string(obj) {
    var THIS = this;
    switch (typeof (obj)) {
        case 'string':
            return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
        case 'array':
            return '[' + obj.map(THIS.json_to_string).join(',') + ']';
        case 'object':
            if (obj instanceof Array) {
                var strArr = [];
                var len = obj.length;
                for (var i = 0; i < len; i++) {
                    strArr.push(THIS.json_to_string(obj[i]));
                }
                return '[' + strArr.join(',') + ']';
            } else if (obj == null) {
                return 'null';

            } else {
                var string = [];
                for (var property in obj)
                {
                    if (property == 'ck' || property == 'operate' || property == 'index')
                        continue;

                    if (obj[property])
                        string.push(THIS.json_to_string(property) + ':' + THIS.json_to_string(obj[property]));
                }
                return '{' + string.join(',') + '}';
            }
        case 'number':
            return obj;
        case false:
            return obj;
    }
}

function showSiteMap()
{
    if ($('#site_map_window').length <= 0)
    {
        $(document.body).append("<div id='site_map_window' class='ngtos_window' style='width: 800px'></div>");
    }
    open_window('site_map_window', 'System/Sitemap', 'show', $LANG.SITE_MAP, 'true');
}
//关闭easyui-window控件
function closeWindow(divid)
{
    eval($('#' + divid).window("close"));
}
function showTopmenu(obj)
{
    if ($('#topmenu_ul_show').length <= 0)
    {
        $(document.body).append("<ul id='topmenu_ul_show' class='topmenu_ul'></ul>");
        $('#topmenu_ul_show').html($(obj).parents('#topdiv').find('#topdiv_menu').html());
        $('#topmenu_ul_show').find('.topmenu').removeClass();
        $('#topmenu_ul_show').find('.topmenuover').removeClass();
    }
    if ($('#topmenu_ul_show').is(":hidden"))
        $('#topmenu_ul_show').slideDown('slow');
    else
        $('#topmenu_ul_show').slideUp('slow');
}

//判断js变量是否是数组
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

function get_mulselect_options(from_id, to_id){
    parent.sourOptions = [];
    parent.selOptions = [];
    var src_from = $("#" + from_id).get(0);
    var dst_to = $("#" + to_id).get(0);
    for (var i = 0; i < src_from.options.length; i++) {
        var s = src_from.options[i].text;
        parent.sourOptions.push(s);
    }
    for (var i = 0; i < dst_to.options.length; i++) {
        var d = dst_to.options[i].text;
        parent.selOptions.push(d);
    }
}

function doSearch(stag, event, selid, tag){
    event = event ? event : window.event;
    var val = eval($('#' + selid + ' option').length);
    var options = search_method(tag, stag);

    eval($('#' + selid).html(options));
    select_add_title(selid);
}

function search_method(tag, stag){
    var soptions = ""
    if (tag == 0){
        for (var i = 0; i < parent.sourOptions.length; i++){
            if (parent.sourOptions[i].toLowerCase().indexOf(stag.toLowerCase()) >= 0)
                soptions += "<option value='" + parent.sourOptions[i].split(' ')[0] + "'>" + parent.sourOptions[i] + "</option>";
        }
    }else if (tag == 1){
        for (var i = 0; i < parent.selOptions.length; i++){
            if (parent.selOptions[i].toLowerCase().indexOf(stag.toLowerCase()) >= 0)
                soptions += "<option value='" + parent.selOptions[i].split(' ')[0] + "'>" + parent.selOptions[i] + "</option>";
        }
    }
    return soptions;
}

function select_add_title(id){
    var src_option = $("#" + id).get(0);
    for (var i = 0; i < src_option.options.length; i++){
        src_option.options[i].title = src_option.options[i].value;
    }
}

/*
 function clear_all_sels(from_id, to_id, tag, selid) {
 var src_from = $("#" + from_id).get(0);
 var dst_to = $("#" + to_id).get(0);
 
 if (src_from == null || dst_to == null)
 return;
 
 if (src_from.options.sel_index == -1)
 return;
 
 var num = 0;
 for (var i = 0; i < src_from.options.length; i++)
 {
 var name = src_from.options[i].text;
 var ID = src_from.options[i].value;
 
 var is_existsitems = 0;
 for (var j = 0; j < dst_to.options.length; j++)
 if (dst_to.options[j].value == ID) {
 is_existsitems = 1;
 break;
 }
 
 src_from.options[i] = null;
 i--;
 
 if (is_existsitems == 0)
 {
 dst_to.options[dst_to.options.length] = new Option(name, ID);
 dst_to.options[dst_to.options.length - 1].title = ID;
 }
 
 move_result(tag, name);
 }
 if (from_id.indexOf('vrc_item_cid') >= 0)
 {
 $('#' + selid).html('已选0个' + parent.curstr);
 }
 else
 $('#' + selid).html('已选0个');
 parent.moveSelNum = 0;
 }
 */

function doSearch2(stag, event, selid, tag){
    event = event ? event : window.event;
    var val = eval($('#adduserDiv').find('#' + selid + ' option').length);
    var options = search_method(tag, stag);
    eval($('#adduserDiv').find('#' + selid).html(options));
}

/*function moveOptions(from_id, to_id, tag, selid) {
 
 var src_from = $("#" + from_id).get(0);
 var dst_to = $("#" + to_id).get(0);
 
 if (src_from == null || dst_to == null)
 return;
 
 if (src_from.options.sel_index == -1)
 return;
 
 var num = 0;
 for (var m = 0; m < src_from.options.length; m++)
 {
 if (src_from.options[m].selected) {
 num++;
 }
 if (num > 128) {
 ngtosPopMessager("error", "最多只能选择128个");
 return;
 }
 }
 
 for (var i = 0; i < src_from.options.length; i++)
 {
 if (src_from.options[i].selected) {
 if (tag == 1)
 parent.moveSelNum++;
 else
 parent.moveSelNum--;
 var name = src_from.options[i].text;
 var ID = src_from.options[i].value;
 
 var is_existsitems = 0;
 for (var j = 0; j < dst_to.options.length; j++)
 if (dst_to.options[j].value == ID) {
 is_existsitems = 1;
 break;
 }
 
 src_from.options[i] = null;
 i--;
 
 if (is_existsitems == 0)
 {
 dst_to.options[dst_to.options.length] = new Option(name, ID);
 dst_to.options[dst_to.options.length - 1].title = ID;
 }
 
 moveResult(tag, name);
 }
 }
 
 if (from_id.indexOf('vrc_item_cid') >= 0)
 {
 $('#sel_addr_num').html('已选' + parent.moveSelNum + '个' + parent.curstr);
 }
 else
 $('#' + selid).html('已选' + parent.moveSelNum + '个');
 }
 */
//num限制右侧个数，0不限制
var NS4 = (navigator.appName == "Netscape" && parseInt(navigator.appVersion) < 5);
function moveOptions(theSelFrom1, theSelTo1, num){
    var theSelFrom = $('#' + theSelFrom1)[0];
    var theSelTo = $('#' + theSelTo1)[0];
    //如果左侧无数据，返回
    var selLength = theSelFrom.length;
    if (selLength == 0) {
        return;
    }
    var i;
    //计算左侧选中个数
    var selectedCount = 0;
    for (i = selLength - 1; i >= 0; i--) {
        if (theSelFrom.options[i].selected) {
            selectedCount++;
        }
    }
    //选择个数加上已添加个数大于总数，报错
    var len = theSelTo.length;
    if (num != 0 && selectedCount + len > num) {
        ngtosPopMessager("error", "最多添加" + num + "个");
        return;
    }

    //执行移动
    for (i = selLength - 1; i >= 0; i--) {
        if (theSelFrom.options[i].selected) {
            addOption(theSelTo, theSelFrom.options[i].text, theSelFrom.options[i].value);
            deleteOption(theSelFrom, i);
        }
    }
    if (NS4)
        history.go(0);
}
function deleteOption(theSel, theIndex){
    var selLength = theSel.length;
    if (selLength > 0)
    {
        theSel.options[theIndex] = null;
    }

}
function addOption(theSel, theText, theValue)
{
    var newOpt = new Option(theText, theValue);
    newOpt.title = theValue
    var selLength = theSel.length;
    theSel.options[selLength] = newOpt;
}
function moveResult(tag, name)
{
    //parent.selOptions = [];
    if (tag == 1)
    {
        parent.selOptions.push(name);
        for (var m = 0; m < parent.sourOptions.length; m++)
        {
            if (parent.sourOptions[m] == name)
                parent.sourOptions.splice(m, 1);
        }
    }
    else
    {
        parent.sourOptions.push(name);
        for (var m = 0; m < parent.selOptions.length; m++)
        {
            if (parent.selOptions[m] == name)
                parent.selOptions.splice(m, 1);
        }
    }
}
function checkNote(o, blur) {
    if (blur)
        findNode(o).style.display = 'none';
    else {
        var n = findNode(o);
        n.innerHTML = o.value;
        n.style.display = o.value.length == 0 ? 'none' : 'block';
    }
}
function findNode(o) {
    var p = o.previousSibling;
    do {
        if (p.className == 'big_note')
            return p;
    } while (p = p.previousSibling);
}
function datagirdDbclick(id, index)
{
    $('#' + id).datagrid('unselectAll');
    $('#' + id).datagrid('selectRow', index);
}
function checkNote(o, blur) {
    if (blur)
        findNode(o).style.display = 'none';
    else {
        var n = findNode(o);
        n.innerHTML = o.value;
        n.style.display = o.value.length == 0 ? 'none' : 'block';
    }
}
function datagridReload(id)
{
    var rows = $('#' + id).datagrid('getRows');
    var rows_select = $('#' + id).datagrid('getSelections');

    if (rows.length == rows_select.length)
        $('#' + id).datagrid('load');
    else
        $('#' + id).datagrid('reload');
}

function ngtosPopMessager(type, msg, fn)
{
    if (type == "success" && (msg == "" || msg == null)) {
        msg = $LANG.OPERATION_SUCCESS;
    }

    //打开弹出框n秒后跳转到登录页面
    if (typeof (fn) == 'string' && fn == "index") {
        fn = function() {
            //清除超时弹出框标记
            $.cookie("messager", null);
            //跳转到登录页面
            window.location.href = $.cookie('urlorg');
        }
        setTimeout(fn, 3000);
    }

    //弹出框，fn为回调函数
    switch (type) {
        case "error":
            $.messager.alert($LANG.ALERT, msg, 'error', fn);
            break;
        case "info":
            $.messager.alert($LANG.ALERT, msg, 'info', fn);
            break;
        case "success":
            $.messager.alert($LANG.ALERT, msg, 'success', fn);
            break;
        case "confirm":
            $.messager.confirm($LANG.ALERT, msg, fn);
            break;
    }
}
//这个方法就是执行选择的方法
function move_options(from_id, to_id, tag, selid) {
//    取得对应的id的匹配的元素，下面代码是取得对应的id的第1个元素
    var src_from = $("#" + from_id).get(0);
    var dst_to = $("#" + to_id).get(0);
    if (src_from == null || dst_to == null)
        return;

    if (src_from.options.sel_index == -1)
        return;

    var num = 0;
    for (var m = 0; m < src_from.options.length; m++)
    {
        if (src_from.options[m].selected) {
            num++;
        }
        if (num > 128) {
            ngtosPopMessager("error", $LANG.CAN_ONLY_CHOOSE);
            return;
        }
    }

    for (var i = 0; i < src_from.options.length; i++)
    {
        if (src_from.options[i].selected) {
            if (tag == 1)
                parent.moveSelNum++;
            else
                parent.moveSelNum--;
            var name = src_from.options[i].text;
            var ID = src_from.options[i].value;

            var is_existsitems = 0;
            for (var j = 0; j < dst_to.options.length; j++)
                if (dst_to.options[j].value == ID) {
                    is_existsitems = 1;
                    break;
                }

            src_from.options[i] = null;
            i--;

            if (is_existsitems == 0)
            {
                dst_to.options[dst_to.options.length] = new Option(name, ID);
                dst_to.options[dst_to.options.length - 1].title = ID;
            }

            move_result(tag, name);
        }
    }

    if (from_id.indexOf('vrc_item_cid') >= 0)
    {
        $('#sel_addr_num').html($LANG.SELECTED + parent.moveSelNum + $LANG.SEVERAL + parent.curstr);
    }
    else
        $('#' + selid).html($LANG.SELECTED + parent.moveSelNum + $LANG.SEVERAL);
}

function move_result(tag, name)
{
    if (tag == 1)
    {
        parent.selOptions.push(name);
        for (var m = 0; m < parent.sourOptions.length; m++)
        {
            if (parent.sourOptions[m] == name)
                parent.sourOptions.splice(m, 1);
        }
    }
    else
    {
        parent.sourOptions.push(name);
        for (var m = 0; m < parent.selOptions.length; m++)
        {
            if (parent.selOptions[m] == name)
                parent.selOptions.splice(m, 1);
        }
    }
}


function prepareLogout() {
    if ($('#logout_page').length <= 0) {
        $(document.body).append("<div id='logout_page' style='width: 400px;'></div>");
    }
    open_window('logout_page', 'Index', 'logoutWindow', $LANG.SIGN_OUT);
}


function doLogout(save) {
    var finish = false;
    if (save) {
        $.ajax({
            url: "?c=System/Config&a=fileSave",
            async: false,
            success: function(data) {
                if (data == 0) {
                    finish = true;
                } else {
                    ngtosPopMessager("error", $LANG.SAVE_CONFIG_FAIL);
                }
                $(".panel-loading").remove();
                $(".window-mask1").remove();
            }
        });
    }

    if ((save && finish) || !save) {
        $.ajax({
            url: "?c=Index&a=logout",
            async: false,
            success: function(data) {
                if (data != 'success') {

                }
                //window.location.href = "?c=Index&a=index";
                window.location.href = $.cookie('urlorg');
            }
        });
    }
}


function saveConfig() {
    $.ajax({
        url: "?c=System/Config&a=fileSave",
        async: true,
        success: function(data) {
            if (data == 0) {
                ngtosPopMessager("success", $LANG.SAVE_CONFIG_SUCCESS);
                $(".panel-loading").remove();
                $(".window-mask1").remove();
            }
            else {
                ngtosPopMessager("error", $LANG.SAVE_CONFIG_FAIL);
                $(".panel-loading").remove();
                $(".window-mask1").remove();
            }
        }
    });



}

//点击保存  出现loading效果
function saveConfigLoading() {
    $("body").append("<div class='panel-loading loading_center'><p>loading....</p></div>", "<div class='window-mask1'></div>");
    saveConfig();
}

function timeFormatterCheck(obj)
{
    var str = obj.value;
    if (str.length != 0)
    {
        var reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
        if (!reg.test(str))
        {
            ngtosPopMessager("error", $LANG.YTFOINC);
            obj.value = '00:00:00';
        }

    }
}

//格式化流量单位
function byte_format(size) {
    size = size ? size : 0;
    var pos = 0;
    var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var rge = /^-?\\d+(\\.\\d+)?$/;
    while (size >= 1024 && pos <= 5) {
        size /= 1024;
        pos++;
    }
    return size.toString().indexOf('.') != -1 ? size.toFixed(2) + unit[pos] : size + unit[pos];
}

//时间字符转时间戳
function js_strto_time(str_time) {
    var new_str = str_time.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return strtotime = datum.getTime() / 1000;
}
//字符串头尾去空格
function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function modCookies(url)
{
    url = '?' + url.split('?')[1];
    $.cookie('center_url', url, {secure: true});
}
/*
 * 功能：删除时，返回页码。在删除命令发送前调用，返回值在删除成功后使用。
 * param：id:datagrid控件id, rows:选中的行数组。
 * return: 返回页码值。
 * */
function return_pagenum(id, rows) {
    var options = $('#' + id).datagrid('getPager').data("pagination").options;
    var pnum = options.pageNumber;
    var total = options.total;
    var psize = options.pageSize;
    var curSize = (total - (pnum - 1) * psize) - (rows.length - 1);
    if (curSize == 1) {
        return pnum - 1;
    } else {
        return pnum;
    }
}

function clear_all_sels(from_id, to_id, tag, selid) {

    var src_from = $("#" + from_id).get(0);
    var dst_to = $("#" + to_id).get(0);

    if (src_from == null || dst_to == null)
        return;

    if (src_from.options.sel_index == -1)
        return;
    var num = 0;
    for (var i = 0; i < src_from.options.length; i++){
        var name = src_from.options[i].text;
        var ID = src_from.options[i].value;

        var is_existsitems = 0;
        for (var j = 0; j < dst_to.options.length; j++)
            if (dst_to.options[j].value == ID) {
                is_existsitems = 1;
                break;
            }

        src_from.options[i] = null;
        i--;

        if (is_existsitems == 0)
        {
            dst_to.options[dst_to.options.length] = new Option(name, ID);
            dst_to.options[dst_to.options.length - 1].title = ID;
        }

        move_result(tag, name);
    }
    if (from_id.indexOf('vrc_item_cid') >= 0)
    {
        $('#' + selid).html($LANG.SELECTED_0 + parent.curstr);
    }
    else
        $('#' + selid).html($LANG.SELECTED_0);
    parent.moveSelNum = 0;
}

function checkIpRangeVal(x, y, show) {
    var a = x.split("."), b = y.split(".")
    for (var i = 0; i < 4; i++) {
        if (parseInt(a[i]) > parseInt(b[i])) {
            //$(XID).focus();
            if (show == undefined) {
                ngtosPopMessager('info', $LANG.STSBLTTEOI);
            }
            return false;
        } else if (parseInt(a[i]) < parseInt(b[i])) {
            return true;
        }
    }
    return true;
}
/*
 var springweb_typeIsFireFox = false;
 var springweb_typeIsChrome = false;
 function waitMegBox(text)
 {
 //  onNgtosWinOpen();
 document.body.style.overflow = "auto";
 
 var divBackground = document.createElement("div");
 divBackground.id = "ngtos_cover2";
 
 divBackground.style.position = "fixed";
 divBackground.style.left = "0px";
 divBackground.style.top = "0px";
 divBackground.style.right = "0px";
 divBackground.style.bottom = "0px";
 if (springweb_typeIsChrome || springweb_typeIsFireFox) {
 divBackground.style.backgroundColor = "rgba(0,0,0,0.3)";
 } else {
 divBackground.style.backgroundColor = "#000";
 divBackground.style.filter = "alpha(opacity=20)";
 }
 divBackground.style.zIndex = "10";
 document.body.appendChild(divBackground);
 
 var divDialog = document.createElement("div");
 divDialog.id = "waitMegDiv";
 //    divDialog.innerHTML = '<div class="ngtos_datagrid_pop" width="65px"><img src="static/images/image/loading.gif"></div>';
 var showtext='';
 if(typeof(text)!='undefined' && text.length>0)
 showtext=text;
 else
 showtext="请等待，数据正在加载……";
 divDialog.innerHTML = '<div class="waitMsgDiv">'+'<img src="./Public/images/image/loading.gif" style="margin-left: 10px">&nbsp;&nbsp;'+showtext+'</div>';
 
 divDialog.style.position = "absolute";
 var w = 200;
 if ($('#leftdiv', parent.document).is(":hidden"))
 divDialog.style.left = (parent.document.body.clientWidth - w) / 2 + "px";
 else
 divDialog.style.left = (parent.document.body.clientWidth - w) / 2 - 190 + "px";
 divDialog.style.top = 100 + "px";
 divDialog.style.zIndex = "20";
 
 divDialog.focus();
 document.body.appendChild(divDialog);
 
 }
 /*
 function closeWaitBox()
 {
 onNgtosWinClose();
 document.body.removeChild(document.getElementById('ngtos_cover2'));
 document.body.removeChild(document.getElementById('waitMegDiv'));
 
 if (document.getElementById('adduserDiv2'))
 document.body.removeChild(document.getElementById('adduserDiv2'));
 }
 function onNgtosWinOpen() {
 //var winNumO = $.cookie("winNum");
 //if (winNumO == 0) {
 if (top.windowNum == 0) {
 parent.document.getElementById('ngtos_cover').style.display = 'block';
 parent.document.getElementById('ngtos_cover').style.zIndex = '0';
 parent.document.getElementById('centerdiv_main').style.zIndex = '9000';
 }
 //$.cookie("winNum", Number(winNumO) + 1);
 top.windowNum = top.windowNum + 1;
 }
 
 function onNgtosWinClose() {
 //var winNumC = $.cookie("winNum");
 //if (winNumC == 1) {
 if (top.windowNum == 1) {
 parent.document.getElementById('ngtos_cover').style.display = 'none';
 }
 //$.cookie("winNum", Number(winNumC) - 1);
 top.windowNum = top.windowNum - 1;
 } 
 */

function mouseMove(ev)
{
    ev = ev || window.event;
    var mousePos = mouseCoords(ev);
//alert(ev.pageX); 
//    document.getElementById("xxx").value = mousePos.x;
//    document.getElementById("yyy").value = mousePos.y;
    if (mousePos.x <= 40) {
        $('#treebar').show();
        if (typeof ($.cookie('left_menu_show')) != 'undefined' && $.cookie('left_menu_show') == 1) {
            $('#jt_left').attr("src", NG_PATH + "Public/images/icon/icon_arrow_14.png");
            $('#treebar').css("left", "0");
        } else {
            $('#jt_left').attr("src", NG_PATH + "Public/images/icon/icon_arrow_03.png");
            $('#treebar').css("left", "10px");
        }
    } else {
        $('#treebar').hide();
    }
}

function mouseCoords(ev)
{
    if (ev.pageX || ev.pageY) {
        return {x: ev.pageX, y: ev.pageY};
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

//function checkOnline() {
//    $.ajax({
//        url: "?c=Index&a=checkOnline",
//        type: 'POST',
//        success: function(data) {
//            if (data != 0) {
//                ngtosPopMessager("error", '登录超时，请重新登录!', 'index');
//            }
//        }
//    });
//}
//
//
//function getTimeout() {
//    $.ajax({
//        url: "?module=page_support&action=timeout",
//        type: 'POST',
////        async: false,
////        timeout: 50,
//        success: function(data) {
//            if (data < 0) {
////                alert("登录超时，请重新登录！");
//                if ($.cookie("messager") != 1) {
//                    $.cookie("messager", 1);
//                    ngtosPopMessager("error", '登录超时，请重新登录!', 'login');
//                }
//            } else {
//                $.cookie("timeout", data);
//            }
//        },
//        error: function() {
//            $.cookie("timeout", 0);
//        }
//    });
//}
//

//发送认证请求，保持在线
function keepAlive() {
    $.ajax({
        url: "?c=Index&a=keepAlive",
        type: 'POST',
//        async: false,
//        timeout: 50,
        success: function(data) {
            if (data < 0) {
                if ($.cookie("messager") != 1) {
                    $.cookie("messager", 1, {secure: true});
                    ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, 'index');
                }
            } else {
                $.cookie("idletime", 0, {secure: true});
            }
        }
    });
}

//手动更新在线时间
//function handAlive() {
//    if (Number($.cookie("timeout")) != 0 && Number($.cookie("idletime")) >= Number($.cookie("timeout")) * 0.8) {
//        keepAlive();
////        $.cookie("idletime", 0);
//    }
//}

//更新在线时间，超时提示错误框
function updateIdletime() {
    //timeoutSuspend超时检查暂停标记，当修改用户超时时间时启用
    if ($.cookie("timeoutSuspend") == 1 || Number($.cookie("timeout")) == 0) {
        return;
    }
    if (Number($.cookie("timeout")) > 0) {
        var temp = ($.cookie("idletime")) ? Number($.cookie("idletime")) + 1 : 1;
        $.cookie("idletime", temp, {secure: true});

        if (Number($.cookie("idletime")) >= Number($.cookie("timeout"))) {
            if ($.cookie("messager") != 1) { //超时框标记
                $.cookie("messager", 1, {secure: true});
                $.cookie("idletime", 0, {secure: true});
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, 'index');
            }
        }
    }
}

//检查通信错误信息
function checkComm() {
    if (Number($.cookie("commflag")) < 0) {
        if ($.cookie("messager") != 1) { //超时框标记
            $.cookie("messager", 1, {secure: true});
            var msg = $.cookie("commmsg");
            $.cookie("commflag", 0, {secure: true});
            $.cookie("commmsg", "", {secure: true});
            ngtosPopMessager("error", msg, 'index');
        }
    }
}

function checkSave() {
    //saveFlagSuspend停止闪烁标识。鼠标浮动到保存按钮，停止闪烁
    if ($.cookie("saveFlagSuspend") == 1) {
        return;
    }
    if ($.cookie("saveFlag") == 1) {
        if ((x = MM_findObj("saveImage")) != null) {
            var index = x.src.lastIndexOf("/");
            var pic = x.src.substring(index + 1, x.src.length);
            if (pic == "bc1.png") {
                x.src = "../images/image/bc2.png";
            } else {
                x.src = "../images/image/bc1.png";
            }
        }
    } else {
        if ((x = MM_findObj("saveImage")) != null) {
            var index = x.src.lastIndexOf("/");
            var pic = x.src.substring(index + 1, x.src.length);
            if (pic != "bc1.png") {
                x.src = "../images/image/bc1.png";
            }
        }
    }
}

/*
 * combo 等组件下拉添加按钮
 * 参数：fun 函数字符串
 * 使用：$("#comboId").combo("panel").after(comboBut("add_time('添加')"));
 * */
function comboBut(fun, id) {
    var combotoolbar = "<div id='" + id + "' class=\"combo-addBut \"><a href=\"#\" class=\"easyui-linkbutton\" data-options=\"iconCls:'icon-add',plain:true\"onClick=\"" + fun + "\"><span class=\"l-btn-left l-btn-icon-left\"><span class=\"l-btn-text\">" + $LANG.ADD + "</span><span class=\"l-btn-icon icon-add\"> </span></span></a></div>";
    return combotoolbar;
}

//清空文本框与checkbox
$.fn.textclear = function() {
    return $(this).find("input[type='text']").each(function() {
        $(this).val("");
    });
}

$.fn.checkclear = function() {
    return $(this).find("input[type='checkbox']").each(function() {
        $(this).attr("checked", false);
    });
}

$.fn.textdisabled = function() {
    return $(this).find("input[type='text']").each(function() {
        $(this).attr('disabled', 'true');
    });
}

$.fn.textenable = function() {
    return $(this).find("input[type='text']").each(function() {
        $(this).removeAttr('disabled');
    });
}

//计算字符串中字符个数（包括中英文）
function getStrLength(str)
{
    var num = 0;
    for (var i = 0; i < str.length; i++)
    {
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128)
            num += 1;
        else
            num += 3;
    }
    return num;
}

//计算字符串中字符个数（包括中英文)
function StrLengthnumber(str,number)
{
    var num = 0;
    for (var i = 0; i < str.length; i++)
    {
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128)
            num += 1;
        else
            num += 3;
    }
    return (num<=number);
}

/*
 * 获得中英混合字符串长度（备用） 
 * @param string str
 * @returns int
 */
/*
 function getStrLength(str)
 {
 var len = 0;
 if (str.match(/[^ -~]/g) == null) {
 len = str.length;
 } else {
 len = str.length + str.match(/[^ -~]/g).length;
 }
 
 return len;
 }
 */

//判断数组中是否存在指定元素
function isArrayValue(objArray, objValue) {
    var isExit = false;
    if (null != objArray && typeof (objArray) != 'undefined') {
        for (var i = 0; i < objArray.length; i++) {
            if (objArray[i] == objValue) {
                isExit = true;
                break;
            }
        }
    }
    return isExit;
}

function doSearchBlock(stag, event, sel_id, type)
{
    event = event ? event : window.event;
    /*if (type == '1')
     var obj = $('#' + sel_id);
     else
     var obj = $('#adduserDiv2').find('#' + sel_id);*/
    var obj = $('#' + sel_id);
    var soptions = ""

    if (navigator.userAgent.indexOf("Firefox") > 0) {
        obj.find('option').each(function() {
            if ($(this).text().toLowerCase().indexOf(stag.toLowerCase()) >= 0)
                $(this).show();
            else
                $(this).hide();
        });
    } else if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
        obj.find('option').each(function() {
            if ($(this).text().toLowerCase().indexOf(stag.toLowerCase()) < 0) {
                var ss = $('<div style="display:none">' + $(this).text() + '</div>');
                obj.append(ss);
                $(this).remove();
            }

        });
        obj.find('div').each(function() {
            if ($(this).text().toLowerCase().indexOf(stag.toLowerCase()) >= 0) {
                var ss = $('<option title=' + $(this).text() + '>' + $(this).text() + '</option>');
                obj.append(ss);
                $(this).remove();
            }
        });
    } else {
        for (var i = 0; i < obj[0].children.length; i++) {
            if (obj[0].children(i).innerText.toLowerCase().indexOf(stag.toLowerCase()) >= 0)
                showone(obj[0], i);
            else
                hideone(obj[0], i);
        }
    }
}

function hideone(theselect, index)
{
    var oldOption = theselect.children(index);
    var oldStr = oldOption.innerText;
    var newOption = document.createElement('<div' + oldOption.outerHTML.match(/(<\w*)([^>]*)(>)/)[2] + '>');
    newOption.innerText = oldStr;
    newOption.swapNode(oldOption);
}

function showone(theselect, index)
{
    var oldOption = theselect.children(index);
    if (oldOption.tagName == 'DIV')
    {
        var oldStr = oldOption.innerText;
        var newOption = document.createElement('<option' + oldOption.outerHTML.match(/(<\w*)([^>]*)(>)/)[2] + '>');
        newOption.innerText = oldStr;
        newOption.swapNode(oldOption);
    }
}

//获得浏览器类型
function getBrowserType()
{
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    ua.match(/msie ([\d.]+)/) ? Sys.ie = 1 :
            ua.match(/firefox\/([\d.]+)/) ? Sys.firefox = 1 :
            ua.match(/chrome\/([\d.]+)/) ? Sys.chrome = 1 :
            ua.match(/opera.([\d.]+)/) ? Sys.opera = 1 :
            ua.match(/version\/([\d.]+).*safari/) ? Sys.safari = 1 : 0;

    return Sys;
}

//调用函数，返回一个数组,r[0]是浏览器名称，r[1]是版本号
function getBrowser() {
    var ua = window.navigator.userAgent,
            ret = "";

    if (/Firefox/g.test(ua)) {
        ua = ua.split(" ");
        ret = "Firefox|" + ua[ua.length - 1].split("/")[1];
    } else if (/MSIE/g.test(ua)) {
        ua = ua.split(";");
        ret = "IE|" + ua[1].split(" ")[2];
    } else if (/Opera/g.test(ua)) {
        ua = ua.split(" ");
        ret = "Opera|" + ua[ua.length - 1].split("/")[1];
    } else if (/Chrome/g.test(ua)) {
        ua = ua.split(" ");
        ret = "Chrome|" + ua[ua.length - 2].split("/")[1];
    } else if (/^apple\s+/i.test(navigator.vendor)) {
        ua = ua.split(" ");
        ret = "Safair|" + ua[ua.length - 2].split("/")[1];
    } else {
        ret = $LANG.UNKNOWN_BROWER;
    }
    return ret.split("|");
}




/*获取登录用户名*/
function getAdminName() {
    var name = "";
    $.ajax({
        url: "?c=Index&a=getLoginName",
        type: 'POST',
        async: false,
        success: function(data) {
            if (data > 0) {
                name = data;
            }
        }
    });
    return name;
}

//判断js变量是否为空
function isEmpty(v) {
    switch (typeof v) {
        case 'undefined':
            return true;
        case 'string':
            if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0)
                return true;
            break;
        case 'boolean':
            if (!v)
                return true;
            break;
        case 'number':
            if (0 === v || isNaN(v))
                return true;
            break;
        case 'object':
            if (null === v || v.length === 0)
                return true;
            for (var i in v) {
                return false;
            }
            return true;
    }
    return false;
}

//判断当前用户是否是虚系统管理员
function isShared() {
    var isShare;
    $.ajax({
        url: "?c=Resource/ObjShared&a=isShared",
        type: 'POST',
        dataType: 'text',
        async: false,
        success: function(data) {
            if (data == 'yes') {
                isShare = true;
            } else {
                isShare = false;
            }
        }
    });
    return isShare;
}

function jsStrtoTime(str_time) {
    var new_str = str_time.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return strtotime = datum.getTime() / 1000;
}

function jsDateTime(unixtime) {
    var timestr = new Date(parseInt(unixtime) * 1000);
    var datetime = dateToStr(timestr);
    return datetime;
}
function dateToStr(datetime) {

    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;//js从0开始取
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minutes = datetime.getMinutes();
    var second = datetime.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (second < 10) {
        second = "0" + second;
    }

    var time = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second; //2009-06-12 17:18:05
    return time;
}


function handleRuntime(obj) {
    var tmp_arr = obj.split("-");
    var str_day = tmp_arr[0];
    var str_hour = tmp_arr[1];
    var str_minute = tmp_arr[2];
    var str_second = tmp_arr[3];
    var tmp = "";
    if (str_day !== "0") {
        if (str_day == 1) {
            tmp += str_day + ' day, ';
        } else {
            tmp += str_day + ' days, ';
        }
    }
    tmp += str_hour + ":" + str_minute + ":" + str_second;
    return tmp;
}