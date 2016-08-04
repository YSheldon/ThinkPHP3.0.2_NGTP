/*log show*/
function searchlog() {
    if ($.trim($('#to_input').val()) != '' && Number($('#from_input').val()) > Number($('#to_input').val())){
        ngtosPopMessager("error", $LANG.THE_STARTING_POSITION_CAN_NOT_EXCEED_THE_END_POSITION);
        return;
    }

    if ($('#date_begin').datebox('getValue')){
        if ($('#date_stop').datebox('getValue')) {
            if ($('#date_begin').datebox('getValue') > $('#date_stop').datebox('getValue')){
                ngtosPopMessager("error", $LANG.THE_START_DATE_CEED);
                return;
            }
        }else{
            ngtosPopMessager("error", $LANG.PLEASE_ENTER_THE_CLOSING_DATE);
            return;
        }

    }
    if ($('#date_stop').datebox('getValue')){
        if (!$('#date_begin').datebox('getValue')) {
            ngtosPopMessager("error", $LANG.PLEASE_ENTER_A_START_DATE);
            return;
        }
    }

    $("#tt").datagrid('options').url = '?c=System/Log&a=logjsondata';
    var queryParams = $('#tt').datagrid('options').queryParams;
    queryParams.from = $('#from_input')[0].value;
    queryParams.to = $('#to_input')[0].value;
    queryParams.typePost = $('#log_type')[0].value;
    queryParams.keyword = $('#keyword')[0].value;
    queryParams.level = $('#level')[0].value;

    if (vsyswitch == '1'){
        queryParams.vsid = $('#vsid')[0].value;
    }
    if ($('#date_begin').datebox('getValue')){
        queryParams.date_range = $('#date_begin').datebox('getValue').replace(/-/g, '') + '-' + $('#date_stop').datebox('getValue').replace(/-/g, '');
    }
    $('#tt').datagrid('options').queryParams = queryParams;
    $('#tt').datagrid('reload');
    closeWindow('log_search');
}


//清空日志
function deleteall(){
    ngtosPopMessager('confirm', $LANG.SURE_CLEAR_ALL, function(r) {
        if (r){
            $.ajax({
                url: "?c=System/Log&a=logClean",
                type: 'POST',
                dataType: 'text',
                success: function(data) {
                    if (data == '0') {
                        $('#tt').datagrid('reload');
                    }else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}
function superQuery(){
    open_window('log_search', 'System/Log', 'search', $LANG.SEARCH);
}

function chang_switch(obj) {
    if (obj.checked == false) {
        jsAddItemToSelect($(obj).parents('tr:first').find('.log_level_select')[0],8);
        $(obj).parents('tr:first').find('.log_level_select')[0].value = 8;
        $(obj).parents('tr:first').find('.log_level_select')[0].disabled = true;
    }else{
        jsRemoveItemFromSelect($(obj).parents('tr:first').find('.log_level_select')[0], 8);
        $(obj).parents('tr:first').find('.log_level_select')[0].disabled = false;
        var type = $("input:radio[name='sel_level']:checked").val();
        if (type == "high") {
            $(obj).parents('tr:first').find('.log_level_select')[0].value = 2;
        } else if (type == "middle") {
            $(obj).parents('tr:first').find('.log_level_select')[0].value = 5;
        } else if (type == "low") {
            $(obj).parents('tr:first').find('.log_level_select')[0].value = 7;
        }
    }
}

function show_sel(str, value, selected) {
	//alert($(".log_switch").length);
    var arr = str.split(",");
    var arr_val = value.split(",");
    $('.log_switch').each(function(k, val) {
				if ($(val).attr("checked") == "checked") {
					$('.log_level_select')[k].options.length = 0;
					for (var i = 0; i < arr.length; i++) {
						
						$('.log_level_select')[k].options.add(new Option(arr[i], arr_val[i]));
					}
					if(this.name==1){
						$('.log_level_select')[k].value = selected;
					}else{
						$('.log_level_select')[k].value = $(".log_max")[k].name;
					}
				}
    });
}

// 判断select选项中 是否存在Value="paraValue"的Item
function jsSelectIsExitItem(objSelect, objItemValue) {
    var isExit = false;
    for (var i = 0; i < objSelect.options.length; i++) {
        if (objSelect.options[i].value == objItemValue) {
            isExit = true;
            break;
        }
    }
    return isExit;
}

function jsRemoveItemFromSelect(objSelect, objItemValue) {
    //判断是否存在
    if (jsSelectIsExitItem(objSelect, objItemValue)) {
        for (var i = 0; i < objSelect.options.length; i++) {
            if (objSelect.options[i].value == objItemValue) {
                objSelect.options.remove(i);
                break;
            }
        }

    }
    return;
}

function jsAddItemToSelect(objSelect, objItemValue) {
    //判断是否存在
    if (!jsSelectIsExitItem(objSelect, objItemValue)) {
        var varItem = new Option('', objItemValue);
        objSelect.options.add(varItem);
    }
    return;
}

function form_submit() {
    var isValid = $("#log").form('validate');
    if(isValid) {
        var key;
        var val;
        var type = [];
        var level = [];
        var max = [];
        var on_state= [];
        var sel_arr = $('.log_level_select.ngtos_input');
        var log_max = $(".log_max");  

        for (var i = 0; i < sel_arr.length; i++){
            for (var t = 0; t < jsonsel.length; t++){
                key = jsonsel[t]["logtype"];
                val = jsonsel[t]["level"];
                if(key == sel_arr[i].id && val != sel_arr[i].value){
                    if(type.indexOf(key) < 0){
                        type.push(sel_arr[i].id);
                        level.push(sel_arr[i].value);
                        on_state.push(sel_arr[i].name);
                        max.push(log_max[i].value);
                    }
                }
            }
            for (var k = 0; k < jsontype.length; k++){  
                key = jsontype[k]["key"];
                val = jsontype[k]["max_table_capacity"];
                if(key == sel_arr[i].id && val != log_max[i].value){
                    if(type.indexOf(key) < 0){
                        type.push(sel_arr[i].id);
                        level.push(sel_arr[i].value);
                        on_state.push(sel_arr[i].name);
                        max.push(log_max[i].value);
                    }
                }
            }
        }
        
        var type_name = type.join('#');
        var level_id = level.join('#');
        var on_state = on_state.join('#');
        var max_num = max.join('#');
        $.ajax({
            url: "?c=System/Log&a=logSetsave",
            type: 'POST',
            datatype: 'text',
            data: {
                type:type_name,
                level:level_id,
                on_state:on_state,
                max:max_num
            },
            success: function(data) {
                if (data.indexOf("parent.window.location") >= 0){
                    ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT);
                } else if (data == "0") {
                    ngtosPopMessager("success", $LANG.CHANGE_SUCCESS);
                    window.location.reload();
                } else {
                    ngtosPopMessager("error", data, function() {
                    window.location.reload();
                    });
                }
            }
        });
    }

}

/*logserver set*/
function addLogServer() {
    var logSetadd = $('#logSet').form('validate');
    if(logSetadd){
        var tran_type = '';
        var tran_deal = '';
        var tran = '';
        var crypt1 = '';
        //var log_switchs = '';
        var toconsole = '';
        var mysql = '';
        var ipaddr1 = '';
//        var language = '';
        var trans_gather = '';
        var num = ip_init_num < ip_num ? ip_num : ip_init_num;
        for (var i = 0; i <= num; i++){
            if (i == 0){
                if (typeof ($('#add_ipaddr').val()) == "undefined")
                    continue;
                ipaddr1 = $("#add_ipaddr").val();
            }else{
                if (typeof ($('#add_ipaddr' + i).val()) == "undefined")
                    continue;
                ipaddr1 += ',' + $("#add_ipaddr" + i).val();
            }
        }
        //服务器端口|传输协议
        if ($("#add_port").val() && $("#tran_tcp")[0].checked) {
            tran_deal = "tcp" + ":" + $("#add_port").val();
        }else if ($("#add_port").val() && $("#tran_udp")[0].checked) {
            tran_deal = "udp" + ":" + $("#add_port").val();
        }
        //传输类型
        if ($("#tran_syslog")[0].checked)
            tran_type = "syslog";
        else if ($("#tran_welf")[0].checked)
            tran_type = "welf";

        //日志语言
//        if($("#log_cn")[0].checked)
//            language = 'chinese';
//        else if($("#log_en")[0].checked)
//            language = 'english';

        //传输日志
        if ($("#trans")[0].checked) {
            tran = "enable";
        } else {
            tran = "disable";
        }

        //合并传输
        if ($("#trans_gather")[0].checked) {
            trans_gather = "yes";
        } else {
            trans_gather = "no";
        }

        //控制台
        if ($('#toconsole')[0].checked)
            toconsole = 'on';
        else
            toconsole = 'off';

        //数据库
        if ($('#todatabase')[0].checked)
            mysql = 'on';
        else
            mysql = 'off';

        $.ajax({
            url: "?c=System/Log&a=logserverAddsave",
            type: 'POST',
            datatype: 'text',
            data: {
                ipaddr: ipaddr1,
                port: tran_deal,
                logtype: tran_type,
//                language:language,
                //log_switch: log_switchs,
                trans: tran,
                trans_gather:trans_gather,
                to_console: toconsole,
                to_mysql:mysql,
                key_set: $('#add_key').textbox("getValue")
            },
            success: function(data) {
                if (data == '0') {
                    ngtosPopMessager("success");
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}

function changllogServerSwitch(obj) {
    if (obj.checked == false) {
        if(obj.name=="database"){
            $('#add_database').val('');
            $('#add_database')[0].disabled = true;
        }else{
//            $('#add_key').val('');
//            $('#add_key')[0].disabled = true;
               $("#add_key").textbox("setValue","")
               $("#add_key").textbox({
                    disabled:true,
                    validType:['unnormal','Length']
                })
        }

    } else {
        if(obj.name=="database"){
            $('#add_database')[0].disabled = false;
        }else{
//            $('#add_key')[0].disabled = false;
             $("#add_key").textbox({
                disabled:false,
                validType:['unnormal','Length']
            })
        }
    }
}

/*
function resetDefault()
{
    $.ajax({
        url: "?module=system_log&action=log_restore",
        type: 'GET',
        dataType: 'text',
        async: false,
        success: function(data) {
            if (data == 'ok') {
                ngtosPopMessager("success", $LANG.RESET_SUCCESSFULLY);
            }
            else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
*/

function addServer(){
    //if(vsys_id != "1"){
        if (ip_num >= 15){
            ngtosPopMessager("error", $LANG.SERVER_ADDRESS_IS_NOT_MORE_THAN);
            return;
        }
        ip_num++;
        var tbl = $('#server_addr')[0];
        var lastRow = tbl.rows.length;
        var iteration = lastRow + 1;
        var row = tbl.insertRow(lastRow);

        var cellCenter = row.insertCell(0);
        if(!vsys_id) {
            var disabled = '';
            var tb1 = "<img src='"+NG_PATH+"Public/images/icon/mini_clear.gif' width='10' height='10' style='cursor:pointer;' onClick='deleteServer(this)'/>&nbsp;";
        } else {
            var disabled = "disabled='disabled'";
            var tb1 = '';
        }
        var tb2 = "<input type='text' size='30' id='add_ipaddr" + ip_num + "' name='add_ipaddr' style='padding:0 2px 0 2px; width:129px; height:22px; line-height:18px;'"+disabled+">&nbsp;";
        if(!vsys_id) {
            var tb3 = "<img src='"+NG_PATH+"Public/images/icon/mini_add.gif' width='10' height='10' style='cursor:pointer;' onClick='addServer()'/>";
        } else {
            var tb3 ='';
        }
        cellCenter.innerHTML = tb1 + tb2 + tb3;
    /*}else{
         ngtosPopMessager("error", $LANG.ONLY_ROOT_USERS_CAN_MODIFY);
    }*/
}

function deleteServer(r){
    var i = r.parentNode.parentNode.rowIndex;
    $('#server_addr')[0].deleteRow(i);
    ip_num--;
}