var bad_char=/[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im;
function setServToolBar(){
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1){
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    }else if(sel_row.length==1){
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }
    }else if(sel_row.length>1){
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
            $('#icon_del').linkbutton('enable');
        }else{
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }
    }
}
function editServRow(msg){
    var rowData=$('#tt').datagrid('getSelections');
    var comm = rowData[0].comment;
    var len = comm.length - 2;
    comment = comm.substr(1, len);
    comment = $.trim(comment);
    if(rowData.length==1)
        edit_selfserv_name(rowData[0].name,rowData[0].protocol,rowData[0].port,comment,rowData[0].shared,msg);
    else
        return;
}
function setServGroToolBar(){
    var sel_row=$('#tt').treegrid('getSelections');
    if(sel_row.length>1){
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
            $('#icon_del').linkbutton('enable');
        }else{
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }

        for(var i=0;i<sel_row.length;i++){
            if(typeof(sel_row[i].member)=='undefined')
                $('#icon_del').linkbutton('disable');
        }
    }else if(sel_row.length==1){
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }
        if(typeof(sel_row[0].member)=='undefined'){
            $('#icon_del').linkbutton('disable');
            if(sel_row[0].type != 0)
                $('#icon_edit').linkbutton('disable');
        }
    }else if(sel_row.length<1){
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    }
}
function editServGroRow(msg){
    var rowData=$('#tt').treegrid('getSelections');
    if(rowData.length==1){
        if(typeof(rowData[0].member)=='undefined'){
            var comm = rowData[0].comment;
            var len = comm.length - 2;
            comment = comm.substr(1, len);
            comment = $.trim(comment);
            edit_selfserv_name(rowData[0].name,rowData[0].protocol,rowData[0].port,comment,rowData[0].shared,$LANG.ADD_SERVICE_OBJ);
        }else
            edit_group_name(rowData[0].name,rowData[0].member,rowData[0].shared,msg);
    }
    else
        return;
}
function time_group_reload(){
    $('#tt').treegrid('options').url = '?s=Home/Resource/Service&mod=servicegroup&grid=tree';
    $('#tt').treegrid('reload');
}

function search_serv_data(){
    var isValid = $('#addName').textbox('isValid');
    if(!isValid) {
        return false;
    }
    var aname = $('#addName').textbox('getValue');
    if(aname == ''){
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    if(bad_char.test(aname)){
        ngtosPopMessager("error", $LANG.INPUT_CHAR_ERROR);
        return false;
    }
    $('#tt').datagrid('getPager').pagination({pageNumber: 1});
    $('#tt').datagrid({
        pageNumber:1,
        url: '?s=Home/Resource/Service&mod=service&search='+encodeURI(aname)
    });
}
function clearSearch() {
    $('#addName').textbox('clear');
}
function freshItem(newValue,oldValue){
    if(newValue == ''){
        $("#tt").datagrid({
            url:'?s=Home/Resource/Service&mod=service'
        });
    }
}

function change_serv_type(num){
    if(num == 1 || num == 2){
        $('#serv1').css("display","");
        $('#serv2').css("display","none");
        $('#serv3_1').css("display","none");
        $('#serv3_2').css("display","none");
        $("#port_st").textbox({novalidate: false});
        $("#port_end").textbox({novalidate: false});
        $("#pro_num_st").textbox({novalidate: true});
        $("#pro_num_end").textbox({novalidate: true});
        $("#proto_num").textbox({novalidate: true});
        $("#sport_st").textbox({novalidate: true});
        $("#sport_end").textbox({novalidate: true});
    }else if(num == 3){
        $('#serv1').css("display","none");
        $('#serv2').css("display","");
        $('#serv3_1').css("display","none");
        $('#serv3_2').css("display","none");
        $("#port_st").textbox({novalidate: true});
        $("#port_end").textbox({novalidate: true});
        $("#pro_num_st").textbox({novalidate: false});
        $("#pro_num_end").textbox({novalidate: false});
        $("#proto_num").textbox({novalidate: true});
        $("#sport_st").textbox({novalidate: true});
        $("#sport_end").textbox({novalidate: true});
    }else if(num == 4){
        $('#serv1').css("display","none");
        $('#serv2').css("display","none");
        $('#serv3_1').css("display","");
        $('#serv3_2').css("display","");
        $("#port_st").textbox({novalidate: true});
        $("#port_end").textbox({novalidate: true});
        $("#pro_num_st").textbox({novalidate: true});
        $("#pro_num_end").textbox({novalidate: true});
        $("#proto_num").textbox({novalidate: false});
        $("#sport_st").textbox({novalidate: false});
        $("#sport_end").textbox({novalidate: false});
    }
}

function add_serv(msg){
    serv_tag = 1;
    if ($('#service_div').length <= 0) {
        $(document.body).append("<div id='service_div' class='ngtos_window_500'></div>");
    }
    open_window('service_div','Resource/Service&w=resource_service_window','',msg);
}

function edit_selfserv_name(serv_name, serv_type, serv_port, serv_comm,serv_sha, msg){
    serv_tag = 2;
    param[0] = serv_name;
    param[1] = serv_type;
    param[2] = serv_port;
    param[3] = serv_comm;
    param[4] = serv_sha;
    if ($('#service_div').length <= 0) {
        $(document.body).append("<div id='service_div' class='ngtos_window_500'></div>");
    }
    open_window('service_div','Resource/Service&w=resource_service_window','',msg);
}

function add_refresh_serv(name){
    var options = "";
    parent.sourOptions.push(name);
    for(var i=0;i<parent.sourOptions.length;i++)
        options += "<option value='" + parent.sourOptions[i] + "'>" + parent.sourOptions[i] +"</option>";

    $('#source_tag').val("");
    $('#service_item_cid').html(options);
    select_add_title("service_item_cid");
}

function add_self_service(tag, grtag){
    var isValid = $("#self_service_form").form('validate');
    if(!isValid) {
        return false;
    }
    var stype;
    var port1;
    var port2;
    var sta = $('input[name="self_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    var type = $('input[name="add_type"]:checked').val();

    if(type == 1 || type == 2){
        port1 = $('#port_st').textbox('getValue');
        port2 = $('#port_end').textbox('getValue');
        if(type == 1)
            stype = "6";
        else if(type == 2)
            stype = "17";
    }else if(type == 3){
        port1 = $('#pro_num_st').textbox('getValue');
        port2 = $('#pro_num_end').textbox('getValue');
        stype = "1";
    }else if(type == 4){
        stype = $('#proto_num').textbox('getValue');
        port1 = $('#sport_st').textbox('getValue');
        port2 = $('#sport_end').textbox('getValue');
    }
    var sport1 = $.trim(port1);
    if(sport1 != "" && sport1 != 0)
        sport1 = parseInt(sport1);
    var sport2 = $.trim(port2);
    if(sport2 != "" && sport2 != 0)
        sport2 = parseInt(sport2);
    if(tag == 2) {
        var method = 'put';
        if(sport2 == "")
            sport2 = 0;
    } else {
        var method = 'post';
    }
    if($('#serv_des').textbox('getValue') == "")
        var commValue ="'" + " " + "'";
    else
        var commValue = "'" + $('#serv_des').textbox('getValue') + "'";

    var serviceName = $('#serv_name').textbox('getValue');

    $.ajax({
        url: "?s=Home/Resource/Service&mod=service",
        type: method,
        datatype:'text',
        data:{
            name:serviceName,
            port1:sport1,
            port2:sport2,
            protocol:stype,
            comment:commValue,
            shared:sha_tag,
            tag:tag
        },
        success: function(data){
            if(data == 0){
                if(grtag == 1){
                    $('#tt').datagrid('reload');
                }else if(grtag == 6 || grtag == 9){
                    var opp = new Option(serviceName,serviceName);
                    opp.title = serviceName;
                    $('#sel1')[0].add(opp);
                }else{
                    if(tag == 1)
                        add_refresh_serv(serviceName);
                    else
                        time_group_reload();
                }
                $("#service_div").window("close");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

/*******自定义服务删除*****/
function delete_serv_item(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var ids2 = [];
                var rows = $('#tt').datagrid('getSelections');
                var pagenum = return_pagenum('tt',rows);
                for(var i=0; i<rows.length; i++){
                    ids2.push(rows[i].id);
                }
                var id = ids2.join('#');
                $.ajax({
                    url: "?s=Home/Resource/Service&mod=service",
                    type: 'delete',
                    datatype:'text',
                    data:{
                        delItems:id,
                        delKey:'id'
                    },
                    success: function(data){
                        if(data == '0'){
                            $('#tt').datagrid('options').pageNumber = pagenum;
                            $('#tt').datagrid('getPager').pagination({pageNumber: pagenum});
                        }else{
                            ngtosPopMessager("error", data);
                        }
                        $('#tt').datagrid('reload');
                    }
                });
            }
        });
}
//自定义服务清空功能
function clear_serv_item() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_CITE_NOT_CLEAR,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Service&mod=service&all=1",
                type: 'delete',
                success: function(data){
                    if(data != 0){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function get_service_options(){
    var src_from = $("#d_service_item_cid").get(0);
    parent.moveSelNum = src_from.options.length;
    $('#sel_service_num').html($LANG.SELECTED+ parent.moveSelNum +$LANG.SEVERAL);
}

function refresh_serv() {
    $.ajax({
        url: "?c=Resource/Service&a=allService",
        type: 'get',
        dataType:'json',
        async:false,
        success: function(data){
            var options = "";
            if(data.rows.length > 0 ){
                $(data.rows).each(function(key,value){
                    options += "<option value='" + value.name + "'>" + value.name +"</option>";
                })

                $('#service_item_cid').html(options);
                get_mulselect_options('service_item_cid','d_service_item_cid');
                select_add_title("service_item_cid");
            }
            get_service_options();
        }
    });
}

function modify_refresh_serv(serv_memb){
    var server_arr = $.trim(serv_memb).split(",");
    $.ajax({
        url: "?c=Resource/Service&a=allService",
        type: 'get',
        dataType:'json',
        async:false,
        success: function(data){
            if(data.rows.length > 0){
                $(data.rows).each(function(key,value){
                    if( $.inArray(value.name, server_arr) > -1 ){    //通过inArray是否在数组中进行判断
                        $('#d_service_item_cid')[0].add(new Option(value.name,value.name));
                    }else{
                        $('#service_item_cid')[0].add(new Option(value.name,value.name));
                    }
                })
                get_mulselect_options('service_item_cid','d_service_item_cid');
                select_add_title("service_item_cid");
                select_add_title("d_service_item_cid");
            }
            get_service_options();
        }
    });
}

function add_serv_group(msg){
    gserv_tag = 1;
    if ($('#service_group_div').length <= 0) {
        $(document.body).append("<div id='service_group_div' class='ngtos_window_500'></div>");
    }
    open_window('service_group_div','Resource/Service&w=resource_service_group_window','',msg);
}

function edit_group_name(serv_name,serv_memb,serv_sha, msg){
    gserv_tag = 2;
    if ($('#service_group_div').length <= 0) {
        $(document.body).append("<div id='service_group_div' class='ngtos_window_500'></div>");
    }
    param[0] = serv_name;
    param[1] = serv_sha;
    param[2] = serv_memb;

    open_window('service_group_div','Resource/Service&w=resource_service_group_window','',msg);
}

function sel_group(tag) {
    var isValid = $("#service_form").form('validate');
    if(!isValid) {
        return false;
    }
    var service_item=new Array();
    $("#d_service_item_cid option").each(function(){
        service_item.push($(this).val());
    });
    if(service_item.length>128) {
        ngtosPopMessager("error", $LANG.MAX_SELECT128);
        return;
    }
    if(service_item == "")
        var mem = "";
    else
        var memb ="'" + service_item.join(' ') + "'";
    var sta = $('input[name="sg_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    var servGroupName = $('#ser_name').textbox('getValue');
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    $.ajax({
        url: "?s=Home/Resource/Service&type=group",
        type: method,
        datatype:'text',
        data:{
            name:servGroupName,
            member:memb,
            tag:tag,
            shared:sha_tag
        },
        success: function(data){
            if(data=='0'){
                if(typeof(grtag)!='undefined' && (grtag==6 || grtag == 9)){
                    if(grtag == 9) {
                        var opp = new Option(servGroupName+'['+$LANG.GROUP+']',servGroupName);
                    } else {
                        var opp = new Option(servGroupName,servGroupName);
                    }

                    opp.title = $('#ser_name').val();
                    $('#sel1')[0].add(opp);
                    $("#service_group_div").window("close");
                }else{
                    $("#service_group_div").window("close");
                    time_group_reload();
                }
            }else{
                ngtosPopMessager("error", data);
                if(typeof(grtag)!='undefined' && (grtag==6 || grtag == 9)){

                }else{
                    time_group_reload();
                }
            }
            $("#tt").treegrid("unselectAll");
        }
    });
}

/*******菜单栏删除*****/
function delete_sgroup_item(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var ids1 = [];
                var rows = $('#tt').treegrid('getSelections');
                var pageNum = return_pagenum('tt',rows);
                for(var i=0; i<rows.length; i++){
                    ids1.push(rows[i].name);
                }
                var name = ids1.join('#');
                $.ajax({
                    url: "?s=Home/Resource/Service&mod=servicegroup",
                    type: 'delete',
                    datatype:'text',
                    data:{
                        delItems:name
                    },
                    success: function(data){
                        if(data == '0'){
                            $('#tt').treegrid('options').pageNumber = pageNum;
                            $('#tt').treegrid('getPager').pagination({pageNumber: pageNum});
                        }else{
                            ngtosPopMessager("error", data);
                        }
                        time_group_reload();
                        $("#tt").treegrid("unselectAll");
                    }
                });
            }
        });
}

function clear_sgroup_item(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Service&mod=servicegroup&all=1",
                type: 'delete',
                dataType:'text',
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    time_group_reload();
                }
            });
        }
    });
}