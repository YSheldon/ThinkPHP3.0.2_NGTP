//打开添加窗口
function add_ha_group() {
    if (ha_enable) {
        ngtosPopMessager('error', $LANG.THE_CURRENT_HA_HAS_BEEN_TURNED_ON);
        return false;
    }
    var data = $('#tt').datagrid('getData');
    var group_num = data['rows'].length;
    if (check_group_number(group_num + 1, max_group_num)) {
        if ($('#add_page').length <= 0) {
            $(document.body).append("<div id='add_page' class='ngtos_window_600'></div>");
        }
        open_window('add_page', 'System/Ha', 'windowShow&w=system_ha_add_window', $LANG.ADD);
    }
}

//打开组编辑窗口
function edit_ha_group(group, actor, preempt, delay, interface) {
    if (ha_enable) {
        ngtosPopMessager('error', $LANG.THE_CURRENT_HA_HAS_BEEN_TURNED_ON);
        return false;
    }

    if (typeof (group) == "string") {
        param[0] = group;
        param[1] = actor;
        param[2] = preempt;
        param[3] = delay;
        param[4] = interface;
    } else {
        var rows = $('#tt').datagrid('getSelections');
        param[0] = rows[0].group;
        param[1] = rows[0].actor;
        param[2] = rows[0].preempt;
        param[3] = rows[0]['preempt-delay'];
        param[4] = rows[0].interface;
    }
    if ($('#edit_page').length <= 0) {
        $(document.body).append("<div id='edit_page' class='ngtos_window_600'></div>");
    }
    open_window('edit_page', 'System/Ha', 'windowShow&w=system_ha_edit_window', $LANG.EDIT);

}


function edit_ha_group_init(dev, prepared, choosed) {
    var if_arr = dev.split(",");
    var jp = "#" + prepared;
    var jc = "#" + choosed;
    $.ajax({
        url: "?c=Network/Physics&a=callFun",
        type: 'POST',
        dataType: 'json',
        data:{
            mod:'network interfaces',
            act:'show all',
            fun:'dataShow'
        },
        success: function(data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++){
                    var value = data.rows[i].dev;
                    if ($.inArray(value, if_arr) > -1) {
                        $(jc).append("<option value='" + value + "'>" + value + "</option>");
                    } else {
                        $(jp).append("<option value='" + value + "'>" + value + "</option>");
                    }
                }
            }
        }
    });
}



//获得所有物理接口
function add_ha_group_init(id) {
    var sid = "#" + id;
    $.ajax({
        url: "?c=Network/Physics&a=callFun",
        data:{
            mod:'network interfaces',
            act:'show all',
            fun:'dataShow'
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++){
                    var value = data.rows[i].dev;
                    $(sid).append("<option value=" + value + ">" + value + "</option>");
                }
            }
        }
    });
}

function ha_save() {
    if (!$("#local").val() && $("#remote").val()) {
        ngtosPopMessager("error", $LANG.PLEASE_FILL_IN_THIS_IP);
        return false;
    }
    var mode = $("#ha_mode_id").combobox('getValue');
    var interface;
    $.ajax({
        url: "?c=System/Ha&a=haShow",
        type: 'POST',
        async: false,
        success: function(data) {
            var obj = jQuery.parseJSON(data);
            interface = obj ["rows"][0]["interface"];
        }
    });
    var data = $('#tt').datagrid('getData');
    var group_num = data['rows'].length;
    if (!check_group_number(group_num, max_group_num)) {
        return false;
    }
    $.ajax({
        url: "?c=System/Ha&a=haSave",
        type: 'POST',
        async: false,
        data: {
            mode: mode,
            interface: $("#interface").combobox('getValue'),
            local: $("#local").val(),
            remote: $("#remote").val(),
            interface_old: interface
        },
        success: function(data) {
            if (data == "0") {
                window.location.reload();
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}

function ha_start() {
    if (check_changes()) {
        ngtosPopMessager('error', $LANG.CONFIGURATION_HBM);
        return false;
    }
    $.ajax({
        url: "?c=System/Ha&a=callFun&random=" + Math.random(),
        data:{
            fun:'simpleHandle',
            mod:'ha start'
        },
        type: 'POST',
        async: false,
        success: function(data) {
            if (data == "0") {
                change_ha_status('start');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
function ha_stop() {
    $.ajax({
        url: "?c=System/Ha&a=callFun&random=" + Math.random(),
        data:{
            fun:'simpleHandle',
            mod:'ha stop'
        },
        type: 'POST',
        async: false,
        success: function(data) {
            if (data != "0") {
                ngtosPopMessager("error", data);
            } else {
                change_ha_status('stop');
            }
        }
    });
}
function ha_sync() {
    $.ajax({
        url: "?c=System/Ha&a=callFun",
        data:{
            fun:'simpleHandle',
            mod:'ha sync-config-to-peer'
        },
        type: 'POST',
        async: false,
        success: function(data) {
            if (data == "0") {
                ngtosPopMessager("success", $LANG.SYNCHRONOUS_SUCCESS);
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}



function check_group_number(group_num, max_group_num) {
    if (group_num <= max_group_num)
        return true;
    if (max_group_num == 0) {
        ngtosPopMessager('error', $LANG.CONNECTION_PMCNB);
    } else if (max_group_num == 1) {
        ngtosPopMessager('error', $LANG.MASTER_MODE_COAMG);
    } else {
        ngtosPopMessager('error', $LANG.LOAD_BLANCING_MCADTMT + max_group_num + $LANG.GROUP);
    }
    return false;
}

function submitGroup() {
    var haadd = $('#ha_form').form('validate');
    if (haadd) {
          var mode = ($("#mode_master").prop("checked")) ? "master" : "backup";
          var preempt = ($("#preempt_enable").prop("checked")) ? "enable" : "disable";
          var dev = "";
        $('#chif_add option').each(function(i) {
            dev += $(this).val() + ",";
        });
        if (dev.length > 0) {
            dev = dev.substr(0, dev.length - 1);
        }

        $.ajax({
            url: "?c=System/Ha&a=hagroupSave",
            type: 'POST',
            data: {
                id: $('#group_id').val(),
                mode: mode,
                preempt: preempt,
                preempt_delay: $('#preempt_delay').val(),
                dev: dev
            },
            success: function(data) {
                if (data == '0') {
                    $("#add_page").window("close");
                    $('#tt').datagrid('reload');               
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}

function submitEditGroup() {
//    var preempt = ($("#edit_preempt_enable").attr("checked")) ? "enable" : "disable";
    //修改管理设置中主动主动抢占下发的数据
    var preempt1 = $('input[name="edit_preempt"]:checked').val();
    var dev = "";
    $('#chif_edit option').each(function(i) {
        dev += $(this).val() + ",";
    });
    if (dev.length > 0) {
        dev = dev.substr(0, dev.length - 1);
    }

    $.ajax({
        url: "?c=System/Ha&a=haGroupEditSave",
        type: 'POST',
        data: {
            id: $('#edit_group_id').val(),
            preempt: preempt1,
            preempt_delay: $('#edit_preempt_delay').val(),
            dev: dev,
            dev_old: $('#dev_edit').val()
        },
        success: function(data) {
            if (data == '0') {
                $("#edit_page").window("close");
                $('#tt').datagrid('reload');
            }else {
                ngtosPopMessager("error", data);
            }
        }
    });
}



function del_ha_group() {
    if (ha_enable) {
        ngtosPopMessager('error', $LANG.THE_CURRENT_HA_HAS_BEEN_TURNED_ON);
        return false;
    }
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r == true) {
                for (var i = 0; i < rows.length; i++) {
                    $.ajax({
                        url: "?c=System/Ha&a=haGroupDel",
                        type: 'POST',
                        async: false,
                        data: {
                            id: rows[i].group,
                            dev: rows[i].interface
                        },
                        success: function(data) {
                            if (data != '0'){
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
                  datagridReload('tt');
            }
        });
    }else {
        ngtosPopMessager("error", $LANG.SELECT_DEL_OPTION);
    }
}
function change_ha_mode() {
    var mode = $("#ha_mode_id").combobox('getValue');
    if (mode == 'sp') {
        max_group_num = 0;
    } else {
        if (mode == 'as')
            max_group_num = 1;
        else
            max_group_num = 255;
    }
    var data = $('#tt').datagrid('getData');
    var group_num = data['rows'].length;
    if (!check_group_number(group_num, max_group_num)) {
        return false;
    }
}
function change_ha_status(status) {
    if (status == 'stop') {
        $("#ha_stop_id").hide();
        $("#ha_start_id").show();
        $("#ha_status_id").html($LANG.STOP);
        $("#sync_to_peer").attr('disabled', true);
        $("#ha_save_id").removeAttr('disabled');
        $("#ha_save_id").removeClass();
        $("#ha_save_id").addClass('ngtos_button_large confirmenable');
        //设置当前手动切换的按钮状态
        $('#manual_switch_btn').attr('disabled',true);
        $('#local').combobox('enable');
        $('#remote').combobox('enable');
        $('#ha_mode_id').combobox('enable');
        $('#interface').combobox('enable')
        ha_enable = false;
    } else {
        $("#ha_start_id").hide();
        $("#ha_stop_id").show();
        $("#ha_status_id").html($LANG.ON);
        $("#sync_to_peer").removeAttr('disabled');
        $("#ha_save_id").removeClass();
        $("#ha_save_id").addClass('confirmdisabled_large confirmdisabled');
        $("#ha_save_id").attr('disabled', true);
        //当状态为停止的时候移除disabled属性
        $('#manual_switch_btn').removeAttr('disabled');
        ha_enable = true;
        $('#local').combobox('disable');
        $('#remote').combobox('disable');
        $('#ha_mode_id').combobox('disable');
        $('#interface').combobox('disable')

    }
}
function init_ha_page(obj) {
    origin_data = obj;
    var url = '?c=System/Ha&a=haGroupJson';
    if (obj['mode'] == 'SP') {
        $("#ha_mode_id").combobox('setValue','sp');
    } else if (obj['mode'] == 'AS') {
        $("#ha_mode_id").combobox('setValue','as');
        $('#tt').datagrid('options').url = url;
        $('#tt').datagrid('reload');
    } else {
        $("#ha_mode_id").combobox('setValue','aa');
        $('#tt').datagrid('options').url = url;
        $('#tt').datagrid('reload');
    }
    $('#interface').combobox('setValue',obj["interface"]);
    $('#local').textbox('setValue',obj["local"]);
    $('#remote').textbox('setValue',obj["remote"]);
    change_ha_status(obj['status']);
    change_ha_mode();
}

function init_ha_page_link(obj) {
    origin_data = obj;
    var url = '?c=System/Ha&a=linkData';
    if (obj['mode'] == 'SP') {
        $("#ha_mode_id").combobox('setValue','sp');
    } else if (obj['mode'] == 'AS') {
        $("#ha_mode_id").combobox('setValue','as');
        $('#tt').datagrid('options').url = url;
        $('#tt').datagrid('reload');
    } else {
        $("#ha_mode_id").combobox('setValue','aa');
        $('#tt').datagrid('options').url = url;
        $('#tt').datagrid('reload');
    }
    $('#interface').combobox('setValue',obj["interface"]);
    $('#local').textbox('setValue',obj["local"]);
    $('#remote').textbox('setValue',obj["remote"]);
    change_ha_status(obj['status']);
//    change_ha_mode();
}

function check_changes() {
    var localip = $("#local").val();
    var remoteip = $("#remote").val();
    var mode = $("#ha_mode_id").combobox('getValue');
    var sif = $("#interface").combobox('getValue');
    if (localip != origin_data['local'] ||
            remoteip != origin_data['remote'] ||
            sif != origin_data['interface']
            ) {
        return true;
    } else
        return false;
}

function set_ha_toolbar() {
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
//添加策略开关控制的js方法
function changBtState_ha(obj) {
    if (obj.title==$LANG.START) {
        obj.src=NG_PATH+"Public/images/image/stop.png";
        obj.title=$LANG.STOP;
        $.ajax({
            url:'?c=System/Ha&a=bindSwitch',
            data:{
                switch:'off'
            },
            type: 'POST',
            datatype: 'text'
        });
    } else {
        obj.src=NG_PATH+"Public/images/image/start.png";
        obj.title=$LANG.START;
        $.ajax({
            url:'?c=System/Ha&a=bindSwitch',
            data:{
                switch:'on'
            },
            type: 'POST',
            datatype: 'text'
        });
    }
}
//判断当前ha bind开关的状态
function haBindStatus(){
    $.ajax({
        url:'?c=System/Ha&a=haBindStatus',
        type:'get',
        dataType:'json',
        success:function(data){
            if(data['rows']['switch'] == 'off'){
                $('#hacheck').attr('src',NG_PATH+"Public/images/image/stop.png");
                $('#hacheck').attr('title',$LANG.STOP);
            }else{
                $('#hacheck').attr('src',NG_PATH+"Public/images/image/start.png");
                $('#hacheck').attr('title',$LANG.START);
            }
        }
    })
}
//添加链路绑定设置
function add_ha_group_link(){
        if ($('#add_page').length <= 0) {
            $(document.body).append("<div id='add_page' class='ngtos_window_400'></div>");
        }
        open_window('add_page', 'System/Ha', 'windowShow&w=system_ha_link_ha_window', $LANG.ADD);

}
//删除链路绑定设置
function del_ha_group_link(){
    var rows = $('#tt').datagrid('getSelections');
    var msg ="";
    if (rows.length > 0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var probe_id = [];
                var vsys_name = [];
                for (var i = 0; i < rows.length; i++) {
                    probe_id.push(rows[i].probeid);
                    vsys_name.push(rows[i].vsysname);
                }
                probe_id = probe_id.join('#');
                vsys_name = vsys_name.join('#');
                $.ajax({
                    url: "?c=System/Ha&a=delLink",
                    type: 'post',
                    dataType: 'text',
                    async: false,
                    data: {
                        probeId:probe_id,
                        vsysName:vsys_name
                    },
                    success: function(data) {
                        if (data != 0) {
                            msg = data;
                        }
                    }
                });
                if (msg != "" && msg != null) {
                    ngtosPopMessager("error", msg);
                }
                $('#tt').datagrid('reload');
            }
        });
    } else {
        ngtosPopMessager("info",$LANG.SELECT_DEL_OPTION);
    }
}
//清空链路绑定设置
function clear_ha_group_link(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=System/Ha&a=linkClean",
                type: 'get',
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
//手动切换的方法
function switch_sync(){
    if($('#manual_switch').val() == ''){
        return false;
    }else{
        $.ajax({
            url: "?c=System/Ha&a=manualSwitch",
            data:{
                id:$('#manual_switch').val()
            },
            type: 'POST',
            async: false,
            success: function(data) {
                if (data == "0") {
                    ngtosPopMessager("success", $LANG.SYNCHRONOUS_SUCCESS);
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}
//添加链路绑定设置的数据
function submitGroupHaLink(){
    var isValid = $("#ha_form").form('validate');
    if(isValid){
        $.ajax({
            url: "?c=System/Ha&a=addHaLink",
            type: 'POST',
            data: {
                probe_id:$('#link').val(),
                vsys_name:$('#vsys_name').val()
            },
            success: function(data) {
                if (data == '0') {
                    $("#add_page").window("close");
                    $('#tt').datagrid('reload');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}