//打开添加窗口
function addArpRow() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_650'></div>");
    }
    open_window('add_page', 'Network/Arp', 'windowShow&w=network_arp_add_window', $LANG.ADD);
}
function addArpSubmit() {
    var add = $('#arp_add').form('validate');
    if (add) {
        $.ajax({
            url: "?c=network/Arp",
            type: 'POST',
            data: {
                dev: $('#interface_cid').combobox('getValue'),
                ip: $('#ip_cid').val(),
                mac: $('#mac_cid').val()
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

function deleteArpRow() {
    var rows = $('#tt').datagrid('getSelections');
    var msg;
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var ip = [];
                var dev = [];
                for (var i = 0; i < rows.length; i++) {
                    ip.push(rows[i].ip);
                    dev.push(rows[i].dev);
                }
                ip = ip.join('#');
                dev = dev.join('#');
                    $.ajax({
                        url: "?c=Network/Arp",
                        type: 'delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            ip: ip,
                            dev: dev
                        },
                        success: function(data) {
                            if (data == 1) {
                                ngtosPopMessager("error", data['info'], '', "login");
                            } else if (data == 2) {
                                msg += data['info'];
                            }
                        }
                    });
                if (msg != "" && msg != null) {
                    ngtosPopMessager("error", msg);
                }
                $('#tt').datagrid('reload');
            }
        });
    }else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}

function clearArpRow() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Arp&a=clean&mod=arp&all=1",
                type: 'delete',
                dataType: 'json',
                async: false,
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    } else if (data == 1) {
                        ngtosPopMessager("error", data['info'], '', "login");
                    } else if (data == 2) {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

//打开查询窗口
function searchArpRow() {
    if ($('#search_page').length <= 0) {
        $(document.body).append("<div id='search_page' class='ngtos_window_600'></div>");
    }
    open_window('search_page', 'Network/Arp', 'searchWindow', $LANG.QUERY);
}

function searchArpSubmit() {
    var url = "&interface=" + $("#find_interface").combobox('getValue');
    url = url + "&ip=" + $("#find_ip").val();
    url = url + "&mac=" + $("#find_mac").val();
    $("#tt").datagrid('options').url = '?c=Network/Arp' + url;
    $("#search_page").window("close");
    $('#tt').datagrid('reload');
}

function set_arp_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    if (getPrivilege("network") == false) {
        $('#icon_delete').linkbutton('disable');
    }else{
    //删除按钮逻辑
        if (crows.length > 0) {
            $('#icon_delete').linkbutton('enable');
        } else {
            $('#icon_delete').linkbutton('disable');
        }
    }
}
