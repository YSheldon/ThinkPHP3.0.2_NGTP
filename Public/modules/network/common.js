//打开接口统计弹出框
function show_flow(interface) {
    param[0] = interface;
    if ($('#show_page').length <= 0) {
        $(document.body).append("<div id='show_page' class='ngtos_window_400'></div>");
    }
    open_window('show_page', 'Network/Physics', 'windowShow&w=network_flow_window', $LANG.SHOW);
}

//统计弹出框赋值
function showFlowInit(interface) {
    $.ajax({
        url: "?c=Network/Physics&a=showFlowJsondata",
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            interface: interface
        },
        success: function(data) {
            if (!data.rows[0]) {
                ngtosPopMessager("error", data);
            } else {
                $('#recv_all_pkts_show').html(data.rows[0].recv_all_pkts);
                $('#recv_all_bytes_show').html(data.rows[0].recv_all_bytes);
                $('#xmit_all_pkts_show').html(data.rows[0].xmit_all_pkts);
                $('#xmit_all_bytes_show').html(data.rows[0].xmit_all_bytes);
                $('#discard_pkts_show').html(data.rows[0].discard_pkts);
                $('#rx_speed_show').html(data.rows[0].rx_speed);
                $('#tx_speed_show').html(data.rows[0].tx_speed);
            }
        }
    });
}

//datagrid格式化输出ip
function format_ip(ip4, ip6) {
    if ((ip4 == "" || ip4 == null) && (ip6 == "" || ip6 == null)) {
        return;
    }
    if (ip4 != "" && ip4 != null) {
        ip4 = ip4.replace(/\/no_ha_static/g, "");
        ip4 = ip4.replace(/\/ha_static/g, "");
        ip4 = ip4.replace(/\/secondary/g, "");
        ip4 = ip4.replace(/\/no_secondary/g, "");
    }

    if (ip6 != "" && ip6 != null) {
        ip6 = ip6.replace(/\/no_ha_static/g, "");
        ip6 = ip6.replace(/\/ha_static/g, "");
        ip6 = ip6.replace(/\/linklocal/g, "");
        ip6 = ip6.replace(/\/no_linklocal/g, "");
        ip6 = ip6.replace(/\/secondary/g, "");
        ip6 = ip6.replace(/\/no_secondary/g, "");
    }

    var s = "";
    var t = "";
    if (ip4.length != 0) {
        if (ip4.length >= 50) {
            s = "IPv4:" + ip4.substr(0, 50) + "...";
        } else {
            s = "IPv4:" + ip4;
        }
        t = "IPv4:<br/>" + ip4;
    }
    if (ip6.length != 0) {
        if (ip4.length != 0)
        {
            if (ip6.length >= 50) {
                s += "<br/>IPv6:" + ip6.substr(0, 50) + "...";
            } else {
                s += "<br/>IPv6:" + ip6;
            }
            t += "<br/>IPv6:<br/>" + ip6;
        } else if (ip4.length == 0) {
            if (ip6.length >= 50) {
                s = "IPv6:" + ip6.substr(0, 50) + "...";
            } else {
                s = "IPv6:" + ip6;
            }
            t = "IPv6:<br/>" + ip6;
        }
    }
    if(s.lastIndexOf('...') != -1) {
        var arr = t.split(',');
        var tipInfo = '';
        var r = 1;
        for(var i=0;i<arr.length;i++){
            var end = (r % 4) == 0 ? '<br/>' : ' , ';
            tipInfo += arr[i] + end;
            r++;
        }
        return s+'&nbsp;&nbsp;<a class="tagvif_tip" title="' + tipInfo + '">[' + $LANG.DETAIL + ']</a>';
    }else {
        return  s;
    }

}

//datagrid添加IPv4
function addIpv4() {
    var obj;
    var ipIsValid = $("#ip4_cid").textbox('isValid');
    if (!ipIsValid) {
        return false;
    }

    var maskIsValid = $("#mask4_cid").textbox('isValid');
    if (!maskIsValid) {
        return false;
    }

    var ipaddr = $("#ip4_cid").textbox('getValue');
    if (ipaddr == '' || ipaddr == null) {
        return false;
    }
    var mask = $("#mask4_cid").textbox('getValue');
    var ha = ($('#ha4_cid').prop("checked") == true) ? "HA" : "";

    if (mask == "" && ha == "HA") {
        ngtosPopMessager("info", "请输入掩码！");
        return;
    }

    var data = $("#ip4_list_cid").datagrid("getData");
    if(data.rows.length > 51) {
        ngtosPopMessager("info", "IP地址最多添加52条！");
        return;
    }
    for (var i = 0; i < data.rows.length; i++) {
        if (ipaddr == data.rows[i]['ip']) {
            ngtosPopMessager("error", "该地址已添加，请重新输入！");
            return;
        }
    }
    var rowid = data.rows.length;
    obj = {id: rowid, ip: ipaddr, mask: mask, ha: ha};

    $("#ip4_list_cid").datagrid("appendRow", obj);
    $("#ip4_cid").textbox('setValue','');
    $("#mask4_cid").textbox('setValue','');
}

//datagrid添加IPv6
function addIpv6() {
    var obj;
    var isValid = $("#ip6_cid").textbox('isValid');
    if(!isValid) {
        return false;
    }
    var ipaddr = $("#ip6_cid").textbox('getValue');
    if(ipaddr == '' || ipaddr == null) {
        return false;
    }
    var ha = ($('#ha6_cid').prop("checked") == true) ? "HA" : "";

    var data = $("#ip6_list_cid").datagrid("getData");
    if(data.rows.length > 51) {
        ngtosPopMessager("info", "IP地址最多添加52条！");
        return;
    }
    for (var i = 0; i < data.rows.length; i++) {
        if (ipaddr == data.rows[i]['ip']) {
            ngtosPopMessager("error", "该地址已添加，请重新输入！");
            return;
        }
    }
    var rowid = data.rows.length;
    obj = {id: rowid, ip: ipaddr, ha: ha};

    $("#ip6_list_cid").datagrid("appendRow", obj);
    $("#ip6_cid").textbox('setValue','');
}

//datagridIPv4删除操作
function del_row4(index) {
    var rows = $("#ip4_list_cid").datagrid('getSelections');
    if((rows.length>0)) {
        ngtosPopMessager('confirm', $LANG.DELETE_IT, function(r) {
            if (r) {
                for(var j=rows.length-1;j>=0;j--) {
                    $("#ip4_list_cid").datagrid("deleteRow", rows[j].id);
                }
                var data = $("#ip4_list_cid").datagrid("getData");
                if(data.rows.length == 0) return;
                $.each(data.rows,function(key,val) {
                    this.id = key;
                });
                $("#ip4_list_cid").datagrid("loadData",data);
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }

}
//datagridIPv6删除操作
function del_row6(index) {
    var rows = $("#ip6_list_cid").datagrid('getSelections');
    if((rows.length>0)) {
        ngtosPopMessager('confirm', $LANG.DELETE_IT, function(r) {
            if (r) {
                for(var j=rows.length-1;j>=0;j--) {
                    $("#ip6_list_cid").datagrid("deleteRow", rows[j].id);
                }
                var data = $("#ip6_list_cid").datagrid("getData");
                if(data.rows.length == 0) return;
                $.each(data.rows,function(key,val) {
                    this.id = key;
                });
                $("#ip6_list_cid").datagrid("loadData",data);
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}

//加载datagrid空表格
function load_datagrid() {
    $('#ip4_list_cid').datagrid({
//      fit:true,
//      fitColumns: true,
        width: '520',
        height: '165',
        striped: true,
        //singleSelect: true,
        loadMsg: $LANG.WAITING,
        rownumbers: true,
        columns: [[
            {field:'ck',checkbox:true},
            {field: 'id', title: 'id', width: 10},
            {field: 'ip', title: $LANG.ADDRESS, width: 180},
            {field: 'mask', title: $LANG.MASK, width: 180},
            {field: 'ha', title: $LANG.ATTRIBUTE, width: 100},
            {field: 'secondary', title: 'secondary', width: 10}
            //{field: 'opt', title: $LANG.OPERATION, formatter: operate_format4, align: 'center', width: 80}
        ]],
        toolbar: [{
            text: $LANG.DELETE,
            iconCls: 'icon-delete',
            handler: function (){
                del_row4();
            }
        }]
    });
    $("#ip4_list_cid").datagrid('loadData', load_objdata());
    $("#ip4_list_cid").datagrid('hideColumn','id');
    $("#ip4_list_cid").datagrid('hideColumn','secondary');

    $('#ip6_list_cid').datagrid({
//      fit:true,
//      fitColumns: true,
        width: '520',
        height: '165',
        striped: true,
        //singleSelect: true,
        loadMsg: $LANG.WAITING,
        rownumbers: true,
        columns: [[
            {field:'ck',checkbox:true},
            {field: 'id', title: 'id', width: 10},
            {field: 'ip', title: $LANG.ADDRESS, width: 330},
            {field: 'ha', title: $LANG.ATTRIBUTE, width: 130},
            {field: 'linklocal', title: 'linklocal', width: 10},
            {field: 'secondary', title: 'secondary', width: 10}
            //{field: 'opt', title: $LANG.OPERATION, formatter: operate_format6, align: 'center', width: 80}
        ]],
        toolbar: [{
            text: $LANG.DELETE,
            iconCls: 'icon-delete',
            handler: function() {
                del_row6();
            }
        }]
    });
    $("#ip6_list_cid").datagrid('loadData', load_objdata());
    $("#ip6_list_cid").datagrid('hideColumn','id');
    $("#ip6_list_cid").datagrid('hideColumn','linklocal');
    $("#ip6_list_cid").datagrid('hideColumn','secondary');
}
//加载datagrid中IPv4数据
function get_ip4_data(ip4) {
    var ip4_arr = new Array();
    var ip4_json_ele = "";
    ip4_arr = ip4.split(",");
    for (var i = 0; i < ip4_arr.length; i++) {
        var ele = ip4_arr[i].split("/");
        if (ele[2] == "ha_static") {
            var ha = "HA";
        } else if (ele[2] == "no_ha_static") {
            var ha = "";
        } else {
            var ha = "DHCP";
        }
        ip4_json_ele += '{"id":"' + i + '","ip":"' + ele[0] + '","mask":"' + ele[1] + '","ha":"' + ha + '","secondary":"' + ele[3] + '"},';
    }
    ip4_json_ele = ip4_json_ele.substr(0, ip4_json_ele.length - 1);
    var ip4_json_head = '"rows":[';
    var ip4_json_end = ']';
    var ip4_json = ip4_json_head + ip4_json_ele + ip4_json_end;
    var grid_data_ip4 = "{" + ip4_json + "}";
    eval('grid_data_ip4=' + grid_data_ip4);
    var my_load_objdata4 = load_objdata(grid_data_ip4);
    return my_load_objdata4;
}
//加载datagrid中IPv6数据
function get_ip6_data(ip6) {
    var ip6_json_ele = "";
    for (var i = 0; i < ip6.length; i++) {
        var ipv6row = ip6[i].split('/');
        var ip = ipv6row[0] + '/' + ipv6row[1];
        var ha = '';
        if (ipv6row[2] == "ha_static") {
            ha = "HA";
        } else if(ipv6row[2] == "no_ha_static"){
            ha = "";
        } else {
            var ha = "DHCP";
        }
        ip6_json_ele += '{"id":"' + i + '","ip":"' + ip + '","ha":"' + ha + '","linklocal":"' + ipv6row[3] + '","secondary":"' + ipv6row[4] + '"},';
    }
    ip6_json_ele = ip6_json_ele.substr(0, ip6_json_ele.length - 1);
    var ip6_json_head = '"rows":[';
    var ip6_json_end = ']';
    var ip6_json = ip6_json_head + ip6_json_ele + ip6_json_end;
    var grid_data_ip6 = "{" + ip6_json + "}";
    eval('grid_data_ip6=' + grid_data_ip6);
    var my_load_objdata6 = load_objdata(grid_data_ip6);
    return my_load_objdata6;

}

//获得所有接口
function getAllInterface(id) {

    var sid = new Array();
    var arr = new Array();
    if (isArray(id)) {
        for (var i = 0; i < id.length; i++) {
            sid.push("#" + id[i]);
        }
    } else {
        sid.push("#" + id);
    }

    $.ajax({
        url: "?c=Network/Physics&a=allInterfacejsondata",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function(data) {
            if (data == '0') {
                return;
            } else if (!data.rows[0]) {
                ngtosPopMessager("error", data);
            } else {
                for (var i = 0; i < data.rows.length; i++) {
                    var value = data.rows[i].dev;
                    for (var j = 0; j < sid.length; j++) {
                        $(sid[j]).append("<option value='" + value + "'>" + value + "</option>");
                    }
                    arr.push(value);
                }
            }
        }
    });
    return arr;
}

function getPhysicsInterface(id, module) {
    var sid = new Array();
    if (isArray(id)) {
        for (var i = 0; i < id.length; i++) {
            sid.push("#" + id[i]);
        }
    } else {
        sid.push("#" + id);
    }
    var jc = "#" + id;
    $.ajax({
        url: "?c=Network/Physics&a=callFun",
        data:{
            fun:'dataShow',
            mod:'network interfaces',
            parKey:'__NA__',
            param:'unslave'
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data == 0) {
                return;
            } else {
                for (var i = 0,exception = 0; i < data["rows"].length; i++) {
                    exception = 0;
                    if (module == "bond") {
                      var value = data["rows"][i]["dev"];
                        if (data["rows"][i]["is_management"] == 1 || data["rows"][i]["comm_type"] != 'routing') {
                            exception = 1;
                        }
                        $(jc).append("<option value='" + value + "'>" + value + "</option>");
                    }
                    if (module == "ha") {
                        if (data["rows"][i]["is_management"] == 1) {
                            exception = 1;
                        }
                    }
                    if (exception != 1) {
                        var value = data["rows"][i]["dev"];
                        for (var j = 0; j < sid.length; j++) {
                            $(sid[j]).append("<option value='" + value + "'>" + value + "</option>");
                        }
                    }
                }
            }
        }
    });
}

//获取所有bond接口
function getBondInterface(id) {
    var sid = new Array();
    if (isArray(id)) {
        for (var i = 0; i < id.length; i++) {
            sid.push("#" + id[i]);
        }
    } else {
        sid.push("#" + id);
    }

    $.ajax({
        url: "?c=network/Bond&a=allBondJsondata",
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data == '0') {
                return;
            }
//            else if (!data.rows[0]) {
//                ngtosPopMessager("error", data);
//            }
            else {
                for (var i = 0; i < data["rows"].length; i++) {
                    var value = data.rows[i].bond_name;
                    for (var j = 0; j < sid.length; j++) {
                        $(sid[j]).append("<option value='" + value + "'>" + value + "</option>");
                    }
                }
            }
        }
    });
}

function change_switch(id) {
    if (id == 'group_access') {
        $("#group_access").show();
        $("#group_trunk_allowed").hide();
        $('#group_trunk_allowed_note').hide();
        $("#group_trunk_native").hide();
    } else {
        $("#group_access").hide();
        $("#group_trunk_allowed").show();
        $('#group_trunk_allowed_note').show();
        $("#group_trunk_native").show();
    }
}

function change_mss(opt,mssVal) {
    if (opt == 'show') {
        $("#mss_define_cid").show();
        $("#define_cid").textbox('enable');
        $("#define_cid").textbox({novalidate:false});
        if(mssVal)
            $("#define_cid").textbox('setValue',mssVal);
    } else {
        $("#mss_define_cid").hide();
        $("#define_cid").textbox('setValue','');
        $("#define_cid").textbox({novalidate:true});
        $("#define_cid").textbox('disable');
    }
}

function compare_ip(list, old, kind) {
    var ip = "";
    var ha = "";
    var flag = 1;
    for (var i = 0; i < list.length; i++) {
        if (list[i].ha == "HA") {
            ha = "ha_static";
        } else if (list[i].ha == "") {
            ha = "no_ha_static";
        } else {
            ha = "dhcp";
        }
        if (kind == "ip4") {
            if (i == list.length - 1) {
                ip += list[i].ip + "/" + list[i].mask + "/" + ha + "/" + list[i].secondary;
            } else {
                ip += list[i].ip + "/" + list[i].mask + "/" + ha + "/" + list[i].secondary + ",";
            }
        } else {
            if (i == list.length - 1) {
                ip += list[i].ip + "/" + ha + "/" + list[i].linklocal + "/" + list[i].secondary;
            } else {
                ip += list[i].ip + "/" + ha + "/" + list[i].linklocal + "/" + list[i].secondary + ",";
            }
        }
    }
    //ip6的linklocal不可编辑和删除，去除此ip，对比是否做过改变
    if(kind == 'ip6' && old.length != 0) {
        var ip6Arr = old.split(",");
        var oldIp6Arr = [];
        for(var i=0;i<ip6Arr.length;i++) {
            if(ip6Arr[i].indexOf('/linklocal') == -1) {
                oldIp6Arr.push(ip6Arr[i]);
            }
        }
        old = oldIp6Arr.join(',');
    }

    if (old == ip) {
        flag = 0;
    }
    return flag;
}

//除物理接口外，其他接口ipv6的linklocal都是临时生成，需要时间，故在linklocal生成时做个延时刷新
var tabId = '';
function delayRefresh(oldip4,oldip6,ip4Edit,ip6Edit,tableId) {
    tabId = tableId;
    if(oldip4 == '' && oldip6 == '' && (ip4Edit == 1 || ip6Edit == 1)) {
        setTimeout(function(){
            $(tabId).datagrid('reload');
        },2000);
    } else {
        $(tabId).datagrid('reload');
    }
}