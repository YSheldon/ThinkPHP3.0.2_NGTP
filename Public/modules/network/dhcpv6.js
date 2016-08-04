/*
 * 
 *  DHCP服务端
 * 
 * */
if ($.cookie("language") == "en") {
    language = "server is running,can't make any config!";
} else {
    language = "服务已经运行，无法进行任何配置!";
}
//添加/编辑地址池处理
function addAddrPoolSubmit(tag) {
    var prefi = $("#prefix").val();
    var prefix1 = '/64';
    var prefix = prefi+prefix1;
	var sub_start = $("#sub_start").val();
	var sub_end = $("#sub_end").val();
    var reserve_start = $("#reserve_start").val();
    var reserve_end = $("#reserve_end").val();
	var lease_day = $("#lease_day").val();
    var clock = $("#clock_cid").val();
    var clock_arr = clock.split(':');
    var lease_hour = clock_arr[0];
    var lease_min = clock_arr[1];
	var sub_name = $("#sub_name").val();
	var pri_dns = $("#pri_dns").val();
	var sec_dns = $("#sec_dns").val();
	var domain = $("#domain").val();
	$.ajax({
		url: "?c=Network/Dhcpv6Server",
		type: changeType,
		datatype:'text',
		data:{
            prefix : prefix,
			prefi : prefi,
			sub_start : sub_start,
			sub_end : sub_end,
            reserve_start : reserve_start,
            reserve_end : reserve_end,
			lease_day : lease_day,
			lease_hour : lease_hour,
			lease_min : lease_min,
			sub_name : sub_name,
			pri_dns : pri_dns,
			sec_dns : sec_dns,
			domain : domain,
            dhcpPool_tag : tag,
            select_add_type:'dhcp_pool'
		},
		success: function(data) {
			if (data == 0) {
                $("#add_addrPool").window("close");
                datagridReload("tt");
			} else {
                ngtosPopMessager("error", data);
			}
		}
	});
}

//添加地址池弹出框
function addAddrDhcpv6Pool() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language);
    } else {
        dhcpPool_tag = 1;
        changeType = 'post';
        open_window('add_addrPool','Network/Dhcpv6Server','windowShow&w=network_dhcpv6_addPool_window',$LANG.ADD);
    }
}

//删除地址池
function delDhcpv6Pool() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language);
    } else {
        var rows = $('#tt').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var sub_name = [];
                for (var i=0; i<rows.length; i++) {
                    sub_name.push(rows[i]['sub_name']);
                }
                    sub_name = sub_name.join('#');
                    $.ajax({
                        url: "?c=Network/Dhcpv6Server&mod=dhcpv6&act=d_subnet",
                        type: 'delete',
                        dataType: 'json',
                        async: false,
                        data: {
//                            mod:'network dhcpv6 server',
                            delItems:sub_name,
                            delKey:'sub_name'
//                            act:'del_subnet'
                        },
                        success: function(data) {
                            if (data != "0") {
                                ngtosPopMessager("error",data);
                            }
                        }
                    });
                datagridReload("tt");
            }
        },true)
    }
}

//清空地址池
function clearDhcpv6Pool() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language);
    } else {
        ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
            if (r) {
                $.ajax({
                    url: "?c=Network/Dhcpv6Server&mod=dhcpv6&act=c_subnet&all=1",
/*                    data:{
                        mod:'network dhcpv6 server',
                        act:'clean_subnet'
                    },*/
                    type: 'delete',
                    datatype:'text',
                    success: function(data) {
                        if (data == "0") {
                            datagridReload("tt");
                        } else {
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
        },true)
    }
}

function editaddrDhcpv6Pool() {
    var row = $('#tt').datagrid('getSelections');
    if (row.length == 1)
        editPool(row[0]['prefix'],row[0]['sub_start'],row[0]['sub_end'],row[0]['lease_day'],row[0]['lease_hour'],row[0]['lease_min'],row[0]['sub_name'],row[0]['pri_dns'],row[0]['sec_dns'],row[0]['domain'],row[0]['rsv_start'],row[0]['rsv_end']);
    else
        return;
}
//地址池编辑弹出框
function editPool(prefix,sub_start,sub_end,lease_day,lease_hour,lease_min,sub_name,pri_dns,sec_dns,domain,reserve_start,reserve_end) {
    dhcpPool_tag = 2;
    changeType = 'put';
    param[0] = prefix;
    param[2] = sub_start;
    param[3] = sub_end;
    param[4] = lease_day;
    param[5] = lease_hour;
    param[6] = lease_min;
    param[10] = sub_name;
    param[11] = pri_dns;
    param[12] = sec_dns;
    param[13] = domain;
    param[17] = reserve_start;
    param[18] = reserve_end;
    if (('#add_addrPool').length<=0) {
        $(document.body).append("<div id='ipprobe_add' class='ngtos_window_620'></div>");
    }
    open_window('add_addrPool','Network/Dhcpv6Server','windowShow&w=network_dhcpv6_addPool_window',$LANG.EDIT);
}
//地址绑定添加处理函数
function addAddrBangSubmit(tag) {
    var name = $("#name").val();
    var ipaddr = $("#ipaddr").val();
    var duid = $("#duid").val();
    $.ajax({
        url: "?c=Network/Dhcpv6Server",
        type: changeType,
        datatype:'text',
        data:{
            name:name,
            duid:duid,
            ipaddr:ipaddr,
            dhcpPool_tag:tag,
            select_add_type:'dhcp_bang'
        },
        success: function(data) {
            if (data == 0) {
                $("#add_addrrBang").window("close");
                datagridReload("aa");
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
//添加地址绑定
function addAddrDhcpv6Bang() {
    dhcpPool_tag = 1;
    changeType = 'post'
    if ($('#add_addrrBang').length <= 0) {
        $(document.body).append("<div id='add_addrrBang' class='ngtos_window_620' /></div>")
    }
    open_window('add_addrrBang','Network/Dhcpv6Server','windowShow&w=network_dhcpv6_addBang_window',$LANG.ADD);
}
function editaddrDhcpv6Bang() {
    var rows = $('#aa').datagrid('getSelections');
    if(rows.length == 1) 
        editaddr(rows[0]['name'],rows[0]['ipv6addr'],rows[0]['duid']);
    else
        return;
}
//修改地址绑定
function editaddr(name,ipv6addr,duid) {
    dhcpPool_tag = 2;
    changeType = 'put';
    param[0] = name;
    param[1] = ipv6addr;
    param[2] = duid;
    if ($('#add_addrrBang').length <= 0) {
        $(document.body).append("<div id='add_addrrBang' class='ngtos_window_620' /></div>")
    }
    open_window('add_addrrBang','Network/Dhcpv6Server','windowShow&w=network_dhcpv6_addBang_window',$LANG.EDIT);
}

//删除地址绑定
function delBangDhcpv6(){
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,true);
    } else {
        var rows = $('#aa').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if (r) {
                var name = [];
                for (var i=0; i<rows.length; i++) {
                    name.push(rows[i].name);
                }
                    name = name.join('#');
                    $.ajax({
                        url: "?c=Network/Dhcpv6Server&mod=dhcpv6&act=d_host",
                        type: 'delete',
                        dataType: 'json',
                        async:false,
                        data:{
/*                            mod:'network dhcpv6 server',
                            act:'del_host',*/
                            delItems:name
                        },
                        success: function(data) {
							if (data != 0) {
                                ngtosPopMessager("error",data);
                            }
                        }
                    });
                datagridReload("aa");
            }
        },true)
    }
}
//清空地址绑定
function clearBangDhcpv6() {
    var text = $("#btn_start").attr("disabled");
    if(text == "disabled") {
        ngtosPopMessager("info", language);
    } else {
        ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
            if (r) {
                $.ajax({
                    url: "?c=Network/Dhcpv6Server&mod=dhcpv6&act=c_host",
                    type: 'delete',
                    datatype:'text',
/*                    data:{
                        mod:'network dhcpv6 server',
                        act:'clean_host'
                    },*/
                    success: function(data) {
                        if (data=="0") {
                            datagridReload("aa");
                        } else {
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
        },true)
    }
}

function dhcppool_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    //编辑按钮逻辑
    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }
    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
    var rows = $('#tt').datagrid('getRows');
}

function dhcpbang_toolbar() {
    var crows = $('#aa').datagrid('getChecked');
    //编辑按钮逻辑
    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }
    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
    var rows = $('#aa').datagrid('getRows');
}
//清空所有接口
function clearAllDhcpv6Option(left,right){
    var opt = '';
    var sel_left = get_select_value(left);
    var sel_right = get_select_value(right);
    if(!sel_right){
        return false;
    }

    var arr_right = sel_right.split(" ");
    for(var i = 0;i<arr_right.length;i++){
        opt += "<option value='" + arr_right[i] + "' title='" + arr_right[i] + "'>" + arr_right[i] +"</option>";
    }
    $("#" + right).text(" ");
    var arr_left = sel_left.split(" ");
    for(var j = 0;j<arr_left.length;j++){
        opt += "<option value='" + arr_left[j] + "' title='" + arr_left[j] + "'>" + arr_left[j] +"</option>";
    }
    $("#" + left).html(opt);
}
//编辑接口
function editDhcpv6Interface(obj) {
    var sel_interface = $("#"+obj+" :selected").val();
    if (sel_interface == null) {
        alert($LANG.SELECT_INTERFACE);
    } else {
        if (sel_interface.indexOf("vlan") >= 0){
            if (sel_interface.indexOf("vlan.000") >= 0) {
                param[0] = sel_interface.substr(8);
            } else if (sel_interface.indexOf("vlan.00") >= 0) {
                param[0] = sel_interface.substr(7);
            } else if (sel_interface.indexOf("vlan.0") >= 0) {
                param[0] = sel_interface.substr(6);
            } else {
                param[0] = sel_interface.substr(5);
            }
            if ($('#edit_page').length <= 0) {
                $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
            }
            open_window('edit_page','Network/Dhcpv6Server','windowShow&w=network_vlan_edit_window',$LANG.EDIT);
        } else if(sel_interface.indexOf("mv") >= 0){
            if ($('#edit_page').length <= 0) {
                $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
            }
            param[0] = sel_interface;
            open_window('edit_page','Network/Dhcpv6Server','windowShow&w=network_macvif_edit_window',$LANG.EDIT);
        } else {
            if ($('#edit_page').length <= 0) {
                $(document.body).append("<div id='edit_page' class='ngtos_window_600'></div>");
            }
            param[0] = sel_interface;
            open_window('edit_page','Network/Dhcpv6Server','windowShow&w=network_physics_edit_window',$LANG.EDIT);
        }
    }
}
function get_select_value(obj){
    var select_item=new Array();
    $("#"+ obj +" option").each(function(){
        select_item.push($(this).val());
    });
    return select_item.join(' ');
}
