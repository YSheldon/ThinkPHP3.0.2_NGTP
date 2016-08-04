function add_vsys(){
    oper = 0
     if ($('#add_vsys_window').length <= 0) {
                $(document.body).append("<div id='add_vsys_window' class='ngtos_window_620'></div>");
            }
      open_window('add_vsys_window', 'System/Virtual', 'addVsysWindow', $LANG.ADD);
}
//数据添加
function addVsysSubmit(){
    
   var vsysadd = $('#vsys_form').form('validate');
   if (vsysadd) {
        var arr_interface=new Array();
        var vsys_name = $("#vsys_name").val();//vsys名称
        var vsys_quota = $("#vsys_quota").val();//vsys配额
        var vsys_rate = $("#vsys_rate").val();//vsys速率
        var interface = get_select_value('d_service_item_cid');//重新获取接口
        var ord_interface =  $("#ord_interface").val();//原来的接口
        var interfaces = interface.split(" ");
        for(var i=0;i<interfaces.length;i++){
            if(interfaces[i].indexOf(":")>0){
                arr_interface.push(interfaces[i].substr(0,interfaces[i].indexOf(":")));
            }else{
                arr_interface.push(interfaces[i]);
            }
        }
        var str_interface = arr_interface.join(' ');
        if (vsys_quota && vsys_quota < 1024) {
            $("#vsys_quota").focus();
            if ($("#vsys_quota").next("span.error").length > 0) {
                $("#vsys_quota").next("span.error").html($LANG.MINIMUM_1024);
            } else {
                $("#vsys_quota").after("<span class='error'>{$Think.lang.MINIMUM_1024}</span>");
            }
            return false;
        } else {
            $("#vsys_quota").next("span.error").html("");
        }
        if ($("#vsys_name").attr('disabled') == 'disabled') {
             var vsys_enable = $("#vsys_enable").combobox('getValue');//vsys使能
                $.ajax({
                    url: "?c=System/Virtual&a=vsysEdit",
                    type: 'POST',
                    data: {
                        vsys_name: vsys_name,
                        vsys_enable: vsys_enable,
                        vsys_quota: vsys_quota,
                        vsys_rate: vsys_rate,
                        interface: str_interface,
                        ord_interface:ord_interface
                    },
                    success: function(data) {
                        if (data == "0") {
                            closeWindow('add_vsys_window');
                            $('#vsys_table').datagrid('reload');
                        } else {     
                           ngtosPopMessager("error", data);
                        }
                    }
              });
        }else{
            var vsys_pattern = $("#vsys_pattern").combobox('getValue');//vsys模式
            $.ajax({
                url: "?c=System/Virtual&a=vsysAdd",
                type: 'POST',
                data: {
                    vsys_name: vsys_name,
                    vsys_pattern: vsys_pattern,
                    vsys_quota: vsys_quota,
                    vsys_rate: vsys_rate
                },
                success: function(data) {
                    if (data == "0") {
                        closeWindow('add_vsys_window');
                        $('#vsys_table').datagrid('reload');
                    } else {     
                       ngtosPopMessager("error", data);
                    }
                }
            });
        }
   }
}
//双击数据修改
function edit_sel_vsys(vsys_name,enable,quota,rate,interfaces){
    
    oper = 1;
    vsys_nam = vsys_name;
    vsys_enable = enable;
    vsys_quota = quota;
    vsys_rate = rate
    interface = interfaces;
   if ($('#add_vsys_window').length <= 0) {
            $(document.body).append("<div id='add_vsys_window' class='ngtos_window_650'></div>");
   }
   open_window('add_vsys_window', 'System/Virtual', 'addVsysWindow&oper=1', $LANG.EDIT);
}

//单击编辑
function editVsys(){
    var rowData=$('#vsys_table').datagrid('getSelections');
    if(rowData.length ==1)
        edit_sel_vsys(rowData[0].vsys_name,rowData[0].enable,rowData[0].quota,rowData[0].rate,rowData[0].interfaces);
    else
        return;
}

function clearAllOption(left,right){
    var opt = '';
    var sel_left = get_select_valueT(left);
    var sel_right = get_select_valueT(right);
    if(!sel_right){
        return false;
    }

    var arr_right = sel_right.split(" ");
    for(var i = 0;i<arr_right.length;i++){
        opt += "<option value='" + arr_right[i] + "' title='" + arr_right[i] + "'>" + arr_right[i] +"</option>";
    }
    $("#" + right).text(" ");
    var arr_left = sel_left.split(" ");
    for(var j = 0;j<arr_left.length;j++){
        opt += "<option value='" + arr_left[j] + "' title='" + arr_left[j] + "'>" + arr_left[j] +"</option>";
    }
    $("#" + left).html(opt);
}

function get_select_value(obj){
    var select_item=new Array();
    $("#"+ obj +" option").each(function(){
        select_item.push($(this).val());
    });
    return select_item.join(' ');
}
function get_select_valueT(obj){
    var select_item=new Array();
    $("#"+ obj +" option").each(function(){
        select_item.push($(this).html());
    });
    return select_item.join(' ');
}
//删除数据
function del_vsys(){
    
    var rows = $('#vsys_table').datagrid('getChecked');
    if (rows.length > 0) {
        ngtosPopMessager('confirm', $LANG.DELETE_IT, function(r) {
            if (r) {
                   var vsysName = [];
                  for (var i = 0; i < rows.length; i++) {
                        vsysName.push(rows[i]['vsys_name']);
                  }
                    vsysName = vsysName.join('#');
                    $.ajax({
                        url: "?c=System/Virtual&a=del",
                        type: 'POST',
                        data: {
                            delItems : vsysName,
                            mod:'vsys',
                            act:'del',
                            delKey:'vsys-name'
                        },
                        success: function(data) {
                            if (data=="0") {
                                $('#vsys_table').datagrid('reload');
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
            }
       });
    }
}


//清空数据
function clear_vsys(){
    
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=System/Virtual&a=clean&mod="+encodeURI('vsys'),
                type: 'POST',
                dataType: 'text',
                async: false,
                success: function(data) {
                    if (data == 0) {
                        $('#vsys_table').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}
function setToolBar(){
        var sel_row = $('#vsys_table').datagrid('getChecked');
        if (sel_row.length < 1){
            $('#icon_del').linkbutton('disable');
            $('#icon_edit').linkbutton('disable');
            $('#icon_add').linkbutton('enable');
        }else if (sel_row.length == 1){
            $('#icon_del').linkbutton('enable');
            $('#icon_edit').linkbutton('enable');
            $('#icon_add').linkbutton('disable');
        }else if (sel_row.length > 1){
            $('#icon_del').linkbutton('enable');
            $('#icon_edit').linkbutton('disable');
            $('#icon_edit').linkbutton('disable');
        }
 }