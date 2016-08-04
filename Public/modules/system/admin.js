/*administrator begin*/
function deleteAdminRow(){
    var rows=$('#tt').datagrid('getSelections');
    if (rows.length>0){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var msg;
                var adminName = [];
                for(var i = 0;i<rows.length;i++){
                    adminName.push(rows[i].admin_name);
                }
                var name = adminName.join('#');
                    $.ajax({
                        url: "?c=System/Admin&a=del",
                        type: 'POST',
                        dataType:'text',
                        data:{
                            delItems:name,
                            mod:'system admin'
                        },
                        success: function(data){
                            if(data != '0'){
                                msg+=i+' '+data+'<br />';
                            }
                        }
                    });
                if(msg != "" && msg != null){
                    ngtosPopMessager("error", msg);
                }
                datagridReload('tt');
            }
        });
    }
}

/*添加用户*/
/*function adduser(){
    var vsys_flag;

    addTan('adminAdd');

    if(vr_switch_php=='on'){
        vsys_flag=1;
        //获取虚系统名称
        $.ajax({
            url: "?module=system_admin&action=vsys_data",
            type: 'POST',
            dataType:'json',
            async:false,
            success: function(data){
                if(data){
                    $.each(data.group,function(){
                        $('#adduserDiv').find('#vsys_name_sel')[0].add(new Option(this.vsys_name,this.vsys_name));
                    });
                }
            }
        });
    }else{
        vsys_flag=0;
    }
    if(pri_php!='0'){
        //获取权限模板的名称
        $.ajax({
            url: "?module=system_admin&action=admin_limit_jsondata",
            type: 'GET',
            dataType:'json',
            async:false,
            success: function(data){
                if(data){
                    $.each(data.group,function(){
                        $('#adduserDiv').find('#map_name')[0].add(new Option(this.map_name,this.map_name));
                    });
                }
            }
        });
    }

    $('#adduserDiv').find('#addA').click(function(){
        var vsysname='';
        if(vsys_flag==1 && $('#adduserDiv').find('#add_type2')[0].checked) vsysname=$('#adduserDiv').find('#vsys_name_sel').val();
        else vsysname='';
        if( $('#adduserDiv').find( "#add_name" ).checkInput( { cl : ['must']} ) == false ) return false;
        var ss=$('#adduserDiv').find("#pwd2").val();
        if( $('#adduserDiv').find( "#pwd1" ).checkInput( { cl : ['must','pwd:'+ss]} ) == false ) return false;

        $.ajax({
            url: "?module=system_admin&action=admin_addsave",
            type: 'POST',
            datatype:'text',
            async:false,
            data:{
                name:$('#adduserDiv').find('#add_name').val(),
                passwd:ss,
                comment:$('#adduserDiv').find('#add_comment').val(),
                vsys_name:vsysname,
                map_name:pri_php!='0'?$('#adduserDiv').find('#map_name').val():''
            },
            success: function(data){
                if(data=='ok'){
                    closetanDiv();
                    ngtosPopMessager("success", $LANG.ADD_ADMINISTRATOR_SUCCESS);
                    $('#tt').datagrid('reload');
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    });
}*/

function admin_auth(newValue,oldValue){
    if(!newValue) {
        newValue = $('#auth_method').combobox('getValue');
    }
   if(newValue == "1"){
        $("#server_name").hide();
        $("#span").hide();
		$("#span1").hide();
    }else{
		$("#span1").show();
        $("#server_name").show();
        $("#span").show();
    }
}

/*编辑用户*/
/*function editAdmin(username,mapname,stat,vsys,comment){

    addTan('adminEdit');
    if(vr_switch_php=='on')
        $('#adduserDiv').find('#vsys_td')[0].innerHTML=vsys;

    $('#adduserDiv').find('#title')[0].innerHTML=$LANG.EDIT_USER;
    $('#adduserDiv').find('#username_td')[0].innerHTML='<label>'+username+'</label>';

    if(pri_php!='0'){
        //获取权限模板的名称
        $.ajax({
            url: "?module=system_admin&action=admin_limit_jsondata",
            type: 'GET',
            dataType:'json',
            async:false,
            success: function(data, textStatus){
                if(data){
                    $.each(data.group,function(){
                        $('#adduserDiv').find('#map_name')[0].add(new Option(this.map_name,this.map_name));
                    });
                }
            }
        });
        $('#adduserDiv').find('#map_name')[0].value=mapname;
        if(stat=='valid'){
//            $('#adduserDiv').find('.switch1')[0].src="static/images/image/start.png";
//            $('#adduserDiv').find('.switch1')[0].title='启用';
            $('#adduserDiv').find('#statRadioT')[0].checked=true;
        }else if(stat=='invalid'){
//            $('#adduserDiv').find('.switch1')[0].src="static/images/image/stop.png";
//            $('#adduserDiv').find('.switch1')[0].title='禁用';
            $('#adduserDiv').find('#statRadioF')[0].checked=true;
        }
    }
    if(admin_php!='0'){
        $('#adduserDiv').find('#add_comment')[0].value=comment;
    }
    $('#adduserDiv').find('#addA').click(function(){
        var mode_type='';
        if(admin_php!='0'){
            var ss=$('#adduserDiv').find("#pwd2").val();
//            if($('#adduserDiv').find('.switch2')[0].title=='启用')
             if($('#adduserDiv').find('#changePwd')[0].checked){
                if( $('#adduserDiv').find( "#pwd1" ).checkInput( { cl : ['must','pwd:'+ss]} ) == false ) return false;
            }
            mode_type='1';
        }
        if(pri_php!='0'){
            var mapname='';
            var state='';
            if($('#adduserDiv').find('#map_name').val()==mapname){
                mapname='';
            }else mapname=$('#adduserDiv').find('#map_name').val();
//            if($('#adduserDiv').find('.switch1')[0].title=='启用'){
//                state='valid';
//            }
//            else if($('#adduserDiv').find('.switch1')[0].title=='禁用'){
//                state='invalid';
//            }

            if($('#adduserDiv').find('#statRadioT')[0].checked){
                state='valid';
            }else{
                state='invalid';
            }

            mode_type='2';
        }
        if(admin_php!='0' && pri_php!='0'){
            mode_type='3';
        }
        $.ajax({
            url: "?module=system_admin&action=admin_editsave",
            type: 'POST',
            dataType:'text',
            async:false,
            data:{
                mode_type:mode_type,
                passwd:(admin_php!='0')?ss:'',
                name:username,
                comment:(admin_php!='0')?$('#adduserDiv').find('#add_comment').val():'',
                status:(pri_php!='0')?state:'',
                map_name:(pri_php!='0')?mapname:''
            },
            success: function(data){
                if(data=='ok'){
                    closetanDiv();
                    ngtosPopMessager("success", $LANG.MODIFY_ADMINISTRATOR_SUCCESS);
                    $('#tt').datagrid('reload');
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    });
}*/

function admintype1(obj){
    if(obj.checked){
        $('#vsys_tr')[0].style.display="none";
        $("#map_name").combobox({
            url: "?c=System/Admin&a=adminLimitJsondata",
            valueField: 'text',
            textField: 'text',
            panelHeight: 'auto',
            panelMaxHeight: 198,
            multiple: false,
            editable: false
        })
        //如果是跟系统的时候取消虚系统名为必选项
        $('#vsys_name_sel').textbox({
            required:false
        })
    }
}

function admintype2(obj){
    if(obj.checked){
        $('#vsys_tr')[0].style.display="block";
        $('#vsys_tr')[0].style.display="";
        $("#map_name").combobox({
           url: "?c=System/Admin&a=adminLimitJsondataTwo",
           valueField: 'text',
           textField: 'text',
           panelHeight: 'auto',
           panelMaxHeight: 198,
           multiple: false,
           editable: false
       })
        //如果是虚系统的时候开启虚系统必填
        $('#vsys_name_sel').textbox({
            required:true
        })
   }
}

function changswitch(obj,st){
    if(obj.title=='禁用'){
        obj.src="static/images/image/start.png";
        obj.title='启用';
        if(st==1){
            $('#adduserDiv').find('#pwd1')[0].disabled=false;
            $('#adduserDiv').find('#pwd2')[0].disabled=false;
        }
    }else{
        obj.src="static/images/image/stop.png";
        obj.title='禁用';
        if(st==1){
            $('#adduserDiv').find('#pwd1')[0].disabled=true;
            $('#adduserDiv').find('#pwd1')[0].value='';
            $('#adduserDiv').find('#pwd2')[0].disabled=true;
            $('#adduserDiv').find('#pwd2')[0].value='';

        }
    }
}


/*function changeState(stat,name){
    if(pri_php=='0')
        return;
    $.ajax({
        url: "?module=system_admin&action=admin_status",
        type: 'POST',
        dataType:'text',
        data:{
            adminname:name,
            status:stat
        },
        success: function(data, textStatus){
            if(data=='ok'){
                $('#tt').datagrid('reload');
            }
            else{
                ngtosPopMessager("error", data);
            }

        }
    });
}*/

function forceOffline(userid,username) {
    if(getPrivilege("device-maintenance") == true) {
        var text=$LANG.DETERMINE_MANDATORY_USER+username+$LANG.OFFLINE;
        ngtosPopMessager("confirm", text,function(r) {
            if(r) {
                $.ajax({
                    url: "?c=System/Admin&a=callFun",
                    type: 'POST',
                    dataType:'text',
                    data: {
                        param:userid,
                        parKey:'session-id',
                        fun:'simpleHandle',
                        mod:'system admin',
                        act:'forced-offline'
                    },
                    success: function(data) {
                        clearInterval(interTime);
                        interTime = setInterval(function() {
                            if(data == '0') {
                                $('#tt1').datagrid('reload');
                                // parent.window.location.reload();
                            } else {
                                ngtosPopMessager("error", data);
                            }
                        },5000);
                    }
                });
            }
        });
    } else {
        ngtosPopMessager("error", $LANG.YOU_DO_NOT_HAVE_AN_OPERATION_ON_THIS_RIGHT);
    }
}

/*limit begin*/
function deleteLimitselectrow(){
    var rows=$('#tt').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var msg='';
                var mapName = [];
                for(var i = 0;i<rows.length;i++){
                    mapName.push(rows[i].map_name);
                }
                var name = mapName.join('#');
                    $.ajax({
                        url: "?c=System/Admin&a=del",
                        type: 'POST',
                        dataType:'text',
                        async:false,
                        data:{
                            delItems:name,
                            mod:'system privilege map'
                        },
                        success: function(data){
                            if(data != '0'){
                                msg+=i+' '+data+'<br />';
                            }
                        }
                    });
                if(msg != "" && msg != null){
                    ngtosPopMessager("error", msg);
                }
                datagridReload('tt');
            }
        });
}

/*set begin*/
/*function changSetswitch(obj){
    if(obj.title=='关闭'){
        obj.src="static/images/image/start.png";
        obj.title='开启';
    }
    else
    {
        obj.src="static/images/image/stop.png";
        obj.title='关闭';
    }
}*/

function formAdminSubmit(){
    if($('#parameter_form').form('validate')){
        if($('#maxnum_type_passward').val() =="0"){
            ngtosPopMessager("error", $LANG.MINIMUM_1);
            return false;
        }

        if($('#auth_method').combobox("getValue") == 1) {
            var authMethod = 'local';
            var serverName = '';
        } else {
            if($('#shift-local-auth')[0].checked)
                    var shift_local_auth = "on";
            else
                    var shift_local_auth = "off";
            var authMethod = 'external';
            var serverName = $('#server_name').val();
            if((!/^[a-zA-Z0-9_-]*$/.test(serverName)) || serverName == '') {
                ngtosPopMessager('error', $LANG.THE_INPUT_VALUE_CANNOT_BE_EMPTY);
                return;
            }
        }

        $.ajax({
            url: "?c=System/Admin&a=setsave",
            type: 'POST',
            dataType:'text',
            data:{
                password_complexity:$('input[name="password-complexity"]:checked').val(),
                first_login:$('#first_login')[0].checked?'yes':'no',
                maxnum_auth_fail:$('#maxnum_auth_fail').val(),
                account_locked_time:$('#account_locked_time').val(),
                maxnum_admin_online:$('#maxnum_admin_online').val(),
                maxnum_same_admin_online:$('#maxnum_same_admin_online').val(),
    //            maxnum_type_cli:$('#maxnum_type_cli').val(),
                maxnum_type_webui:$('#maxnum_type_webui').val(),
                maxnum_type_ssh:$('#maxnum_type_ssh').val(),
                maxnum_type_telnet:$('#maxnum_type_telnet').val(),
                maxnum_type_passward :$('#maxnum_type_passward').val(),
                auth_method :authMethod,
                server_name :serverName,
                shift_local_auth:shift_local_auth
            },
            success: function(data){
                if(data=='0'){
                    ngtosPopMessager("success", $LANG.CHANGE_SUCCESS);
                    parent.window.location.reload();
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
        });
}
}
function resetAdminDefault(){

        $.ajax({
            url: "?c=System/Admin&a=callFun",
            data:{
                mod:'system admin-auth-policy',
                act:'reset',
                fun:'simpleHandle'
            },
            type: 'post',
            dataType:'text',
            success: function(data){
                if(data=='0'){
                    ngtosPopMessager("success", $LANG.RESET_SUCCESSFULLY,'main');
                    parent.window.location.reload();
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });

}

function changePwdFun(obj){
    if(obj.checked){

        $('#pwd1').textbox("readonly",false);
        $('#pwd2').textbox("readonly",false);
        $('#pwd1').textbox({required:true});
        $('#pwd2').textbox({required:true});
    }else{

        $('#pwd1').textbox("readonly");
        $('#pwd1').textbox({required:false});
        $('#pwd2').textbox("readonly");
        $('#pwd2').textbox({required:false});
    }
}

function setToolBar(){
    if(admin_php==0 && pri_php==0)
        return;
    var sel_row=$('#tt').datagrid('getSelections');
    if(sel_row.length<1){
        if(admin_php==1){
            $('#icon_edit').linkbutton('disable');
            $('#icon_delete').linkbutton('disable');
        }
        if(pri_php==1){
            $('#icon_enable').linkbutton('disable');
            $('#icon_disable').linkbutton('disable');
        }
    }else if(sel_row.length==1){
        if(admin_php==1){
            $('#icon_edit').linkbutton('enable');
            $('#icon_delete').linkbutton('enable');
        }
        if(pri_php==1){
            $('#icon_enable').linkbutton('enable');
            $('#icon_disable').linkbutton('enable');
        }
    }else if(sel_row.length>1){
        if(admin_php==1){
            $('#icon_edit').linkbutton('disable');
            $('#icon_delete').linkbutton('enable');
        }
        if(pri_php==1){
            $('#icon_enable').linkbutton('enable');
            $('#icon_disable').linkbutton('enable');
        }

    }
}

/*function editSelectUser()
{
    var row=$('#tt').datagrid('getSelections');
    editAdmin(row[0].admin_name,row[0].map_name,row[0].status,row[0].vsys_name,row[0].comment);
}*/

function enableSelectrow(value){
    if(value==1){
        var t=$LANG.SURE_ENABLE;
        var st='valid';
    }else{
        var t=$LANG.SURE_DISABLE;
        var st='invalid';
    }
    ngtosPopMessager("confirm", t,function(r){
        if(r){
            var row=$('#tt').datagrid('getSelections');
            var msg='';
            for(var i=0;i<row.length;i++){
                $.ajax({
                    url: "?c=System/Admin&a=adminStatus",
                    type: 'POST',
                    dataType:'text',
                    data:{
                        adminname:row[i].admin_name,
                        status:st
                    },
                    success: function(data){
                        if(data !='0'){
                            msg+=data+'<br>';
                        }
                    }
                });
            }
            if(msg.length>1)
                ngtosPopMessager("error", msg);
            $('#tt').datagrid('reload');
        }
    });
}

function setLimitToolBar(){
    var sel_row=$('#tt').datagrid('getSelections');
    if(sel_row.length<1){
        $('#icon_edit').linkbutton('disable');
        $('#icon_delete').linkbutton('disable');
    }else if(sel_row.length==1){
        if(sel_row[0].map_type!='default')
            $('#icon_edit').linkbutton('enable');
        else
            $('#icon_edit').linkbutton('disable');
        $('#icon_delete').linkbutton('enable');
    }else if(sel_row.length>1){
        $('#icon_edit').linkbutton('disable');
        $('#icon_delete').linkbutton('enable');
    }
}

function openLimitWindow(){
    oper=0;
    $.cookie('limitname',null, {secure:true});
    if ($('#limit_add_window').length <= 0) {
        $(document.body).append("<div id='limit_add_window' class='ngtos_window_550'></div>");
    }
    open_window('limit_add_window','System/Admin','windowLimit',$LANG.ADD);
}
function editLimitWindow(){
        var rowData=$('#tt').datagrid('getSelections');
        if(rowData.length ==1)
            editDoubleClickLimitWindow(rowData[0].map_name, rowData[0].comment);
        else
            return;
}
function editDoubleClickLimitWindow(name,comment){
    oper=1;
    editName=name;
    editCom=comment;
    $.cookie('limitname',editName, {secure:true});
    if ($('#limit_add_window').length <= 0) {
        $(document.body).append("<div id='limit_add_window' class='ngtos_window_550'></div>");
    }
    open_window('limit_add_window','System/Admin','windowLimitt&editName='+editName+'&editCom='+editCom,$LANG.EDIT);
//    open_window('limit_add_window','system_admin','window_limit',"编辑");
}

function adduserWindow(){
    oper=0;
    if ($('#admin_add_window').length <= 0) {
        $(document.body).append("<div id='admin_add_window' class='ngtos_window_500'></div>");
    }
    open_window('admin_add_window','System/Admin','windowAdmin',$LANG.ADD);
}
function edituserWindow(){
    oper=1;
    var row=$('#tt').datagrid('getSelections');
    editName=row[0].admin_name;
    editCom=row[0].comment;
    editLimitName=row[0].map_name;
    editVsys=row[0].vsys_name;
    editStatus=row[0].status;
    if ($('#admin_add_window').length <= 0) {
        $(document.body).append("<div id='admin_add_window' class='ngtos_window_500'></div>");
    }
    open_window('admin_add_window','System/Admin','windowAdmin',$LANG.EDIT);
}

function showLimit(map_name) {

    //editName=map_name;
    if ($('#limit_show_window').length <= 0) {
        $(document.body).append("<div id='limit_show_window' class='ngtos_window_550'></div>");
    }
    open_window('limit_show_window', 'System/Admin', 'windowLimitShow&editName='+map_name, $LANG.SHOW);
}