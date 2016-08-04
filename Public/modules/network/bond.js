//打开添加窗口
function add_bond_row() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_620'></div>");
    }
    open_window('add_page', 'Network/Bond', 'windowShow&w=network_bond_add_window', $LANG.ADD);
}
//function addBondRowInit(id) {
//    var jq = "#" + id;
//    $(jq).empty();
//    $(jq).append("<option value=''>-选择ID-</option>");
//    var bond_id = new Array();
//    $.ajax({
//        url: "?c=Network/Bond&a=allBondJsondata",
//        type: 'POST',
//        dataType: 'json',
//        success: function(data) {
//            if(data["rows"]){
//                for (var i = 0; i < data["rows"].length; i++)
//                {
//                    bond_id.push(parseInt(data["rows"][i]["bond_id"]));
//                }
//            }
//            for (var j = 0; j < 8; j++) {
//                if ($.inArray(j, bond_id) < 0) {
//                    $(jq).append("<option value='" + j + "'>" + j + "</option>");
//                }
//            }
//        }
//    });
//}
//添加提交
function add_bond_submit() {
    if (!$("#id_add").combobox('getValue')) {
        ngtosPopMessager("info", $LANG.PLEASE_CHOOSE_ID);
        return;
    }
    if (!$("#load_add").combobox('getValue')) {
        ngtosPopMessager("info", $LANG.SELECT_LOAD_ALGORITHM);
        return;
    }
//    alert($("#load_add").combobox('getValue'));
    var dev = "";
    $('#chif_add option').each(function(i) {
        dev += $(this).val() + " ";
    });
    if (dev.length > 0) {
        dev = dev.substr(0, dev.length - 1);
    }
    $.ajax({
        url: "?c=Network/Bond",
        type: 'POST',
        dataType: 'text',
        data: {
            id: $('#id_add').combobox('getValue'),
            load: $('#load_add').combobox('getValue'),
            dev: dev
        },
        success: function(data) {
            if (data == 0) {
                $("#add_page").window("close");
                setTimeout(function(){
                    $('#tt').datagrid('reload');
                },2000);
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}


//打开编辑窗口
function edit_bond_row(id, load, dev) {
    if (typeof (id) == "string") {
        param[0] = id;
        param[1] = load;
        param[2] = dev;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].bond_id;
        param[1] = rows[0].load_balance;
        param[2] = rows[0].slave_name;
    }
    if ($('#edit_page').length <= 0) {
        $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
    }
    open_window('edit_page', 'Network/Bond', 'windowShow&w=network_bond_edit_window',$LANG.EDIT);
}
function edit_bond_row_init(dev, prepared, choosed) {
    var if_arr = dev.split(" ");
    var jp = "#" + prepared;
    var jc = "#" + choosed;
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
            if (data == 0 || data == 1) {
                return;
            } else if (data == 2) {
                ngtosPopMessager("error", data);
            } else {
                for (var i = 0; i < data["rows"].length; i++) {
                    var value = data["rows"][i]["dev"];
                        $(jp).append("<option value='" + value + "'>" + value + "</option>");
                }
                for (var i = 0; i < if_arr.length; i++) {
                    if(if_arr[i]!="")
                        $(jc).append("<option value='" + if_arr[i] + "'>" + if_arr[i] + "</option>");
                }
            }
        }
    });
}

//弹出框提交
function edit_bond_submit() {
    if (!$("#load_edit").val()) {
        ngtosPopMessager("info", $LANG.SELECT_LOAD_ALGORITHM);
        return;
    }
    var dev = "";
    $('#chif_edit option').each(function(i) {
        dev += $(this).val() + ",";
    });
    if (dev.length > 0) {
        dev = dev.substr(0, dev.length - 1);
    }
    $.ajax({
        url: "?c=Network/Bond",
        type: 'put',
       // dataType: 'json',
        data: {
            id: $('#id_hid_edit').val(),
            load: $('#load_edit').combobox('getValue'),
            dev: dev,
            dev_old: $('#dev_edit').val()
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

function attr_bond_row(name) {
    if (typeof (name) == "string") {
        param[0] = name;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].bond_id;
    }
    if ($('#attr_page').length <= 0) {
        $(document.body).append("<div id='attr_page' class='ngtos_window_620'></div>");
    }
    open_window('attr_page', 'Network/Bond', 'windowShow&w=network_bond_attr_window', $LANG.ATTRIBUTE);
}

function attr_bond_row_init(id) {
    page_show('attr_page', 'basic');
    var vsid = "";
    $("#ha4_cid").attr("checked", false);
    $("#ha6_cid").attr("checked", false);
    $.ajax({
        url: "?c=Network/bond&a=singleJsondata",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            interface: "bond" + id
        },
        success: function(data) {
            if (data == 0 || data == 2) {
                ngtosPopMessager("error", data);
            } else if (data == 1) {
                ngtosPopMessager("error", data['info'], '', "login");
            } else {
                load_datagrid();
//                vsid = data["rows"][0]["vsid"];
                $('#vsid_old').val(vsid);

                $('#interface_name_cid').html("bond" + id);
                $('#if_attr').val("bond" + id);

                $('#description_cid').val(data["rows"][0]["description"]);
                $('#description_old').val(data["rows"][0]["description"]);

                if (data["rows"][0]["shutdown"] == "disable") {
                    $('#shutdown_disable').attr("checked", "checked");
                    $('#shutdown_old').val(1);
                } else {
                     $('#shutdown_enable').attr("checked", "checked");
                    $('#shutdown_old').val(0);
                }

                $('#access_cid').val(data["rows"][0]["access_id"]);
                $('#access_old').val(data["rows"][0]["access_id"]);
                $('#allowed_cid').val(data["rows"][0]["vlan_range"]);
                $('#allowed_old').val(data["rows"][0]["vlan_range"]);
                $('#native_cid').val(data["rows"][0]["native_vlan"]);
                $('#native_old').val(data["rows"][0]["native_vlan"]);

                if (data["rows"][0]["vlan_vpn_enable"] == "0") {
                    $('#vlanvpn_disable').attr("checked", "checked");
                } else {
                    $('#vlanvpn_enable').attr("checked", "checked");
                }

                $('#vlanvpn_old').val(data["rows"][0]["vlan_vpn_enable"]);
                $('#tpid_cid').val(data["rows"][0]["vlan_vpn_tpid"]);
                $('#tpid_old').val(data["rows"][0]["vlan_vpn_tpid"]);

                $("#comm_type_old").val(data["rows"][0]["comm_type"]);
                if (data["rows"][0]["comm_type"] == "routing") {
                    $('#comm_type_route_cid').attr("checked", "checked");
                    $('#group_route').show();
                    $('#group_switch').hide();
                } else {
                    $('#comm_type_switch_cid').attr("checked", "checked");
                    $('#group_switch').show();
                    $('#group_route').hide();

                    $('#switch_type_old').val(data["rows"][0]["switch_mode"]);
                    if (data["rows"][0]["switch_mode"] == "access")
                    {
                        $('#switch_type_access_cid').attr("checked", "checked");
                        $('#group_access').show();
                        $('#group_trunk_allowed').hide();
                        $('#group_trunk_allowed_note').hide();
                        $('#group_trunk_native').hide();
                    } else {
                        $('#switch_type_trunk_cid').attr("checked", "checked");
                        $('#group_trunk_allowed').show();
                        $('#group_trunk_allowed_note').show();
                        $('#group_trunk_native').show();
                        $('#group_access').hide();
                    }
                }

                var ip4 = data["rows"][0]["ip4"];
                var ip6 = data["rows"][0]["ip6"];

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
   // get_vsys("vsysid", "vsid_cid", vsid);
}

function attr_bond_submit() {
    if ($('input:radio[name="shutdown"]:checked').val() == 'disable') {
        var shutdown_val = 1;
    } else {
        var shutdown_val = 0;
    }
    if ($('input:radio[name="vlanvpn"]:checked').val() == 'disable') {
        var vlanvpn = 0;
    } else {
        var vlanvpn = 1;
    }

    var comm_type = $('input:radio[name="comm_type"]:checked').val();

    var data_address4_list = $("#ip4_list_cid").datagrid("getRows");
    var data_address6_list = $("#ip6_list_cid").datagrid("getRows");
    var switch_type ="";
    if($('#switch_type_access_cid')[0].checked){
        switch_type = "access";
    }else{
        switch_type = "switch";
    }

    var mss = $('input:radio[name="mss"]:checked').val();
    if (mss == "define") {
//        if ($("#define_cid").checkInput({cl: ['must', 'allownumber', 'range:200-1460']}) == false)
//            return false;
        mss = $("#define_cid").val();
    }
    $.ajax({
        url: "?c=Network/Bond&attr=1",
        type: 'put',
        //dataType: 'json',
        data: {
            interface_name: $('#if_attr').val(),
            description: $('#description_cid').val(),
            description_old: $('#description_old').val(),
            shutdown: shutdown_val,
            shutdown_old: $('#shutdown_old').val(),
            comm_type: comm_type,
            comm_type_old: $("#comm_type_old").val(),
            ip4addr_items: json_to_string(data_address4_list),
            ip4addr_items_old: compare_ip(data_address4_list, $("#ip4addr_items_old").val(), "ip4"),
            ip6addr_items: json_to_string(data_address6_list),
            ip6addr_items_old: compare_ip(data_address6_list, $("#ip6addr_items_old").val(), "ip6"),
            switch_type: switch_type,
            switch_type_old: $("#switch_type_old").val(),
            access: $('#access_cid').val(),
            access_old: $('#access_old').val(),
            allowed: $('#allowed_cid').val(),
            allowed_old: $('#allowed_old').val(),
            native: $('#native_cid').val(),
            native_old: $('#native_old').val(),
            vlanvpn: vlanvpn,
            vlanvpn_old: $('#vlanvpn_old').val(),
            tpid: $('#tpid_cid').val(),
            tpid_old: $('#tpid_old').val(),
            mtu: $('#mtu_cid').val(),
            mtu_old: $('#mtu_old').val(),
//            vsid: $('#vsid_cid')[0].value,
//            vsid_old: $('#vsid_old')[0].value,
            mss: mss,
            mss_old: $('#mss_old').val()
        },
        success: function(data) {
            if (data== "0") {
                $("#attr_page").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
                return;
            }
        }
    });
}

function delete_bond_row() {
    var rows = $('#tt').datagrid('getSelections');
    var msg;
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var bondId = [];
                for (var i = 0; i < rows.length; i++) {
                    bondId.push(rows[i].bond_id);
                }
                    bondId = bondId.join('#');
                    $.ajax({
                        url: "?c=Network/Bond&mod=bond",
                        type: 'delete',
                        async: false,
                        data: {
                            delItems: bondId,
                            delKey:'id'
                        },
                        success: function(data) {
                             if (data != '0') {
                                 ngtosPopMessager("error", data);
                             }
                        }
                    });
                $('#tt').datagrid('reload');
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}

function clear_bond_row() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Bond&mod=bond&all=1",
                type: 'delete',
//                dataType: 'json',
                async: false,
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    } else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

function change_bond_comm(id) {
    if (id == 'group_route') {
        $("#group_route").show();
        $("#group_switch").hide();
    } else {
        $("#group_route").hide();
        $("#group_switch").show();
        change_switch("group_access");
        $('#switch_type_access_cid').attr("checked", "checked");
    }
}

function get_balance_name(id) {
    var arr = new Array("根据发送端口的轮流均衡", "根据源mac地址均衡", "根据目的mac地址均衡", "根据源和目的mac地址组合均衡",
            "根据源IP地址均衡", "根据目的IP地址均衡", "根据源和目的IP地址组合均衡", "根据源TCP/UDP端口均衡", "根据目的TCP/UDP端口均衡",
            "根据源和目的TCP/UDP端口组合均衡", "根据五元组均衡");
    return arr[id];
}

//多选控件同policy.js
var NS4 = (navigator.appName == "Netscape" && parseInt(navigator.appVersion) < 5);
function addOption(theSel, theText, theValue) {
    var newOpt = new Option(theText, theValue);
    newOpt.title = theValue
    var selLength = theSel.length;
    theSel.options[selLength] = newOpt;
}

function deleteOption(theSel, theIndex) {
    var selLength = theSel.length;
    if (selLength > 0) {
        theSel.options[theIndex] = null;
    }
}
//function moveOptions(theSelFrom1, theSelTo1, num) {
//    if (num) {
//        var theSelFrom = $('#' + theSelFrom1)[0];
//        var theSelTo = $('#' + theSelTo1)[0];
//    } else {
//        var theSelFrom = $('#adduserDiv2').find('#' + theSelFrom1)[0];
//        var theSelTo = $('#adduserDiv2').find('#' + theSelTo1)[0];
//    }
//    var selLength = theSelFrom.length;
//    var selectedText = new Array();
//    var selectedValues = new Array();
//    var selectedCount = 0;
//
//    var num = 0;
//    var j;
//    for (j = selLength - 1; j >= 0; j--) {
//        if (theSelFrom.options[j].selected)
//            num++;
//        if (num > 128) {
//            ngtosPopMessager("error", "最多只能选择128个");
//            return;
//        }
//    }
//
//    var i;
//    for (i = selLength - 1; i >= 0; i--) {
//        if (theSelFrom.options[i].selected) {
//            selectedText[selectedCount] = theSelFrom.options[i].text;
//            selectedValues[selectedCount] = theSelFrom.options[i].value;
//            deleteOption(theSelFrom, i);
//            selectedCount++;
//        }
//    }
//
//    for (i = selectedCount - 1; i >= 0; i--) {
//        addOption(theSelTo, selectedText[i], selectedValues[i]);
//    }
//    if (NS4)
//        history.go(0);
//}
//多选控件结束

function set_bond_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    //编辑按钮逻辑
        if (crows.length == 1) {
            $('#icon-edit').linkbutton('enable');
        } else {
            $('#icon-edit').linkbutton('disable');
        }
        //属性按钮逻辑
        if (crows.length == 1) {
            $('#icon-attr').linkbutton('enable');
        } else {
            $('#icon-attr').linkbutton('disable');
        }
        //删除按钮逻辑
        if (crows.length > 0) {
            $('#icon-delete').linkbutton('enable');
        } else {
            $('#icon-delete').linkbutton('disable');
        }
}