/*打开添加弹出框*/
function add_item(msg) {
    tag = 1;
    if ($('#window_div').length <= 0) {
        $(document.body).append("<div id='window_div' class='ngtos_window_600'></div>");
    }
    open_window('window_div', 'Resource/Balance&w=resource_balance_window', '', msg);
}


function edit_item(flag, name, enable, balance, server, msg) {
    tag = 2;
    if (flag == 1) {
        param[0] = name;
        param[1] = enable;
        param[2] = balance;
        param[3] = server;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].name;
        param[1] = rows[0].enable;
        param[2] = rows[0].balance;
        param[3] = rows[0].server;
    }
    if ($('#window_div').length <= 0) {
        $(document.body).append("<div id='window_div' class='ngtos_window_600'></div>");
    }
    open_window('window_div', 'Resource/Balance&w=resource_balance_window', '', msg);
}

/*提交数据*/
function submit_item(tag) {
    var isValid = $("#balance_form").form('validate');
    if(!isValid) {
        return false;
    }
    if ($('#status').attr("title") == $LANG.DOWN) {
        var status = 'no';
    } else {
        var status = 'yes';
    }
    var ele = "";
    $("#dst_element option").each(function() {
        if (ele == "") {
            ele = $(this).val();
        } else {
            ele += " " + $(this).val();
        }
    });

    if (tag == 2 && ele == "") {
        ele = 'none';
    }
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    $.ajax({
        url: "?s=Home/Resource/Balance&mod=balance",
        type: method,
        dataType: 'text',
        data: {
            name: $('#name').textbox('getValue'),
            enable: status,
            server: ele,
            balance: $('input:radio[name="balance"]:checked').val(),
            tag: tag
        },
        success: function(data) {
            if (data == 0) {
                $("#window_div").window("close");
                $('#tt').datagrid('reload');
            } else if (data == '-3016') {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, 'login');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    })
}

/*菜单栏删除*/
function deleteBlanceItem() {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r){
                var rows = $('#tt').datagrid('getSelections');
                var ids = [];
                var pagenum = return_pagenum('tt',rows);
                for (var i = 0; i < rows.length; i++) {
                    ids[i] = rows[i].name;
                }
                    ids = ids.join('#');
                $.ajax({
                    url: "?s=Home/Resource/Balance&mod=balance",
                    type: 'delete',
                    dataType: 'text',
                    async: false,
                    data: {
                        delItems: ids
                    },
                    success: function(data) {
                        if (data != '0') {
                            ngtosPopMessager("error", data);
                        } else {
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
function clearBlanceItem() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?s=Home/Resource/Balance&mod=balance&all=1",
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

/*菜单栏添加获取主机数据*/
function add_prepare() {
    $.ajax({
        url: "?s=Home/Resource/Server&fun=dataShow&mod=server&key=name",
        type: 'get',
        async: false,
        dataType: 'json',
        success: function(data) {
            if (data['rows'].length > 0) {
                $(data["rows"]).each(function(key, value) {
                    $('#src_element')[0].add(new Option(value.name + "["+$LANG.SERVER+"]", value.name));
                });
            }
        }
    });
}

function modify_prepare() {
    $('#name').val(param[0]);
    (param[1] == "yes") ? setBtState("status", "start") : setBtState("status", "stop");
    $('input:radio[name="balance"][value="' + param[2] + '"]').attr("checked", true);
    $("#name").attr('disabled', 'disabled');
    var server_arr = $.trim(param[3]).split(",");
    $.ajax({
        url: "?s=Home/Resource/Server&fun=dataShow&mod=server&key=name",
        type: 'get',
        async: false,
        dataType: 'json',
        success: function(data) {
            if (data['rows'].length > 0) {
                $(data["rows"]).each(function(key, value) {
                    if ($.inArray(value.name, server_arr) > -1) {
                        $('#dst_element')[0].add(new Option(value.name + "["+$LANG.SERVER+"]", value.name));
                    } else {
                        $('#src_element')[0].add(new Option(value.name + "["+$LANG.SERVER+"]", value.name));
                    }
                });
            }
        }
    });
}

function changBtState(obj) {
    if (obj.title == $LANG.ENABLE) {
        obj.src = NG_PATH+"Public/images/image/stop.png";
        obj.title = $LANG.DOWN;
    } else {
        obj.src = NG_PATH+"Public/images/image/start.png";
        obj.title = $LANG.ENABLE;
    }
}

function setBtState(obj, opt) {
    var obj = "#" + obj;
    if (opt == 'stop') {
        $(obj).attr("src", NG_PATH+"Public/images/image/stop.png");
        $(obj).attr("title", $LANG.DOWN);
    } else {
        $(obj).attr("src", NG_PATH+"Public/images/image/start.png");
        $(obj).attr("title", $LANG.ENABLE);
    }
}


function set_toolbar() {
    var crows = $('#tt').datagrid('getChecked');

    //编辑按钮逻辑
    if (crows.length == 1) {
        $('#icon_edit').linkbutton('enable');
    } else {
        $('#icon_edit').linkbutton('disable');
    }

    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon_delete').linkbutton('enable');
    } else {
        $('#icon_delete').linkbutton('disable');
    }

    var rows = $('#tt').datagrid('getRows');

    //清空按钮逻辑
    if (rows.length > 0) {
        $('#icon_clear').linkbutton('enable');
    } else {
        $('#icon_clear').linkbutton('disable');
    }
}