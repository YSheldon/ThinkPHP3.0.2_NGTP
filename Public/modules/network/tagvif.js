//打开添加窗口
function addTagvifRow() {
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_620'></div>");
    }
    open_window('add_page', 'Network/Macvif', 'windowShow&w=network_tagvif_add_window',  $LANG.ADD);
}

//添加提交
function addTagvifSubmit() {
    var isValid = $("#tagvif_form").form('validate');
    if(isValid) {
        if ($("#single_cid").prop("checked")) {
            var type = "single";
        } else {
            var type = "range";
        }

        $.ajax({
//            url: "?c=Network/Macvif&a=addTagvifSave",
            url: "?c=Network/Macvif",
            type: 'POST',
            dataType: 'text',
            data: {
                changeType:'tagvif',
                interface: $('#interface_cid_pop').combobox('getValue'),
                type: type,
                id: $('#id_cid').textbox('getValue'),
                range_start: $('#range_start_cid').textbox('getValue'),
                range_end: $('#range_end_cid').textbox('getValue')
            },
            success: function(data) {
                if (data== 0) {
                    $('#tt').datagrid('reload');
                    $("#add_page").window("close");
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }

}

function set_tagvif_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    //编辑按钮逻辑
    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }
    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
}

function editTagvifRow(name) {
    //alert(name);
    if (typeof (name) == "string") {
        param[0] = name;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].interface_name;
    }
    if ($('#edit_page').length <= 0) {
        $(document.body).append("<div id='edit_page' class='ngtos_window_620'></div>");
    }
    open_window('edit_page', 'Network/Macvif', 'windowShow&w=network_tagvif_edit_window', $LANG.EDIT);
}

function editTagvifSubmit() {
    var isValid = $("#tagvif_form").form('validate');
    if(isValid) {
        var data_address4_list = $("#ip4_list_cid").datagrid("getRows");
        var data_address6_list = $("#ip6_list_cid").datagrid("getRows");
        if ($('input:radio[name="shutdown"]:checked').val() == 'disable') {
            var shutdown_val = 1;
        } else {
            var shutdown_val = 0;
        }
        var mss = $('input:radio[name="mss"]:checked').val();
        if (mss == "define") {
            mss = $("#define_cid").textbox('getValue');
        }
        var oldip4 = $("#ip4addr_items_old").val();
        var oldip6 = $("#ip6addr_items_old").val();
        var ipv4IsEdit = compare_ip(data_address4_list, oldip4, "ip4");
        var ipv6IsEdit = compare_ip(data_address6_list, oldip6, "ip6");
        //获取路由和交换模式的值
        var comm_type = $('input[name="comm_type"]:checked').val();
        $.ajax({
//            url: "?c=Network/Macvif&a=editTagvifSave",
            url: "?c=Network/Macvif",
            type: 'PUT',
            dataType: 'text',
            data: {
                changeType:'tagvif',
                interface_name: $('#interface_value_cid').val(),
                description: $('#description_cid').textbox('getValue'),
                description_old: $('#description_old').val(),
                shutdown: shutdown_val,
                shutdown_old: $('#shutdown_old').val(),
                ip4addr_items: json_to_string(data_address4_list),
                ip4addr_items_old: ipv4IsEdit,
                ip6addr_items: json_to_string(data_address6_list),
                ip6addr_items_old: ipv6IsEdit,
                mtu: $('#mtu_cid').textbox('getValue'),
                mtu_old: $('#mtu_old').val(),
                mss: mss,
                mss_old: $('#mss_old').val(),
                comm_type:comm_type,
                comm_type_old:$('#comm_type_old').val()
            },
            success: function(data) {
                if (data == '0') {
                    $("#edit_page").window("close");
                    delayRefresh(oldip4,oldip6,ipv4IsEdit,ipv6IsEdit,'#tt');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}

function deleteTagvifRow() {
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var pageNum = return_pagenum('tt',rows);
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids[i] = rows[i].interface_name
                }
                $.ajax({
//                    url: "?c=Network/Macvif&a=delTagvif",
                    url: "?c=Network/Macvif",
                    type: 'DELETE',
                    dataType: 'text',
                    async: false,
                    data: {
                        changeType:'tagvif',
                        tagvif: ids
                    },
                    success: function(data) {
                        if (data != '0') {
                            ngtosPopMessager("error", data);
                            $('#tt').datagrid('reload');
                        }else{
                            $('#tt').datagrid('options').pageNumber = pageNum;
                            $('#tt').datagrid('getPager').pagination({pageNumber: pageNum});
                            $('#tt').datagrid('reload');
                        }
                    }
                });
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}

//打开清空窗口
function clearTagvifRow() {
    if ($('#clear_page').length <= 0) {
        $(document.body).append("<div id='clear_page' class='ngtos_window_400'></div>");
    }
    open_window('clear_page', 'Network/Macvif', 'windowShow&w=network_tagvif_clear_window',$LANG.CLEAR);
}

//弹出框提交
function clearTagvifSubmit() {
    var isValid = $("#tagvif_clear_form").form('validate');
    if(isValid) {
        $.ajax({
//            url: "?c=Network/Macvif&a=clearTagvif",
            url: "?c=Network/Macvif&all=1",
            type: 'DELETE',
            dataType: 'text',
            data: {
                changeType:'tagvif',
                interface: $('#interface_clear').combobox('getValue')
            },
            success: function(data) {
                if (data == '0') {
                    $("#clear_page").window("close");
                    $('#tt').datagrid('reload');
                } else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    }

}

//切换单个和范围，禁用/启用输入框
function change(id) {
    if (id == 'single_cid') {
        $('#id_cid').textbox("enable");
        $('#id_cid').textbox({novalidate:false});

        $('#range_start_cid').textbox({novalidate:true});
        $('#range_start_cid').textbox("disable");

        $('#range_end_cid').textbox({novalidate:true });
        $('#range_start_cid').textbox("setValue", "");
        $('#range_end_cid').textbox("setValue", "");
        $('#range_end_cid').textbox("disable");

    } else if (id == 'range_cid') {

        $('#id_cid').textbox({ novalidate:true});
        $('#id_cid').textbox("setValue", "");
        $('#id_cid').textbox("disable");

        $('#range_start_cid').textbox("enable");
        $('#range_start_cid').textbox({novalidate:false});

        $('#range_end_cid').textbox("enable");
        $('#range_end_cid').textbox({novalidate:false});
    }
}

function editTagvifRowInit(name){
    //alert(name);
    var vsid = "";
    page_show('edit_page', 'basic');
    $("#ha4_cid").attr("checked", false);
    $("#ha6_cid").attr("checked", false);
    $.ajax({
        url: "?c=Network/Macvif&a=singleTagvif",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            tagvif: name
        },
        success: function(data) {
            if (!data.rows[0]) {
                ngtosPopMessager("error", data);
            } else {
                load_datagrid();
                /*vsid = data.rows[0].vsys_id;
                $('#vsid_old').val(vsid);*/
                $('#interface_name_cid').html(name);
                $('#interface_value_cid').val(name);
                $('#description_cid').val(data.rows[0].description);
                $('#description_old').val(data.rows[0].description);
                if (data.rows[0].shutdown == "disable") {
                    //                            setBtState("shutdown_cid", "stop");
                    $('#shutdown_disable').attr("checked", "checked");
                    $('#shutdown_old').val(1);
                } else {
                    //                            setBtState("shutdown_cid", "start");
                    $('#shutdown_enable').attr("checked", "checked");
                    $('#shutdown_old').val(0);
                }
                //设置路由和交换模式的方法
                if(data.rows[0].comm_type == 'routing'){
                    $('#comm_type_route_cid').attr('checked','checked');
                }else{
                    $('#comm_type_switch_cid').attr('checked','checked');
                }
                $('#comm_type_old').val(data.rows[0].comm_type);
                var ip4 = data.rows[0].ip4;
                var ip6 = data.rows[0].ip6;
                $("#ip4addr_items_old").val(ip4);
                $("#ip6addr_items_old").val(ip6);
                if (ip4.length !== 0) {
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

                $('#mtu_cid').val(data.rows[0].mtu);
                $('#mtu_old').val(data.rows[0].mtu);
                var mss = data.rows[0].mss;
                if (mss == 1) {
                    $("#mss_auto").attr("checked", "checked");
                    $('#mss_old').val("auto");
                    change_mss("hide");
                } else if (mss == 0) {
                    $("#mss_off").attr("checked", "checked");
                    $('#mss_old').val("off");
                    change_mss("hide");
                } else {
                    $("#define_cid").val(mss);
                    $("#mss_define").attr("checked", "checked");
                    $('#mss_old').val(mss);
                    change_mss("show",mss);
                }
                //get_vsys("vsysid", "vsid_cid", vsid);
            }
        }
    });
}

/*
//查看所有   seach  1代表显示所有；  空值代表只能看自己的
function searchTagvifRowAll(){
    var seach = "1";
    $("#tt").datagrid('options').url = "?c=Network/Macvif&a=tagSubifShow&seach="+seach;
    $('#tt').datagrid('reload');
}
//查看自己
function searchTagVifRows(){
    $("#tt").datagrid('options').url = "?c=Network/Macvif&a=tagSubifShow";
    $('#tt').datagrid('reload');
}*/
