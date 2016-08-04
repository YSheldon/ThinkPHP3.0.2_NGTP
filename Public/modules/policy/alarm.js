var auto_add_tag = "off";
function changswitch(obj)
{
    if (obj.title == 'close') {
        obj.src = NG_PATH+"Public/images/image/stop.png";
        obj.title = 'open';
        auto_add_tag = "off";
        $("#email_username").textbox('disable');	
        $("#email_pass").textbox('disable');
        $('#email_username').textbox({'required':true});
        $('#email_pass').textbox({'required':true});
    }
    else
    {
        obj.src = NG_PATH+"Public/images/image/start.png";
        obj.title = 'close';
        auto_add_tag = "on";
        $("#email_username").textbox('enable');	
        $("#email_pass").textbox('enable');	
        $('#email_username').textbox({'required':true});
        $('#email_pass').textbox({'required':true});
    }
}
function setAlarmToolBar()
{
    var sel_row = $('#tt').datagrid('getChecked');
    if (sel_row.length < 1)
    {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    }
    else if (sel_row.length == 1)
    {
        $('#icon_edit').linkbutton('enable');
        $('#icon_del').linkbutton('enable');
        if (sel_row[0].type != "console" && sel_row[0].type != "snmp")
            $('#icon_edit').linkbutton('enable');
        else
            $('#icon_edit').linkbutton('disable');
    }
    else if (sel_row.length > 1)
    {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('enable');
    }
}
function add_alarm(msg){
     sign = 'add';
     alarm_tag = 1;
    if ($('#alarm_div').length <= 0) {
        $(document.body).append("<div id='alarm_div' class='ngtos_window' style='width:500px;'></div>");
    }
    open_window("alarm_div", 'Policy/Alarm', 'windowShow&w=policy_alarm_window', msg);
}

function edit_alarm(name, type, detail, msg){
     sign = 'edit';
    if (name == '') {
        var rows = $('#tt').datagrid('getSelections');
        detail = rows[0].detail;
        detail = detail.replace(/\'/g, "‘");
        name = rows[0].noticename;
        type = rows[0].type;
    }
    alarm_tag = 2;

    param[0] = name;
    param[1] = type;
    param[2] = detail;
    if ($('#alarm_div').length <= 0) {
        $(document.body).append("<div id='alarm_div' class='ngtos_window' style='width:500px;'></div>");
    }
    open_window("alarm_div", 'Policy/Alarm', 'windowShow&w=policy_alarm_window', msg);
}

function delAlarm(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r){
                var ids1 = [];

                var rows = $('#tt').datagrid('getSelections');
                for (var i = 0; i < rows.length; i++) {
                    ids1.push(rows[i].noticename);
                }
                var name = ids1.join('#');

                $.ajax({
                    url: "?c=Policy/Alarm&a=del",
                    type: 'POST',
                    datatype: 'text',
                    data: {
                        delItems: name,
                        mod:'alarm notice'
                    },
                    success: function(data) {
                        if (data.indexOf("parent.window.location") >= 0){
                            ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
                        }else if (data == '0') {
                            $('#tt').datagrid('reload');
                        }else {
                            ngtosPopMessager("error", data, "", true);
                            $('#tt').datagrid('reload');
                        }
                    }
                });
            }
        }, true);
}

function test_alarm(){
    $.ajax({
        url: "?c=Policy/Alarm&a=callFun",
        data:{
            fun:'simpleHandle',
            mod:'alarm notice',
            act:'test'
        },
        type: 'post',
        success: function(data) {
            if (data.indexOf("parent.window.location") >= 0){
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }else if (data == '0') {
                $('#tt').datagrid('reload');
            }else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    });
}

/*获取管理，系统，安全等选项框的公共方法
 * id 所选值的id值
 * idVal 所选值中的id
 * */
function mangeWay(id,idVal){
    var policyID = "'#"+idVal+"'";
    var act = idVal.replace(id,'Add');
    if ($(eval(policyID)).attr("checked") == "checked") {
        var tag = "on";
    } else {
        var tag = "off";
    }
    $.ajax({
        url: "?c=Policy/Alarm&a="+act,
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0)
            {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }
            else if (data == '0') {
                $('#tt').datagrid('reload');
            }
            else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}

/*function event_manage(id){
    var policyID = "'" + "#manage" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked") {
        var tag = "on";
        //alert(tag);
    } else {
        var tag = "off";
        //alert(tag);
    }
    $.ajax({
        url: "?c=Policy/Alarm&a=manageAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0)
            {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }
            else if (data == '0') {
                $('#tt').datagrid('reload');
            }
            else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_system(id){
    var policyID = "'" + "#system" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked") {
        var tag = "on";
    } else {
        var tag = "off";
    }
    $.ajax({
        url: "?c=policy/Alarm&a=systemAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0)
            {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }
            else if (data == '0') {
                $('#tt').datagrid('reload');
            }
            else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_security(id){
    var policyID = "'" + "#security" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked")
        var tag = "on";
    else
        var tag = "off";
    $.ajax({
        url: "?c=Policy/Alarm&a=securityAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0){
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }else if (data == '0') {
                $('#tt').datagrid('reload');
            }else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_policy(id){
    var policyID = "'" + "#policy" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked")
        var tag = "on";
    else
        var tag = "off";
    $.ajax({
        url: "?c=Policy/Alarm&a=policyAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0)
            {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }
            else if (data == '0') {
                $('#tt').datagrid('reload');
            }
            else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_comm(id){
    var policyID = "'" + "#call" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked")
        var tag = "on";
    else
        var tag = "off";
    $.ajax({
        url: "?c=policy/Alarm&a=callAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0){
                ngtosPopMessager("error",$LANG.LOGIN_TIMEOUT, "login", true);
            }else if (data == '0') {
                $('#tt').datagrid('reload');
            }else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_hardware(id){
    var policyID = "'" + "#hardware" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked")
        var tag = "on";
    else
        var tag = "off";
    $.ajax({
        url: "?c=Policy/Alarm&a=hardwareAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0){
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }else if (data == '0') {
                $('#tt').datagrid('reload');
            }else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_recover(id){
    var policyID = "'" + "#recover" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked")
        var tag = "on";
    else
        var tag = "off";
    $.ajax({
        url: "?c=Policy/Alarm&a=recoverAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0)
            {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }
            else if (data == '0') {
                $('#tt').datagrid('reload');
            }
            else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}
function event_test(id){
    var policyID = "'" + "#test" + id + "'";
    if ($(eval(policyID)).attr("checked") == "checked")
        var tag = "on";
    else
        var tag = "off";
    $.ajax({
        url: "?c=Policy/Alarm&a=testAdd",
        type: 'POST',
        datatype: 'text',
        data: {
            noticeid: id,
            tag: tag
        },
        success: function(data, textStatus) {
            if (data.indexOf("parent.window.location") >= 0){
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
            }else if (data == '0') {
                $('#tt').datagrid('reload');
            }else {
                ngtosPopMessager("error", data, "", true);
            }
        }
    })
}*/

function add_alarm_conf(tag){
    var alarm_name = $('#alarm_name').val();
    if(alarm_name==""){
        ngtosPopMessager("error", $LANG.ALARM_NAME_IS_NOT_EMPTY);
        return false;
    }
    var alarmType = $('input[name="alarm_type"]:checked').val();
    if (alarmType == 1){
        var allEmail = "";
        var serv_addr = $("#serv_addr" ).val();
        var serv_port = $("#serv_port" ).val();
        if(serv_addr == ""){
            ngtosPopMessager("error", $LANG.SERVER_ADDRESS_IS_NOT_EMPTY);
            return false;
        }
        if(serv_port == ""){
            ngtosPopMessager("error", $LANG.SERVER_PORT_IS_NOT_EMPTY);
            return false;
        }
        $('#alert_email option').each(function() {
            allEmail += $(this).val() + " ";
        });
        var emailRec = $.trim(allEmail);
        if (emailRec == ""){
            ngtosPopMessager("error", $LANG.RECIPIENT_ADDRESS_IS_NOT_EMPTY);
            $('#alert_email').focus();
            return false;
        }else
            emailRec = "'" + emailRec + "'";
        
        if (auto_add_tag == "on"){
            //if( $('#email_username').checkInput( { cl : ['must','allowname','Length:1-127']} ) == false )  return false;
            //if( $('#email_pass').checkInput( { cl : ['must','allowname','Length:1-31']} ) == false )  return false;
            var email_username = $('#email_username').val();
            var email_pass = $('#email_pass').val();
            if(email_username ==""){
                ngtosPopMessager("error", $LANG.THE_SENDER_IS_NOT_EMPTY);
                return false;
            }
            if(email_pass ==""){
                ngtosPopMessager("error", $LANG.USER_PASSWORD_IS_NOT_EMPTY);
                return false;
            }
        }
        //if( $('#email_subject').checkInput( { cl : ['must','allowname','Length:1-127']} ) == false )  return false;
        var email_subject = $('#email_subject').val();
        if(email_subject ==""){
             ngtosPopMessager("error", $LANG.THE_SUBJECT_OTMINE);
             return false;
        }

        $.ajax({
            url: "?c=Policy/Alarm&a=mailAdd",
            type: 'POST',
            datatype: 'text',
            data: {
                name: $('#alarm_name').val(),
                srvaddr: $('#serv_addr').val(),
                srvport: $('#serv_port').val(),
                mailaddr: emailRec,
                auth: auto_add_tag,
                username: $('#email_username').val(),
                password: $('#email_pass').val(),
                subject: $('#email_subject').val(),
                alarm_tag: tag
            },
            success: function(data, textStatus) {
                ;
                if (data.indexOf("parent.window.location") >= 0){
                    ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login");
                }else if (data == '0') {
                    $("#alarm_div").window("close");
                    $('#tt').datagrid('reload');
                }else {
                    ngtosPopMessager("error", data);
                }
            }
        })
    }else if (alarmType == 2){
        var voice_frequ = $( "#voice_frequ" ).val();
        var voice_length = $( "#voice_length" ).val();
        var voice_number = $( "#voice_number" ).val();
        var voice_interval = $( "#voice_interval" ).val();
        if(voice_frequ ==""){
            ngtosPopMessager("error", $LANG.OUTPUT_FREQUENCY_INN);
            return false;
        }
        if(voice_length ==""){
            ngtosPopMessager("error", $LANG.SOUND_LENGTH_INE);
            return false;
        }
        if(voice_number ==""){
            ngtosPopMessager("error", $LANG.STRESS_TINE);
            return false;
        }
        if(voice_interval ==""){
            ngtosPopMessager("error", $LANG.THE_TWO_TIINE);
            return false;
        }
        $.ajax({
            url: "?c=Policy/Alarm&a=beepAdd",
            type: 'POST',
            datatype: 'text',
            data: {
                name: $('#alarm_name').val(),
                freq: $('#voice_frequ').val(),
                length: $('#voice_length').val(),
                reps: $('#voice_number').val(),
                delay: $('#voice_interval').val(),
                alarm_tag: tag
            },
            success: function(data, textStatus) {
                if (data.indexOf("parent.window.location") >= 0){
                    ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login");
                }else if (data == '0') {
                    $("#alarm_div").window("close");
                    $('#tt').datagrid('reload');
                }else {
                    ngtosPopMessager("error", data);
                }
            }
        })
    }else if (alarmType == 3){
//		if( $('#bios_name').checkInput( { cl : ['must','allowname','Length:1-63']} ) == false )  return false;
//		if( $( "#bios_addr" ).checkInput( { cl : ['must','ip']} ) == false )return false;
        var bios_name = $('#bios_name').val();
        var bios_addr = $("#bios_addr").val();
        if(bios_name ==""){
            ngtosPopMessager("error", $LANG.HOST_NAME_IS_NOT_EMPTY);
            return false;
        }
        if(bios_addr ==""){
            ngtosPopMessager("error", $LANG.HOST_AINE);
            return false;
        }
        $.ajax({
            url: "?c=Policy/Alarm&a=biosAdd",
            type: 'POST',
            datatype: 'text',
            data: {
                name: $('#alarm_name').val(),
                hostname: $('#bios_name').val(),
                ipaddr: $('#bios_addr').val(),
                alarm_tag: tag
            },
            success: function(data, textStatus) {
                if (data.indexOf("parent.window.location") >= 0)
                {
                    ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login");
                }
                else if (data == '0') {
                    $("#alarm_div").window("close");
                    $('#tt').datagrid('reload');
                }
                else {
                    ngtosPopMessager("error", data);
                }
            }
        })
    }else{
        if (alarmType == 4) {
            //var submit_post = "consoleAdd";
            $.ajax({
                url: "?c=Policy/Alarm&a=consoleAdd",
                type: 'POST',
                datatype: 'text',
                data: {
                    name: $('#alarm_name').val(),
                    alarm_tag: tag
                },
                success: function(data, textStatus) {
                    if (data.indexOf("parent.window.location") >= 0)
                    {
                        ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login");
                    }
                    else if (data == '0') {
                        $("#alarm_div").window("close");
                        $('#tt').datagrid('reload');
                    }
                    else {
                        ngtosPopMessager("error", data);
                    }
                }
            })
        } else if(alarmType == 6){
            var num = /^[0-9]{1,15}$/;
            if(!num.test($('#phone').val())){
                ngtosPopMessager('info',$LANG.NSBGTC);
                return;
            }
            $.ajax({
                url: "?c=Policy/Alarm&a=smsAdd",
                type: 'POST',
                datatype: 'text',
                data: {
                    name: $('#alarm_name').val(),
                    alarm_tag: tag,
                    phonenum:$('#phone').val()
                },
                success: function(data, textStatus) {
                    if (data.indexOf("parent.window.location") >= 0)
                    {
                        ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login");
                    }
                    else if (data == '0') {
                        $("#alarm_div").window("close");
                        $('#tt').datagrid('reload');
                    }
                    else {
                        ngtosPopMessager("error", data);
                    }
                }
            })
        }else {
            $.ajax({
                url: "?c=Policy/Alarm&a=snmpAdd",
                type: 'POST',
                datatype: 'text',
                data: {
                    name: $('#alarm_name').val(),
                    alarm_tag: tag
                },
                success: function(data, textStatus) {
                    if (data.indexOf("parent.window.location") >= 0)
                    {
                        ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login");
                    }
                    else if (data == '0') {
                        $("#alarm_div").window("close");
                        $('#tt').datagrid('reload');
                    }
                    else {
                        ngtosPopMessager("error", data);
                    }
                }
            })
        }
    }
}

function beep_default(){
    $('#voice_frequ').textbox('setValue',"440");
    $('#voice_length').textbox('setValue',"200");
    $('#voice_number').textbox('setValue',"5");
    $('#voice_interval').textbox('setValue',"100");
}

function change_type(num) {
    var i, j;
    if (num == 1){
        $("#name1").css("display", "");
        for (i = 1; i < 8; i++){
            eval($('#email' + i).css("display", ""));
        }
        for (j = 1; j < 6; j++){
            eval($('#voice' + j).css("display", "none"));
        }
        $('#bios1').css("display", "none");
        $('#bios2').css("display", "none");
        $('#bios3').css('display','none');
        $("#name1").css("display", "");
    }else if (num == 2){
        for (i = 1; i < 8; i++){
            eval($('#email' + i).css("display", "none"));
        }
        $("#name1").css("display", "");
        
        for (j = 1; j < 6; j++){
            eval($('#voice' + j).css("display", ""));
        }
        $('#bios1').css("display", "none");
        $('#bios2').css("display", "none");
        $('#bios3').css('display','none');
    }else if (num == 3){
        $("#name1").css("display", "");
        for (i = 1; i < 8; i++){
            eval($('#email' + i).css("display", "none"));
        }
        for (j = 1; j < 6; j++){
            eval($('#voice' + j).css("display", "none"));
        }
        $('#bios1').css("display", "");
        $('#bios2').css("display", "");
        $('#bios3').css('display','none');
    }else if(num == 6){
        $("#name1").css("display", "");
        for (i = 1; i < 8; i++){
            eval($('#email' + i).css("display", "none"));
        }
        for (j = 1; j < 6; j++){
            eval($('#voice' + j).css("display", "none"));
        }
        $('#bios1').css("display", "none");
        $('#bios2').css("display", "none");
        $('#bios3').css('display','');
    }else{
        $("#name1").css("display", "");
        for (i = 1; i < 8; i++){
            eval($('#email' + i).css("display", "none"));
        }
        for (j = 1; j < 6; j++){
            eval($('#voice' + j).css("display", "none"));
        }
        $('#bios1').css("display", "none");
        $('#bios2').css("display", "none");
        $('#bios3').css('display','none');
    }
}

function email_adtolist(){
    var alert_email = $('#alert_email').val();
    var alert_email_tex = $('#alert_email_tex').val();
    var len = $('#alert_email option').length;
    if (len >= 20){
        ngtosPopMessager("error", $LANG.NUMBER_OF_RSNE);
        return false;
    }

    if (alert_email_tex == ""){
        ngtosPopMessager("error", $LANG.EMAIL_ADDRESS_CNBE);
        $('#alert_email_tex').focus();
        return false;
    }
    var found = false;
    $('#alert_email option').each(function() {
        if (alert_email_tex == $(this).val()){
            found = true;
            return false;
        }
    });

    if (found != true){
        var option = "<option value='" + alert_email_tex + "'>" + alert_email_tex + "</option>";
        $('#alert_email').prepend(option);
    }
}

function email_delflist(){
    
    $('#alert_email option:selected').each(function() {
            $(this).remove();
    });

}

function clearItem(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Policy/Alarm&a=clean&mod="+encodeURI('alarm notice'),
                type: 'GET',
                success: function(data) {
                    if (data == '0') {
                        $('#tt').datagrid('reload');
                    }else if (data.indexOf("parent.window.location") >= 0){
                        ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT, "login", true);
                    }else {
                        ngtosPopMessager("error", data, "", true);
                    }
                }
            });
        }
    }, true);

}

function note_alarm(){
    location.href = "?c=Policy/Alarm&a=alarm_show&url=1";
}

function NoteType(newValue,oldValue){
    if(!newValue) {
        newValue = $('#type').combobox('getValue');
    }
    if(newValue=="ismg"){
        $(".tr1").css("display", "");
        $(".trismg").css("display", "");
        $(".trdb").css("display", "none");
        $(".trweb").css("display", "none");
        $(".trtime").css("display", "");
        $(".trhttp").css("display", "none");
        $(".trbutton").css("display", "");
    }else if(newValue=="db"){
        $(".trdb").css("display", "");
        $(".tr1").css("display", "");
        $(".trismg").css("display", "none");
        $(".trweb").css("display", "none");
        $(".trtime").css("display", "");
        $(".trhttp").css("display", "none");
        $(".trbutton").css("display", "");
    }else if(newValue=="webservice"){
        $(".trweb").css("display", "");
        $(".trtime").css("display", "");
        $(".trismg").css("display", "none");
        $(".trdb").css("display", "none");
        $(".tr1").css("display", "none");
        $(".trhttp").css("display", "none");
        $(".trbutton").css("display", "");
    }else if(newValue=="http"){
        $(".trhttp").css("display", "");
        $(".trtime").css("display", "");
        $(".tr1").css("display", "none");
        $(".trdb").css("display", "none");
        $(".trismg").css("display", "none");
        $(".trweb").css("display", "none");
        $(".trbutton").css("display", "");
    }else{
        $(".tr1").css("display", "none");
        $(".trdb").css("display", "none");
        $(".trismg").css("display", "none");
        $(".trweb").css("display", "none");
        $(".trtime").css("display", "none");
        $(".trhttp").css("display", "none");
        $(".trbutton").css("display", "none");
    }
}

function webType(newValue,oldValue){
    if(!newValue) {
        newValue = $('#soap_ver').combobox('getValue');
    }
    if(newValue=="soap1.1"){
        $("#soapaction").textbox({disabled:false});
    }else{
        $("#soapaction").textbox({disabled:true});
    }
}
function addNote(){
    //短信发送方式名称
    var type = $("#type").combobox('getValue');
    //超时时间
    var timeout = $("#timeout").textbox('getValue');
    if(timeout==""){
         ngtosPopMessager("error", "超时时间不能为空");
         return false;
    }
    if(type=="ismg"){
        //短信网关协议类型
        var ismg_type = $("#ismg_type").combobox('getValue');
        //短信网关ip地址
        var ip = $("#ip").textbox('getValue');
        if(ip==""){
            ngtosPopMessager("error", "服务器地址不能为空");
            return false;
        }
        //短信网关端口
        var port = $("#port").textbox('getValue');
        if(port==""){
            ngtosPopMessager("error", "网关端口不能为空");
            return false;
        }
        //短信网关账号
        var username = $("#username").textbox('getValue');
        if(username==""){
            ngtosPopMessager("error", "短信网关账号不能为空");
            return false;
        }
        //短信网关账号密码
        var password = $("#password").textbox('getValue');
        if(password==""){
            ngtosPopMessager("error", "短信网关账号密码不能为空");
            return false;
        }
        //sp接入号
        var sp_id = $("#sp_id").textbox('getValue');
        //业务代码
        var service_id = $("#service_id").textbox('getValue');
        //企业代码
        var enterprise_id = $("#enterprise_id").textbox('getValue');
    }else if(type=="db"){
        //数据库类型
        var db_type = $("#db_type").combobox('getValue');
        //短信网关ip地址
        var ip = $("#ip").textbox('getValue');
        if(ip==""){
            ngtosPopMessager("error", "数据库所在主机ip地址不能为空");
            return false;
        }
        //短信网关端口
        var port = $("#port").textbox('getValue');
        if(port==""){
            ngtosPopMessager("error", "数据库端口号不能为空");
            return false;
        }
        //数据库名
        var db_name = $("#db_name").textbox('getValue');
        if(db_name==""){
            ngtosPopMessager("error", "数据库名称不能为空");
            return false;
        }
        //短信网关账号
        var username = $("#username").textbox('getValue');
        if(username==""){
            ngtosPopMessager("error", "登录数据库账号不能为空");
            return false;
        }
        //短信网关账号密码
        var password = $("#password").textbox('getValue');
        if(password==""){
            ngtosPopMessager("error", "登录数据库账号密码不能为空");
            return false;
        }
         //sql语句模板
        var mess = $("#dbmoduleViews").textbox('getValue');
        var charset = $("#charset").textbox('getValue');
    }else if(type=="webservice"){
        //webservice版本
        var soap_ver = $("#soap_ver").combobox('getValue');
        //字符编码方式
        var charset = $("#webcharset").combobox('getValue');
        //url地址
        var url = $("#url").textbox('getValue');
        if(url==""){
            ngtosPopMessager("error", "url地址不能为空");
            return false;
        }
        //soap配置
        if(soap_ver=="soap1.1"){
            var soapaction = $("#soapaction").textbox('getValue');
        }
        //输出模板
        var mess = $("#moduleViews").textbox('getValue');
        //接受配置
        var recv_attr_val = $("#recv_attr_val").textbox('getValue');
    }else if(type=="http"){
        //请求方式
        var http_method = $("#http_method").combobox('getValue');
        //编码方式
        var charset = $("#httpcharset").combobox('getValue');
        //url地址
        var url = $("#httpurl").textbox('getValue');
        if(url==""){
            ngtosPopMessager("error", "url地址不能为空");
            return false;
        }
        //请求模板
        var mess = $("#httpmoduleViews").textbox('getValue');
        //接收模板
        var recv_attr_val = $("#httprecv_attr_val").textbox('getValue');
    }
    $.ajax({
            url: "?c=Policy/Alarm&a=addNote",
            type: 'POST',
            datatype: 'text',
            data: {
                type: type,
                ismg_type: ismg_type,
                db_type:db_type,
                soap_ver:soap_ver,
                http_method:http_method,
                charset:charset,
                url:url,
                soapaction:soapaction,
                mess:mess,
                recv_attr_val:recv_attr_val,
                ip:ip,
                port:port,
                db_name:db_name,
                username:username,
                userpasswd:password,
                sp_id:sp_id,
                service_id:service_id,
                enterprise_id:enterprise_id,
                timeout:timeout
            },
            success: function(data) {
               if(data!=0){
                   ngtosPopMessager("error", data);
               }else{
                   ngtosPopMessager("error", "设置成功");
               }
            }
        });
}

function clearNote(){
    $.ajax({
            url: "?c=Policy/Alarm&a=cleanNote",
            type: 'POST',
            datatype: 'text',
            success: function(data) {
                if(data==0){
                    parent.window.location.reload();
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });
}

function sendIphone(){
    var phone = $("#phone").textbox('getValue');
    if(phone==""){
        ngtosPopMessager("error", "手机号码不能为空");
        return false;
    }
    $.ajax({
            url: "?c=Policy/Alarm&a=sendIphone",
            type: 'POST',
            datatype: 'text',
            data:{phone:phone},
            success: function(data) {
                if(data==0){
//                    parent.window.location.reload();
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });
}

function flie(){
    if ($('#note_div').length <= 0) {
        $(document.body).append("<div id='note_div' class='ngtos_window' style='width:600px;'></div>");
    }
    open_window('note_div','Policy/Alarm','windowShow&w=system_note_import',$LANG.BROWSER);
}

function import_flie(){
    var flie = document.getElementById("file").value;
    if (flie == ""){
        ngtosPopMessager("error", $LANG.PLEASE_SELECT_AIFSAIF);
        return;
    };
    
    $.ajaxFileUpload({
        url:'?c=Policy/Alarm&a=flieImport',
        type: 'POST',
        secureuri:false,//secureuri是否启用安全提交，默认为false
        fileElementId:'file',//fileElementId表示文件域ID
        dataType: 'text',
        async:false,
        success: function (data){
            if(data==0){
                $("#note_div").window("close");
                $('#flie_name').textbox('setValue',flie);
            }
        }
    })
}

function showView(){
    var file_name = document.getElementById("file").value;
    var interface_name = $("#interface_name").textbox('getValue');
    $.ajax({
        url: "?c=Policy/Alarm&a=showViews",
        type: 'POST',
        datatype: 'text',
        data:
       {
           file_name:file_name,
           interface_name:interface_name
       },
        success: function(data) {
            $("#moduleViews").textbox('setValue',data);

        }
    });
}