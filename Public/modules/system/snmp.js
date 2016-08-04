function add_snmpManage_submit(){
    var hostName = $("#hostName").val();
    var snmp_manageHostType = $(':radio[name="snmp_manageHostType"]:checked').val();
    var hostIp = $("#hostIp").val();
    var subnetIp = $("#subnetIp").val();
    var subnetIp_stop = $("#subnetIp_stop").val();
    var community = $("#community").val();
    if ( hostName.length == 0 ) {
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_THE_HOST_NAME);
        return false;
    }

    var snmp_tag;
    var hostIp_reg = /^(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/i;
    var mask_reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/;
    if(snmp_manageHostType == $LANG.HOST){
        snmp_tag = 1;
        if( hostIp.length != 0 ){
            if(!hostIp_reg.test(hostIp)){
                ngtosPopMessager("info", '主机ip输入不合法');
                return false;
            }
        }else{
            ngtosPopMessager("info", $LANG.PLEASE_ENTER_THE_HOST_IP);
            return false;
        }
    }
    if(snmp_manageHostType == $LANG.SUBNET){
        snmp_tag = 0;
        if( subnetIp.length != 0 ){
            if(!hostIp_reg.test(subnetIp)){
                ngtosPopMessager("info", '子网ip输入不合法');
                return false;
            }
        }else{
            ngtosPopMessager("info", '请输入子网ip');
            return false;
        }

        if( subnetIp_stop.length == 0 ){
            ngtosPopMessager("info", '请输入子网掩码');
            return false;
        }else{
            if(subnetIp_stop.indexOf(".") > 0){
                if(!mask_reg.test(subnetIp_stop)){
                    ngtosPopMessager("info", '子网掩码输入不合法');
                    return false;
                }
            }else if(subnetIp_stop<=31 && subnetIp_stop>=1){
                
            }else if(subnetIp_stop>31 || subnetIp_stop<1){
                ngtosPopMessager("info", '子网掩码输入1-31');
                 return false;
            }else{
                 ngtosPopMessager("info", '子网掩码输入不合法');
                 return false;
            }

        }
    }
    var community_reg =/^[\w!@#$%^&+=|?><~]{0,20}$/;
    if( community.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_COMMUNITY);
        return false;
    }else{
        if(!community_reg.test(community)){
            ngtosPopMessager("info", 'community输入不合法');
            return false;
        }
    }
    $.ajax({
        url: "?c=System/Snmp&type=host",
        type: 'POST',
        datatype:'text',
        data:{
            hostName:hostName,
            hostIp:hostIp,
            subnetIp:subnetIp,
            subnetIp_stop:subnetIp_stop,
            community:community,
            snmp_tag:snmp_tag
        },
        success: function(data){
            if(data=='0'){
                $("#snmp_div1").window("close");
                datagridReload("tt");
            }else{
                ngtosPopMessager("error", data);
            }
                
        }
    });
}
function add_snmp1(){
    if($('#snmp_div1').length<=0)
        $(document.body).append("<div id='snmp_div1' style='width:550px;'></div>");
    open_window('snmp_div1','System/Snmp&w=system_snmp_addHost1_window','',$LANG.ADD);
}
function add_snmpControl_submit(){
    var hostName1 = $("#hostName1").val();
    var hostIp1 = $("#hostIp1").val();
    if( hostName1.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_THE_HOST_NAME);
        return false;
    }
    if( hostIp1.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_THE_HOST_IP);
        return false;
    }
    $.ajax({
        url: "?c=System/Snmp&type=control",
        type: 'POST',
        datatype:'text',
        data:{
            hostName1:hostName1,
            hostIp1:hostIp1
        },
        success: function(data){
             if(data=='0'){
                $("#snmp_div2").window("close");
                 datagridReload("aa");
             }else{
                ngtosPopMessager("error", data);
             }
        }
    });
}
function add_snmp2(){
    if($('#snmp_div2').length<=0)
        $(document.body).append("<div id='snmp_div2' style='width:550px;'></div>");
    open_window('snmp_div2','System/Snmp&w=system_snmp_addHost2_window','',$LANG.ADD);
}

function add_snmpSNMPV3_submit(tag){
    var userName = $("#userName").val();
    var snmp_user_lev = $(':radio[name="snmp_user_lev"]:checked').val();
    var userPassword = $("#userPassword").val();
    var userSelfpassword = $("#userSelfpassword").val();
    if( userName.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_USER_NAME);
        return false;
    }
    if( userPassword.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_USER_AUTHENTICATION_PASSWORD);
        return false;
    }else if(userPassword.length != 8 ){
        ngtosPopMessager("info", $LANG.PASSWORD_LENGTH_IS_8);
        return false;
    }
    var snmp_user_lev_type;
    if(snmp_user_lev == $LANG.ENCRYPT){
        if( userSelfpassword.length == 0 ){
            ngtosPopMessager("info", $LANG.PLEASE_ENTER_THE_USERS_PASSWORD);
            return false;
        }else if(userSelfpassword.length != 8 ){
            ngtosPopMessager("info", $LANG.PRIVATE_PASSWORD_LENGTH_IS_8);
            return false;
        }
        snmp_user_lev_type = "authpriv";
    }else{
        snmp_user_lev_type = "authnopriv";
    }
    $.ajax({
        url: "?c=System/Snmp&type=snmpv3",
        type: 'POST',
        datatype:'text',
        data:{
            userName:userName,
            userPassword:userPassword,
            userSelfpassword:userSelfpassword,
            snmp_user_lev_type:snmp_user_lev_type,
            tag:tag
        },
        success: function(data){
             if(data=='0'){
                $("#snmp_div3").window("close");
                 datagridReload("bb");
             }else{
                ngtosPopMessager("error", data);
             }
        }
    });
}
function add_snmp3(){
    v3User_tag = 1;
    if($('#snmp_div3').length<=0)
        $(document.body).append("<div id='snmp_div3' style='width:550px;'></div>");
    open_window('snmp_div3','System/Snmp&w=system_snmp_addHost3_window','',$LANG.ADD);
}

//snmp_app
//由于应用中需要传递两个参数，并且后台处理方法特殊，所以无法使用公共方法
function snmp_app(){
    var position = $("#position").val();
    var call = $("#call").val();
    if( position.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_ENTER_A_POSITION);
        return false;
    }
    if( call.length == 0 ){
        ngtosPopMessager("info", $LANG.PLEASE_CONTACT);
        return false;
    }

    $.ajax({
        url: "?c=System/Snmp&a=snmp_btn_app",
        type: 'POST',
        dataType:'json',
        data:{
            position:position,
            call:call
        },
        success: function(data){
            if(data == 0){
                location.reload();
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function snmp_start(){
    var position = $("#position").val();
    var call = $("#call").val();
    if(position && call){
        $.ajax({
            url: "?c=System/Snmp&a=callFun",
            data:{
                mod:'system snmp',
                act:'start',
                fun:'simpleHandle'
            },
            type: 'POST',
            dataType:'text',
            success: function(data){
                if(data=='0'){
                    $("#btn_start").attr("disabled","true");
                    $("#btn_stop").removeAttr("disabled");
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}
//snmp_stop
function snmp_stop(){
    var position = $("#position").val();
    var call = $("#call").val();
    if(position && call){
        $.ajax({
            url: "?c=System/Snmp&a=callFun",
            data:{
                mod:'system snmp',
                act:'stop',
                fun:'simpleHandle'
            },
            type: 'POST',
            dataType:'text',
            success: function(data){
                if(data=='0'){
                    //处理开始 停止的按钮可用不可用
                    $("#btn_stop").attr("disabled","true");
                    $("#btn_start").removeAttr("disabled");
                }else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}
//del_snmp1
function del_snmp1(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var rows=$('#tt').datagrid('getChecked');
                for(var i=0; i<rows.length; i++){
                    if(rows[i].host){
                        ipTag = 1;
                    }else{
                        ipTag = 0;
                    }
                    $.ajax({
                        url: "?c=System/Snmp",
                        type: 'delete',
                        dataType: 'json',
                        async:false,
                        data:{
                            name:rows[i].name,
                            ip:ipTag
                        },
                        success: function(data){
                            if(data!='0'){
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
                datagridReload("tt");
            }
        },true);
}

//clear_snmp1
function clear_snmp1(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=System/Snmp&mod=managesubnet_managehost&all=1",
                type: 'delete',
                dataType:'json',
                success: function(data){
                    if(data== 0){
                        location.reload();
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);
}

//del_snmp2
function del_snmp2(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var rows=$('#aa').datagrid('getChecked');
                var names = [];
                for(var i=0; i<rows.length; i++){
                    names.push(rows[i]['name']);
                }
                    names = names.join('#');
                    $.ajax({
                        url: "?c=System/Snmp&mod=traphost",
                        type: 'delete',
                        dataType: 'json',
                        async:false,
                        data:{
                            delItems:names
/*                            mod:'system snmp traphost'*/
                        },
                        success: function(data){
                            if(data!='0'){
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                $('#aa').datagrid('reload');
            }
        },true);
}

//clear_snmp2
function clear_snmp2(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=System/Snmp&mod=traphost&all=1",
                type: 'delete',
                success: function(data){
                    if(data=='0')
                        location.reload();
                    else
                        ngtosPopMessager("error", data);
                }
            });
        }
    },true);
}
//del_snmp3
function del_snmp3(){
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var rows=$('#bb').datagrid('getChecked');
                var name = [];
                for(var i=0; i<rows.length; i++){
                    name.push(rows[i]['user_name']);
                }
                name = name.join('#');
                    $.ajax({
                        url: "?c=System/Snmp&mod=snmpv3user",
                        type: 'delete',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:name
/*                            mod:'system snmp snmpv3user'*/
                        },
                        success: function(data){
                            if(data != '0'){
                                ngtosPopMessager("error", data);
                            }
                        }
                    });

                $('#bb').datagrid('reload');
            }
        },true);
}

//clear_snmp3
function clear_snmp3(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=System/Snmp&a=clean&mod="+encodeURI('system snmp snmpv3user'),
                type: 'POST',
                success: function(data){
                    if(data=='0')
                        location.reload();
                    else
                        ngtosPopMessager("error", data);
                }
            });
        }
    },true);
}

function snmpmanage_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
}
function snmpcontrol_toolbar() {
    var crows = $('#aa').datagrid('getChecked');
    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
}
function snmpv3_toolbar() {
    var crows = $('#bb').datagrid('getChecked');

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
function change_radio(obj){
    if(obj == 1){
        $("#sp1").show();
        $("#sp2").hide();
    }
    if(obj == 2){
        $("#sp1").hide();
        $("#sp2").show();
    }
    if(obj == 3){
        $("#sp3").show();
    }
    if(obj == 4){
        $("#sp3").hide();
    }
}