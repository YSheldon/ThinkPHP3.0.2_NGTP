/*打开添加弹出框*/
function addServerItem(msg) {
    tag = 1;
    if ($('#window_div').length <= 0) {
        $(document.body).append("<div id='window_div' class='ngtos_window_500'></div>");
    }
    open_window('window_div', 'Resource/Server&w=resource_server_window', '', msg);
}

/*打开编辑弹出框*/
function edit_item(flag, name, ipaddr, weight, shared, msg) {
    tag = 2;
    if (flag == 1) {
        param[0] = name;
        param[1] = ipaddr;
        param[2] = weight;
        param[3] = shared;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].name;
        param[1] = rows[0].ipaddr;
        param[2] = rows[0].weight;
        param[3] = rows[0].shared;
    }
    if ($('#window_div').length <= 0) {
        $(document.body).append("<div id='window_div' class='ngtos_window_500'></div>");
    }
    open_window('window_div', 'Resource/Server&w=resource_server_window', '', msg);
}

/*提交数据*/
function submit_item(tag) {
    var isValid = $("#res_server_form").form('validate');
    if(!isValid) {
       return false;
    }
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }
    var shared = $('input[name="shared"]:checked').val();
    if (shared == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    $.ajax({
        url: "?s=Home/Resource/Server&mod=server",
        type: method,
        dataType: 'text',
        data: {
            name: $('#name').textbox('getValue'),
            ipaddr: $('#host').textbox('getValue'),
            weight: $('#weight').textbox('getValue'),
            shared: sha_tag,
            tag: tag
        },
        success: function(data) {
            if (data == 0) {
                $("#window_div").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    })
}

/*菜单栏删除*/
function deleteServerItem() {
    ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
        if (r){
            var rows = $('#tt').datagrid('getSelections');
            var names = [];
            //var ids = [];
            var pagenum = return_pagenum('tt',rows);
            for (var i = 0; i < rows.length; i++) {
                names[i] = rows[i].name;
                //ids[i] = rows[i].id;
            }
            $.ajax({
                url: "?s=Home/Resource/Server&mod=server",
                type: 'delete',
                dataType: 'text',
                async: false,
                data: {
                    delItems: names
                },
                success: function(data) {
                    if(data != '0') {
                        ngtosPopMessager("error", data);
                    }else{
                        $('#tt').datagrid('options').pageNumber = pagenum;
                        $('#tt').datagrid('getPager').pagination({pageNumber: pagenum});
                    }
                        $('#tt').datagrid('reload');
                }
            });
        }
    });
}

/*菜单栏清空*/
function clearServerItem() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?s=Home/Resource/Server&mod=server&all=1",
                type: 'delete',
                dataType: 'text',
                async: false,
                success: function(data) {
                    if (data != 0) {
                        ngtosPopMessager("error", data);
                    }
                        $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function set_toolbar() {
    var sel_row = $('#tt').datagrid('getChecked');
    if(sel_row.length>1) {
        var enable = true;
        if(isShared()) {
            for(var i = 0;i<sel_row.length;i++){
                if(sel_row[i].shared == 'on'){
                    enable = false;
                }
            }
        }
        if(enable){
            $('#icon_edit').linkbutton('disable');
            $('#icon_delete').linkbutton('enable');
        }else{
            $('#icon_edit').linkbutton('disable');
            $('#icon_delete').linkbutton('disable');
        }
    } else if(sel_row.length==1) {
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_delete').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_delete').linkbutton('enable');
        }
    } else if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_delete').linkbutton('disable');
    }
    //    //清空按钮逻辑
    if (sel_row.length > 0) {
        $('#icon_clear').linkbutton('enable');
    } else {
        $('#icon_clear').linkbutton('disable');
    }
}