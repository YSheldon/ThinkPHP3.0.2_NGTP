
function vlanChange(id) {
    if (id == 'single_cid') {
        $('#id_cid').textbox("enable");
        $('#id_cid').textbox("enableValidation");
        $('#range_start_cid').textbox("setValue", "");
        $('#range_start_cid').textbox('disable');
        $('#range_start_cid').textbox("disableValidation");
        $('#range_end_cid').textbox("setValue", "");
        $('#range_end_cid').textbox('disable');
        $('#range_end_cid').textbox("disableValidation");
    } else if (id == 'range_cid') {
        $('#id_cid').textbox("setValue", "");
        $('#id_cid').textbox('disable');
        $('#id_cid').textbox("disableValidation");
        $('#range_start_cid').textbox("enable");
        $('#range_start_cid').textbox("enableValidation");
        $('#range_end_cid').textbox("enable");
        $('#range_end_cid').textbox("enableValidation");
    }
}
//打开添加窗口
function addVlanRow() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_620'></div>");
    }
    //open_window('add_page', 'Network/Vlan', 'windowShow&w=network_vlan_add_window', $LANG.ADD);
    open_window('add_page', 'Network/Vlan&w=network_vlan_add_window', '', $LANG.ADD);
}

/*function addVlanRowInit(tdid, vrid, selectid) {
    var jtdid = "#" + tdid;
    var jvrid = "#" + vrid;
    var jselectid = "#" + selectid;
    //获取虚系统开关, true：开；false：关
    var vr_state = getVsysTurn();
    if (vr_state) {
        $(jtdid).attr("rowSpan", "2");
        $(jvrid).show();
        $.ajax({
            url: "?c=System/Virtual&a=vrDataAll",
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function(data) {
                if (data) {
//                    $(jselectid).empty();
                    $.each(data.rows, function() {
                        $(jselectid)[0].add(new Option(this.vr_name, this.vr_id));
                    });
                }
            }
        });
    } else {
        $(jtdid).attr("rowSpan", "1");
        $(jvrid).hide();
    }
}
*/
//添加弹出框提交
function addVlanSubmit() {
    var vlanform = $('#vlan_add').form('validate');
    if(vlanform) {
        if ($("#range_cid").prop("checked")) {
            if ($("#range_end_cid").val() - $("#range_start_cid").val() >= 500) {
                ngtosPopMessager("info", $LANG.SINGLE_UP_TO_FIVE);
                return;
            }
        }
        if ($("#single_cid").prop("checked")) {
            var type = "single";
        } else {
            var type = "range";
        }
        $.ajax({
//            url: "?c=Network/Vlan&a=addSave",
            url: "?c=Network/Vlan",
            type: 'POST',
            dataType: 'text',
            data: {
                type: type,
                id: $('#id_cid').val(),
                range_start: $('#range_start_cid').val(),
                range_end: $('#range_end_cid').val()
            },
            success: function(data) {
                if (data == 0) {
                    if(typeof(grtag)!='undefined' && (grtag == 9 || grtag == 6)) {
                        $("#add_page").window("close");
                        selectVlanRefresh();
                    } else {
                        $("#add_page").window("close");
                        setTimeout(function(){
                            $('#tt').datagrid('reload');
                        },2000);
    				}
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}
//打开编辑窗口
function editVlanRow(name) {
    if (typeof (name) == "string") {
        param[0] = name;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].vlanid;
    }
    if ($('#edit_page').length <= 0) {
        $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
    }
    open_window('edit_page', 'Network/Vlan', 'windowShow&w=network_vlan_edit_window', $LANG.EDIT);
}

function editVlanRowInit(value) {
    page_show('edit_page', 'basic');
    var interface = "";
    $("#ha4_cid").attr("checked", false);
    $("#ha6_cid").attr("checked", false);
    if (value < 10) {
        interface = "vlan.000" + value;
    } else if (value >= 10 && value < 100) {
        interface = "vlan.00" + value;
    } else if (value >= 100 && value < 1000) {
        interface = "vlan.0" + value;
    } else {
        interface = "vlan." + value;
    }
    $.ajax({
        url: "?c=Network/Vlan&a=datagridShow",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            mod:'network vlan',
            parKey:'id',
            param:value
        },
        success: function(data) {
            if (data == 0 || data == 2) {
                ngtosPopMessager("error", data);
            } else if (data == 1) {
                ngtosPopMessager("error", data);
            } else {
                load_datagrid();
                vsid = data["rows"][0]["vsysid"];
                $('#vsid_old').val(vsid);
                $('#interface_name_cid').html(interface);
                $('#interface_value_cid').val(interface);
                $('#description_cid').val(data["rows"][0]["description"]);
                $('#description_old').val(data["rows"][0]["description"]);
                if (data["rows"][0]["state"] == "suspended") {
                    $('#shutdown_disable').attr("checked", "checked");
                    $('#shutdown_old').val(1);
                } else {
                    $('#shutdown_enable').attr("checked", "checked");
                    $('#shutdown_old').val(0);
                }

                var ip4 = data["rows"][0]["ipv4"];
                var ip6 = data["rows"][0]["ipv6"];
                $("#ip4addr_items_old").val(ip4);
                $("#ip6addr_items_old").val(ip6);
                if (ip4.length != 0) {
                    $("#ip4_list_cid").datagrid('loadData', get_ip4_data(ip4));
                }
                //linklocal不可编辑和删除，去除此ip
                if(ip6.length != 0) {
                    var ip6Arr = ip6.split(",");
                    var gridIp6 = [];
                    for(var i=0;i<ip6Arr.length;i++) {
                        if(ip6Arr[i].indexOf('/linklocal') == -1) {
                            gridIp6.push(ip6Arr[i]);
                        }
                    }
                    if (gridIp6.length !== 0) {
                        $("#ip6_list_cid").datagrid('loadData', get_ip6_data(gridIp6));
                    }
                }
                $('#mtu_cid').val(data["rows"][0]["mtu"]);
                $('#mtu_old').val(data["rows"][0]["mtu"]);
                var mss = data["rows"][0]["mss"];
                if (mss == 1) {
                    $("#mss_auto").attr("checked", "checked");
                    $('#mss_old').val("auto");
                    change_mss("hide");
                } else if (mss == 0) {
                    $("#mss_off").attr("checked", "checked");
                    $('#mss_old').val("off");
                    change_mss("hide");
                } else {
                    $("#define_cid").textbox('setValue',mss);
                    $("#mss_define").attr("checked", "checked");
                    $('#mss_old').val(mss);
                    change_mss("show");
                }
            }
        }
    });
    //获取vsys列表
    //get_vsys("vsysid", "vsid_cid", vsid);
}

function editVlanSubmit() {
    var data_address4_list = $("#ip4_list_cid").datagrid("getRows");
    var data_address6_list = $("#ip6_list_cid").datagrid("getRows");
//  if ($('#shutdown_cid').attr("title") == '停用') {
    if ($('input:radio[name="shutdown"]:checked').val() == 'disable') {
        var shutdown_val = 1;
    } else {
        var shutdown_val = 0;
    }
    var mss = $('input:radio[name="mss"]:checked').val();
    if (mss == "define") {
        //if ($("#define_cid").checkInput({cl: ['must', 'allownumber', 'range:200-1460']}) == false)
        //    return false;
        mss = $("#define_cid").val();
    }
    $.ajax({
//        url: "?c=Network/Vlan&a=editSave",
        url: "?c=Network/Vlan",
        type: 'put',
        dataType: 'text',
        data: {
            interface_name: $('#interface_value_cid').val(),
            description: $('#description_cid').val(),
            description_old: $('#description_old').val(),
            shutdown: shutdown_val,
            shutdown_old: $('#shutdown_old').val(),
            ip4addr_items: json_to_string(data_address4_list),
            ip4addr_items_old: compare_ip(data_address4_list, $("#ip4addr_items_old").val(), "ip4"),
            ip6addr_items: json_to_string(data_address6_list),
            ip6addr_items_old: compare_ip(data_address6_list, $("#ip6addr_items_old").val(), "ip6"),
            mtu: $('#mtu_cid').val(),
            mtu_old: $('#mtu_old').val(),
            mss: mss,
            mss_old: $('#mss_old').val()
        },
        success: function(data) {
            if (data == 0) {
                $("#edit_page").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}

function deleteVlanRow() {
    var rows = $('#tt').datagrid('getSelections');
    var msg ="";
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var vlanId = [];
                for (var i = 0; i < rows.length; i++) {
                    vlanId.push(rows[i].vlanid);
                }
                    vlanId = vlanId.join('#');
                    $.ajax({
                        url: "?c=Network/Vlan&mod=vlan",
                        type: 'DELETE',
                        dataType: 'text',
                        async: false,
                        data: {
                            delKey:'id',
                            delItems: vlanId
                        },
                        success: function(data) {
                            if (data != 0) {
                                 msg = data;
                            }
                        }
                    });
                if (msg != "" && msg != null) {
                    ngtosPopMessager("error", msg);
                }
                $('#tt').datagrid('reload');
            }
        });
    } else {
        ngtosPopMessager("info",$LANG.SELECT_DEL_OPTION);
    }
}
//范围删除Vlan弹出框
function deleteRangeVlan() {
    if ($('#delete_Rvlan').length<=0) {
        $(document.body).append("<div id='delete_Rvlan' class='ngtos_window_600'></div>");
    }
    open_window('delete_Rvlan','Network/Vlan','windowShow&w=network_vlan_delete_range',$LANG.DELETE);
}
//删除范围Vlan
function deleteVlanSubmit() {
    var isVlan = $('#vlan_range_delete').form('validate');
    if(isVlan) {
        var range_start = $('#range_start_vlan').val();
        var range_end = $('#range_end_vlan').val();
        var range = range_start+'-'+range_end;
            $.ajax({
            url: "?c=Network/Vlan&mod=vlan&fun=simpleHandle&parKey=range&act=dt&param="+range,
            type: 'DELETE',
//            data: {
//                parKey:'range',
//                param : range,
//                act:'delete'
//            },
            success: function(data) {
                if (data != 0) {
                    ngtosPopMessager("error", data);
                }
                $("#delete_Rvlan").window("close");
                $('#tt').datagrid('reload');
            }
        });
    }
}   

function clearVlanRow() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Vlan&mod=vlan&all=1",
                type: 'delete',
                dataType: 'text',
                async: false,
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

function set_vlan_toolbar() {
        vsys_network = getPrivilege('network');
        vsys_manage = getPrivilege('vsys-manage');
    var crows = $('#tt').datagrid('getChecked');
    if(vsys_network == true && vsys_manage == false){
        $('#icon-edit').linkbutton('disable');
        $('#icon-delete').linkbutton('disable');
        $('#icon-delete_range').linkbutton('disable');
        $('#icon-clear').linkbutton('disable');
        $('#icon-add').linkbutton('disable');
    }else{
        //删除按钮逻辑
        if (crows.length > 0) {
            $('#icon-delete').linkbutton('enable');
        } else {
            $('#icon-delete').linkbutton('disable');
        }
    }
    //编辑按钮逻辑
    if (crows.length  == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

}

function formatVlanInterface(value) {
	if (value == "" || value == null) {
        return;
    }
    var regex = /,/g;
    var s = value;
    var index = 0;
        s = s.replace(regex, function() {
            index++;
            return index % 5 ? arguments[0] : ',<br>';
        });
    var t = value;
    var index = 0;
        t = t.replace(regex, function() {
            index++;
            return index % 5 ? arguments[0] : ',\n';
        });
    return '<div title="' + t + '">' + s + '</div>';
}

//查看所有
function searchVlanRowAll() {
    var seach = "1";
    $("#tt").datagrid('options').url = "?c=Network/Vlan&a=showJsondata&seach="+seach;
    $('#tt').datagrid('reload');
}
//查看自己
function searchVlanRows() {
    $("#tt").datagrid('options').url = "?c=Network/Vlan&a=showJsondata";
    $('#tt').datagrid('reload');
}
//生成树设定弹出框
function show_span(id) {
    $.ajax({
        url: '?c=Network/Vlan&a=show_tr',
        type: 'POST',
        datatype:'json',
        async: false,
        data: {
            id:id
        },
        success:function(data) {
            var row = eval("("+data+")");
            var aid = row['rows'][0]['vlanid'];
            var vsysname = row['rows'][0]['vsysname'];
            var state = row['rows'][0]['state'];
            var priori = row['rows'][0]['priority'];
            var hello_time = row['rows'][0]['hello_time'];
            var fward_delay = row['rows'][0]['fward_delay'];
            var max_age_time = row['rows'][0]['max_age_time'];
            var root_priority = row['rows'][0]['root_priority'];
            var root = row['rows'][0]['root'];
            var mac = row['rows'][0]['mac'];
            var portname = row['rows'][0]['portname'];
            var portstate = row['rows'][0]['port_state'];
            var portcost = row['rows'][0]['port_cost'];
            var portpriority = row['rows'][0]['port_priority'];
            if ($('#show_spantree').length <= 0) {
                $(document.body).append("<div id='show_spantree' class='ngtos_window_620'></div>");
            }
            function set() {
                if (portstate == '') {
                    } else {
                    var  str = new Array();
                    str = portname.split(",");
                    for (i=0;i<str.length;i++) {
                        $("#a").append("<input type='text' id='portname' value='"+str[i]+"' style='text-align:right;width:100px;border-style:none;'><br>");
                    }
                    str = portstate.split(",");
                    for (i=0;i<str.length;i++) {
                        if (str[i] == 0) {
                            str[i] = 'DISABLED';
                        } else if (str[i] == 1) {
                            str[i] = 'LISTENING';
                        } else if (str[i] == 2) {
                            str[i] = 'LEARNING';
                        } else if (str[i] == 3) {
                            str[i] = 'FORWARDING';
                        } else if (str[i] == 4) {
                            str[i] = 'BLOCKING';
                        } else if (str[i] == ' ') {
                            str[i] = ' ';
                        }
                        $("#b").append("<input type='text' id='portstate' value='"+str[i]+"' style='text-align:right;width:80px;border-style:none;'><br>");
                    }
                    str = portcost.split(",");
                    for(i=0;i<str.length;i++){
                        $("#c").append("<input type='text' id='portcost' value='"+str[i]+"' style='text-align:right;width:50px;border-style:none;'><br>");
                    }
                    str = portpriority.split(",");
                    for(i=0;i<str.length;i++){
                        $("#d").append("<input type='text' id='portpriority' value='"+str[i]+"' style='text-align:right;width:60px;border-style:none;'><br>");
                    }
                }
                $("#id_hid").val(aid);
                $("#id_vid").val(aid);
                $("#priority").textbox('setValue',priori);
                $("#hello").textbox('setValue',hello_time);
                $("#fwddelay").textbox('setValue',fward_delay);
                $("#maxage").textbox('setValue',max_age_time);
                if (state == 'on') {
                    $('#spantree_enable').attr('checked',true);
                } else {
                    $('#spantree_disable').attr('checked',true);
                }
                $('#root_priori').val(root_priority);
                $('#bridge_max').val(max_age_time);
                $('#htime').val(hello_time);
                $('#fdelay').val(fward_delay);
                $('#bripriori').val(priori);
                $('#root').val(root);
                $('#mac').val(mac);
            }
            open_window('show_spantree','Network/Vlan','show_tree',$LANG.SET,set);
        }
    });
}
//生成树设定
function add_spantree() {
    var id_hid = $('#id_hid').val();
    var priority = $('#priority').val();
    var hello = $('#hello').val();
    var fwddelay = $('#fwddelay').val();
    var maxage = $('#maxage').val();
    $.ajax({
        url: '?c=Network/Vlan&a=set_tree',
        type: 'POST',
        data: {
            eable: $('#spantree_enable')[0].checked ? 'enable' : '',
            dable: $('#spantree_disable')[0].checked ? 'disable' : '',
            vlanid: id_hid,
            priority: priority,
            hello: hello,
            fwddelay: fwddelay,
            maxage: maxage
        },
        success: function(data) {
            if (data == 0) {
                $("#show_spantree").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
//设为根桥
function set_spantree() {
    var id_hid = $('#id_hid').val();
    $.ajax({
        url: '?c=Network/Vlan&a=set_span',
        type: 'POST',
        data: {
            vlanid: id_hid
        },
        success: function(data) {
            if (data == 0) {
                $("#show_spantree").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
