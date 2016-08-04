//打开添加窗口
function addVlineRow() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_400'></div>");
    }
    open_window('add_page', 'Network/Virtualline', 'windowShow&w=network_virtual_line_add_window', $LANG.ADD);
}

//弹出框提交
function addVlineSubmit() {
    $.ajax({
//        url: "?c=Network/Virtualline&a=addSave",
        url: "?c=Network/Virtualline",
        type: 'POST',
        data: {
            dev1: $('#interface_one_cid').combobox('getValue'),
            dev2: $('#interface_two_cid').combobox('getValue')
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

function deleteVlineRow() {
    var rows = $('#tt').datagrid('getSelections');
    var msg;
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r == 1) {
                var objId = [];
                for (var i = 0; i < rows.length; i++) {
                    objId.push(rows[i].objid);
                }
                    objId = objId.join('#');
                    $.ajax({
                        url: "?c=Network/Virtualline&mod=virtual-line",
                        type: 'delete',
                        async: false,
                        data: {
                            delItems: objId,
                            delKey:'id'
                        },
                        success: function(data) {
                            if(data != 0) {
                                ngtosPopMessager("error", data);
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

function clearVlineRow() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Virtualline&mod=virtual-line&all=1",
                type: 'delete',
                dataType: 'json',
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

function set_vline_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    if(getPrivilege("network") == false){
        $('#icon-delete').linkbutton('disable');
    }else{
    //删除按钮逻辑
        if (crows.length > 0) {
            $('#icon-delete').linkbutton('enable');
        } else {
            $('#icon-delete').linkbutton('disable');
        }
    }
}