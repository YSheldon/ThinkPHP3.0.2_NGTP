var bad_char=/[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im;
function setTimeToolBar(){
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    }  else if(sel_row.length==1) {
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }
    } else if(sel_row.length>1) {
        var enable = true;//定义一个标识位，初始值为true
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
function editCirTimeRow(msg){
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1)
        edit_circle_time(rowData[0].name,rowData[0].type,rowData[0].week__mon_year,rowData[0].start,rowData[0].stop,rowData[0].shared,msg);
    else
        return;
}
function editSigTimeRow(msg){
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1)
        edit_sigle_time(rowData[0].name,rowData[0].start,rowData[0].stop,rowData[0].shared,msg);
    else
        return;
}
function setTimeGroToolBar() {
    var sel_row=$('#tt').treegrid('getSelections');
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
            $('#icon_del').linkbutton('enable');
        }else{
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }
        for(var i=0;i<sel_row.length;i++) {
            if(typeof(sel_row[i].member)=='undefined')
                $('#icon_del').linkbutton('disable');
        }
    } else if(sel_row.length==1) {
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }

        if(typeof(sel_row[0].member)=='undefined')
            $('#icon_del').linkbutton('disable');
    } else if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    }
}
function editTimeGroRow(msg) {
    var rowData=$('#tt').treegrid('getSelections');
    if(rowData.length==1) {
        if(typeof(rowData[0].type)=='undefined')
            edit_group_name(rowData[0].name,rowData[0].member,rowData[0].shared,msg);
        else if(rowData[0].type == "year")
            edit_sigle_time(rowData[0].name,rowData[0].start,rowData[0].stop,rowData[0].shared,$LANG.SINGLE_TIME_OBJ);
        else
            edit_circle_time(rowData[0].name,rowData[0].type,rowData[0].week__mon_year,rowData[0].start,rowData[0].stop,rowData[0].shared,$LANG.CIRCULATE_TIME_OBJ);
    }
    else
        return;
}
function time_group_reload() {
    $('#tt').treegrid('options').url = '?c=Resource/Time&grid=tree';
    $('#tt').treegrid('reload');
}

function search_cir_data() {
    var isValid = $('#searchName').textbox('isValid');
    if(!isValid) {
        return false;
    }
    var aname = $('#searchName').textbox('getValue');
    if(aname == '') {
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    if(bad_char.test(aname)){
        ngtosPopMessager("error", $LANG.INPUT_CHAR_ERROR);
        return false;
    }
    $('#tt').datagrid('getPager').pagination({pageNumber: 1});
    $("#tt").datagrid({
        pageNumber:1,
        url:'?s=Home/Resource/Time&mod=schedule&parKey=type&param=cycle&search='+encodeURI(aname)
    });
}

function clearSearch() {
    $('#searchName').textbox('clear');
}

function freshItem_cir(newValue,oldValue) {
    if(newValue == '') {
        $("#tt").datagrid({
            url:'?s=Home/Resource/Time&mod=schedule&parKey=type&param=cycle'
        });
    }
}

function search_sig_data() {
    var isValid = $('#searchName').textbox('isValid');
    if(!isValid) {
        return false;
    }
    var aname = $('#searchName').textbox('getValue');
    if(aname == '') {
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    if(bad_char.test(aname)){
        ngtosPopMessager("error", $LANG.INPUT_CHAR_ERROR);
        return false;
    }
    $('#tt').datagrid('getPager').pagination({pageNumber: 1});
    $("#tt").datagrid({
        pageNumber:1,
        url:'?s=Home/Resource/Time&mod=schedule&parKey=type&param=single&search='+encodeURI(aname)
    });
}

function freshItem_sig(newValue) {
    if(newValue == '') {
        $("#tt").datagrid({
            url:'?s=Home/Resource/Time&mod=schedule&parKey=type&param=single'
        });
    }
}
function addCirTime() {
    $("#st_time").timespinner('setValue','00:00');
    $("#end_time").timespinner('setValue','23:59');
}

function add_cir_time(msg) {
    circle_tag = 1;
    if ($('#circle_time_div').length <= 0) {
        $(document.body).append("<div id='circle_time_div' class='ngtos_window_550'></div>");
    }
    open_window('circle_time_div','Resource/Time&w=resource_circle_time_window','',msg,addCirTime);
}

function change_circle_type(num){
    if(num ==1) {
        $("#week_info").hide();
        $("#month_info").hide();
    } else if(num == 2) {
        $("#week_info").show();
        $("#month_info").hide();
    } else {
        $("#week_info").hide();
        $("#month_info").show();
    }
}

function refresh_login_time(timeId) {
    $('#'+timeId).combotree({
        url: '?c=Resource/Time&a=callFun',
        parent_checked:false,
        queryParams:{
            fun:'comboTree',
            parentNode: 'Time,TimeGroup',
            Time: 'define schedule',
            TimeGroup: 'define group_schedule'
        }
    });
}

var sig_cir_form = '';

function cir_submit(tag, grtag){
    if(sig_cir_form != '') {
        var isValid = $(sig_cir_form).form('validate');
    } else {
        var isValid = $("#circle_time_form").form('validate');
    }
    if(!isValid) {
        return false;
    }
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    if((grtag == 2 || grtag == 6) && tag == 1) {
        var val=$('input:radio[name="circle_method2"]:checked').val();
        var timeName = $("#time_name2").textbox('getValue');
        var stTime = $("#st_time2").timespinner('getValue');
        var endTime = $("#end_time2").timespinner('getValue');
    } else {
        var val=$('input:radio[name="circle_method"]:checked').val();
        var timeName = $("#time_name").textbox('getValue');
        var stTime = $("#st_time").timespinner('getValue');
        var endTime = $("#end_time").timespinner('getValue');
        var sta = $('input[name="cir_sha"]:checked').val();
        if(sta == 1)
            var sha_tag = "on";
        else
            var sha_tag = "off";
    }

    if(val == 1) {
        var cmonth = "1-31";

        $.ajax({
            url: "?s=Home/Resource/Time&cyctype=day",
            type: method,
            dataType:'text',
            data:{
                name:timeName,
                start:stTime,
                stop:endTime,
                month:cmonth,
                shared:sha_tag,
                tag:tag
            },
            success: function(data){
                if(data== '0'){
                    cir_page_show(tag,grtag,timeName);
                }else{
                    ngtosPopMessager("error", data);
                }
                $("#tt").treegrid("unselectAll");
            }
        })
    } else if(val == 3) {
        if(grtag == 2 && tag == 1)
            var cmonth = $("#month_st2").combobox('getValue') + "-" +$("#month_end2").combobox('getValue');
        else
            var cmonth = $("#month_st").combobox('getValue') + "-" +$("#month_end").combobox('getValue');

        $.ajax({
            url: "?s=Home/Resource/Time&cyctype=monthcyc",
            type: method,
            dataType:'text',
            data:{
                name:timeName,
                start:stTime,
                stop:endTime,
                month:cmonth,
                shared:sha_tag,
                tag:tag
            },
            success: function(data){
                if(data=='0'){
                    cir_page_show(tag,grtag,timeName);
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
        })
    } else {
        var s = "";
        if(grtag == 2 && tag == 1)
        {
            if($("#week1_2").is(":checked"))
                s = s + "1";
            if($("#week2_2").is(":checked"))
                s = s + "2";
            if($("#week3_2").is(":checked"))
                s = s + "3";
            if($("#week4_2").is(":checked"))
                s = s + "4";
            if($("#week5_2").is(":checked"))
                s = s + "5";
            if($("#week6_2").is(":checked"))
                s = s + "6";
            if($("#week7_2").is(":checked"))
                s = s + "7";
        } else {
            if($("#week1").is(":checked"))
                s = s + "1";
            if($("#week2").is(":checked"))
                s = s + "2";
            if($("#week3").is(":checked"))
                s = s + "3";
            if($("#week4").is(":checked"))
                s = s + "4";
            if($("#week5").is(":checked"))
                s = s + "5";
            if($("#week6").is(":checked"))
                s = s + "6";
            if($("#week7").is(":checked"))
                s = s + "7";
        }

        var cweek = s;

        $.ajax({
            url: "?s=Home/Resource/Time&cyctype=weekcyc",
            type: method,
            dataType:'text',
            data:{
                name:timeName,
                start:stTime,
                stop:endTime,
                week:cweek,
                shared:sha_tag,
                tag:tag
            },
            success: function(data){
                if(data== '0'){
                    cir_page_show(tag,grtag,timeName);
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
        })
    }

}

function change_circle_type2(num){
    if(num ==1) {
        $("#week_info2").hide();
        $("#month_info2").hide();
    } else if(num == 2) {
        $("#week_info2").show();
        $("#month_info2").hide();
    } else {
        $("#week_info2").hide();
        $("#month_info2").show();
    }
}

function add_refresh_cirtime(name) {
    var options = "";
    parent.sourOptions.push(name);
    for(var i=0;i<parent.sourOptions.length;i++)
        options += "<option value='" + parent.sourOptions[i] + "'>" + parent.sourOptions[i] +"</option>";
    $('#time_item_cid').html(options);
    $('#source_tag').val("");
    select_add_title("time_item_cid");
}

function cir_page_show(tag,grtag,timeName) {
    if(grtag == 1) {
        $("#circle_time_div").window("close");
        $('#tt').datagrid('reload');
    } else if(grtag == 6) {
        var opp = new Option(timeName,timeName);
        opp.title = timeName;
        $('#sel1')[0].add(opp);
        $("#sig_cir_div").window("close");
    } else {
        if(tag == 2) {
            $("#circle_time_div").window("close");
            time_group_reload();
        } else {
            $("#sig_cir_div").window("close");
            add_refresh_cirtime(timeName);
        }
    }
}

function editCirTime() {
    $("#st_time").timespinner('setValue',param[3]);
    $("#end_time").timespinner('setValue',param[4]);
}

function edit_circle_time(cir_name, cir_type, cir_date, cir_start, cir_stop, cir_sha, msg) {
    circle_tag = 2;
    param[0] = cir_name;
    param[1] = cir_type;
    param[2] = cir_date;
    param[3] = cir_start;
    param[4] = cir_stop;
    param[5] = cir_sha;
    if ($('#circle_time_div').length <= 0) {
        $(document.body).append("<div id='circle_time_div' class='ngtos_window_550'></div>");
    }
    open_window('circle_time_div','Resource/Time&w=resource_circle_time_window','',msg,editCirTime);
}

/*******循环时间删除*****/
function delete_cir_time(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var ids = [];
                var rows = $('#tt').datagrid('getSelections');
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].id);
                }
                var pagenum = return_pagenum('tt',rows);
                var id = ids.join('#');
                $.ajax({
                    url: "?s=Home/Resource/Time&mod=schedule",
                    type: 'delete',
                    datatype:'text',
                    data:{
                        delItems:id,
                        delKey:'id'
                    },
                    success: function(data){
                        if(data=='0'){
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
//清除循环时间的功能
function clear_cir_time() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_CITE_NOT_CLEAR,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Time&mod=schedule&all=1",
                dataType:'text',
                type: 'delete',
                data: {
                    parKey:'type',
                    param:'cycle'
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function loadAddFunc() {
    $("#st_date").datebox('setValue','');
    $("#sig_st_time").val("00:00:00");
    $("#end_date").datebox('setValue','');
    $("#sig_end_time").val("00:00:00");
}

function add_sig_time(msg){
    sig_tag = 1;
    if ($('#single_time_div').length <= 0) {
        $(document.body).append("<div id='single_time_div' class='ngtos_window_550'></div>");
    }
    open_window('single_time_div','Resource/Time&w=resource_single_time_window','',msg,loadAddFunc);
}

function sigle_submit(tag, grtag){
    if(sig_cir_form != '') {
        var isValid = $(sig_cir_form).form('validate');
    } else {
        var isValid = $("#single_time_form").form('validate');
    }
    if(!isValid) {
        return false;
    }
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    if((grtag == 2 || grtag == 6) && tag == 1) {
        var timeName = $("#time_name2").textbox('getValue');
        var stDate = $("#sig_st_date").datebox('getValue');
        var endDate = $("#sig_end_date").datebox('getValue');
        var stTime = $("#sig_st_time2").timespinner('getValue');
        var endTime = $("#sig_end_time2").timespinner('getValue');
    } else {
        var timeName = $("#sig_time_name").textbox('getValue');
        var stDate = $("#st_date").datebox('getValue');
        var endDate = $("#end_date").datebox('getValue');
        var stTime = $("#sig_st_time").timespinner('getValue');
        var endTime = $("#sig_end_time").timespinner('getValue');
        var sta = $('input[name="sig_sha"]:checked').val();
        if(sta == 1)
            var sha_tag = "on";
        else
            var sha_tag = "off";
    }

    if(stDate > endDate) {
        ngtosPopMessager("error", $LANG.DATE_START_LT_END);
        return false;
    } else if(stDate == endDate) {
        if(stTime > endTime) {
            ngtosPopMessager("error", $LANG.TIME_START_LT_END);
            return false;
        }
    }

    $.ajax({
        url: "?s=Home/Resource/Time&cyctype=year",
        type: method,
        datatype:'text',
        data:{
            name:timeName,
            sdate:stDate,
            edate:endDate,
            stime:stTime,
            etime:endTime,
            shared:sha_tag,
            tag:tag
        },
        success: function(data){
            if(data=='0'){
                sig_page_show(tag,grtag,timeName);
            } else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

function sig_page_show(tag,grtag,timeName) {
    if(grtag == 1)  {
        $("#single_time_div").window("close");
        $('#tt').datagrid('reload');
    } else if(grtag==6) {
        var opp = new Option(timeName,timeName);
        opp.title = timeName;
        $('#sel1')[0].add(opp);
        $("#sig_cir_div").window("close");
    } else {
        if(tag == 2) {
            $("#single_time_div").window("close");
            time_group_reload();
        } else {
            $("#sig_cir_div").window("close");
            add_refresh_cirtime(timeName);
        }
    }
}

function loadEditFunc() {
    var st_value = param[2].split(' ');
    $("#st_date").datebox('setValue',st_value[0]);
    $("#sig_st_time").timespinner('setValue',st_value[1]);
    var end_value = param[3].split(' ');
    $("#end_date").datebox('setValue',end_value[0]);
    $("#sig_end_time").timespinner('setValue',end_value[1]);
}

function edit_sigle_time(sig_name, sig_start, sig_stop,sig_sha, msg) {
    sig_tag = 2;
    param[0] = sig_name;
    param[1] = sig_sha;
    param[2] = sig_start;
    param[3] = sig_stop;
    if($("#single_time_div").length <= 0){
        $(document.body).append("<div id='single_time_div' class='ngtos_window_550'></div>");
    }
    open_window('single_time_div','Resource/Time&w=resource_single_time_window','',msg,loadEditFunc);
}

/*******菜单栏删除*****/
function delete_sig_item(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var ids = [];
                var rows = $('#tt').datagrid('getSelections');
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].id);
                }
                var pagenum = return_pagenum('tt',rows);
                var id = ids.join('#');
                $.ajax({
                    url: "?c=Resource/Time&mod=schedule",
                    type: 'delete',
                    datatype:'text',
                    data:{
                        delItems:id,
                        delKey:'id'
                    },
                    success: function(data){
                        if(data=='0'){
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
//清除单次时间的功能
function clear_sig_item() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_CITE_NOT_CLEAR,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Time&mod=schedule&all=1",
                type: 'delete',
                data: {
                    parKey:'type',
                    param:'single'
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function get_time_options(){
    var src_from = $("#d_time_item_cid").get(0);
    parent.moveSelNum = src_from.options.length;
    $('#sel_time_num').html($LANG.SELECTED+ parent.moveSelNum +$LANG.SEVERAL);
}

function refresh_cirtime(){
    $.ajax({
        url:'?s=Home/Resource/Time&fun=dataShow&mod=schedule&key=name',
        type:'get',
        dataType:'json',
        async:false,
        success:function(data){
            var options="";
            if(data.rows != 'false'){
                $(data.rows).each(function(key,value){
                    options += "<option value='" + value.name + "'>" + value.name +"</option>";
                })

                $('#time_item_cid').html(options);
                get_mulselect_options('time_item_cid','d_time_item_cid');
                select_add_title("time_item_cid");
            }
            get_time_options();
        }
    });
}

function modify_refresh_cirtime(time_memb){
    var server_arr = $.trim(time_memb).split(",");
    $.ajax({
        url:'?s=Home/Resource/Time&fun=dataShow&mod=schedule&key=name',
        type:'get',
        dataType:'json',
        async:false,
        success:function(data){
            $(data.rows).each(function(key,value){
                if( $.inArray(value.name, server_arr) > -1 ){    //通过inArray是否在数组中进行判断
                    $('#d_time_item_cid')[0].add(new Option(value.name,value.name));
                }else{
                    $('#time_item_cid')[0].add(new Option(value.name,value.name));
                }
            })
            get_mulselect_options('time_item_cid','d_time_item_cid');
            select_add_title("time_item_cid");
            select_add_title("d_time_item_cid");
            get_time_options();
        }
    });
}

function add_time_group(msg){
    time_tag = 1;
    if($("#time_group_div").length <= 0){
        $(document.body).append("<div id='time_group_div' class='ngtos_window_550'></div>")
    }
    open_window('time_group_div','Resource/Time&w=resource_time_group_window','',msg);
}

function sel_time_group(tag) {
    var isValid = $("#time_group_form").form('validate');
    if(!isValid) {
        return false;
    }
    var time_item=new Array();
    $("#d_time_item_cid option").each(function(){
        time_item.push($(this).val());
    });
    if(time_item.length>128) {
        ngtosPopMessager("error", $LANG.MAX_SELECT128);
        return;
    }
    if(time_item == "")
        var mem = "";
    else
        var mem ="'" + time_item.join(' ') + "'";

    var sta = $('input[name="tg_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    var tName = $('#ti_name').textbox('getValue');
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    $.ajax({
        url: "?s=Home/Resource/Time&cyctype=group",
        type: method,
        datatype:'text',
        data:{
            name:tName,
            tag:tag,
            member:mem,
            shared:sha_tag
        },
        success: function(data){
            if(data=='0'){
                if(typeof(grtag)!='undefined' && grtag==6) {
                    var opp = new Option(tName,tName);
                    opp.title = tName;
                    $('#sel1')[0].add(opp);
                    $("#time_group_div").window("close");
                }else{
                    $("#time_group_div").window("close");
                    time_group_reload();
                }
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function edit_group_name(time_name,time_memb,time_sha, msg){
    time_tag = 2;
    param[0] = time_name;
    param[1] = time_sha;
    param[2] = time_memb;
    if($("#time_group_div").length <= 0){
        $(document.body).append("<div id='time_group_div' class='ngtos_window_550'></div>");
    }
    open_window('time_group_div','Resource/Time&w=resource_time_group_window','',msg);
}

/*******时间组删除*****/
function delete_group_check(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var ids = [];
                var rows = $('#tt').treegrid('getSelections');
                var pagenum = return_pagenum('tt',rows);
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].name);
                }
                var nameval = ids.join('#');
                $.ajax({
                    url: "?s=Home/Resource/Time&mod=timegroup",
                    type: 'delete',
                    datatype:'text',
                    data:{
                        delItems:nameval
                    },
                    success: function(data){
                        if(data=='0'){
                            $('#tt').treegrid('options').pageNumber = pagenum;
                            $('#tt').treegrid('getPager').pagination({pageNumber: pagenum});
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
//时间组清空功能
function clear_group_item(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Time&mod=timegroup&all=1",
                type: 'delete',
                success: function(data){
                    if(data!='0'){
                        ngtosPopMessager("error", data);
                    }
                    time_group_reload();
                }
            });
        }
    });
}

function add_times(msg){
    sig_tag = 1;
    circle_tag = 1;
    if ($('#sig_cir_div').length <= 0) {
        $(document.body).append("<div id='sig_cir_div' class='ngtos_window_550'></div>");
    }
    open_window('sig_cir_div','Resource/Time&w=resource_sig_cir_window','',msg);
}

function add_loginTime(msg,id){
   if(id != ''){
        $("#"+id).combo('hidePanel');
    }
    if ($('#add_login_time').length <= 0) {
        $(document.body).append("<div id='add_login_time' class='ngtos_window_550'></div>");
    }
    open_window('add_login_time','Resource/Time&w=resource_timeGroup_window','',msg);
}

function changeTimeType(tag) {
    if(tag == 1) {
        $('#addSchTr').css("display","");
        $('#addSchSingleTr1').css("display","none");
        $('#addSchSingleTr2').css("display","none");
        $('#addSchGroupTr').css("display","none");
        $('#timeGrTable').css("display","none");
        $("#sig_st_date").datebox({novalidate:true});
        $("#sig_end_date").datebox({novalidate:true});
    } else if(tag == 2) {
        $('#addSchTr').css("display","none");
        $('#addSchSingleTr1').css("display","");
        $('#addSchSingleTr2').css("display","");
        $('#addSchGroupTr').css("display","none");
        $('#timeGrTable').css("display","none");
        $("#sig_st_date").datebox({novalidate:false});
        $("#sig_end_date").datebox({novalidate:false});
    } else {
        $('#addSchTr').css("display","none");
        $('#addSchSingleTr1').css("display","none");
        $('#addSchSingleTr2').css("display","none");
        $('#addSchGroupTr').css("display","");
        $('#timeGrTable').css("display","");
        $("#sig_st_date").datebox({novalidate:true});
        $("#sig_end_date").datebox({novalidate:true});
    }
}

function cir_time_submit(tag,grtag){
    var isValid = $("#sig_cir_group_form").form('validate');
    if(!isValid) {
        return false;
    }
    var val=$('input:radio[name="circle_method"]:checked').val();
    var timeName = $("#time_name").textbox('getValue');
    var stTime = $("#cir_st_time").timespinner('getValue');
    var endTime = $("#cir_end_time").timespinner('getValue');
    var sta = $('input[name="cir_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    if(val == 1){
        var cmonth = "1-31";

        $.ajax({
            url: "?s=Home/Resource/Time&cyctype=monthcyc",
            type: 'POST',
            datatype:'text',
            data:{
                name:timeName,
                start:stTime,
                stop:endTime,
                month:cmonth,
                shared:sha_tag,
                tag:tag
            },
            success: function(data){
                if(data=='0'){
                    if(grtag == 3)
                        refresh_login_time('more_login_time');
                    else if(grtag == 5)
                        refresh_login_time('import_login_time');
                    else if(grtag == 7)
                        refresh_login_time('local_more_login_time');
                    else if(grtag == 8)
                        refresh_login_time('whole_more_login_time');
                    else if(grtag == 11) //流量策略中添加vlink时所用
                        time_combobox_reflesh('add_schedule',false,3);
                    closeWindow('add_login_time');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        })
    } else if(val == 3) {
        var cmonth = $("#month_st").combobox('getValue') + "-" +$("#month_end").combobox('getValue');

        $.ajax({
            url: "?s=Home/Resource/Time&cyctype=monthcyc",
            type: 'POST',
            datatype:'text',
            data:{
                name:timeName,
                start:stTime,
                stop:endTime,
                month:cmonth,
                shared:sha_tag,
                tag:tag
            },
            success: function(data){
                if(data=='0'){
                    if(grtag == 3)
                        refresh_login_time('more_login_time');
                    else if(grtag == 5)
                        refresh_login_time('import_login_time');
                    else if(grtag == 7)
                        refresh_login_time('local_more_login_time');
                    else if(grtag == 8)
                        refresh_login_time('whole_more_login_time');
                    else if(grtag == 11)
                        time_combobox_reflesh('add_schedule',false,3);
                    closeWindow('add_login_time');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        })
    } else {
        var s = "";
        if($("#week1").attr("checked")=="checked")
            s = s + "1";
        if($("#week2").attr("checked")=="checked")
            s = s + "2";
        if($("#week3").attr("checked")=="checked")
            s = s + "3";
        if($("#week4").attr("checked")=="checked")
            s = s + "4";
        if($("#week5").attr("checked")=="checked")
            s = s + "5";
        if($("#week6").attr("checked")=="checked")
            s = s + "6";
        if($("#week7").attr("checked")=="checked")
            s = s + "7";
        var cweek = s;
        $.ajax({
            url: "?s=Home/Resource/Time&cyctype=weekcyc",
            type: 'POST',
            datatype:'text',
            data:{
                name:timeName,
                start:stTime,
                stop:endTime,
                week:cweek,
                shared:sha_tag,
                tag:tag
            },
            success: function(data){
                if(data=='0'){
                    if(grtag == 3)
                        refresh_login_time('more_login_time');
                    else if(grtag == 5)
                        refresh_login_time('import_login_time');
                    else if(grtag == 7)
                        refresh_login_time('local_more_login_time');
                    else if(grtag == 8)
                        refresh_login_time('whole_more_login_time');
                    else if(grtag == 11)
                        time_combobox_reflesh('add_schedule',false,3);
                        closeWindow('add_login_time');
                } else {
                        ngtosPopMessager("error", data);
                }
            }
        })
    }
}

function sig_time_submit(tag, grtag){
    var isValid = $("#sig_cir_group_form").form('validate');
    if(!isValid) {
        return false;
    }
    var timeName = $("#time_name").textbox('getValue');
    var stDate = $("#sig_st_date").datebox('getValue');
    var endDate = $("#sig_end_date").datebox('getValue');
    var stTime = $("#sig_st_time").timespinner('getValue');
    var endTime = $("#sig_end_time").timespinner('getValue');
    var sta = $('input[name="cir_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    if(stDate > endDate) {
        ngtosPopMessager("error", $LANG.DATE_START_LT_END);
        return false;
    } else if(stDate == endDate) {
        if(stTime > endTime) {
            ngtosPopMessager("error", $LANG.TIME_START_LT_END);
            return false;
        }
    }

    $.ajax({
        url: "?s=Home/Resource/Time&cyctype=year",
        type: 'POST',
        datatype:'text',
        data:{
            name:timeName,
            sdate:stDate,
            edate:endDate,
            stime:stTime,
            etime:endTime,
            shared:sha_tag,
            tag:tag
        },
        success: function(data){
            if(data=='0'){
                if(grtag == 3)
                    refresh_login_time('more_login_time');
                else if(grtag == 5)
                    refresh_login_time('import_login_time');
                else if(grtag == 7)
                    refresh_login_time('local_more_login_time');
                else if(grtag == 8)
                    refresh_login_time('whole_more_login_time');
                else if(grtag == 11)
                    time_combobox_reflesh('add_schedule',false,3);
                closeWindow('add_login_time');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    })
}

function time_group_submit(tag,grtag) {
    var isValid = $("#sig_cir_group_form").form('validate');
    if(!isValid) {
        return false;
    }
    var time_item=new Array();
    $("#d_time_item_cid option").each(function(){
        time_item.push($(this).val());
    });
    if(time_item.length>128) {
        ngtosPopMessager("error", $LANG.MAX_SELECT128);
        return;
    }
    if(time_item == "")
        var mem = "";
    else
        var mem ="'" + time_item.join(' ') + "'";

    var sta = $('input[name="cir_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    var timeGroupName = $('#time_name').textbox('getValue');
    $.ajax({
        url: "?s=Home/Resource/Time&cyctype=group",
        type: 'POST',
        datatype:'text',
        data:{
            name:timeGroupName,
            tag:tag,
            member:mem,
            shared:sha_tag
        },
        success: function(data){
            if(data=='0'){
                if(grtag == 3)
                    refresh_login_time('more_login_time');
                else if(grtag == 5)
                    refresh_login_time('import_login_time');
                else if(grtag == 7)
                    refresh_login_time('local_more_login_time');
                else if(grtag == 8)
                    refresh_login_time('whole_more_login_time');
                else if(grtag == 11)
                    time_combobox_reflesh('add_schedule',false,3);
                closeWindow('add_login_time');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}