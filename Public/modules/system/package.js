function setToolBar(){
     var sel_row = $('#tt').datagrid('getChecked');
     if (sel_row.length < 1){
         //$('#icon_up').linkbutton('disable');
//         $('#icon_edit').linkbutton('disable');
     }
     else if (sel_row.length == 1)
     {
         //$('#icon_up').linkbutton('enable');
//         $('#icon_edit').linkbutton('enable');
     }
     else if (sel_row.length > 1)
     {
         //$('#icon_up').linkbutton('enable');
//         $('#icon_edit').linkbutton('disable');
     }
 }
 
 function edit_package(){
     
     if ($('#package_div').length <= 0) {
        $(document.body).append("<div id='package_div' class='ngtos_window' style='width:600px;'></div>");
    }
    open_window('package_div','System/Package','packageWindow',$LANG.EDIT);
 }
 //方式转换
 function check_ftp(tag){
        $('#user').show();
        $('#passwd').show();
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
//时间转换
function check_time(tag){

    if(tag == 1){
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

function add_serip(){
    var tbl = $('#serv_addr')[0];
    var lastRow = tbl.rows.length;
    if(lastRow == 2){
        ngtosPopMessager("error", $LANG.SERVER_ADDRESS_NUMBER_UP_TO_2);
        return;
    }
    var iteration = lastRow+1;
    var row = tbl.insertRow(lastRow);

    var cellCenter = row.insertCell(0);
    var tb1="<img src='"+NG_PATH+"Public/images/icon/mini_clear.gif' width='10' height='10' style='cursor:pointer;' onClick='del_serip(this)'/>&nbsp;";
    var tb2="<input type='text' class='ngtos_input' style='width:180px;' maxlength='63'' id='ip_addr"+ ip_num +"' name='ip_addr"+ ip_num +"'>&nbsp;";
    var tb3="<img src='"+NG_PATH+"Public/images/icon/mini_add.gif' width='10' height='10' style='cursor:pointer;' onClick='add_serip()'/>";
    cellCenter.innerHTML=tb1 + tb2 + tb3;
    if(lastRow < 8){
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

function add_more_roles(){

    if(confVal == 1 && vsidVal == 0){
        var rtype = $('input:radio[name="role_type"]:checked').val();
        var uname = $('#user_name').val();
        if(uname == '')
            uname = 'anonymous';
        if(uname != 'anonymous')
        {
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
        if($('#ipaddr').val() == "www.ngtos.com/192.168.1.1") {
            $('#ipaddr').css('color', "#000");
            $('#ipaddr').val("");
        }
        var sip = $('#ipaddr').val();
        for(i=1;i<=5;i++)
        {
            if(typeof($('#ip_addr'+i).val()) == "undefined")
                continue;
            sip = sip + "," + $('#ip_addr'+i).val();
        }

        $.ajax({
            url: "?c=System/Package&a=addPackge",
            type: 'POST',
            datatype:'text',
            data:{
                role_type:rtype,
                time_type:date_type,
                ftp_user:uname,
                ftp_pass:$('#pass_name').val(),
                server_ip:sip,
                pri_date:date_val,
                pri_time:dateTime
            },
            success: function(data){
               if(data == '0'){
                    $("#package_div").window("close");
                    $('#tt').datagrid('reload');
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
        })
    }else{
        ngtosPopMessager("error", $LANG.ONLY_OPEN_THE_PERMISSIONS);
        return false;
    }
}

function enable_app_roles(){
    
    $.ajax({
        url: "?c=System/Package&a=enablePacksge",
        type: 'POST',
        datatype:'text',
        success: function(data){
        
            if(data=='0'){
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
                parent.window.location.reload();
            }else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

function disable_app_roles(){
    
    $.ajax({
        url: "?c=System/Package&a=disablePackage",
        type: 'POST',
        datatype:'text',
        success: function(data){
            
            if(data=='0'){
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
                parent.window.location.reload();
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function update_more_package(){
    
    var row=$('#tt').datagrid('getSelected');
    if(row && row.name !=null){
        ngtosPopMessager("confirm", $LANG.BE_SURE_TO_UPDATE, function(r) {
            if(r){
                $.ajax({
                    url: "?c=System/Package&a=updatePackage",
                    type: 'POST',
                    datatype:'text',
                    data:{
                        update_app:row.name
                    },
                    success: function(data){
                        if(data=='0'){
                            ngtosPopMessager("success", $LANG.OPERATION_SUCCESS);
                            $('#tt').datagrid('reload');
                        }
                        else{
                            ngtosPopMessager("error", data);
                        }
                    }
                })
            }
         });
    }else{
        $.ajax({
            url: "?c=System/Package&a=update_more_package",
            type: 'POST',
            datatype:'text',
            success: function(data){

                if(data=='0'){
                    ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                    $('#tt').datagrid('reload');
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
       });
    }
}

function reset_more_roles(){
    
    if(confVal == 1 && vsidVal == 0){
        $.ajax({
            url: "?c=System/Package&a=resetPackage",
            type: 'POST',
            datatype:'text',
            success: function(data){

                if(data=='0'){
                    ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                    $("#package_div").window("close");
                    $('#tt').datagrid('reload');
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    }else{
         ngtosPopMessager("error", $LANG.ONLY_OPEN_THE_PERMISSIONS);
         return false;
    }
}
function import_more_package(){
    
    if ($('#package_div').length <= 0) {
        $(document.body).append("<div id='package_div' class='ngtos_window' style='width:600px;'></div>");
    }
    open_window('package_div','System/Package','windowShow&w=system_package_inport',$LANG.IMPORT);
    }

function update_package(){
    
    $.ajax({
        url: "?c=System/Package&a=update_more_package",
        type: 'POST',
        datatype:'text',
        success: function(data){
            
            if(data=='0'){
                $('#tt').datagrid('reload');
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//导入数据
function import_package(){
    var dest = $("#text").val();
    var fval = document.getElementById("file").value;
    if(fval == "")
    {
        ngtosPopMessager("error", $LANG.PLEASE_SELECT_AIFSAIF);
        $('#window_cover').css("display","none");
        return;
    }
    $.ajaxFileUpload({
        url:'?c=System/Package&a=packageImport',
        type: 'POST',
        secureuri:false,//secureuri是否启用安全提交，默认为false
        fileElementId:'file',//fileElementId表示文件域ID
        data:{
            dest:dest
        },
        dataType: 'text',
        async:false,
        success: function (data){
            if(data == "0"){
                closeWindow('package_div');
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
            }else{
                if(data.indexOf('102684') > -1)
                {
                    var str = data.split(':')[1];
                    ngtosPopMessager("info", str);
                }
                else
                    ngtosPopMessager("error", data);
            }
        }
    })
}