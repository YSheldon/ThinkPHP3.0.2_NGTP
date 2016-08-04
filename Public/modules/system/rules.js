function setToolBar(){
    var row = $('#tt').datagrid('getSelected');
    if (row && row.tag == 1){
        $('#icon_edit').linkbutton('enable');
        $('#icon_import').linkbutton('enable');
        $('#icon_enable').linkbutton('enable');
        $('#icon_disable').linkbutton('enable');
        $('#icon_up').linkbutton('enable');
    }else{
        $('#icon_edit').linkbutton('disable');
        $('#icon_import').linkbutton('disable');
        $('#icon_enable').linkbutton('disable');
        $('#icon_disable').linkbutton('disable');
        $('#icon_up').linkbutton('disable');
    }
    if(row.apply == 'disable'){
	$('#icon_disable').linkbutton('disable');
        $('#icon_up').linkbutton('disable');
    }else if(row.apply == 'enable'){
        $('#icon_enable').linkbutton('disable');
    }
}

function add_serip()
{
    ip_num++;
    if(ip_num > 4)
    {
        ngtosPopMessager("error", $LANG.SERVER_ADDRESS_NUMBER_UP_TO);
        return;
    }
    var tbl = $('#serv_addr')[0];
    var lastRow = tbl.rows.length;
    var iteration = lastRow+1;
    var row = tbl.insertRow(lastRow);

    var cellCenter = row.insertCell(0);
    var tb1="<img src='static/images/icons/mini_clear.gif' width='10' height='10' style='cursor:pointer;' onClick='del_serip(this)'/>&nbsp;";
    var tb2="<input type='text' class='ngtos_input' style='width:180px;' maxlength='63'' id='ip_addr"+ ip_num +"' name='ip_addr"+ ip_num +"'>&nbsp;";
    var tb3="<img src='static/images/icons/mini_add.gif' width='10' height='10' style='cursor:pointer;' onClick='add_serip()'/>";
    cellCenter.innerHTML=tb1 + tb2 + tb3;

    if(ip_num < 8)
    {
        var height = $('#ip_div').css("height");
        height = parseInt(height) + 33;
        $('#ip_div').css("height", height);
    }

}

function del_serip(r){
    ip_num--;
    var i=r.parentNode.parentNode.rowIndex;
    $('#serv_addr')[0].deleteRow(i);

    if(ip_num < 7){
        var height = $('#ip_div').css("height");
        height = parseInt(height) - 33;
        $('#ip_div').css("height", height);
    }
}

function update_more_roles(){
    var row=$('#tt').datagrid('getSelected');
    addTan('loding',1);
    $.ajax({
        url: "?module=system_rules",
        type: 'POST',
        datatype:'text',
        data:{
            update_app:row.name,
            action: 'update_rules'
        },
        success: function(data){
            closetanDiv('loding');
            if(data=='ok'){
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
            }else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

function import_roles(msg)
{
    if ($('#import_rules_div').length <= 0) {
        $(document.body).append("<div id='import_rules_div' class='ngtos_window_600'></div>");
    }
    open_window('import_rules_div','system_rules','rule_import_window',msg,'true');
}

/*function import_more_roles(){
    $('#window_cover').css("display","block");
    var fval = document.getElementById("file").value;
    if(fval == "")
    {
        ngtosPopMessager("error", "请选择一个导入文件");
        $('#window_cover').css("display","none");
        return;
    }

    var rname = $('#mrname').html();
    if(rname == "应用识别特征库")
        var rule_name = "aise";
    else if(rname == "病毒库")
        var rule_name = "av";
    else if(rname == "入侵防御特征库")
        var rule_name = "ips";
    else if(rname == "URL分类库")
        var rule_name = "url";

    $.ajaxFileUpload({
        url:'?module=system_rules&action=roles_import',
        type: 'POST',
        secureuri:false,//secureuri是否启用安全提交，默认为false
        fileElementId:'file',//fileElementId表示文件域ID
        dataType: 'text',
        async:false,
        data:{rule_type:rule_name},
        success: function (data,textstatus){
            if(data.indexOf("parent.window.location")>=0)
            {
                ngtosPopMessager("error", "登陆超时，请重新登陆!", "login", true);
            }else if(data == "ok"){
                $('#window_cover').css("display","none");
                $("#import_rules_div").window("close");
                ngtosPopMessager("info", "操作成功！");
                $('#tt').datagrid('reload');
            }else{
                if(data.indexOf('102684') > -1)
                {
                    var str = data.split(':')[1];
                    ngtosPopMessager("info", str);
                }
                else
                    ngtosPopMessager("error", data);
                $('#window_cover').css("display","none");
            }
        }
    })
}*/

function check_ftp(tag){
    if(tag == 0)
    {
        $('#user').hide();
        $('#passwd').hide();
        if($('#ipaddr').val() == "" || $('#ipaddr').val() == "192.168.1.1")
            $('#ipaddr').val("www.ngtos.com/192.168.1.1");
        if($('#ipaddr').val() == "www.ngtos.com/192.168.1.1")
            $('#ipaddr').css('color', "#ccc");

        $('#ipaddr').unbind('focus');
        $('#ipaddr').focus(function(){
            if($(this).val() == "www.ngtos.com/192.168.1.1"){
                $(this).val("");
                $(this).css('color', "#000");
            }
        })
        $('#ipaddr').unbind('blur');
        $('#ipaddr').blur(function(){
            if($(this).val() == ""){
                $(this).val("www.ngtos.com/192.168.1.1");
                $(this).css('color', "#ccc");
            }
        })
    }
    else
    {
        $('#user').show();
        $('#passwd').show();
        if($('#ipaddr').val() == "" || $('#ipaddr').val() == "www.ngtos.com/192.168.1.1")
            $('#ipaddr').val("www.ngtos.com/192.168.1.1");
        if($('#ipaddr').val() == "www.ngtos.com/192.168.1.1")
            $('#ipaddr').css('color', "#ccc");

        $('#ipaddr').unbind('focus');
        $('#ipaddr').focus(function(){
            if($(this).val() == "www.ngtos.com/192.168.1.1"){
                $(this).val("");
                $(this).css('color', "#000");
            }
        })
        $('#ipaddr').unbind('blur');
        $('#ipaddr').blur(function(){
            if($(this).val() == ""){
                $(this).val("www.ngtos.com/192.168.1.1");
                $(this).css('color', "#ccc");
            }
        })
    }
}

function check_time(tag){
    if(tag == 1)
    {
        $("#week_info").show();
        $("#month_info").hide();
        $("#day_info").hide();
        $("#interval_info").hide();
    }else if(tag == 2){
        $("#day_info").show();
        $("#week_info").hide();
        $("#month_info").hide();
        $("#interval_info").hide();
    }else if(tag == 3){
        $("#interval_info").show();
        $("#week_info").hide();
        $("#month_info").hide();
        $("#day_info").hide();
    }else{
        $("#month_info").show();
        $("#week_info").hide();
        $("#day_info").hide();
        $("#interval_info").hide();
    }
}

function add_roles(msg){
    var row=$('#tt').datagrid('getSelected');
    if(row){
        edit_rules(row.name,row.type,row.time,row.ip,row.ftp,row.tmp,row.state,msg);
    }
}

function edit_rules(rname, rtype, rtime, rip, rftp, rtmp, rstate, msg){
    ip_num = 0;

    if(rtype)
        roles_tag = 2;
    else
        roles_tag = 1;
    if ($('#rule_div').length <= 0) {
        $(document.body).append("<div id='rule_div' class='ngtos_window' style='width:600px;'></div>");
    }
    open_window('rule_div','system_rules','rules_window',msg,'true');

    param[0] = rname;
    param[1] = rtype;
    param[2] = rtime;
    param[3] = rip;
    param[4] = rftp;
    param[5] = rtmp;
    param[6] = rstate;
}

function add_more_roles(tag){
    if( $('#ipaddr').checkInput( { cl : ['notnull']} ) == false )  return false;
    var rtype = $('input:radio[name="role_type"]:checked').val();

    if(rtype == "ftp"){
        var uname = $('#user_name').val();
        if(uname == '')
            uname = 'anonymous';
        if(uname != 'anonymous')
        {
            if( $('#pass_name').checkInput( { cl : ['notnull']} ) == false )  return false;
        }
        var len2 = getStrLength(uname);
        if(len2 > 63){
            ngtosPopMessager("error", $LANG.THE_MAXMUM_NUMBER_OF_CHRACTERS);
            return false;
        }
        var len3 = getStrLength($('#pass_name').val());
        if(len3 > 63){
            ngtosPopMessager("error", $LANG.PASSWORD_MNOCNMT);
            return false;
        }
    }

    var date_type = $('input:radio[name="time_type"]:checked').val();
    var date_val;
    var dateTime;
    if(date_type == "date"){
        date_val = $('#date_info').val();
        dateTime = $('#date_time').val();
    }else if(date_type == "week"){
        date_val = $('#week_st').val();
        dateTime = $('#week_time').val();
    }else if(date_type == "day")
        dateTime = $('#day_time').val();
    else{
        dateTime = $('#inter_min').val();
        if(dateTime.length == 1)
            dateTime = "0" + dateTime;
    }

        if($('#ipaddr').val() == "www.ngtos.com/192.168.1.1"){
            $('#ipaddr').css('color', "#000");
            $('#ipaddr').val("");
        }

    if( $('#ipaddr').checkInput( { cl : ['must','domain']} ) == false )
        return false;
    var sip = $('#ipaddr').val();
    for(i=1;i<=5;i++){
        if(typeof($('#ip_addr'+i).val()) == "undefined")
            continue;
        if(rtype == "ftp"){
            if( $('#ip_addr'+i).checkInput( { cl : ['must','ip']} ) == false )
                return false;
        }else{
            if( $('#ip_addr'+i).checkInput( { cl : ['must','domain']} ) == false )
                return false;
        }
        sip = sip + "," + $('#ip_addr'+i).val();
    }

    var rname = $('#rname').html();
    if(rname == $LANG.APPLICATION_RFL)
        var rule_name = "aise";
    else if(rname == $LANG.VIRUS_DATABASE)
        var rule_name = "av";
    else if(rname == $LANG.INTRUSION_PFL)
        var rule_name = "ips";
    else if(rname == $LANG.URL_DATABASE)
        var rule_name = "url";

    $.ajax({
        url: "?module=system_rules",
        type: 'POST',
        datatype:'text',
        data:{
            role_name:rule_name,
            role_type:rtype,
            time_type:date_type,
            ftp_user:uname,
            ftp_pass:$('#pass_name').val(),
            server_ip:sip,
            pri_date:date_val,
            pri_time:dateTime,
            roles_tag:tag,
            action: 'add_rules'
        },
        success: function(data){
              if(data=='ok'){
                $("#rule_div").window("close");
                $('#tt').datagrid('reload');
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

function disable_app_roles(){
    var row=$('#tt').datagrid('getSelected');
    $.ajax({
        url: "?module=system_rules",
        type: 'POST',
        datatype:'text',
        data:{
            dis_name:row.name,
            action: 'rules_dis'
        },
        success: function(data){
            if(data=='ok'){
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function enable_app_roles(){
    var row=$('#tt').datagrid('getSelected');
    $.ajax({
        url: "?module=system_rules",
        type: 'POST',
        datatype:'text',
        data:{
            role_name:row.name,
            app_name:row.name,
            action: 'app_rules'
        },
        success: function(data){
            if(data=='ok'){
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

/*function check_stype(tag)
{
    if(tag == 0){
        $('#rmethod').hide();
        $('#raddr').hide();
        $('#user').hide();
        $('#passwd').hide();
        $('#user').hide();
        $('#passwd').hide();
    }
    else{
        $('#rmethod').show();
        $('#raddr').show();
        var rtype = $('input:radio[name="role_type"]:checked').val();
        if(rtype == "ftp"){
            $('#user').show();
            $('#passwd').show();
        }
        else{
            $('#user').hide();
            $('#passwd').hide();
        }
    }
}*/
/*
function add_default_roles()
{
    var date_type = $('input:radio[name="time_type"]:checked').val();
    var date_val;
    var dateTime;
    if(date_type == "date")
    {
        date_val = $('#date_info').val();
        dateTime = $('#date_time').val();
    }
    else if(date_type == "week")
    {
        date_val = $('#week_st').val();
        dateTime = $('#week_time').val();
    }
    else if(date_type == "day")
        dateTime = $('#day_time').val();
    else
    {
        dateTime = $('#inter_min').val();
        if(dateTime.length == 1)
            dateTime = "0" + dateTime;
    }

    var rname = $('#rname').html();
    if(rname == "应用识别特征库")
        var rule_name = "aise";
    else if(rname == "病毒库")
        var rule_name = "av";
    else if(rname == "入侵防御特征库")
        var rule_name = "ips";
    else if(rname == "URL分类库")
        var rule_name = "url";
    $.ajax({
        url: "?module=system_rules",
        type: 'POST',
        datatype:'text',
        data:{
            role_name:rule_name,
            time_type:date_type,
            pri_date:date_val,
            pri_time:dateTime,
            action: 'modify_default_rules'
        },
        success: function(data, textStatus){
            if(data.indexOf("parent.window.location")>=0)
            {
                ngtosPopMessager("error", "登录超时，请重新登录!", "login");
            }
            else if(data=='ok'){
                $("#rule_div").window("close");
                $('#tt').datagrid('reload');
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    })
}*/
