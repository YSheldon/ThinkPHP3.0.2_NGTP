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
//获取添加地址池页面数据
function addAddrPoolSubmit(tag) {
 	var subnet = $("#subnet").val();
	var mask = $("#mask").val();
	var addr_start = $("#addr_start").val();
	var addr_stop = $("#addr_stop").val();
    var addr_start1 = $("#addr_start1").val();
    var addr_stop1 = $("#addr_stop1").val();
	var date_start_day = $("#date_start_day").val();
    var clock = $("#clock_cid").val();
    var clock_arr = clock.split(':');
    var date_start_horse = clock_arr[0];
    var date_start_min = clock_arr[1];
	var date_max_day = $("#date_max_day").val();
    var clock_max = $("#clock_cid_max").val();
    var clock_arr_max = clock_max.split(':');
    var date_max_horse = clock_arr_max[0];
    var date_max_min = clock_arr_max[1];
	var web_addr = $("#web_addr").val();
	var dns_main = $("#dns_main").val();
	var dns_second = $("#dns_second").val();
	var yu_name = $("#yu_name").val();
	var client_type = $("#client_type").val();
	var gro_desc = $("#gro_desc").val();
//	var vcomId = $("#vcomId").val();
	$.ajax({
		url: "?c=Network/DhcpServer",
		type: changeType,
		datatype: 'text',
		data: {
			subnet:subnet,
			mask:mask,
			addr_start:addr_start,
			addr_stop:addr_stop,
            addr_start1:addr_start1,
            addr_stop1:addr_stop1,
			date_start_day:date_start_day,
			date_start_horse:date_start_horse,
			date_start_min:date_start_min,
			date_max_day:date_max_day,
			date_max_horse:date_max_horse,
			date_max_min:date_max_min,
			web_addr:web_addr,
			dns_main:dns_main,
			dns_second:dns_second,
			yu_name:yu_name,
			client_type:client_type,
			gro_desc:gro_desc,
//			vcomId:vcomId,
            dhcpPool_tag:tag,
            select_add_type:'dhcp'
		},
		success: function(data) {
			if (data == "0") {
                $("#add_addrPool").window("close");
                datagridReload("tt");
			} else {
                ngtosPopMessager("error", data,"");
			}
		}
	});
}
//添加地址池
function addAddrPool() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,"");
    } else {
        dhcpPool_tag = 1;
        changeType = 'post';
        open_window('add_addrPool','Network/DhcpServer','windowShow&w=network_dhcp_addPool_window',$LANG.ADD);
    }
}
function editaddrPool(subnet) {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,"");
    } else {
        var rows = $('#tt').datagrid('getSelections');
        dhcpPool_tag = 2;
        changeType = 'put';
        subnet = rows[0].subnet;
        $.ajax({
            url: "?c=Network/DhcpServer&mod=dhcp&act=di",
            type: 'get',
            dataType: 'json',
            data: {
                param:subnet,
//                mod:'network dhcp dhcpd_subnet',
//                act:'display',
                parKey:'subnet'

            },
            success: function(data) {
                $(data.rows).each(function(key,value) {
                    param[0] = subnet;
                    param[1] = value.submask;
                    param[2] = value.sub_start;
                    param[3] = value.sub_end;
                    param[4] = value.def_lease_day;
                    param[5] = value.def_lease_hour;
                    param[6] = value.def_lease_min;
                    param[7] = value.max_lease_day;
                    param[8] = value.max_lease_hour;
                    param[9] = value.max_lease_min;
                    param[10] = value.gateway;
                    param[11] = value.pri_dns;
                    param[12] = value.sec_dns;
                    param[13] = value.domain;
                    param[14] = value.pri_wins;
                    param[15] = value.sec_wins;
                    param[17] = value.rsv_start;
                    param[18] = value.rsv_end;
                    open_window('add_addrPool','Network/DhcpServer','windowShow&w=network_dhcp_addPool_window',$LANG.EDIT);
                })
            }
        });
    }
}

function editaddrPoolDbclick(subnet) {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,"");
    } else {
        var rows = $('#tt').datagrid('getSelections');
        dhcpPool_tag = 2;
        changeType = 'put';
        $.ajax({
            url: "?c=Network/DhcpServer&mod=dhcp&act=di",
            type: 'get',
            dataType: 'json',
            data: {
                param:subnet,
//                mod:'network dhcp dhcpd_subnet',
//                act:'display',
                parKey:'subnet'

            },
            success: function(data) {
                $(data.rows).each(function(key,value) {
                    param[0] = subnet;
                    param[1] = value.submask;
                    param[2] = value.sub_start;
                    param[3] = value.sub_end;
                    param[4] = value.def_lease_day;
                    param[5] = value.def_lease_hour;
                    param[6] = value.def_lease_min;
                    param[7] = value.max_lease_day;
                    param[8] = value.max_lease_hour;
                    param[9] = value.max_lease_min;
                    param[10] = value.gateway;
                    param[11] = value.pri_dns;
                    param[12] = value.sec_dns;
                    param[13] = value.domain;
                    param[14] = value.pri_wins;
                    param[15] = value.sec_wins;
                    param[17] = value.rsv_start;
                    param[18] = value.rsv_end;
                    open_window('add_addrPool','Network/DhcpServer','windowShow&w=network_dhcp_addPool_window',$LANG.EDIT);
                })
            }
        });
    }
}

function addAddrBangSubmit(tag) {
    var name = $("#name").val();
    var hostAddr = $("#hostAddr").val();
    var phyAddr = $("#phyAddr").val();
//    var vcomId1 = $("#vcomId1").val();
    if ( name.length == 0 ) {
        ngtosPopMessager("info",$LANG.ENTER_THE_BINDING_ADDRESS_NAME);return ;
    }

    if ( hostAddr.length == 0 ) {
        ngtosPopMessager("info",$LANG.PLEASE_ENTER_THE_HOST_ADDRESS);return ;
    }

    if ( phyAddr.length == 0 ) {
        ngtosPopMessager("info",$LANG.PLEASE_ENTER_TPAOTBA); return ;
    }

//    if ( vcomId1.length == 0 ) {
//        ngtosPopMessager("info",$LANG.PLEASE_FILL_IN_ROUTING_ID);return ;
//    }

    $.ajax({
        url: "?c=Network/DhcpServer",
        type: changeType,
        datatype:'text',
        data:{
            name:name,
            hostAddr:hostAddr,
            phyAddr:phyAddr,
            dhcpPool_tag:tag,
            select_add_type:'bang'
        },
        success: function(data) {
            if (data=="0") {
                $("#add_addrBang").window("close");
                datagridReload("aa");
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
//添加地址绑定
function addAddrBang() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language);
    } else {
        dhcpPool_tag = 1;
        changeType = 'post';
        open_window('add_addrBang','Network/DhcpServer','windowShow&w=network_dhcp_addBang_window',$LANG.ADD);
    }
}
function editaddrBang(name) {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language);
    } else {
        var rows = $('#aa').datagrid('getSelections');
        changeType = "put";
        dhcpPool_tag = 2;
        name = rows[0].name;
        $.ajax({
            url: "?c=Network/DhcpServer&mod=dhcp_host&act=di",
            type: 'get',
            dataType:'json',
            data:{
                param:name,
/*                mod:'network dhcp dhcpd_host',
                act:'display',*/
                parKey:'name'
            },
            success: function(data) {
                $(data.rows).each(function(key,value) {
                    param[0] = name;
                    param[1] = value.ipaddr;
                    param[2] = value.macaddr;
                    param[3] = "0";
                    open_window('add_addrBang','network/DhcpServer','windowShow&w=network_dhcp_addBang_window',$LANG.EDIT);
                })
            }
        });
    }
}
function delPool() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,"");
    } else {
        var rows = $('#tt').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if (r) {
                var subnet = [];
                for (var i=0; i<rows.length; i++) {
                    subnet.push(rows[i].subnet);
                }
                    subnet = subnet.join('#');
                    $.ajax({
                        url: "?c=Network/DhcpServer&mod=dhcp_server&act=d_subnet",
                        type: 'delete',
                        dataType: 'json',
                        async:false,
                        data:{
/*                            mod:'network dhcp server',
                            act:'del_subnet',*/
                            delKey:'subnet',
                            delItems:subnet
                        },
                        success: function(data) {
                            if (data !="0") {
                                ngtosPopMessager("error", data,"");
                            }
                        }
                    });
                datagridReload("tt");
            }
        },true)
    }
}

function clearPool() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,true);
    } else {
        ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
            if (r) {
                $.ajax({
                    url: "?c=Network/DhcpServer&mod=dhcp_server&act=c_subnet&all=1",
                    type: 'delete',
/*                    data:{
                        mod:'network dhcp server',
                        act:'clean_subnet'
                    },*/
                    datatype:'text',
                    success: function(data) {
						if (data=="0") {
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
function delBang() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,true);
    } else {
        var rows=$('#aa').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if (r) {
                var name = [];
                for (var i=0; i<rows.length; i++) {
                    name.push(rows[i].name);
                }
                    name = name.join('#');
                    $.ajax({
                        url: "?c=Network/DhcpServer&mod=dhcp_server&act=d_host",
                        type: 'delete',
                        dataType: 'json',
                        async:false,
                        data:{
                            delItems:name
/*                            mod:'network dhcp server',
                            act:'del_host'*/
                        },
                        success: function(data) {
							if (data !="0") {
                                ngtosPopMessager("error", data,"",true);
                            }
                        }
                    });
                datagridReload("aa");
            }
        },true)
    }
}
function clearBang() {
    var text = $("#btn_start").attr("disabled");
    if (text == "disabled") {
        ngtosPopMessager("info", language,true);
    } else {
        ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
            if (r) {
                $.ajax({
                    url: "?c=Network/DhcpServer&mod=dhcp_server&act=c_host&all=1",
                    type: 'delete',
                    datatype:'text',
/*                    data:{
                        mod:'network dhcp server',
                        act:'clean_host'
                    },*/
                    success: function(data) {
						if (data=="0") {
                            datagridReload("aa");
                        } else {
                            ngtosPopMessager("error", data,true);
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
function clearAllOption(left,right) {
    var opt = '';
    var sel_left = get_select_value(left);
    var sel_right = get_select_value(right);
    if (!sel_right) {
        return false;
    }

    var arr_right = sel_right.split(" ");
    for (var i = 0;i<arr_right.length;i++) {
        opt += "<option value='" + arr_right[i] + "' title='" + arr_right[i] + "'>" + arr_right[i] +"</option>";
    }
    $("#" + right).text(" ");
    var arr_left = sel_left.split(" ");
    for (var j = 0;j<arr_left.length;j++) {
        opt += "<option value='" + arr_left[j] + "' title='" + arr_left[j] + "'>" + arr_left[j] +"</option>";
    }
    $("#" + left).html(opt);
}
function editInterface(obj) {
    var sel_interface = $("#"+obj+" :selected").val();
    //判断当前接口名称如果是lo的时候弹出提示信息
    if(sel_interface == 'lo'){
        ngtosPopMessager('info',$LANG.TICANNOTBE);
        return;
    }
    if (sel_interface == null) {
        ngtosPopMessager('info',$LANG.SELECT_INTERFACE)
    } else {
        if (sel_interface.indexOf("vlan") >= 0) {
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
            open_window('edit_page', 'Network/Dhcpv6Server', 'windowShow&w=network_vlan_edit_window', $LANG.EDIT);
        }else if(sel_interface.indexOf("mv") >= 0){
             if($('#edit_page').length <= 0){
                 $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
             }
            param[0] = sel_interface;
            open_window('edit_page', 'Network/Dhcpv6Server', 'windowShow&w=network_macvif_edit_window', $LANG.EDIT);
        }else {
            param[0] = sel_interface;
            if($('#edit_page').length <= 0){
                $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
            }
            open_window('edit_page', 'Network/Dhcpv6Server', 'windowShow&w=network_physics_edit_window', $LANG.EDIT);
        }
    }
}
function get_select_value(obj) {
    var select_item=new Array();
    $("#"+ obj +" option").each(function() {
        select_item.push($(this).val());
    });
    return select_item.join(' ');
}
