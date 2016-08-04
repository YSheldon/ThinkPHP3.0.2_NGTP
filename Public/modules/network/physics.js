
//打开编辑窗口
function edit_physics_row(name) {

    param[0] = name;
    if ($('#edit_page').length <= 0) {
        $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
    }
    open_window('edit_page', 'Network/Physics', 'windowShow&w=network_physics_edit_window', $LANG.EDIT);
}

function edit_physics_row_init(name) {
    page_show('edit_page', 'basic');
    var vsid = "";
    $("#ha4_cid").attr("checked", false);
    $("#ha6_cid").attr("checked", false);

    if (getLicense(0, "QINQ") == false) {
        $('#qinq_btn').hide();
        $('#qinq_proid').hide();
    }

    $.ajax({
        url: "?c=Network/Physics&a=datagridShow",
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            param: name,
            mod:'network physicalinterface',
            parKey:'single'
        },
        success: function(data) {
            if (data['rows'].length > 0) {
                //如何接口模式错误，返回
                if (data["rows"][0]["comm_type"] == "unknown") {
                    ngtosPopMessager("info", $LANG.INTERFACE_EPCTD);
                    return;
                }

                load_datagrid();
                vsid = data["rows"][0]["vsid"];
                $('#vsid_old').val(vsid);

                $('#interface_name_cid').html(name);
                $('#interface_value_cid').val(name);
                var description_cid = data["rows"][0]["description"];
                var description_old = data["rows"][0]["description"];
                if(description_cid.indexOf("&lt;") > 0){
                    description_cid = description_cid.replace(/&lt;/g,'<');
                }
                if(description_old.indexOf("&lt;") >0){
                    description_old = description_old.replace(/&lt;/g,'<');
                }
                $('#description_cid').val(description_cid);
                $('#description_old').val(description_old);
                if (data["rows"][0]["shutdown"] == "disable") {
//                            setBtState("shutdown_cid", "stop");
                    $('#shutdown_disable').attr("checked", "checked");
                    $('#shutdown_old').val(1);
                } else {
//                            setBtState("shutdown_cid", "start");
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
                if (data["rows"][0]["comm_type"] == "virtualline") {
                    $('#comm_type_line_cid').attr("checked", "checked");
                    $('#group_route').hide();
                    $('#group_switch').hide();
                    $('#group_line').show();
                    $('#comm_type_route_cid').attr("disabled", "disabled");
                    $('#comm_type_switch_cid').attr("disabled", "disabled");
                    $('#comm_type_line_cid').attr("disabled", false);
                    $('#face_cid').attr("disabled", "disabled");
                } else if (data["rows"][0]["comm_type"] == "slave") {
                    $('#comm_type_slave_cid').attr("checked", "checked");
                    $('#group_route').hide();
                    $('#group_switch').hide();
                    $('#group_line').hide();
                    $('#comm_type_route_cid').attr("disabled", "disabled");
                    $('#comm_type_switch_cid').attr("disabled", "disabled");
                    $('#comm_type_line_cid').attr("disabled", "disabled");
                } else if (data["rows"][0]["comm_type"] == "switching") {
                    $('#comm_type_switch_cid').attr("checked", "checked");
                    $('#group_route').hide();
                    $('#group_switch').show();
                    $('#group_line').hide();
                    $('#comm_type_route_cid').attr("disabled", false);
                    $('#comm_type_switch_cid').attr("disabled", false);
                    $('#comm_type_line_cid').attr("disabled", false);
                    $('#face_cid').attr("disabled", false);
                    $('#switch_type_old').val(data["rows"][0]["switch_mode"]);
                    if (data["rows"][0]["switch_mode"] == "access") {
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
                } else {
                    $('#comm_type_route_cid').attr("checked", "checked");
                    $('#group_route').show();
                    $('#group_switch').hide();
                    $('#group_line').hide();
                    $('#comm_type_route_cid').attr("disabled", false);
                    $('#comm_type_switch_cid').attr("disabled", false);
                    $('#comm_type_line_cid').attr("disabled", false);
                    $('#face_cid').attr("disabled", false);
                }
                var oldIp4 = data["rows"][0]["ip4"];
                var oldIp6 = data["rows"][0]["ip6"];
                $("#ip4addr_items_old").val(oldIp4);
                $("#ip6addr_items_old").val(oldIp6);

                if (oldIp4.length != 0) {
                    $("#ip4_list_cid").datagrid('loadData', get_ip4_data(oldIp4));
                }
                //linklocal不可编辑和删除，去除此ip
                if(oldIp6.length != 0) {
                    var ip6Arr = oldIp6.split(",");
                    var gridIp6 = [];
                    for(var i=0;i<ip6Arr.length;i++) {
                        if(ip6Arr[i].indexOf('/linklocal') == -1) {
                            gridIp6.push(ip6Arr[i]);
                        }
                    }
                    if (gridIp6.length != 0 ) {
                        $("#ip6_list_cid").datagrid('loadData', get_ip6_data(gridIp6));
                    }
                }
                //bond模式屏蔽以下功能
                if (data["rows"][0]["comm_type"] == "slave") {
                    $("#mtu_conf").hide();
                    $("#mss_conf").hide();
                    $("#mss_define_cid").hide();
                    $("#mtu_show").show();
                    $("#mss_show").show();
                    $('#mtu_show_cid').html(data["rows"][0]["mtu"]);
                    var mss = data["rows"][0]["mss"];
                    if (mss == 1) {
                        $('#mss_show_cid').html("自适应");
                    } else if (mss == 0) {
                        $('#mss_show_cid').html("关闭");
                    } else {
                        $('#mss_show_cid').html(mss);
                    }
                } else {
                    $("#mtu_conf").show();
                    $("#mss_conf").show();
                    $("#mss_define_cid").show();
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
                var manager = data["rows"][0]["is_management"];
                $("#manager_old").val(manager);
                if (manager == 1) {
                    $("#shutdownTt").hide();
                    $("#duplex_conf").hide();
                    $("#speed_conf").hide();
                } else {
                    $("#shutdownTt").show();
                    $("#duplex_conf").show();
                    $("#speed_conf").show();

                    var duplex = data["rows"][0]["duplex_conf"];
                    if (duplex == "Full-duplex") {
                        $('#duplex_cid').attr("value", "full");
                        $('#duplex_old').val("full");
                    } else if (duplex == "Half-duplex") {
                        $('#duplex_cid').attr("value", "half");
                        $('#duplex_old').val("half");
                    } else {
                        $('#duplex_cid').attr("value", "auto");
                        $('#duplex_old').val("auto");
                    }

                    if ($.trim(data["rows"][0]["speed_conf"]) == 0) {
                        $('#speed_cid').attr("value", "auto");
                        $('#speed_old').val("auto");
                    } else {
                        var speed = $.trim(data["rows"][0]["speed_conf"].replace("Mb/s", ""));
                        $('#speed_cid').attr("value", speed);
                        $('#speed_old').val(speed);
                    }
                }
            }
        }
    });
    get_vline_interface("face_cid", name);
}


function editPhysicsSubmit() {
    $('#window_phy').window('open');

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
        mss = $("#define_cid").val();
    }
    $.ajax({
        url: "?c=Network/Physics&a=editSave",
        type: 'POST',
        data: {
            interface_name: $('#interface_value_cid').val(),
            description: $('#description_cid').val(),
            description_old: $('#description_old').val(),
            shutdown: shutdown_val,
            shutdown_old: $('#shutdown_old').val(),
            comm_type: comm_type,
            comm_type_old: $("#comm_type_old").val(),
            ip4addr_items: json_to_string(data_address4_list),
            ip4addr_itemsOld: $("#ip4addr_items_old").val(),
            ip4addr_items_old: compare_ip(data_address4_list, $("#ip4addr_items_old").val(), "ip4"),
            ip6addr_items: json_to_string(data_address6_list),
            ip6addr_itemsOld: $("#ip6addr_items_old").val(),
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
            face: $('#face_cid').val(),
            mtu: $('#mtu_cid').val(),
            mtu_old: $('#mtu_old').val(),
            mss: mss,
            mss_old: $('#mss_old').val(),
            duplex: $('#duplex_cid').combobox('getValue'),
            duplex_old: $('#duplex_old').val(),
            speed: $('#speed_cid').combobox('getValue'),
            speed_old: $('#speed_old').val(),
            manager: $("#manager_old").val()
        },
        success: function(data) {
            if (data == 0) {
                $('#window_phy').window('close');
                $("#edit_page").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
                $('#window_phy').window('close');
            }
        }
    });
}


function change_physics_comm(id) {
    if (id == 'group_route') {
        $("#group_route").show();
        $("#group_switch").hide();
        $("#group_line").hide();
    } else if (id == 'group_line') {
        $("#group_route").hide();
        $("#group_switch").hide();
        $("#group_line").show();
    } else if (id == 'group_bond') {
        $("#group_route").hide();
        $("#group_switch").hide();
        $("#group_line").hide();
    } else {
        $("#group_route").hide();
        $("#group_switch").show();
        $("#group_line").hide();
        change_switch("group_access");
        $('#switch_type_access_cid').attr("checked", "checked");
    }
}




//??????????需要测试翻页是否还有效
//动态改变接口链路状态
function update_link_state() {
    var CONNECT = $LANG.CONNECT;
    var UNCONNECT = $LANG.UNCONNECT;
    $.ajax({
        url: "?c=Network/Physics&a=datagridShow",
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            mod:'network physicalinterface',
            page:$('#tt').datagrid('options').pageNumber,
            rows:$('#tt').datagrid('getRows').length
        },
        success: function(data) {
            if (data == 0 || data == 2) {
                ngtosPopMessager("error", data);
            } else if (data == 1) {
                ngtosPopMessager("error", data);
            } else {
                for (var i = 0; i < data["rows"].length; i++){
                    var value = data["rows"][i]["link_status"];
                    var obj = $('#tt').datagrid("getPanel").find("td[field=\"link_status\"]").eq(i + 1).find('img');
                    var src = obj.attr("src");
                    var img = src.substring(src.lastIndexOf("/") + 1, src.length);

                    if (value == "up" && img == "interface_abnormal.png") {
                        obj.attr("src", NG_PATH+"Public/images/icon/interface_normal.png");
                        obj.attr("title", CONNECT);
                    } else if (value == "down" && img == "interface_normal.png") {
                        obj.attr("src", NG_PATH+"Public/images/icon/interface_abnormal.png");
                        obj.attr("title", UNCONNECT);
                    }
                }
            }
        }
    });
}


//供物理接口和虚拟线功能使用，获得允许使用的物理接口
function get_vline_interface(selectid, current) {
    var jqid = "#" + selectid;
//    $(jqid).empty();

    //获得除current接口外的物理接口
    $.ajax({
        url: "?c=Network/Physics&a=alPhysicsJsondata",
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data == 0 || data == 2) {
                ngtosPopMessager("error", data);
            } else if (data == 1) {
                ngtosPopMessager("error", data);
            } else {
                for (var i = 0; i < data["rows"].length; i++) {
                    var value = data["rows"][i]["interface_name"];
                    if (value != current) {
                        $(jqid).append("<option value='" + value + "'>" + value + "</option>");
                    }
                }
            }
        }
    });

    //移除已经配置过虚拟线的物理接口
    $.ajax({
        url: "?c=Network/Virtualline&a=allVlineJsondata",
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data['type'] == 0) {
            } else if (data['type'] == 1) {
                ngtosPopMessager("error", data);
            } else if (data['type'] == 2) {
                ngtosPopMessager("error", data);
            } else {
                for (var i = 0; i < data["rows"].length; i++) {
                    var dev = data["rows"][i]["dev"];
                    var peer = data["rows"][i]["peer_dev"];
                    if (dev == current) {
                        $(jqid)[0].value = peer;
                    } else if (peer == current) {
                        $(jqid)[0].value = dev;
                    } else {
                        $("#" + selectid + " option[value=" + dev + "]").remove();
                        $("#" + selectid + " option[value=" + peer + "]").remove();
                    }
                }
            }
        }
    });
}

//查看所有   seach  1代表显示所有；  空值代表只能看自己的
/*function searchPhysicsRowAll(){
    
    var seach = "1";
    $("#tt").datagrid('options').url = "?c=Network/Physics&a=showJsondata&seach="+seach;
    $('#tt').datagrid('reload');
}*/
//查看自己
/*function searchPhysicsRows(){
    
    $("#tt").datagrid('options').url = "?c=Network/Physics&a=showJsondata";
    $('#tt').datagrid('reload');
}*/
//单击编辑按钮的时候进行编辑
function edit(){
    if(getPrivilege("network") != false){
        var row=$('#tt').datagrid('getSelections');
        var insterface_name = row[0].interface_name;
        edit_physics_row(insterface_name);
    }
}
//确定启用的方法
function NetworkSelectrowEnable(){
        var st= 0;
    ngtosPopMessager("confirm", $LANG.SURE_ENABLE,function(r){
        if(r){
            var row=$('#tt').datagrid('getSelections');
                $.ajax({
                    url: "?c=Network/Physics&a=callFun",
                    type: 'POST',
                    dataType:'text',
                    async:false,
                    data:{
                        fun:'enableEdit',
                        mod:'network interface',
                        act:'null',
                        parVal:row[0].interface_name,
                        enable:'shutdown',
                        parKey:'__NA__eth',
                        operate:'no'
                    },
                    success: function(data){
                        if(data !='0'){
                            ngtosPopMessager('error',data);
                        }
                    }
                });
            $('#tt').datagrid('reload');
        }
    });
}
//确定停止的方法
function NetworkSelectrowDisable(){
        var st= 1;
    ngtosPopMessager("confirm", $LANG.SURE_DISABLE,function(r){
        if(r){
            var row=$('#tt').datagrid('getSelections');
            $.ajax({
                url: "?c=Network/Physics&a=callFun",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    fun:'enableEdit',
                    mod:'network interface',
                    act:'null',
                    parVal:row[0].interface_name,
                    enable:'shutdown',
                    parKey:'__NA__eth',
                    operate:'__NA__sh'
                },
                success: function(data){
                    if(data !='0'){
                        ngtosPopMessager('error',data);
                    }
                }
            });
            $('#tt').datagrid('reload');
        }
    });
}