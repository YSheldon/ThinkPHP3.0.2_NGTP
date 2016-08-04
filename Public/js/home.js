var total_width;
var sub_width;
var li_num;
$(document).ready(function() {
    /*检查浏览器宽度，如果缩小到一定程度，右上角模块hide*/
    li_num = $('#topdiv_menu').find('.topmenu').length;
    topmenuChangeStyle();
    $(window).resize(function() {
        topmenuChangeStyle();
        if ($('.easyui-layout').length > 0)
            $('.easyui-layout').layout('resize');

    });
    //可见区域宽高
    var cw = document.documentElement.clientWidth;
    var ch = document.documentElement.clientHeight;
    //弹出框宽高
    var pw = $("#panel").width();
    var ph = $("#panel").height();
    //图片宽高
    var iw = $("#img").width();
    var ih = $("#img").height();

    var hiw = iw / 2;
    var hih = ih / 2;
    $('#panel').unbind().bind('mouseleave', function() {
        setTimeout(function() {
            $("#panel").hide();
            closeToSide('', cw, iw, ch, ih);
        }, 1000);
    });

    $('#sidebar').mouseenter(function() {
        //从半隐藏状态显示全部
        var left = $("#sidebar").css('left').substring(0, $("#sidebar").css('left').indexOf('px'));
        if (left == cw - hiw) {
            $("#sidebar").css('left', cw - iw);
        } else if (left == -hiw) {
            $("#sidebar").css('left', 0);
        }

        var top = $("#sidebar").css('top').substring(0, $("#sidebar").css('top').indexOf('px'));
        if (top == ch - hih) {
            $("#sidebar").css('top', ch - ih);
        } else if (top == -hih) {
            $("#sidebar").css('top', 0);
        }

        $('#sidebar').draggable({'disabled': false});
        showPanel(this, cw, pw, iw, ch, ph, ih);
    });

    // $('#sidebar').draggable({
    //     handle: '#img',
    //     disabled: false, //
    //     onBeforeDrag: function() {
    //         $("#panel").hide();
    //     },
    //     onStartDrag: function() {
    //         $(this).draggable('options').cursor = "not-allowed";
    //     },
    //     onDrag: function() {

    //     },
    //     onStopDrag: function() {
    //         $(this).draggable('options').cursor = "move";
    //         $(this).draggable({'disabled': true});
    //         closeToSide('', cw, iw, ch, ih);
    //     }
    // });
    //当前模块
    curModuleArr = eval(curModuleJsonStr);
    //带定时器模块
    intervalModuleArr = eval(intervalModuleJsonStr);
    //第一次进入或者刷新页面加载模块
    loadUserModules(curModuleArr, false, true);
    initSortable();
    $(".import-module-center :checkbox").change(function() {
        if (this.checked == true) {
            importModule(this.id);
        } else {
            if (inArray(this.id, intervalModuleArr) === false) {
                closeModule(this.id);
            } else {
                //目前默认interval的id与模块id相同；否则需要修改此函数
                closeModuleInterval(this.id);
            }
        }
    });
    //添加回到页面顶部
    $($("#center")[0]).scroll(function() {
        if ($("#center")[0].scrollTop > 150) {
            $("#back-to-top").fadeIn(1500);
        } else {
            $("#back-to-top").fadeOut(1500);
        }
    });
    //当点击跳转链接后，回到页面顶部位置
    $("#back-to-top").click(function() {
        $('html,body,#center').animate({scrollTop: '0px'}, 1000);
        return false;
    });
});
/*初始化拖动事件*/ 
function initSortable() {
    $('.home-center').css('height', $("#center").height());
    $(".home-center").sortable({
        revert: true, //如果设置成true，则被拖拽的元素在返回新位置时，会有一个动画效果
        connectWith: ".home-center", //允许sortable对象连接另一个sortable对象，可将item元素拖拽到另一个中
        tolerance: "intersect", //设置当拖动元素越过其它元素多少时便对元素进行重新排序。可选值：intersect：至少重叠50%;pointer：鼠标指针重叠元素
        opacity: 0.8, //定义当排序时，辅助元素(helper)显示的透明度
        items: ".module-half-body , .module-full-body", //指定在排序对象中，哪些元素是可以进行拖拽排序的
        cursor: 'move', //定义在开始排序动作时，如果的样式
        handle: '.module-header', //限制排序的动作只能在item元素中的某个元素开始
        start: function(event, ui) {
            $('.home-center').css('height', $("#center").height());
        },
        stop: function() {
            $('.home-center').css('height', $("#center").height());
            //获得当前顺序
            var modules = $("#center > div");
            var len = modules.length;
            var tmpModuleArr = new Array();
            for (var i = 0; i < len; i++) {
                var moduleId = modules[i].id.substr(0, modules[i].id.length - 7);
                tmpModuleArr.push(moduleId);
            }
            //如果变化存数据库
            if (tmpModuleArr.toString() !== curModuleArr.toString()) {
                save_modules_layout(JSON.stringify(tmpModuleArr));
                curModuleArr = tmpModuleArr;
            }
        }
    });
}

/*
 * 加载用户模块 
 * @param Array moduleArr   需要在的模块数组
 * @param boolean saveFlag  是否保存到数据库
 * @param boolean clearFlag 是否清空div
 * @returns 无
 */
function loadUserModules(moduleArr, saveFlag, clearFlag) {
    var showLen = moduleArr.length;
    var i = 0;
    var id = '';
    var flag = false;
    var modules = '';
    var curLen = 0;
    if (clearFlag) {
        $("#center").html('');
    }
    $.each(moduleArr, function(index, module) {
        //如果模块已存在，不再重新加载
        if ($("#" + module + '_module').length == 0) {
            $.ajax({
                url: '?c=Home/' + module + '&a=' + module,
                type: 'POST',
                dataType: 'html',
                success: function(data) {
                    modules = $("#center").find('div');
                    curLen = modules.length;
                    flag = false;
                    if (curLen == 0) {
                        //div为空，直接添加
                        $("#center").append(data);
                    } else {
                        //先检查后面的模块是否已加载
                        for (i = index + 1; i < showLen; i++) {
                            id = moduleArr[i];
                            if ($('#' + id + '_module').length) {
                                $('#' + id + '_module').before(data);
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            //如果后面模块均未加载再检查前面的模块是否已存在
                            for (i = index - 1; i >= 0; i--) {
                                id = moduleArr[i];
                                if ($('#' + id + '_module').length) {
                                    $('#' + id + '_module').after(data);
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }
    });
    if (saveFlag) {
        //保存到数据库
        //JSON.stringify 数组转json
        save_modules_layout(JSON.stringify(moduleArr));
    }
    //初始化全选按钮的选中和取消
    checkboxIsCheckall();
}
/*
 * 导入模块，追加到最后
 * @param string module
 * @returns 无
 */
function importModule(module) {
    curModuleArr.push(module);
    loadUserModules(curModuleArr, true, false);
}

/*
 * 把当前的模块保存到数据库
 * @param json moduleStr
 * @returns 无
 */
function save_modules_layout(moduleStr) {
    $.ajax({
        url: '?c=Index&a=saveModulesLayout',
        type: 'POST',
        timeout: 30000,
        dataType: 'html',
        data: {
            modules: moduleStr
        },
        success: function(data) {
            //最好加一下判断
        }
    });
}

/*
 * 关闭模块,无定时器
 * @param string moduleId
 * @returns 无
 */
function closeModule(moduleId) {
    $('#' + moduleId + '_module').remove();
    $("#" + moduleId).attr('checked', false);
    checkboxIsCheckall();

    var index = inArray(moduleId, curModuleArr);
    if (index !== false) {
        curModuleArr.splice(index, 1);
        save_modules_layout(JSON.stringify(curModuleArr));
    }
}

/*
 * 关闭模块，带定时器
 * @param string moduleId
 * @returns 无
 */
function closeModuleInterval(moduleId) {
    closeModule(moduleId);
    clearInterval(eval(moduleId + '_interval'));
}

//检查是否已全选
function checkboxIsCheckall() {
    var checkall = true;
    $(".module-list :checkbox[name='modules_check']").each(function() {
        if (!this.checked) {
            checkall = false;
        }
    });
    document.getElementById('check_all').checked = checkall;
}

/*
 * 全选,追加在最后|取消全选
 * @param object obj
 * @returns 无
 */
function checkAll(obj) {
    if (obj.checked) {
        $(".module-list :checkbox[name='modules_check']").each(function() {
            if (inArray(this.id, curModuleArr) === false) {
                this.checked = true;
                curModuleArr.push(this.id);
            }
        });
        loadUserModules(curModuleArr, true, false);
    } else {
        $(".module-list :checkbox[name='modules_check']").each(function() {
            this.checked = false;
        });
        cleanModules();
    }
}

/*清除所有模块*/
function cleanModules() {
    $("#center").html('');

    //清空时要清除定时器
    var len = curModuleArr.length;
    for (var i = 0; i < len; i++) {
        if (inArray(curModuleArr[i], intervalModuleArr) !== false) {
            clearInterval(eval(curModuleArr[i] + '_interval'));
        }
    }
    curModuleArr = [];
    save_modules_layout('[]');
}

/*
 * 加载默认模块
 * @returns 无
 */
function reset_module() {
    var defaultModuleArr = eval(defaultModuleJsonStr);
    $(".module-list :checkbox[name='modules_check']").each(function(index) {
        var module = $(this).attr('id');
        if (this.checked) {
            //因为目前reset清空div,所以需要清除所有定时器
            if (inArray(module, intervalModuleArr) !== false) {
                clearInterval(eval(module + '_interval'));
            }
        }

        if (inArray(module, defaultModuleArr) === false) {
            $(this).prop('checked', false);
        } else {
            $(this).prop('checked', true);
        }
    });
    curModuleArr = defaultModuleArr;
    loadUserModules(defaultModuleArr, true, true);
}

/*
 * 检查element是否在dataArr中,在返回序号,不在返回false;
 * @param {string} element
 * @param {array} dataArr
 * @returns {int|Boolean}
 */
function inArray(element, dataArr) {
    var isexte = false;
    $.each(dataArr, function(index) {
        if ($.trim(this) == $.trim(element)) {
            isexte = index;
            //$each返回false将停止循环;true跳至下一个循环
            return false;
        }
    });
    return isexte;
}

/**
 * 跳转页面
 * @param  {[str]} url      跳转的页面地址，如果没有刷新页面
 * @param  {[str]} bannername 一级菜单名称
 * @return {[type]}            [description]
 */
function pageToMain(url, buf) {
    location.href = url;
}

function closeToSide(offset, cw, iw, ch, ih) {
    if (offset == null || offset == '') {
        offset = 40;
    }
    var hiw = iw / 2;
    var hih = ih / 2;

    //靠边效果
    var left = $("#sidebar").css('left');
    var top = $("#sidebar").css('top');
    left = left.substring(0, left.indexOf('px'));
    if (left < offset) {
        $("#sidebar").css('left', -hiw);
    } else if (cw - left - iw < offset) {
        $("#sidebar").css('left', cw - hiw);
    }
    top = top.substring(0, top.indexOf('px'));
    if (top < offset) {
        $("#sidebar").css('top', -hih);
    } else if (ch - top - ih < offset) {
        $("#sidebar").css('top', ch - hih);
    }
}

function showPanel(e, cw, pw, iw, ch, ph, ih) {
    //图片位置top/left
    var top = e.offsetTop;
    var left = e.offsetLeft;
    while (e = e.offsetParent) {
        top += e.offsetTop;
        left += e.offsetLeft;
    }

    if (top + ih + ph > ch) {
        $("#panel").css('top', top - ph);
    } else {
        $("#panel").css('top', top + ih);
    }

    if (left + pw > cw) {
        $("#panel").css('left', cw - pw);
    } else {
        $("#panel").css('left', left);
    }

    $("#panel").show();
}

function moduleKeepAlive() {
    if ($('input[name=modules_check][checked]').length > 0) {
        keepAlive();
    }
}
var interFaceDataGrid = {};     //接口表格对象，用于刷新时不再重新创建表格，保持原来属性[分页保持]
function  createInterfaceTable() {
    // if(interFaceDataGrid.length > 0) {
    //     interFaceDataGrid.datagrid('reload');
    //     return;
    // }
    interFaceDataGrid = $('#interface_state_table').datagrid({
        fitColumn: true,
        singleSelect: true,
        collapsible: true,
        nowrap: true,
        striped: true,
        remoteSort: false,
        height: 310,
        url: '?c=Network/Physics&a=datagridShow',
        queryParams:{
            mod:'network physicalinterface'
        },
        pagination: true,
        pageSize: 20,
        pageList: [20, 40, 60],
        columns: [
            [{
                field: 'interface_name',
                title: $LANG.INTERFACE_NAME,
                width: '100'
            }, {
                field: 'link_status',
                title: $LANG.LINK_STATE,
                width: '100',
                formatter: function(value) {
                    if (value == "up") {
                        var s = '<img src="' + NG_PATH + 'Public/images/icon/interface_normal.png" title="'+$LANG.CONNECT+'"/>';
                        return s;
                    } else {
                        var e = '<img src="' + NG_PATH + 'Public/images/icon/interface_abnormal.png" title="'+$LANG.UNCONNECT+'"/>';
                        return e;
                    }
                }
            }, {
                field: 'comm_type',
                title: $LANG.IF_MODE,
                width: '100',
                formatter: function(value) {
                    if (value == "routing") {
                        return $LANG.ROUTE;
                    }
                    else if (value == "switching") {
                        return $LANG.NETWORK_SWITCH;
                    }
                    else if (value == "virtualline") {
                        return $LANG.VLINE;
                    }
                    else if (value == "slave") {
                        return "SLAVE";
                    }
                }
            }, {
                field: 'mtu',
                title: 'MTU',
                width: '100'
            }, {
                field: 'shutdown',
                title: $LANG.STATE,
                width: '100',
                formatter: function(value) {
                    if (value == "enable") {
                        return $LANG.ENABLE;
                    } else {
                        return $LANG.DOWN;
                    }
                }
            }, {
                field: 'speed',
                title: $LANG.SPEED,
                width: '150',
                formatter: function(value) {
                    if (value == "unknown speed") {
                        return " ";
                    } else {
                        return value;
                    }
                }
            }]
        ]
    });
}

function refurbishInterfaceData() {
    if ($('#interface_state_type').val() == 'table') {
        $('#interface_state_table').datagrid('reload');
    } else {
        $.ajax({
            url: '?c=Network/Physics&a=callFun',
            timeout: 30000,
            type: 'POST',
            data: {
                fun:'dataShow',
                mod:'network physicalinterface'
            },
            dataType: 'json',
            success: function(data) {
                $('#interface_list').html('');
                if (data.rows.length == 0) {
                    $('#InterfaceState_module').find('.module-content').html('没有数据！');
                    return false;
                }
                $.each(data.rows, function() {
                    if (this.link_status == 'up') {
                        var icon = 'interface_normal.png';
                    } else {
                        var icon = 'interface_abnormal.png';
                    }
                    var html = '<img style="padding-right: 15px;" title="'+$LANG.NAME+'：<b>' + this.interface_name + '</b><br/>';
                    if (this.mtu)
                        html += 'MTU：<b>' + this.mtu + '</b><br />';
                    if (this.comm_type) {
                        if (this.comm_type == "routing") {
                            html += ''+$LANG.IF_MODE+'：<b>'+$LANG.ROUTE+'</b><br />';
                        }
                        else if (this.comm_type == "switching") {
                            html += ''+$LANG.IF_MODE+'：<b>'+$LANG.NETWORK_SWITCH+'</b><br />';
                        }
                        else if (this.comm_type == "virtualline") {
                            html += ''+$LANG.IF_MODE+'：<b>'+$LANG.VLINE+'</b><br />';
                        }
                        else if (this.comm_type == "slave") {
                            html += ''+$LANG.IF_MODE+'：<b>slave</b><br />';
                        }
                    }
                    if (this.link_status == "up") {
                        if (this.duplex) {
                            if (this.duplex == "Full-duplex") {
                                html += ''+$LANG.DUPLEX+'：<b>'+$LANG.FULL+'</b><br />';
                            }
                            else if (this.duplex == "Half-duplex") {
                                html += ''+$LANG.DUPLEX+'：<b>'+$LANG.HALF+'</b><br />';
                            }
                            else {
                                html += ''+$LANG.DUPLEX+'：<b>'+$LANG.ADAPT+'</b><br />';
                            }
                        }
                    } else {
                        html += ''+$LANG.DUPLEX+'：<b>-</b><br />';
                    }
                    if (this.link_status == "up") {
                        if (this.speed == "unknown speed") {
                            if (this.speed)
                                html += ''+$LANG.SPEED+'： <br />';
                        } else {
                            if (this.speed)
                                html += ''+$LANG.SPEED+'：<b>' + this.speed + '</b><br />';
                        }
                    } else {
                        html += ''+$LANG.SPEED+'：<b>-</b><br />';
                    }
                    if (this.ip4.length !== 0) {
                        var ip4 = this.ip4.replace(/\/no_ha_static/g, "");
                        ip4 = ip4.replace(/\/ha_static/g, "");
                        //ip4 = ip4.replace(/\/no_secondary/g, "");
                        //ip4 = ip4.replace(/\/secondary/g, "");
                        var ret = "";
                        var single = ip4.split(",");
                        for (var i = 0; i < single.length; i++) {
                            var iparr = single[i].split("/");
                            var maskarr = iparr[1].split(".");
                            var sum = 0;
                            for (var j = 0; j < maskarr.length; j++) {
                                var str = decToBin(maskarr[j]);
                                var len = (str.split("1")).length - 1;
                                sum += len;
                            }
                            ret += iparr[0] + "/" + sum + "<br/>";
                        }
                        html += 'IPv4：<br /><b>' + ret + '</b>';
                    }
                    if (this.ip6.length !== 0) {
                        var ip6 = this.ip6.replace(/\/no_ha_static/g, "");
                        ip6 = ip6.replace(/\/ha_static/g, "");
                        ip6 = ip6.replace(/\/secondary/g, "");
                        ip6 = ip6.replace(/\/no_secondary/g, "");
                        ip6 = ip6.replace(/\/linklocal/g, "");
                        ip6 = ip6.replace(/\/no_linklocal/g, "");
                        html += 'IPv6：<br /><b>' + ip6.replace(/,/g, '<br />') + '</b><br />';
                    }
                    html += ''+$LANG.SEND_PACKET+'：<b>' + this.recv_all_pkts + '</b><br />';
                    html += ''+$LANG.SEND_BYTE+'：<b>' + this.recv_all_bytes + '</b><br />';
                    html += ''+$LANG.RECV_PACKET+'：<b>' + this.xmit_all_pkts + '</b><br />';
                    html += ''+$LANG.RECV_BYTE+'：<b>' + this.xmit_all_bytes + '</b><br />';
                    html += ''+$LANG.DROP_PACKET+'：<b>' + this.discard_pkts + '</b><br />';

                    html += '" class="simpletooltip right-top pastelblue" width="18" height="14" src="' + NG_PATH + 'Public/images/icon/' + icon + '" />';
                    $(html).appendTo($("#interface_list"));
                });
                $.simpletooltip();
            }
        });
    }
}

//十进制转二进制
function decToBin(intNum) {
    var answer = "";
    if (/\d+/.test(intNum)) {
        while (intNum != 0) {
            answer = Math.abs(intNum % 2) + answer;
            intNum = parseInt(intNum / 2);
        }
        if (answer.length == 0)
            answer = "0";
        return answer;
    } else {
        return 0;
    }
}

function removeLoading(moduleId) {
    $('#' + moduleId + '_module').find('.loading').remove();
    $('#' + moduleId + '_module').find('.chartdiv').show();
}
var moduleSlide = function(obj) {
    $(obj).parents('.module').find('.module-content').slideToggle('slow', function() {
        $(obj).toggleClass('slide-down-icon');
    });
};
