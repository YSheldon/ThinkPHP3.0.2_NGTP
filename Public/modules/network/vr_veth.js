//打开添加窗口
function add_vveth_row() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_400'></div>");
    }
    open_window('add_page', 'Network/Vrveth', 'addWindow', $LANG.ADD);
}

//弹出框提交
function add_vveth_submit() {
    
    var vrid1 = $('#interface_one_cid').combobox('getValue');
    var vrid2 = $('#interface_two_cid').combobox('getValue');
    $.ajax({
        url: "?c=Network/Vrveth",
        type: 'POST',
        dataType: 'json',
        data: {
            vrid1: vrid1,
            vrid2: vrid2
        },
        success: function(data) {
            $("#add_page").window("close");
            $('#tt').datagrid('reload');
        },
        error: function(XMLHttpRequest) {
            var msg = XMLHttpRequest.responseText.split(':');
            ngtosPopMessager("error", msg);
        }
    });
}
//编辑窗口
function edit_vveth_row(interface, description, ip4, ip6) {
    if (typeof (interface) == "string") {
        param[0] = interface;
        param[1] = description;
        param[2] = ip4;
        param[3] = ip6;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].interface_name;
        param[1] = rows[0].description;
        param[2] = rows[0].ip4;
        param[3] = rows[0].ip6;
    }
    if ($('#edit_page').length <= 0) {
        $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
    }
    open_window('edit_page', 'Network/Vrveth', 'windowShow&w=network_vrveth_edit_window', $LANG.EDIT);
}

function edit_vveth_row_init(interface, description, ip4, ip6) {
    page_show('edit_page', 'basic');
    $("#ha4_cid").attr("checked", false);
    $("#ha6_cid").attr("checked", false);
    load_datagrid();
    $('#interface_name_cid').html(interface);
    $('#interface_value_cid').val(interface);
    $('#description_cid').val(description);
    $('#description_old').val(description);
    $("#ip4addr_items_old").val(ip4);
    $("#ip6addr_items_old").val(ip6);
    if (ip4.length != 0) {
        $("#ip4_list_cid").datagrid('loadData', get_ip4_data(ip4));
    }
    //linklocal不可编辑和删除，去除此ip
    var gridIp6 = [];
    if(ip6.length != 0) {
        var ip6Arr = ip6.split(",");
        for(var i=0;i<ip6Arr.length;i++) {
            if(ip6Arr[i].indexOf('/linklocal') == -1) {
                gridIp6.push(ip6Arr[i]);
            }
        }
    }
    if (gridIp6.length !== 0) {
        $("#ip6_list_cid").datagrid('loadData', get_ip6_data(gridIp6));
    }
}

function edit_vveth_submit() {

    var data_address4_list = $("#ip4_list_cid").datagrid("getRows");
    var data_address6_list = $("#ip6_list_cid").datagrid("getRows");

    var ipv4 = "";
    var ha = "";
    var ipv4_flag = 1;
    for (var i = 0; i < data_address4_list.length; i++) {
        if (data_address4_list[i].ha == "HA") {
            ha = "ha_static";
        } else if (data_address4_list[i].ha == "") {
            ha = "no_ha_static";
        } else {
            ha = "is_dhcp";
        }
        if (i == data_address4_list.length - 1) {
            ipv4 += data_address4_list[i].ip + "/" + data_address4_list[i].mask + "/" + ha + "/" + data_address4_list[i].secondary;
        } else {
            ipv4 += data_address4_list[i].ip + "/" + data_address4_list[i].mask + "/" + ha + "/" + data_address4_list[i].secondary + ",";
        }
    }
    var oldip4s = $("#ip4addr_items_old").val();
    if (oldip4s == ipv4) {
        ipv4_flag = 0;
    }

    var ipv6 = "";
    var ha = "";
    var ipv6_flag = 1;
    for (var i = 0; i < data_address6_list.length; i++) {
        if (data_address6_list[i].ha == "HA") {
            ha = "ha_static";
        } else {
            ha = "no_ha_static";
        }
        if (i == data_address6_list.length - 1) {
            ipv6 += data_address6_list[i].ip + "/" + ha + "/" + data_address6_list[i].linklocal + "/" + data_address6_list[i].secondary;
        } else {
            ipv6 += data_address6_list[i].ip + "/" + ha + "/" + data_address6_list[i].linklocal + "/" + data_address6_list[i].secondary + ",";
        }
    }
    var oldip6s = $("#ip6addr_items_old").val();
    //linklocal不可编辑和删除，去除此ip，对比是否做过改变
    var oldIp6Arr = [];
    if(oldip6s.length != 0) {
        var ip6Arr = oldip6s.split(",");
        for(var i=0;i<ip6Arr.length;i++) {
            if(ip6Arr[i].indexOf('/linklocal') == -1) {
                oldIp6Arr.push(ip6Arr[i]);
            }
        }
    }
    var oldip6str = oldIp6Arr.join(',');
    if(oldip6str == ipv6) {
        ipv6_flag = 0;
    }

    $.ajax({
        url: "?c=Network/Vrveth",
        type: 'put',
        dataType: 'text',
        data: {
            interface_name: $('#interface_value_cid').val(),
            description: $('#description_cid').val(),
            description_old: $('#description_old').val(),
            ip4addr_items: json_to_string(data_address4_list),
            ip4addr_items_old: ipv4_flag,
            ip6addr_items: json_to_string(data_address6_list),
            ip6addr_items_old: ipv6_flag
        },
        success: function(data) {
            if (data == 0) {
                $("#edit_page").window("close");
                delayRefresh(oldip4s,oldip6s,ipv4_flag,ipv6_flag,'#tt');
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function delete_vveth_row() {
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length == 2) {
          var vsys_name = rows[0].vsys_name;
          var peer_vsys_name = rows[1].vsys_name;
          var checkVsys_name = rows[0].interface_name;
          var checkPeerVsys_name = rows[1].interface_name;
          var checkVsys = [];
          var checkPeerVsys = [];
        //获取截取到的id字符串
          checkVsys_name = checkVsys_name.substring(5);
          checkPeerVsys_name = checkPeerVsys_name.substring(5);
        //将截取到的id的字符串转化成数组，用于比较是否是同一对接口
          checkVsys = checkVsys_name.split('_');
          checkPeerVsys = checkPeerVsys_name.split('_');
           if(checkVsys[0] == checkPeerVsys[1] && checkVsys[1] == checkPeerVsys[0]){
               ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
                   if (r) {
                       $.ajax({
                           url: "?c=Network/Vrveth",
                           type: 'delete',
                           dataType: 'text',
                           data: {
                               vrid1: vsys_name,
                               vrid2: peer_vsys_name
                           },
                           success: function(data) {
                               var a = '';
                               if(data == 0) {
                                   a = setTimeout(function(){
                                       $('#tt').datagrid('reload');
                                   },500);
                               }else{
                                   ngtosPopMessager('error',data);
                               }
                           }
                       });
                   }
               });
           }else{
               ngtosPopMessager('error',$LANG.DELETE_IS_NAPOIPC);
           }

    } else if (rows.length == 1) {
        ngtosPopMessager("error", $LANG.CHOOSE_ANTHER_INTERFACE);
    }
}

function set_vveth_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
//    判断用户是否为虚系统用户
    if(isShared()){
        $('#icon-add').linkbutton('disable');
        $('#icon-delete').linkbutton('disable');
        $('#icon-searchall').linkbutton('disable');
        $('#icon-searcha').linkbutton('disable');
        if (crows.length == 1) {
            $('#icon-edit').linkbutton('enable');
        } else {
            $('#icon-edit').linkbutton('disable');
        }
    }else{
    //编辑按钮逻辑
        if (crows.length == 1) {
            $('#icon-edit').linkbutton('enable');
        } else {
            $('#icon-edit').linkbutton('disable');
        }
        //删除按钮逻辑
        if (crows.length == 2) {
            $('#icon-delete').linkbutton('enable');
        }else if(crows.length > 2){
            $('#icon-delete').linkbutton('disable');
        } else if(crows.length == 1){
            $('#icon-delete').linkbutton('enable');
        }else {
            $('#icon-delete').linkbutton('disable');
        }
//    遍历得到的选项行的数据，并且把数据进行遍历，并且判断用户属于什么系统,如果为根系统则可以编辑
       for($i = 0;$i < crows.length; $i++){
           if(crows[$i]['vsys_name'] == 'root_vsys'){
               $('#icon-edit').linkbutton('enable');
           }else{
               $('#icon-edit').linkbutton('disable');
           }
       }
    }
}
//查看所有   seach  1代表显示所有；  空值代表只能看自己的
function searchall_vveth_row(){
    $("#tt").datagrid('options').url = "?c=Network/Vrveth&act=all&mod=veth";
    $('#tt').datagrid('reload');
}
//查看自己
function searcha_vveth_row(){
    $("#tt").datagrid('options').url = "?c=Network/Vrveth&mod=veth";
    $('#tt').datagrid('reload');
}