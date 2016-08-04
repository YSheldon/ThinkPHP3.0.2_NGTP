//打开添加窗口
function addNeighRow() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_600'></div>");
    }
    open_window('add_page', 'Network/Neighbour', 'windowShow&w=network_neighbour_add_window', $LANG.ADD);
}

function addNeighSubmit() {
    var add = $('#neighbour_add').form('validate');
    if (add) {
        $.ajax({
            url: "?c=Network/Neighbour",
            type: 'POST',
            dataType: 'text',
            data: {
                dev: $('#interface_cid').combobox('getValue'),
                ip: $('#ip_cid').val(),
                mac: $('#mac_cid').val()
            },
            success: function(data) {
                if (data == 0) {
                    $("#add_page").window("close");
                    $('#tt').datagrid('reload');
                } else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}

function deleteNeighRow() {
    var rows = $('#tt').datagrid('getSelections');
    var msg;
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r == 1) {
                var ip = [];
                var dev = [];
                for (var i = 0; i < rows.length; i++) {
                    ip.push(rows[i].ip);
                    dev.push(rows[i].dev);
                }
                ip = ip.join('#');
                dev = dev.join('#');
                    $.ajax({
                        url: "?c=Network/Neighbour",
                        type: 'delete',
                        async: false,
                        dataType: 'text',
                        data: {
                            ip: ip,
                            dev: dev
                        },
                        success: function(data) {
                            if (data == 1) {
                                ngtosPopMessager("error", data);
                            } else{
                                msg += data;
                            }
                        }
                    });
                $('#tt').datagrid('reload');
            }
        });
    }else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}

function clearNeighRow(){
    //获取所有接口
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Neighbour&mod=neighbour&all=1",
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

//打开添加窗口
function searchNeighRow() {
    if ($('#search_page').length <= 0) {
        $(document.body).append("<div id='search_page' class='ngtos_window_600'></div>");
    }
    open_window('search_page', 'Network/Neighbour', 'searchWindow', $LANG.QUERY);
}

function searchNeighSubmit() {
    var url = "&interface=" + $("#find_interface").combobox('getValue');
    url = url + "&ip=" + $("#find_ip").val();
    url = url + "&mac=" + $("#find_mac").val();
    $("#tt").datagrid('options').url = '?c=Network/Neighbour' + url;
    $("#search_page").window("close");
    $('#tt').datagrid('reload');
}

function set_neigh_toolbar() {
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
}