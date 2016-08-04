//打开添加窗口
function addMacRow() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_620'></div>");
    }
    open_window('add_page', 'Network/Mac', 'windowShow&w=network_mac_add_window', $LANG.ADD);
}
//弹出框提交
function addMacSubmit() {
//    if (!$("#vlan_cid_pop").combobox('getValue')) {
//        ngtosPopMessager("info", "vlan不能为空，请先添加vlan！");
//        return;
//    }
//    if (!$("#interface_cid_pop").combobox('getValue')) {
//        ngtosPopMessager("info", "接口不能为空，请检查接口配置！");
//        return;
//    }
//    if (!$("#address_cid_pop").val()) {
//        ngtosPopMessager("info", "物理地址不能为空！");
//        return;
//    }
    var add = $('#mac_add').form('validate');
    if (add) {
       $.ajax({
           url: "?c=Network/Mac",
           type: 'POST',
           //dataType: 'json',
           data: {
               vlan: $("#vlan_cid_pop").combobox('getValue'),
               interfacee: $('#interface_cid_pop').combobox('getValue'),
               address: $('#address_cid_pop').val()
           },
           success: function(data) {
               if (data == 0) {
                   $("#add_page").window("close");
                   $('#tt').datagrid('reload');
               } else {
                   ngtosPopMessager("error", data);
               }
           }
       });
   }
}

function deleteMacRow() {
    var rows = $('#tt').datagrid('getSelections');
    var msg;
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                for (var i = 0; i < rows.length; i++) {
                    $.ajax({
                        url: "?c=Network/Mac",
                        type: 'delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            address: rows[i].mac,
                            vlan: rows[i].vlanid,
                            interface: rows[i].devname
                        },
                        success: function(data) {
                            if (data == 1) {
                                ngtosPopMessager("error", data['info'], '', "login");
                            } else if (data == 2) {
                                msg += data['info'];
                            }
                        }
                    });
                }
                if (msg != "" && msg != null) {
                    ngtosPopMessager("error", msg);
                }
                $('#tt').datagrid('reload');
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}

function clearMacRow() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Mac&mod=mac&all=1",
                type: 'delete',
                dataType: 'json',
                async: false,
                data: {
                    parKey:'__NA__',
                    param: "static"
                },
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data['info']);
                    }
                }
            });
        }
    });
}


function mySearch() {
    var mac_reg =/^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
    var vlan_reg =/^[+]?[-]?[1-9]+\d*$/;
    if($("#find_mac").val() && !$("#find_vlan").val()){
        if(!mac_reg.test($("#find_mac").val())){
            ngtosPopMessager("error", 'MAC地址错误');
            return;
        }else{
            $('#tt').datagrid({
                queryParams: {
                    mac: $("#find_mac").val(),
                    vlan: $("#find_vlan").val(),
                    interfacee: $("#find_interface").val()
                }
            });
        }
    }else if($("#find_vlan").val() && !$("#find_mac").val()){
        if(!vlan_reg.test($("#find_vlan").val())){
            ngtosPopMessager("error", 'VLANID错误');
            return;
        }else{
            $('#tt').datagrid({
                queryParams: {
                    mac: $("#find_mac").val(),
                    vlan: $("#find_vlan").val(),
                    interfacee: $("#find_interface").val()
                }
            });
        }
    }else if($("#find_vlan").val() && $("#find_mac").val()){
        if(!mac_reg.test($("#find_mac").val())){
            ngtosPopMessager("error", 'MAC地址错误');
            return;
        }else if(!vlan_reg.test($("#find_vlan").val())){
            ngtosPopMessager("error", 'VLANID错误');
            return;
        }else{
            $('#tt').datagrid({
                queryParams: {
                    mac: $("#find_mac").val(),
                    vlan: $("#find_vlan").val(),
                    interfacee: $("#find_interface").val()
                }
            });
        }
    }else{
        $('#tt').datagrid({
            queryParams: {
                mac: $("#find_mac").val(),
                vlan: $("#find_vlan").val(),
                interfacee: $("#find_interface").val()
            }
        });
    }

}


//function getVlanInterface(id) {
//    var sid = "#" + id;
//    $.ajax({
//        url: "?c=Network/Vlan&a=allVlanJsondata",
//        type: 'POST',
//        dataType: 'json',
//        success: function(data) {
//            if (data == 0) {
//                //空值
//            } else if (data == 1) {
//                ngtosPopMessager("error", data['info'], '', "login");
//            } else if (data == 2) {
//                ngtosPopMessager("error", data['info']);
//            } else {
//                for (var i = 0; i < data["rows"].length; i++)
//                {
//                    var value = data["rows"][i]["vlanid"];
//                    if (value < 10) {
//                        var name = "vlan.000" + value;
//                    } else if (value >= 10 && value < 100) {
//                        var name = "vlan.00" + value;
//                    } else if (value >= 100 && value < 1000) {
//                        var name = "vlan.0" + value;
//                    } else {
//                        var name = "vlan." + value;
//                    }
//                    $(sid).append("<option value='" + value + "'>" + name + "</option>");
//                }
//            }
//        }
//    });
//}


function set_mac_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    //删除按钮逻辑
    if (getPrivilege("network") == false) {
        $('#icon_delete').linkbutton('disable');
    }else{
        if (crows.length > 0) {
            $('#icon_delete').linkbutton('enable');
        } else {
            $('#icon_delete').linkbutton('disable');
        }
    }

//    var rows = $('#tt').datagrid('getRows');
//
//    //清空按钮逻辑
//    if (rows.length > 0) {
//        $('#icon_clear').linkbutton('enable');
//    } else {
//        $('#icon_clear').linkbutton('disable');
//    }
}

//function myDynamicMacSearch() {
//    var mac_reg =/^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
//    var vlan_reg =/^[+]?[-]?[1-9]+\d*$/;
//    if($("#find_mac").val() && !$("#find_vlan").val()){
//        if(!mac_reg.test($("#find_mac").val())){
//            alert('MAC地址错误');
//            return;
//        }else{
//            $('#tt').datagrid({
//                queryParams: {
//                    mac: $("#find_mac").val(),
//                    vlan: $("#find_vlan").val(),
//                    interfacee: $("#find_interface").combobox("getValue")
//                }
//            });
//        }
//    }else if($("#find_vlan").val() && !$("#find_mac").val()){
//        if(!vlan_reg.test($("#find_vlan").val())){
//            alert('VLANID错误');
//            return;
//        }else{
//            $('#tt').datagrid({
//                queryParams: {
//                    mac: $("#find_mac").val(),
//                    vlan: $("#find_vlan").val(),
//                    interfacee: $("#find_interface").combobox("getValue")
//                }
//            });
//        }
//    }else if($("#find_vlan").val() && $("#find_mac").val()){
//        if(!mac_reg.test($("#find_mac").val())){
//            alert('MAC地址错误');
//            return;
//        }else if(!vlan_reg.test($("#find_vlan").val())){
//            alert('VLANID错误');
//            return;
//        }else{
//            $('#tt').datagrid({
//                queryParams: {
//                    mac: $("#find_mac").val(),
//                    vlan: $("#find_vlan").val(),
//                    interfacee: $("#find_interface").combobox("getValue")
//                }
//            });
//        }
//    }else{
//        $('#tt').datagrid({
//            queryParams: {
//                mac: $("#find_mac").val(),
//                vlan: $("#find_vlan").val(),
//                interfacee: $("#find_interface").combobox("getValue")
//            }
//        });
//    }
//}
//动态mac清空数据
function myDynamicMacClear(){
    
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/DynamicMac&all=1",
                type: 'delete',
                dataType: 'json',
                async: false,
                data: {
                    type: "dynamic"
                },
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data['info']);
                    }
                }
            });
        }
    });
}
