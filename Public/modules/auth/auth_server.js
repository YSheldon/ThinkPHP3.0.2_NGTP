var auto_add_tag = "yes";
var radius_charge_tag = "yes";
function freshServItem(val) {
    if(val == '') {
        $("#tt").datagrid('options').url='?c=Auth/Server&a=datagridShow';
        $('#tt').datagrid('reload');
    }
}

function authServerWindow(divid, moduleVal, actionVal, titleVal, loadFunc) {
    document.body.style.overflow = "auto";
    eval($('#' + divid).css("display", "block"));
    eval(
        $('#' + divid).window({
            collapsible: false, //定义是否显示可折叠按钮。
            minimizable: false, //定义是否显示最小化按钮。
            maximizable: false, //定义是否显示最大化按钮。
            noheader: false, //如果设置为true，控制面板头部将不被创建。
            border: false, //定义是否显示控制面板边框。
            top: 80, //设置面版的顶边距。
            href: "?c=" + moduleVal + "&a=" + actionVal,
            resizable: false, //定义窗口是否可以被缩放。
            shadow: false, //如果设置为true，显示窗口的时候将显示阴影。
            modal: true, //定义窗口是否带有遮罩效果。
            cache: false, //如果设置为true，从超链接载入的数据将被缓存。
//        firstWindow: tag, //如果设置为true，则窗口为第一个弹出框
//        newWinOpts: '',
            title: '&nbsp;&nbsp;' + titleVal,
            style: {
                borderWidth: 0,
                padding: 5
            },
            onLoad: function() {
                if (loadFunc)
                    loadFunc();
            }
        })
    );
}

function add_server(mag) {
    parent.sourOptions = [];
    parent.selOptions = [];
	server_add_tag = 1;
    if ($('#add_server_div').length <= 0) {
        $(document.body).append("<div id='add_server_div' class='ngtos_window_600'></div>");
    }
    authServerWindow('add_server_div','Auth/Server','windowShow&w=auth_server_add_window',mag);
}
function searchServ() {
    var val = $("#searchServName").val();
    if(val == '' || val == $LANG.INPUT_SEARCH) {
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    $('#tt').datagrid('getPager').pagination({pageNumber: 1});
    $("#tt").datagrid({
        pageNumber:1,
        url:'?c=Auth/Server&a=datagridShow&search='+encodeURI(val)
    });
}
function setServerToolBar() {
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    } else if(sel_row.length==1) {
        $('#icon_edit').linkbutton('enable');
        $('#icon_del').linkbutton('enable');
    } else if(sel_row.length>1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('enable');
    }
}

function disabled_text1() {
	multi_disabled1();
	login_limit_disabled1();
	reset_limit_disabled1();
	pass_limit_disabled1();
	termly_disabled1();
	invalid_disabled1();
	change_disabled1();
}

function disabled_text2() {
	multi_disabled2();
	login_limit_disabled2();
	reset_limit_disabled2();
	pass_limit_disabled2();
	termly_disabled2();
	invalid_disabled2();
	change_disabled2();
}

function change_disabled1() {
	if($("#deny_change").prop("checked")) {
		$("#first_login").attr("disabled", "disabled");
		$("#pass_change1").css({"color":"#ccc"});
	} else {
		$("#first_login").removeAttr("disabled"); 
		$("#pass_change1").css({"color":"#666"});
	}
}
function change_disabled2() {
	if($("#local_deny_change").prop("checked")) {
		$("#local_first_login").attr("disabled", "disabled");
		$("#pass_change2").css({"color":"#ccc"});
	} else {
		$("#local_first_login").removeAttr("disabled"); 
		$("#pass_change2").css({"color":"#666"});
	}
}
function multi_disabled1() {
	if($("#more_login_whole").prop("checked"))
		$("#login_num_whole").textbox("enable");
	else
		$("#login_num_whole").textbox("disable");
}
function multi_disabled2() {
	if($("#local_more_login_whole").prop("checked"))
		$("#local_login_num_whole").textbox("enable");
	else
		$("#local_login_num_whole").textbox("disable");
}
function multi_disabled3() {
	if($("#whole_more_login").prop("checked"))
		$("#whole_login_num").textbox("enable");
	else
		$("#whole_login_num").textbox("disable");
}
function login_limit_disabled1() {
	if($("#fail_login_limit").prop("checked")) {
		$("#max_auth_fail").textbox("enable");
		$("#accout_lock_time").textbox("enable");
	} else {
		$("#max_auth_fail").textbox("disable");
		$("#accout_lock_time").textbox("disable");
	}
}
function login_limit_disabled2() {
	if($("#local_fail_login_limit").prop("checked")) {
		$("#local_max_auth_fail").textbox("enable");
		$("#local_accout_lock_time").textbox("enable");
    } else {
		$("#local_max_auth_fail").textbox("disable");
		$("#local_accout_lock_time").textbox("disable");
	}
}
function reset_limit_disabled1() {
	if($("#pass_reset_limit").prop("checked")) {
		$("#pass_reset_max").textbox("enable");
		$("#pass_reset_interval").textbox("enable");
	} else {
		$("#pass_reset_max").textbox("disable");
		$("#pass_reset_interval").textbox("disable");
	}
}
function reset_limit_disabled2() {
	if($("#local_pass_reset_limit").prop("checked")) {
		$("#local_pass_reset_max").textbox("enable");
		$("#local_pass_reset_interval").textbox("enable");
	} else {
		$("#local_pass_reset_max").textbox("disable");
		$("#local_pass_reset_interval").textbox("disable");
	}
}
function pass_limit_disabled1() {
	if($("#pass_limit").prop("checked")) {
		$("#pass_min").textbox("enable");
		$("#pass_max").textbox("enable");
	} else {
		$("#pass_min").textbox("disable");
		$("#pass_max").textbox("disable");
	}
}
function pass_limit_disabled2() {
	if($("#local_pass_limit").prop("checked")) {
		$("#local_pass_min").textbox("enable");
		$("#local_pass_max").textbox("enable");
	} else {
		$("#local_pass_min").textbox("disable");
		$("#local_pass_max").textbox("disable");
	}
}
function termly_disabled1() {
	if($("#termly_change").prop("checked"))
		$("#pass_interval").textbox("enable");
	else
		$("#pass_interval").textbox("disable");
}
function termly_disabled2() {
	if($("#local_termly_change").prop("checked"))
		$("#local_pass_interval").textbox("enable");
	else
		$("#local_pass_interval").textbox("disable");
}
function invalid_disabled1() {
	if($("#pass_invalid").prop("checked"))
		$("#invalid_period").textbox("enable");
	else
		$("#invalid_period").textbox("disable");
}
function invalid_disabled2() {
	if($("#local_pass_invalid").prop("checked"))
		$("#local_invalid_period").textbox("enable");
	else
		$("#local_invalid_period").textbox("disable");
}
//密码重置方式
function resetPwdType(obj) {
    if($(obj).val() == 'no') {
        $("#pass_reset_limit").attr("checked", false);
        $("#pass_reset_limit").attr("disabled", "disabled");
        $("#pass_reset_max").textbox("disable");
        $("#pass_reset_interval").textbox("disable");
    }else if($(obj).val() == 'mail') {
        $("#pass_reset_limit").removeAttr("disabled");
    }else{
        $("#pass_reset_limit").removeAttr("disabled");
    }
}
//邮箱设置
function mailSet(obj) {
    if($(obj).val() == 'smtp') {
        $("#mail_server_auth_user").textbox("disableValidation");
        $("#mail_server_auth_passwd").textbox("disableValidation");
        //$("#mail_server_auth_user").textbox('setValue','');
        //$("#mail_server_auth_passwd").textbox('setValue','');
        $("#mail_server_auth_user").textbox("disable");
        $("#mail_server_auth_passwd").textbox("disable");
    }else{
        $("#mail_server_auth_user").textbox("enable");
        $("#mail_server_auth_passwd").textbox("enable");
        $("#mail_server_auth_user").textbox("enableValidation");
        $("#mail_server_auth_passwd").textbox("enableValidation");
    }
}

//密码重置方式
function localResetPwdType(obj) {
    if(obj)
        var resetPwdVal = $(obj).val();
    else
        var resetPwdVal = $('input[name="local_pass_reset_type"]:checked').val();
    if(resetPwdVal == 'no') {
        $("#local_pass_reset_limit").attr("checked", false);
        $("#local_pass_reset_limit").attr("disabled", "disabled");
        $("#local_pass_reset_max").textbox("disable");
        $("#local_pass_reset_interval").textbox("disable");
        $("#local_mail_server_type1").attr("disabled", "disabled");
        $("#local_mail_server_type2").attr("disabled", "disabled");
        $("#local_mail_time_out").textbox("disable");
        //$("#local_mail_host").textbox("setValue",'');
        $("#local_mail_host").textbox("disable");
        $("#local_mail_port").textbox("disable");
        $("#local_mail_time_out").textbox("disableValidation");
        $("#local_mail_host").textbox("disableValidation");
        $("#local_mail_port").textbox("disableValidation");
        $("#local_mail_server_auth_user").textbox("disable");
        $("#local_mail_server_auth_passwd").textbox("disable");
        $("#local_mail_server_auth_user").textbox("disableValidation");
        $("#local_mail_server_auth_passwd").textbox("disableValidation");
    }else if(resetPwdVal == 'mail') {
        $("#local_pass_reset_limit").removeAttr("disabled");
        $("#local_mail_server_type1").removeAttr("disabled");
        $("#local_mail_server_type2").removeAttr("disabled");
        $("#local_mail_time_out").textbox("enable");
        $("#local_mail_host").textbox("enable");
        $("#local_mail_port").textbox("enable");
        $("#local_mail_time_out").textbox("enableValidation");
        $("#local_mail_host").textbox("enableValidation");
        $("#local_mail_port").textbox("enableValidation");
        if($('input[name="local_mail_server_type"]:checked').val() == 'smtp') {
            $("#local_mail_server_auth_user").textbox("disable");
            $("#local_mail_server_auth_passwd").textbox("disable");
            $("#local_mail_server_auth_user").textbox("disableValidation");
            $("#local_mail_server_auth_passwd").textbox("disableValidation");
        } else {
            $("#local_mail_server_auth_user").textbox("enable");
            $("#local_mail_server_auth_passwd").textbox("enable");
            $("#local_mail_server_auth_user").textbox("enableValidation");
            $("#local_mail_server_auth_passwd").textbox("enableValidation");
        }
    }else{
        $("#local_pass_reset_limit").removeAttr("disabled");
        $("#local_mail_server_type1").attr("disabled", "disabled");
        $("#local_mail_server_type2").attr("disabled", "disabled");
        $("#local_mail_time_out").textbox("disable");
        $("#local_mail_host").textbox("disable");
        //$("#local_mail_host").textbox("setValue",'');
        $("#local_mail_port").textbox("disable");
        $("#local_mail_time_out").textbox("disableValidation");
        $("#local_mail_host").textbox("disableValidation");
        $("#local_mail_port").textbox("disableValidation");
        $("#local_mail_server_auth_user").textbox("disable");
        $("#local_mail_server_auth_passwd").textbox("disable");
        $("#local_mail_server_auth_user").textbox("disableValidation");
        $("#local_mail_server_auth_passwd").textbox("disableValidation");
    }
}
//邮箱设置
function localMailSet(obj) {
    if($(obj).val() == 'smtp') {
        $("#local_mail_server_auth_user").textbox("disableValidation");
        $("#local_mail_server_auth_passwd").textbox("disableValidation");
        //$("#local_mail_server_auth_user").textbox('setValue','');
        //$("#local_mail_server_auth_passwd").textbox('setValue','');
        $("#local_mail_server_auth_user").textbox("disable");
        $("#local_mail_server_auth_passwd").textbox("disable");
    }else{
        $("#local_mail_server_auth_user").textbox("enable");
        $("#local_mail_server_auth_passwd").textbox("enable");
        $("#local_mail_server_auth_user").textbox("enableValidation");
        $("#local_mail_server_auth_passwd").textbox("enableValidation");
    }
}

function change_server_type(tag) {
	if(tag == 1) {
            $('#local_addr').css("display","none");
            $('#local_port').css("display","none");
            $('#radius1').css("display","none");
            $('#radius2').css("display","none");
            $('#radius3').css("display","none");
            $('#ldap').css("display","none");
            $('#ldap1').css("display","none");
            $('#ldap2').css("display","none");
            $('#ldap3').css("display","none");
            $('#ldap4').css("display","none");
            $('#ldap5').css("display","none");
            $('#ldap6').css("display","none");
            $('#ldap7_user1').css("display","none");
            $('#ldap7_user2').css("display","none");
            $('#ldap7_user3').css("display","none");
            $('#ldap7_user4').css("display","none");
            $('#ldap8_role1').css("display","none");
            $('#ldap8_role2').css("display","none");
            $('#local_adv').css("display","");
            $('#radius_adv').css("display","none");
            $('#adv_radius_conf').css("display","none");
            $('#adv_radius_conf2').css("display","none");
            $('#adv_radius_conf3').css("display","none");
            $('#adv_radius_conf4').css("display","none");
            $('#adv_radius_conf5').css("display","none");
            $('#adv_radius_conf6').css("display","none");
            $('#adv_radius_conf7').css("display","none");
            $('#adv_ldap_conf').css("display","none");
            $('#adv_ldap_conf2').css("display","none");
            $('#adv_ldap_conf3').css("display","none");
            $('#adv_ldap_conf4').css("display","none");
            $('#adv_ldap_conf5').css("display","none");
            $('#ldap_adv').css("display","none");
            $('#tacas_adv').css("display","none");
            $('#adv_tacas_conf').css("display","none");
            $('#adv_tacas_conf2').css("display","none");
            $('#adv_tacas_conf3').css("display","none");
            $('#adv_tacas_conf4').css("display","none");

            $("#serv_addr").textbox('disableValidation');
            $("#serv_port").textbox('disableValidation');
            $("#serv_sharesecret").textbox('disableValidation');
            $("#serv_ldap_dn").textbox('disableValidation');
            $("#serv_ldap_name").textbox('disableValidation');
            $("#serv_ldap_pass").textbox('disableValidation');
            $("#ldap_user_othervalue1").textbox('disableValidation');
            $("#ldap_user_othervalue2").textbox('disableValidation');
            $("#ldap_user_othervalue3").textbox('disableValidation');
            $("#ldap_user_othervalue4").textbox('disableValidation');
            $("#ldap_attr_role_othervalue").textbox('disableValidation');
            $("#ldap_attr_role").textbox('disableValidation');
        /*$("#ldap_user1").combobox('disableValidation');
        $("#ldap_user2").combobox('disableValidation');
        $("#ldap_user3").combobox('disableValidation');
        $("#ldap_user_group1").combobox('disableValidation');
        $("#ldap_type").combobox('disableValidation');*/

            $.getJSON(
                "?c=Auth/User&a=userAndGroup",
                function(data){
                    var options;
                    $(data.rows).each(function(key,value){
                            if(value.gTag == undefined)
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.USER+"]</option>";
                            else
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.GROUP+"]</option>";
                    })
                    $('#guser_item_cid').html(options);
                     select_add_title("guser_item_cid");
                }
           );
	} else if(tag == 2) {
            $('#local_addr').css("display","");
            $('#local_port').css("display","");
            $('#radius1').css("display","");
            $('#radius2').css("display","");
            $('#radius3').css("display","");
            $('#ldap').css("display","none");
            $('#ldap1').css("display","none");
            $('#ldap2').css("display","none");
            $('#ldap3').css("display","none");
            $('#ldap4').css("display","none");
            $('#ldap5').css("display","none");
            $('#ldap6').css("display","none");
            $('#ldap7_user1').css("display","none");
            $('#ldap7_user2').css("display","none");
            $('#ldap7_user3').css("display","none");
            $('#ldap7_user4').css("display","none");
            $('#ldap8_role1').css("display","none");
            $('#ldap8_role2').css("display","none");
            $('#local_adv').css("display","none");
            $('#radius_adv').css("display","");
            $('#adv_local_conf').css("display","none");
            $('#adv_ldap_conf').css("display","none");
            $('#adv_ldap_conf2').css("display","none");
            $('#adv_ldap_conf3').css("display","none");
            $('#adv_ldap_conf4').css("display","none");
            $('#adv_ldap_conf5').css("display","none");
            $('#ldap_adv').css("display","none");
            $('#tacas_adv').css("display","none");
            $('#adv_tacas_conf').css("display","none");
            $('#adv_tacas_conf2').css("display","none");
            $('#adv_tacas_conf3').css("display","none");
            $('#adv_tacas_conf4').css("display","none");

            $("#serv_addr").textbox('enableValidation');
            $("#serv_port").textbox('enableValidation');
            $("#serv_sharesecret").textbox('enableValidation');
            $("#serv_ldap_dn").textbox('disableValidation');
            $("#serv_ldap_name").textbox('disableValidation');
            $("#serv_ldap_pass").textbox('disableValidation');
            $("#ldap_user_othervalue1").textbox('disableValidation');
            $("#ldap_user_othervalue2").textbox('disableValidation');
            $("#ldap_user_othervalue3").textbox('disableValidation');
            $("#ldap_user_othervalue4").textbox('disableValidation');
            $("#ldap_attr_role_othervalue").textbox('disableValidation');
            $("#ldap_attr_role").textbox('disableValidation');
            $('#port_notice').text('[1-65535,'+$LANG.DEFAULT+':1812]');
            get_auser_options('d_guserRa_item_cid','selRa_auser_num');
        /*$("#ldap_user1").combobox('disableValidation');
        $("#ldap_user2").combobox('disableValidation');
        $("#ldap_user3").combobox('disableValidation');
        $("#ldap_user_group1").combobox('disableValidation');
        $("#ldap_type").combobox('disableValidation');*/
        $.getJSON(
                "?c=Auth/User&a=userAndGroup",
                function(data){
                    var options;
                    $(data.rows).each(function(key,value){
                            if(value.gTag == undefined)
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.USER+"]</option>";
                            else
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.GROUP+"]</option>";
                    })
                    $('#guserRa_item_cid').html(options);
                     select_add_title("guserRa_item_cid");
                }
           );

	} else if(tag == 3) {
            tree_auth_change();
            $('#local_addr').css("display","");
            $('#local_port').css("display","");
            $('#radius1').css("display","none");
            $('#radius2').css("display","none");
            $('#radius3').css("display","none");
            $('#ldap').css("display","");
            $('#ldap1').css("display","");
            $('#ldap2').css("display","");
//		$('#ldap3').css("display","");
//		$('#ldap4').css("display","");
            $('#ldap5').css("display","");
            $('#ldap6').css("display","");
            $('#ldap7_user1').css("display","");
            $('#ldap8_role1').css("display","");
            $('#local_adv').css("display","none");
            $('#radius_adv').css("display","none");
            $('#adv_radius_conf').css("display","none");
            $('#adv_radius_conf2').css("display","none");
            $('#adv_radius_conf3').css("display","none");
            $('#adv_radius_conf4').css("display","none");
            $('#adv_radius_conf5').css("display","none");
            $('#adv_radius_conf6').css("display","none");
            $('#adv_radius_conf7').css("display","none");
            $('#adv_local_conf').css("display","none");
            $('#ldap_adv').css("display","");
            $('#tacas_adv').css("display","none");
            $('#adv_tacas_conf').css("display","none");
            $('#adv_tacas_conf2').css("display","none");
            $('#adv_tacas_conf3').css("display","none");
            $('#adv_tacas_conf4').css("display","none");

            $("#serv_addr").textbox('enableValidation');
            $("#serv_port").textbox('enableValidation');
            $("#serv_sharesecret").textbox('disableValidation');
            $("#serv_ldap_dn").textbox('enableValidation');
            //$("#serv_ldap_name").textbox('disableValidation');
            //$("#serv_ldap_pass").textbox('disableValidation');
            $("#ldap_user_othervalue1").textbox('disableValidation');
            $("#ldap_user_othervalue2").textbox('disableValidation');
            $("#ldap_user_othervalue3").textbox('disableValidation');
            $("#ldap_user_othervalue4").textbox('disableValidation');
            $("#ldap_attr_role_othervalue").textbox('disableValidation');
            $("#ldap_attr_role").textbox('disableValidation');
            $('#port_notice').text('[1-65535,'+$LANG.DEFAULT+':389]');
            get_auser_options('d_guserLa_item_cid','selLa_auser_num');
        //$("#ldap_attr_role").textbox('disableValidation');
        /*$("#ldap_user1").combobox('disableValidation');
        $("#ldap_user2").combobox('disableValidation');
        $("#ldap_user3").combobox('disableValidation');
        $("#ldap_user_group1").combobox('disableValidation');
        $("#ldap_type").combobox('disableValidation');*/
            type_change();
            $.getJSON(
                "?c=Auth/User&a=userAndGroup",
                function(data){
                    var options;
                    $(data.rows).each(function(key,value){
                            if(value.gTag == undefined)
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.USER+"]</option>";
                            else
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.GROUP+"]</option>";
                    })
                    $('#guserLa_item_cid').html(options);
                     select_add_title("guserLa_item_cid");
                }
           );
	} else if(tag == 4) {
            $('#local_addr').css("display","");
            $('#local_port').css("display","");
            $('#radius1').css("display","");
            $('#radius2').css("display","");
            $('#radius3').css("display","none");
            $('#ldap').css("display","none");
            $('#ldap1').css("display","none");
            $('#ldap2').css("display","none");
            $('#ldap3').css("display","none");
            $('#ldap4').css("display","none");
            $('#ldap5').css("display","none");
            $('#ldap6').css("display","none");
            $('#ldap7_user1').css("display","none");
            $('#ldap7_user2').css("display","none");
            $('#ldap7_user3').css("display","none");
            $('#ldap7_user4').css("display","none");
            $('#ldap8_role1').css("display","none");
            $('#ldap8_role2').css("display","none");
            $('#local_adv').css("display","none");
            $('#radius_adv').css("display","none");
            $('#adv_radius_conf').css("display","none");
            $('#adv_radius_conf2').css("display","none");
            $('#adv_radius_conf3').css("display","none");
            $('#adv_radius_conf4').css("display","none");
            $('#adv_radius_conf5').css("display","none");
            $('#adv_radius_conf6').css("display","none");
            $('#adv_radius_conf7').css("display","none");
            $('#adv_local_conf').css("display","none");
            $('#ldap_adv').css("display","none");
            $('#adv_ldap_conf').css("display","none");
            $('#adv_ldap_conf2').css("display","none");
            $('#adv_ldap_conf3').css("display","none");
            $('#adv_ldap_conf4').css("display","none");
            $('#adv_ldap_conf5').css("display","none");
            $('#tacas_adv').css("display","");

            $("#serv_addr").textbox('enableValidation');
            $("#serv_port").textbox('enableValidation');
            $("#serv_sharesecret").textbox('enableValidation');
            $("#serv_ldap_dn").textbox('disableValidation');
            $("#serv_ldap_name").textbox('disableValidation');
            $("#serv_ldap_pass").textbox('disableValidation');
            $("#ldap_user_othervalue1").textbox('disableValidation');
            $("#ldap_user_othervalue2").textbox('disableValidation');
            $("#ldap_user_othervalue3").textbox('disableValidation');
            $("#ldap_user_othervalue4").textbox('disableValidation');
            $("#ldap_attr_role_othervalue").textbox('disableValidation');
            $("#ldap_attr_role").textbox('disableValidation');
            $('#port_notice').text('[1-65535,'+$LANG.DEFAULT+':49]');
            get_auser_options('d_guserTa_item_cid','selTa_auser_num');
        /*$("#ldap_user1").combobox('disableValidation');
        $("#ldap_user2").combobox('disableValidation');
        $("#ldap_user3").combobox('disableValidation');
        $("#ldap_user_group1").combobox('disableValidation');
        $("#ldap_type").combobox('disableValidation');*/
        $.getJSON(
                "?c=Auth/User&a=userAndGroup",
                function(data){
                    var options;
                    $(data.rows).each(function(key,value){
                            if(value.gTag == undefined)
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.USER+"]</option>";
                            else
                                    options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.GROUP+"]</option>";
                    })
                    $('#guserTa_item_cid').html(options);
                     select_add_title("guserTa_item_cid");
                }
           );
    }
	if(tag != 3) {
		if($("#serverDiv2").css("height") == "500px") {
			$("#serverDiv2").css("height", "");
			$("#serverDiv2").css("overflow-y", "false");
		}
	}	
}

function advanced_local() {
    if($('#local_img').html().indexOf('arrow_down') > -1)
        $('#local_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_up.gif"/>');
    else
        $('#local_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_down.gif"/>');

	$("#adv_local_conf").toggle();
	if($("#serverDiv2").css("height") == "500px") {
		$("#serverDiv2").css("height", "");
		$("#serverDiv2").css("overflow-y", "false");
	}
}

function advanced_radius() {
    if($('#radius_img').html().indexOf('arrow_down') > -1)
        $('#radius_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_up.gif"/>');
    else
        $('#radius_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_down.gif"/>');
    
	$("#adv_radius_conf").toggle();
	$("#adv_radius_conf2").toggle();
	$("#adv_radius_conf3").toggle();
	$("#adv_radius_conf4").toggle();
	$("#adv_radius_conf5").toggle();
	$("#adv_radius_conf6").toggle();
        $("#adv_radius_conf7").toggle();
	if($("#serverDiv2").css("height") == "500px") {
		$("#serverDiv2").css("height", "");
		$("#serverDiv2").css("overflow-y", "false");
	}
}

function advanced_ldap() {
    if($('#ldap_img').html().indexOf('arrow_down') > -1)
        $('#ldap_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_up.gif"/>');
    else
        $('#ldap_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_down.gif"/>');

	$("#adv_ldap_conf").toggle();
	$("#adv_ldap_conf2").toggle();
	$("#adv_ldap_conf3").toggle();
	$("#adv_ldap_conf4").toggle();
        $("#adv_ldap_conf5").toggle();
	if($("#serverDiv2").css("height") == "500px") {
		$("#serverDiv2").css("height", "");
		$("#serverDiv2").css("overflow-y", "false");
	} else {
		$("#serverDiv2").css("height", "500px");
		$("#serverDiv2").css("overflow-y", "auto");
	}
}

function advanced_tacas() {
    if($('#tacas_img').html().indexOf('arrow_down') > -1)
        $('#tacas_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_up.gif"/>');
    else
        $('#tacas_img').html('<img src="'+NG_PATH+'Public/images/icon/arrow_down.gif"/>');

    $("#adv_tacas_conf").toggle();
    $("#adv_tacas_conf2").toggle();
    $("#adv_tacas_conf3").toggle();
    $("#adv_tacas_conf4").toggle();
    
    if($("#serverDiv2").css("height") == "500px") {
        $("#serverDiv2").css("height", "");
        $("#serverDiv2").css("overflow-y", "false");
    }
}

function whole_conf() {
    sms_tag = 0;
	$('#whole-div').css("display","");
	$('#local-div').css("display","none");
    $('#sms-div').css("display","none");
    $('#email-div').css("display","none");
}

function change_style1() {
	$("#wholeStyle").removeClass("unselectStyle").addClass("selectStyle");
	$("#localStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#smsStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#eamilStyle").removeClass("selectStyle").addClass("unselectStyle");
}

function local_conf() {
    sms_tag = 0;
	$('#whole-div').css("display","none");
	$('#local-div').css("display","");
    $('#sms-div').css("display","none");
    $('#email-div').css("display","none");
}
function change_style2() {
	$("#wholeStyle").removeClass("selectStyle").addClass("unselectStyle");
	$("#localStyle").removeClass("unselectStyle").addClass("selectStyle");
    $("#smsStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#eamilStyle").removeClass("selectStyle").addClass("unselectStyle");
}

function sms_conf() {
    sms_tag = 1;
    $('#whole-div').css("display","none");
    $('#local-div').css("display","none");
    $('#sms-div').css("display","");
    $('#email-div').css("display","none");
}
function change_style3() {
    $("#wholeStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#localStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#smsStyle").removeClass("unselectStyle").addClass("selectStyle");
    $("#eamilStyle").removeClass("selectStyle").addClass("unselectStyle");
}

function email_conf() {
    sms_tag = 0;
    $('#whole-div').css("display","none");
    $('#local-div').css("display","none");
    $('#sms-div').css("display","none");
    $('#email-div').css("display","");
}
function change_style4() {
    $("#wholeStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#localStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#smsStyle").removeClass("selectStyle").addClass("unselectStyle");
    $("#eamilStyle").removeClass("unselectStyle").addClass("selectStyle");
}
function changswitch1(obj) {
	if(obj.title=='close'){
		obj.src= NG_PATH+"Public/images/image/stop.png";
		obj.title='open';
		auto_add_tag = "no";
	} else {
		obj.src=NG_PATH+"Public/images/image/start.png";
		obj.title='close';
		auto_add_tag = "yes";
	}
}

function changswitch2(obj) {
	if(obj.title=='close'){
		obj.src=NG_PATH+"Public/images/image/stop.png";
		obj.title='open';
		radius_charge_tag = "no";
	} else {
		obj.src= NG_PATH+"Public/images/image/start.png";
		obj.title='close';
		radius_charge_tag = "yes";
	}
}

function add_auth_serv(tag,selUser,selGroup) {
    var isValid = $("#auth_server_form").form('validate');
    if(!isValid) {
        return false;
    }

	var ldap_check;
	var user_member;
	var group_member;
	var stype = $('input[name="serv_type"]:checked').val();
    var radiusRetry = $('#serv_radius_retry').val();
    //用户组
    var user_item=new Array();
    var group_item=new Array();
    if(stype=="radius"){
        $("#d_guserRa_item_cid option").each(function(){
            if($(this).text().indexOf($LANG.USER)>=0)
                user_item.push($(this).val());
            else
                group_item.push($(this).val());
        });
    }else if(stype=="ldap"){
        $("#d_guserLa_item_cid option").each(function(){
            if($(this).text().indexOf($LANG.USER)>=0)
                user_item.push($(this).val());
            else
                group_item.push($(this).val());
        });
    }else if(stype=="tacacs"){
        $("#d_guserTa_item_cid option").each(function(){
            if($(this).text().indexOf($LANG.USER)>=0)
                user_item.push($(this).val());
            else
                group_item.push($(this).val());
        });
    }else{
        $("#d_guser_item_cid option").each(function(){
            if($(this).text().indexOf($LANG.USER)>=0)
                user_item.push($(this).val());
            else
                group_item.push($(this).val());
        });
    }
    if(user_item != "")
        user_member = user_item.join(',');
    if(group_item != "")
        group_member = group_item.join(',');

    var delUser = '';
    var delGroup = '';
    var addUser = '';
    var initUser = '';
    var initServer = '';
    if(tag == 2) {
        var sUser = $.trim(selUser).split(",");
        var umem = $.trim(user_member).split(",");
        for(var i=0;i<sUser.length;i++) {
            if( $.inArray(sUser[i], umem) < 0 && sUser[i] != "")
                delUser = delUser + sUser[i] + ',';
        }
        for(var i=0;i<umem.length;i++) {
            if( $.inArray(umem[i], sUser) < 0 && umem[i] != "")
                addUser = addUser + umem[i] + ',';
        }
        var sGro = $.trim(selGroup).split(",");
        var gmem = $.trim(group_member).split(",");
        for(var i=0;i<sGro.length;i++) {
            if( $.inArray(sGro[i], gmem) < 0 && sGro[i] != "")
                delGroup = delGroup + sGro[i] + ',';
        }
    }
    
    var sUser = $.trim(selUser).split(",");
    var umem = $.trim(user_member).split(",");
    for(var i=0;i<umem.length;i++) {
        for(var j=0;j<user_server.length;j++) {
            if(umem[i] == user_server[j]['name'] && $('#serv_name').val() != user_server[j]['server'] && user_server[j]['server'] != "null") {
                initUser = initUser + umem[i] + ',';
                initServer = initServer + user_server[j]['server'] + ',';
                break;
            }
        }
    }
    if(stype == "radius") {
        $.ajax({
            url: "?c=Auth/Server&a=serverAdd",
            type: 'POST',
            datatype:'text',
            data:{
                hid_serv_name:$('#serv_name').val(),
                hid_serv_addr:$('#serv_addr').val(),
                hid_serv_port:$('#serv_port').val()?$('#serv_port').val():1812,
                server_add_tag:tag,
                hid_serv_type:stype,
                hid_radius_auth:$("#radius_auth").combobox('getValue'),
                hid_serv_clientip:$('#serv_clientip').textbox('getValue'),
                hid_serv_sharesecret:$('#serv_sharesecret').val(),
                hid_serv_radius_max:$('#serv_radius_max').val(),
                hid_serv_radius_retry:radiusRetry?radiusRetry:3,
                hid_serv_radius_code:$('#serv_radius_code').combobox('getValue'),
                hid_user_auto_add:auto_add_tag,
                hid_radius_charge:radius_charge_tag,
                hid_serv_radius_sep:$('#serv_radius_sep').val(),
                hid_user_member:user_member,
                hid_group_member:group_member,
                hid_init_user:initUser,
                hid_del_server:initServer,
                hid_del_user:delUser,
                hid_del_group:delGroup,
                hid_add_user:addUser
            },
            success: function(data){
                if(data=='0'){
                   $("#add_server_div").window("close");
                   $('#tt').datagrid('reload');
                } else {
                     ngtosPopMessager("error", data);
                }
            }
        });
    } else if(stype == "ldap") {
        var tree_auth_type = $('#tree_auth_type').combobox('getValue');
        if(tree_auth_type == "actuality"){
            ldap_check = "yes";
        }else{
            ldap_check = "no";
        }

        var typeVal = $('#ldap_type').combobox('getValue');
        var userVal;
        var groVal;
        if(typeVal == 'ad') {
            userVal = $('#ldap_user1').combobox('getValue');
            groVal = $('#ldap_user_group1').combobox('getValue');
            if(userVal == "other") {
                userVal = $('#ldap_user_othervalue1').val();
            }
            if(groVal == "other") {
                groVal = $('#ldap_attr_role_othervalue').val();
            }
        } else if(typeVal == 'novell') {
            userVal = $('#ldap_user2').combobox('getValue');
            groVal = $('#ldap_attr_role').val();
            if(userVal == "other") {
                userVal = $('#ldap_user_othervalue2').val();
            }
        } else if(typeVal == 'sun') {
            userVal = $('#ldap_user3').combobox('getValue');
            groVal = $('#ldap_attr_role').val();
            if(userVal == "other") {
                    userVal = $('#ldap_user_othervalue3').val();
            }
        } else if(typeVal == 'other') {
            userVal = $('#ldap_user_othervalue4').val();
            groVal = $('#ldap_attr_role').val();
        }

        $.ajax({
            url: "?c=Auth/Server&a=serverAdd",
            type: 'POST',
            datatype:'text',
            data:{
                hid_serv_name:$('#serv_name').val(),
                hid_serv_addr:$('#serv_addr').val(),
                hid_serv_port:$('#serv_port').val()?$('#serv_port').val():389,
                server_add_tag:tag,
                hid_serv_type:stype,
                hid_serv_ldap_dn:$('#serv_ldap_dn').val(),
                hid_ldap_type:$('#ldap_type').combobox('getValue'),
                hid_ldap_check:ldap_check,
                hid_serv_ldap_name:$('#serv_ldap_name').val(),
                hid_serv_ldap_pass:$('#serv_ldap_pass').val(),
                hid_serv_ldap_filter:$('#serv_ldap_filter').val(),
                hid_ldap_range:$('#ldap_range').combobox('getValue'),
                hid_serv_ldap_max:$('#serv_ldap_max').val(),
                hid_serv_ldap_code:$('#serv_ldap_code').combobox('getValue'),
                hid_user_auto_add:auto_add_tag,
                hid_serv_ldap_sep:$('#serv_ldap_sep').val(),
                hid_ldap_user:userVal,
                hid_ldap_user_group:groVal,
                hid_user_member:user_member,
                hid_group_member:group_member,
                hid_init_user:initUser,
                hid_del_server:initServer,
                hid_del_user:delUser,
                hid_del_group:delGroup,
                hid_add_user:addUser
            },
            success: function(data){
                if(data=='0'){
                    $("#add_server_div").window("close");
                    $('#tt').datagrid('reload');
                } else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    } else if(stype == "tacacs") {
        $.ajax({
            url: "?c=Auth/Server&a=serverAdd",
            type: 'POST',
            datatype:'text',
            data:{
                hid_serv_name:$('#serv_name').val(),
                hid_serv_addr:$('#serv_addr').val(),
                hid_serv_port:$('#serv_port').val()?$('#serv_port').val():49,
                server_add_tag:tag,
                hid_serv_type:stype,
                hid_tacacs_auth:$("#radius_auth").combobox('getValue'),
                hid_serv_sharesecret:$('#serv_sharesecret').val(),
                hid_serv_tacas_max:$('#serv_tacas_max').val(),
                hid_serv_tacas_code:$('#serv_tacas_code').combobox('getValue'),
                hid_user_auto_add:auto_add_tag,
                hid_user_member:user_member,
                hid_group_member:group_member,
                hid_init_user:initUser,
                hid_del_server:initServer,
                hid_del_user:delUser,
                hid_del_group:delGroup,
                hid_add_user:addUser
            },
            success: function(data){
                if(data=='0'){
                    $("#add_server_div").window("close");
                    $('#tt').datagrid('reload');
                }
                else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    } else {
//        var user_item=new Array();
//        var group_item=new Array();
//        $("#d_guser_item_cid option").each(function(){
//            if($(this).text().indexOf($LANG.USER)>=0)
//                user_item.push($(this).val());
//            else
//                group_item.push($(this).val());
//        });
//        if(user_item != "")
//            user_member = user_item.join(',');
//        if(group_item != "")
//            group_member = group_item.join(',');
//
//        var delUser = '';
//        var delGroup = '';
//        var addUser = '';
//        var initUser = '';
//        var initServer = '';
//        if(tag == 2) {
//            var sUser = $.trim(selUser).split(",");
//            var umem = $.trim(user_member).split(",");
//            for(var i=0;i<sUser.length;i++) {
//                if( $.inArray(sUser[i], umem) < 0 && sUser[i] != "")
//                    delUser = delUser + sUser[i] + ',';
//            }
//            for(var i=0;i<umem.length;i++) {
//                if( $.inArray(umem[i], sUser) < 0 && umem[i] != "")
//                    addUser = addUser + umem[i] + ',';
//            }
//            var sGro = $.trim(selGroup).split(",");
//            var gmem = $.trim(group_member).split(",");
//            for(var i=0;i<sGro.length;i++) {
//                if( $.inArray(sGro[i], gmem) < 0 && sGro[i] != "")
//                    delGroup = delGroup + sGro[i] + ',';
//            }
//        }
//
//        var sUser = $.trim(selUser).split(",");
//        var umem = $.trim(user_member).split(",");
//        for(var i=0;i<umem.length;i++) {
//            for(var j=0;j<user_server.length;j++) {
//                if(umem[i] == user_server[j]['name'] && $('#serv_name').val() != user_server[j]['server'] && user_server[j]['server'] != "null") {
//                    initUser = initUser + umem[i] + ',';
//                    initServer = initServer + user_server[j]['server'] + ',';
//                    break;
//                }
//            }
//        }

        $.ajax({
            url: "?c=Auth/Server&a=serverAdd",
            type: 'POST',
            datatype:'text',
            data:{
                hid_serv_name:$('#serv_name').val(),
                hid_serv_addr:'127.0.0.1',
                hid_serv_port:'3307',
                server_add_tag:tag,
                hid_serv_type:stype,
                hid_user_member:user_member,
                hid_group_member:group_member,
                hid_del_user:delUser,
                hid_del_group:delGroup,
                hid_add_user:addUser,
                hid_init_user:initUser,
                hid_del_server:initServer
            },
            success: function(data){
                if(data=='0'){
                     $("#add_server_div").window("close");
                     $('#tt').datagrid('reload');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}

function add_whole_conf() {
    var isValid = $("#whole_attr_form").form('validate');
    if(!isValid) {
        return false;
    }
	if($("#cert_auth").prop("checked")!=true && $("#pass_auth").prop("checked")!=true && $("#msg_auth").prop("checked")!=true) {
        ngtosPopMessager("error", $LANG.SELECT_AUTH_FACTOR);
		return;
	}
    if($('input[name="pass_reset_type"]:checked').val() == 'mail' && $('#mail_host').val() == '') {
        ngtosPopMessager("error", $LANG.PLEASE_MAIL_SERVER_SET);
        return;
    }
    //if($('input[name="mail_server_type"]:checked').val() == 'esmtp'){
        var mailServerAuthUser = $('#mail_server_auth_user').val();
        var mailServerAuthPasswd = $('#mail_server_auth_passwd').val();
    /*}else{
        var mailServerAuthUser = '';
        var mailServerAuthPasswd = '';
    }*/
	if($("#cert_auth").prop("checked"))
		var certAuth = "yes";
	else
		var certAuth = "no";
	if($("#pass_auth").prop("checked"))
		var passAuth = "yes";
	else
		var passAuth = "no";
	if($("#msg_auth").prop("checked"))
		var msgAuth = "yes";
	else
		var msgAuth = "no";
	if($("#more_login_whole").prop("checked"))
		var moreLoginCheck = "yes";
	else
		var moreLoginCheck = "no";

    var access_ip = $('#more_login_addr').combotree('getText');
    if(access_ip == '')
        access_ip= 'null';
    var access_time = $('#more_login_time').combotree('getText');
    if(access_time == '')
        access_time= 'null';

    if($("#pass_diff").prop("checked"))
		var passDiff = "yes";
	else
		var passDiff = "no";
	if($("#pass_account").prop("checked"))
		var passAccount = "yes";
	else
		var passAccount = "no";
	if($("#char_lower").prop("checked"))
		var charLower = "yes";
	else
		var charLower = "no";
	if($("#char_upper").prop("checked"))
		var charUpper = "yes";
	else
		var charUpper = "no";
	if($("#char_digit").prop("checked"))
		var charDigit = "yes";
	else
		var charDigit = "no";
	if($("#char_punct").prop("checked"))
		var charPunct = "yes";
	else
		var charPunct = "no";
	if($("#pass_limit").prop("checked"))
		var passLimit = "yes";
	else
		var passLimit = "no";

	if($("#change_pass").prop("checked"))
		var changePass = "yes";
	else
		var changePass = "no";
	if($("#deny_change").prop("checked"))
		var denyChange = "yes";
	else
		var denyChange = "no";
	if($("#first_login").prop("checked"))
		var firstLogin = "yes";
	else
		var firstLogin = "no";
	if($("#termly_change").prop("checked"))
		var termlyChange = "yes";
	else
		var termlyChange = "no";

	if($("#pass_invalid").prop("checked"))
		var passInvalid = "yes";
	else
		var passInvalid = "no";
	if($("#change_mail").prop("checked"))
		var changeMail = "yes";
	else
		var changeMail = "no";
	if($("#change_phone").prop("checked"))
		var changePhone = "yes";
	else
		var changePhone = "no";
	
	if($("#fail_login_limit").prop("checked"))
		var failLoginCheck = "yes";
	else
		var failLoginCheck = "no";
	if($("#pass_reset_limit").prop("checked"))
		var passReseCheck = "yes";
	else
		var passReseCheck = "no";

	$.ajax({
		url: "?c=Auth/Server&a=authAttrSet",
		type: 'POST',
		datatype:'text',
		data:{
			hid_cert_auth:certAuth,
			hid_pass_auth:passAuth,
			hid_msg_auth:msgAuth,			
			hid_more_login_whole:moreLoginCheck,
			hid_login_num_whole:$('#login_num_whole').val(),
            hid_access_ip:access_ip,
            hid_access_time:access_time,
			hid_fail_login_limit:failLoginCheck,
			hid_max_auth_fail:$("#max_auth_fail").val(),
			hid_accout_lock_time:$("#accout_lock_time").val(),
			hid_pass_reset_limit:passReseCheck,
			hid_pass_reset_max:$("#pass_reset_max").val(),
			hid_pass_reset_interval:$("#pass_reset_interval").val(),
			hid_pass_reset_type:$('input[name="pass_reset_type"]:checked').val(),
			hid_pass_diff:passDiff,
			hid_pass_account:passAccount,
			hid_char_lower:charLower,
			hid_char_upper:charUpper,
			hid_char_digit:charDigit,
			hid_char_punct:charPunct,
			hid_pass_limit:passLimit,
			hid_pass_min:$("#pass_min").val(),
			hid_pass_max:$("#pass_max").val(),
			hid_change_pass:changePass,
			hid_deny_change:denyChange,
			hid_first_login:firstLogin,
			hid_termly_change:termlyChange,
			hid_pass_interval:$("#pass_interval").val(),
			hid_pass_invalid:passInvalid,
			hid_invalid_period:$("#invalid_period").val(),
			hid_change_mail:changeMail,
			hid_change_phone:changePhone,
            hid_mail_server_type:$('input[name="mail_server_type"]:checked').val(), //邮箱服务器参数
            hid_mail_time_out:$("#mail_time_out").val(),
            hid_mail_server_host:$("#mail_host").val(),
            hid_mail_server_port:$("#mail_port").val(),
            hid_mail_server_auth_user:mailServerAuthUser,
            hid_mail_server_auth_passwd:mailServerAuthPasswd
		},
		success: function(data, textStatus){
			if(data=='0'){
                $("#server_whole_conf_div").window("close");
				$('#tt').datagrid('reload');
			} else {
                ngtosPopMessager("error", data);
			}
		}
	});
}

function modify_whole_serv(name) {
    var isValid = $("#third_form").form('validate');
    if(!isValid) {
        return false;
    }
	if($("#obey_global_conf").prop("checked"))
		var globalConf = "yes";
	else {
		var globalConf = "no";
		if(!$("#whole_cert_auth").prop("checked") && !$("#whole_pass_auth").prop("checked") && !$("#whole_msg_auth").prop("checked")) {
            ngtosPopMessager("error", $LANG.SELECT_AUTH_FACTOR);
			return;
		}
		if($("#whole_cert_auth").prop("checked"))
			var  certAuth = "yes";
		else
			var  certAuth = "no";
		if($("#whole_pass_auth").prop("checked"))
			var passAuth = "yes";
		else
			var passAuth = "no";
		if($("#whole_msg_auth").prop("checked"))
			var msgAuth = "yes";
		else
			var msgAuth = "no";
		if($("#whole_more_login").prop("checked"))
			var moreLoginCheck = "yes";
		else
			var moreLoginCheck = "no";
	}
    var access_ip = $('#whole_more_login_addr').combotree('getText');
    if(access_ip == '')
        access_ip= 'null';
    var access_time = $('#whole_more_login_time').combotree('getText');
    if(access_time == '')
        access_time= 'null';

	$.ajax({
		url: "?c=Auth/Server&a=wholeServModify",
		type: 'POST',
		datatype:'text',
		data:{
			hid_obey_global_conf:globalConf,
			hid_serv_name:name,
			hid_cert_auth:certAuth,			
			hid_pass_auth:passAuth,
			hid_msg_auth:msgAuth,
			hid_more_login_whole:moreLoginCheck,
			hid_login_num_whole:$('#whole_login_num').val(),
            hid_access_ip:access_ip,
            hid_access_time:access_time
		},
		success: function(data){
			if(data=='0'){
                $("#server_third_conf_div").window("close");
				$('#tt').datagrid('reload');
			} else {
                ngtosPopMessager("error", data);
			}
		}
	});
}

function modify_local_server(name) {
    var isValid = $("#local_attr_form").form('validate');
    if(!isValid) {
        return false;
    }
	if($("#obey_local_conf").prop("checked"))
		var globalConf = "yes";
	else {
		var globalConf = "no";
		if($("#local_cert_auth").prop("checked")!=true && $("#local_pass_auth").prop("checked")!=true && $("#local_msg_auth").prop("checked")!=true) {
            ngtosPopMessager("error", $LANG.SELECT_AUTH_FACTOR);
			return;
		}
        /*if($('input[name="local_pass_reset_type"]:checked').val() == 'mail' && $('#local_mail_host').val() == '') {
            ngtosPopMessager("error", $LANG.PLEASE_MAIL_SERVER_SET);
            return;
        }*/
        //if($('input[name="local_mail_server_type"]:checked').val() == 'esmtp'){
            var localMailServerAuthUser = $('#local_mail_server_auth_user').val();
            var localMailServerAuthPasswd = $('#local_mail_server_auth_passwd').val();
        /*}else{
            var localMailServerAuthUser = '';
            var localMailServerAuthPasswd = '';
        }*/
		if($("#local_cert_auth").prop("checked"))
			var certAuth = "yes";
		else
			var certAuth = "no";
		if($("#local_pass_auth").prop("checked"))
			var passAuth = "yes";
		else
			var passAuth = "no";
		if($("#local_msg_auth").prop("checked"))
			var msgAuth = "yes";
		else
			var msgAuth = "no";
		if($("#local_more_login_whole").prop("checked"))
			var moreLoginCheck = "yes";
		else
			var moreLoginCheck = "no";

        var access_ip = $('#local_more_login_addr').combotree('getText');
        if(access_ip == '')
            access_ip= 'null';
        var access_time = $('#local_more_login_time').combotree('getText');
        if(access_time == '')
            access_time= 'null';
		if($("#local_pass_diff").prop("checked"))
			var passDiff = "yes";
		else
			var passDiff = "no";
		if($("#local_pass_account").prop("checked"))
			var passAccount = "yes";
		else
			var passAccount = "no";
		if($("#local_char_lower").prop("checked"))
			var charLower = "yes";
		else
			var charLower = "no";
		if($("#local_char_upper").prop("checked"))
			var charUpper = "yes";
		else
			var charUpper = "no";
		if($("#local_char_digit").prop("checked"))
			var charDigit = "yes";
		else
			var charDigit = "no";
		if($("#local_char_punct").prop("checked"))
			var charPunct = "yes";
		else
			var charPunct = "no";
		if($("#local_pass_limit").prop("checked"))
			var passLimit = "yes";
		else
			var passLimit = "no";

		if($("#local_change_pass").prop("checked"))
			var changePass = "yes";
		else
			var changePass = "no";
		if($("#local_deny_change").prop("checked"))
			var denyChange = "yes";
		else
			var denyChange = "no";
		if($("#local_first_login").prop("checked"))
			var firstLogin = "yes";
		else
			var firstLogin = "no";
		if($("#local_termly_change").prop("checked"))
			var termlyChange = "yes";
		else
			var termlyChange = "no";
		if($("#local_pass_invalid").prop("checked"))
			var passInvalid = "yes";
		else
			var passInvalid = "no";
		if($("#local_change_mail").prop("checked"))
			var changeMail = "yes";
		else
			var changeMail = "no";
		if($("#local_change_phone").prop("checked"))
			var changePhone = "yes";
		else
			var changePhone = "no";
		
		if($("#local_fail_login_limit").prop("checked"))
			var failLoginCheck = "yes";
		else
			var failLoginCheck = "no";

		if($("#local_pass_reset_limit").prop("checked"))
			var passReseCheck = "yes";
		else
			var passReseCheck = "no";
	}
	
	$.ajax({
		url: "?c=Auth/Server&a=authAttrSet",
		type: 'POST',
		datatype:'text',
		data:{
			hid_obey_global_conf:globalConf,
			hid_serv_name:name,
			hid_cert_auth:certAuth,
			hid_pass_auth:passAuth,
			hid_msg_auth:msgAuth,			
			hid_more_login_whole:moreLoginCheck,
			hid_login_num_whole:$('#local_login_num_whole').val(),
            hid_access_ip:access_ip,
            hid_access_time:access_time,
			hid_fail_login_limit:failLoginCheck,
			hid_max_auth_fail:$("#local_max_auth_fail").val(),
			hid_accout_lock_time:$("#local_accout_lock_time").val(),
			hid_pass_reset_limit:passReseCheck,
			hid_pass_reset_max:$("#local_pass_reset_max").val(),
			hid_pass_reset_interval:$("#local_pass_reset_interval").val(),
			hid_pass_reset_type:$('input[name="local_pass_reset_type"]:checked').val(),
			hid_pass_diff:passDiff,
			hid_pass_account:passAccount,
			hid_char_lower:charLower,
			hid_char_upper:charUpper,
			hid_char_digit:charDigit,
			hid_char_punct:charPunct,
			hid_pass_limit:passLimit,
			hid_pass_min:$("#local_pass_min").val(),
			hid_pass_max:$("#local_pass_max").val(),
			hid_change_pass:changePass,
			hid_deny_change:denyChange,
			hid_first_login:firstLogin,
			hid_termly_change:termlyChange,
			hid_pass_interval:$("#local_pass_interval").val(),
			hid_pass_invalid:passInvalid,
			hid_invalid_period:$("#local_invalid_period").val(),
			hid_change_mail:changeMail,
			hid_change_phone:changePhone,
            hid_mail_server_type:$('input[name="local_mail_server_type"]:checked').val(), //邮箱服务器参数
            hid_mail_time_out:$("#local_mail_time_out").val(),
            hid_mail_server_host:$("#local_mail_host").val(),
            hid_mail_server_port:$("#local_mail_port").val(),
            hid_mail_server_auth_user:localMailServerAuthUser,
            hid_mail_server_auth_passwd:localMailServerAuthPasswd,
			action: 'local_serv_modify'
		},
		success: function(data){
			if(data=='0'){
                $("#server_local_conf_div").window("close");
				$('#tt').datagrid('reload');
			} else {
                ngtosPopMessager("error", data);
			}
		}
	});
}

$.fn.disable = function() { 
	return $(this).find("*").each(function() { 
	$(this).attr("disabled", "disabled"); 
	}); 
} 

$.fn.enable = function() { 
	return $(this).find("*").each(function() { 
		$(this).removeAttr("disabled"); 
	}); 
}

function disable_whole_self() {
	if($("#obey_global_conf").prop("checked")) {
        $("#disable_global").disable();
        $("#whole_global_week").combobox('disable');
        $("#whole_global_st_time").timespinner('disable');
        $("#whole_global_end_time").timespinner('disable');
        $('#whole_more_login_addr').combotree('disable');
        $('#whole_more_login_time').combotree('disable');
    } else {
        $("#disable_global").enable();
        $("#whole_global_week").combobox('enable');
        $("#whole_global_st_time").timespinner('enable');
        $("#whole_global_end_time").timespinner('enable');
        $('#whole_more_login_addr').combotree('enable');
        $('#whole_more_login_time').combotree('enable');
        multi_disabled3();
    }
}

function disable_local_self() {
	if($("#obey_local_conf").prop("checked")) {
		$("#disable_local").disable(); 
		$("#local_ipaddr_st").disable();
        $("#local_ipaddr_end").disable();
        $("#local_global_week").combobox('disable');
        $("#local_global_st_time").timespinner('disable');
        $("#local_global_end_time").timespinner('disable');
        $('#local_more_login_addr').combotree('disable');
        $('#local_more_login_time').combotree('disable');
	} else {
		$("#disable_local").enable();
        $("#local_ipaddr_st").enable();
        $("#local_ipaddr_end").enable();
        $("#local_global_week").combobox('enable');
        $("#local_global_st_time").timespinner('enable');
        $("#local_global_end_time").timespinner('enable');
        $('#local_more_login_addr').combotree('enable');
        $('#local_more_login_time').combotree('enable');
        disabled_text2();
        if($('input[name="local_pass_reset_type"]:checked').val() == 'no') {
            $("#local_pass_reset_limit").attr("checked", false);
            $("#local_pass_reset_limit").attr("disabled", "disabled");
        }
        localResetPwdType();
	}
}

function whole_attr(name, msg) {
    grtag=8;
    param[0] = name;
    if ($('#server_third_conf_div').length <= 0) {
        $(document.body).append("<div id='server_third_conf_div' class='ngtos_window_550'></div>");
    }
    open_window('server_third_conf_div','Auth/Server','windowShow&w=auth_server_third_conf_window',msg);
}

function local_attr(name, msg) {
    grtag=7;
    param[0] = name;
    if ($('#server_local_conf_div').length <= 0) {
        $(document.body).append("<div id='server_local_conf_div' class='ngtos_window_550'></div>");
    }
    authServerWindow('server_local_conf_div','Auth/Server','windowShow&w=auth_server_local_conf_window',msg);
}

function get_auser_options(d_cid,sel_num) {
//    var src_from = $("#d_guser_item_cid").get(0);
    var src_from = $("#"+d_cid).get(0);
    parent.moveSelNum = src_from.options.length;
//    $('#sel_auser_num').html($LANG.SELECTED+ parent.moveSelNum +$LANG.SEVERAL);
    $('#'+sel_num).html($LANG.SELECTED+ parent.moveSelNum +$LANG.SEVERAL);
}

function local_edit_serve(name, host, port, msg) {
    parent.sourOptions = [];
    parent.selOptions = [];
    server_add_tag = 2;
    server_type_tag = 1;
    param[0] = name;
    param[1] = host;
    param[2] = port;

    if ($('#add_server_div').length <= 0) {
        $(document.body).append("<div id='add_server_div' class='ngtos_window_550'></div>");
    }
    authServerWindow('add_server_div','Auth/Server','windowShow&w=auth_server_add_window',msg);
}

function radius_edit_serve(name, host, port, mode, secret, clientip, timeout, retry, charset, autoadd, useaccoun, separator, msg) {
	server_add_tag = 2;
    server_type_tag = 2;
    param[0] = name;
    param[1] = host;
    param[2] = port;
    param[3] = mode;
    param[4] = secret;
    param[5] = clientip;
    param[6] = timeout;
    param[7] = retry;
    param[8] = charset;
    param[9] = autoadd;
    param[10] = useaccoun;
    param[11] = separator;

    if ($('#add_server_div').length <= 0) {
        $(document.body).append("<div id='add_server_div' class='ngtos_window_550'></div>");
    }
    authServerWindow('add_server_div','Auth/Server','windowShow&w=auth_server_add_window',msg);
}

function ldap_edit_serve(name, host, port, dn, stype, account, queryname, querypasswd, filterinfo, scope, timeout, charset, autoadd, separator, attrgroup, attruser, msg) {
    server_add_tag = 2;
    server_type_tag = 3;
    param[0] = name;
    param[1] = host;
    param[2] = port;
    param[3] = dn;
    param[4] = stype;
    param[5] = account;
    param[6] = queryname;
    param[7] = querypasswd;
    param[8] = filterinfo;
    param[9] = scope;
    param[10] = timeout;
    param[11] = charset;
    param[12] = autoadd;
    param[13] = separator;
    param[14] = attrgroup;
    param[15] = attruser;

    if ($('#add_server_div').length <= 0) {
        $(document.body).append("<div id='add_server_div' class='ngtos_window_550'></div>");
    }
    authServerWindow('add_server_div','Auth/Server','windowShow&w=auth_server_add_window',msg);
}

function tacas_edit_serve(name, host, port, mode, secret, timeout, charset, autoadd, msg) {
    server_add_tag = 2;
    server_type_tag = 4;
    param[0] = name;
    param[1] = host;
    param[2] = port;
    param[3] = mode;
    param[4] = secret;
    param[5] = timeout;
    param[6] = charset;
    param[7] = autoadd;

    if ($('#add_server_div').length <= 0) {
        $(document.body).append("<div id='add_server_div' class='ngtos_window_550'></div>");
    }
    authServerWindow('add_server_div','Auth/Server','windowShow&w=auth_server_add_window',msg);
}
function other_option1(newVal,oldVal) {
    if(!newVal || newVal == undefined) {
        newVal = $("#ldap_user1").combobox('getValue');
    }
    other_option(newVal,'ldap_user_othervalue1');
}
function other_option2(newVal,oldVal) {
    if(!newVal || newVal == undefined) {
        newVal = $("#ldap_user2").combobox('getValue');
    }
    other_option(newVal,'ldap_user_othervalue2');
}
function other_option3(newVal,oldVal) {
    if(!newVal || newVal == undefined) {
        newVal = $("#ldap_user3").combobox('getValue');
    }
    other_option(newVal,'ldap_user_othervalue3');
}
function other_option4(newVal,oldVal) {
    if(!newVal || newVal == undefined) {
        newVal = $("#ldap_user_group1").combobox('getValue');
    }
    other_option(newVal,'ldap_attr_role_othervalue');
}

function other_option(typeVal,other_id) {
	if(typeVal=="other") {
		//document.getElementById(other_id).style.display = "";
        $("#"+other_id).parent().css('display','inline');
        $("#"+other_id).textbox('enableValidation');
	} else {
		//document.getElementById(other_id).style.display = "none";
        $("#"+other_id).textbox('disableValidation');
        $("#"+other_id).parent().css('display','none');
	}
}

function type_change(typeVal,oldVal) {
	$('#ldap7_user1').css("display","none");
	$('#ldap7_user2').css("display","none");
	$('#ldap7_user3').css("display","none");
	$('#ldap7_user4').css("display","none");
	$('#ldap8_role1').css("display","none");
	$('#ldap8_role2').css("display","none");
	if(!typeVal || typeVal == undefined) {
        //typeVal = $('#ldap_type option:selected').val();
        typeVal = $('#ldap_type').combobox('getValue');
    }
	if(typeVal == 'ad') {
        var gid = $("#ldap_user_group1").combobox('getValue');
        var uid = $("#ldap_user1").combobox('getValue');
		$('#ldap8_role1').css("display","");
		$('#ldap7_user1').css("display","");
		other_option(gid ,'ldap_attr_role_othervalue');
		other_option(uid ,'ldap_user_othervalue1');
        $('#ldap_attr_role').textbox('disableValidation');
        $('#ldap_user_othervalue4').textbox('disableValidation');
	} else if(typeVal == 'novell') {
		//var uid = document.getElementById("ldap_user2");
        var uid = $("#ldap_user2").combobox('getValue');
		$('#ldap8_role2').css("display","");
		$('#ldap7_user2').css("display","");
		other_option(uid ,'ldap_user_othervalue2');
        $('#ldap_attr_role').textbox('enableValidation');
        $('#ldap_user_othervalue4').textbox('disableValidation');
	} else if(typeVal == 'sun') {
		//var uid = document.getElementById("ldap_user3");
        var uid = $("#ldap_user3").combobox('getValue');
		$('#ldap8_role2').css("display","");
		$('#ldap7_user3').css("display","");
		other_option(uid ,'ldap_user_othervalue3');
        $('#ldap_attr_role').textbox('enableValidation');
        $('#ldap_user_othervalue4').textbox('disableValidation');
	} else if(typeVal == 'other') {
		$('#ldap8_role2').css("display","");
		$('#ldap7_user4').css("display","");
        $('#ldap_attr_role').textbox('enableValidation');
        $('#ldap_user_othervalue4').textbox('enableValidation');
	}
}

function tree_auth_change(typeVal,oldVal){
    if(!typeVal || typeVal == undefined) {
        typeVal = $('#tree_auth_type').combobox('getValue');   //alert(typeVal);
    }
    var ser_typeVal =  $("input:radio[name='serv_type']:checked").val();
    if(typeVal == 'actuality' && ser_typeVal == 'ldap') {
        $('#ldap3').css("display","");
        $('#ldap4').css("display","");
        $("#serv_ldap_name").textbox("enable");
        $("#serv_ldap_name").textbox("enableValidation");
        $("#serv_ldap_pass").textbox("enable");
        $("#serv_ldap_pass").textbox("enableValidation");
        $("#example_msg").text($LANG.FORMAT_MS_AD_DC);
    } else if(typeVal == 'anonymity') {
        $('#ldap3').css("display","none");
        $('#ldap4').css("display","none");
        $("#serv_ldap_name").textbox("disable");
        $("#serv_ldap_name").textbox("disableValidation");
        $("#serv_ldap_pass").textbox("disable");
        $("#serv_ldap_pass").textbox("disableValidation");
        $("#example_msg").text($LANG.FORMAT_MS_AD_VPN);
    }
}
var syncServer = '';
function sync_attr(sname, msg) {
    syncServer = sname;
    if ($('#server_ldap_sync_div').length <= 0) {
        $(document.body).append("<div id='server_ldap_sync_div' class='ngtos_window_500'></div>");
    }
    open_window('server_ldap_sync_div','Auth/Server','windowShow&w=auth_server_ldap_sync_window',msg);
}

function modify_sync_attr() {
    var isValid = $("#ldap_sync_form").form('validate');
    if(!isValid) {
        return false;
    }
    if($("#sync_user").prop("checked"))
        var utag = "yes";
    else
        var utag = "no";
    if($("#sync_group").prop("checked"))
        var gtag = "yes";
    else
        var gtag = "no";
    $.ajax({
        url: "?c=Auth/Server&a=modifySync",
        type: 'POST',
        datatype:'text',
        data:{
            sname:$('#sname').val(),
            hid_sync_type:$('#sync_type').combobox('getValue'),
            hid_sync_interval:$('#sync_interval').val()?$('#sync_interval').val():24,
            hid_query_name:$('#qname').val(),
            hid_query_pass:$('#qpass').val(),
            hid_sync_user:utag,
            hid_user_filter:$('#user_filter').val(),
            hid_sync_group:gtag,
            hid_group_filter:$('#group_filter').val(),
            hid_par_group:$('#group_father').val(),
            hid_pre_group:$('#group_prefix').val()
        },
        success: function(data){
            if(data=='0'){
                $("#server_ldap_sync_div").window("close");
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

function sync_mode(newVal,oldVal) {
    if(!newVal) {
        newVal = $("#sync_type").combobox('getValue');
    }
    if(newVal == "manual")
        $("#sync_time").css("display","none");
    else
        $("#sync_time").css("display","");
}

function enable_filter() {
    if($("#sync_user").prop("checked"))
        $("#user_filter").textbox('enable');
    else
        $("#user_filter").textbox('disable');
    if($("#sync_group").prop("checked"))
        $("#group_filter").textbox('enable');
    else
        $("#group_filter").textbox('disable');
}

function add_sms_conf() {
    var isValid = $("#whole_attr_form").form('validate');
    if(!isValid) {
        return false;
    }
    $.ajax({
        url: "?c=Auth/Server&a=smsAdd",
        type: 'POST',
        datatype:'text',
        data:{
            hid_sms_type:$('#sms_type').combobox('getValue'),
            hid_sms_mode:$('#sms_mode').combobox('getValue'),
            hid_sms_ip:$('#sms_addr').val(),
            hid_sms_port:$('#sms_port').val(),
            hid_sms_id:$('#sms_id').val(),
            hid_sms_len:$('#sms_len').val(),
            hid_sms_invalid:$('#sms_invalid').val(),
            hid_sms_err:$('#sms_err').val(),
            hid_sms_share:$('#sms_sha').val(),
            hid_sms_timeout:$('#sms_timeout').val(),
            hid_sms_content_req:$('#sms_content_req').combobox('getValue'),
            hid_sms_info:$('#sms_info').val()
        },
        success: function(data, textStatus){
            if(data=='0'){
                $("#server_whole_conf_div").window("close");
                $('#tt').datagrid('reload');
            }
            else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function sms_set_info(newVal,oldVal) {
    if(!newVal) {
        newVal = $("#sms_type").combobox('getValue');
    }

    if(newVal == "none") {
        //$("#sms-div").textdisabled();
        //$("#sms-div").find("select[1]").attr('disabled','true');
        //$("#sms-div").find("input").attr('disabled','true');
        $("#sms_mode").combobox('disable');
        $("#sms_addr").textbox('disableValidation');
        $("#sms_addr").textbox('disable');
        $("#sms_port").textbox('disableValidation');
        $("#sms_port").textbox('disable');
        $("#sms_sha").textbox('disableValidation');
        $("#sms_sha").textbox('disable');
        $("#sms_id").textbox('disableValidation');
        $("#sms_id").textbox('disable');
        $("#sms_len").textbox('disable');
        $("#sms_invalid").textbox('disable');
        $("#sms_err").textbox('disable');
        $("#sms_timeout").textbox('disable');
        $("#sms_info").textbox('disable');
        $("#sms_content_req").combobox('disable');
    } else if(newVal == "local") {
        /*$("#sms-div").textenable();
        $("#sms_mode").removeAttr('disabled');
        $("#sms_addr").prop('disabled',true);
        $("#sms_port").prop('disabled',true);
        $("#sms_id").prop('disabled',true);
        $("#sms_sha").prop('disabled',true);
        $("#sms_content_req").removeAttr('disabled');*/

        $("#sms_mode").combobox('enable');
        $("#sms_addr").textbox('disableValidation');
        $("#sms_addr").textbox('disable');
        $("#sms_port").textbox('disableValidation');
        $("#sms_port").textbox('disable');
        $("#sms_sha").textbox('disableValidation');
        $("#sms_sha").textbox('disable');
        $("#sms_id").textbox('disableValidation');
        $("#sms_id").textbox('disable');
        $("#sms_len").textbox('enable');
        $("#sms_invalid").textbox('enable');
        $("#sms_err").textbox('enable');
        $("#sms_timeout").textbox('enable');
        $("#sms_info").textbox('enable');
        $("#sms_content_req").combobox('enable');
    } else {
        /*$("#sms-div").textenable();
        $("#sms_mode").prop('disabled',true);
        $("#sms_content_req").removeAttr('disabled');*/

        $("#sms_mode").combobox('disable');
        $("#sms_addr").textbox('enable');
        $("#sms_addr").textbox('enableValidation');
        $("#sms_port").textbox('enable');
        $("#sms_port").textbox('enableValidation');
        $("#sms_sha").textbox('enable');
        $("#sms_sha").textbox('enableValidation');
        $("#sms_id").textbox('enable');
        $("#sms_id").textbox('enableValidation');
        $("#sms_len").textbox('enable');
        $("#sms_invalid").textbox('enable');
        $("#sms_err").textbox('enable');
        $("#sms_timeout").textbox('enable');
        $("#sms_info").textbox('enable');
        $("#sms_content_req").combobox('enable');
    }
}

/*******菜单栏删除*****/
function del_server(){
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r) {
            var ids1 = [];
            var rows = $('#tt').datagrid('getSelections');
            var pageNum = return_pagenum('tt',rows);
            for(var i=0; i<rows.length; i++){
                ids1.push(rows[i].server_name);
            }
            $.ajax({
                url: "?c=Auth/Server&a=del",
                type: 'POST',
                datatype:'text',
                data:{
                    mod:'user auth server',
                    delItems:ids1
                },
                success: function(data){
                    if(data=='0'){
                        $('#tt').datagrid('options').pageNumber = pageNum;
                        $('#tt').datagrid('getPager').pagination({pageNumber: pageNum});
                    } else {
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

//数据编辑栏
function editServerRow() {
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1) {
        if(rowData[0].protocol.indexOf("radius") >= 0)
            radius_edit_serve(rowData[0].server_name,rowData[0].host,rowData[0].port,rowData[0].radius_authmode,rowData[0].radius_sharesecret,rowData[0].radius_clientip,rowData[0].timeout,rowData[0].radius_retry_times,rowData[0].charset,rowData[0].auto_addr_user,rowData[0].radius_useaccount,rowData[0].radius_attr_separator,$LANG.EDIT);
        else if(rowData[0].protocol.indexOf("ldap") >= 0)
            ldap_edit_serve(rowData[0].server_name,rowData[0].host,rowData[0].port,rowData[0].ldap_dn,rowData[0].ldap_subtype,rowData[0].ldap_usequeryaccount,rowData[0].ldap_queryname,rowData[0].ldap_querypasswd,rowData[0].ldap_filterinfo,rowData[0].ldap_scope,rowData[0].timeout,rowData[0].charset,rowData[0].auto_addr_user,rowData[0].ldap_attr_seperator,rowData[0].ldap_attr_group,rowData[0].ldap_attr_username,$LANG.EDIT);
        else if(rowData[0].protocol.indexOf("tacacs") >= 0)
            tacas_edit_serve(rowData[0].server_name,rowData[0].host,rowData[0].port,rowData[0].tacas_mode,rowData[0].tacas_key,rowData[0].timeout,rowData[0].charset,rowData[0].auto_addr_user,$LANG.EDIT);
        else
            local_edit_serve(rowData[0].server_name,rowData[0].host,rowData[0].port,$LANG.EDIT);
    }

    else
        return;
}
//全局认证
function conf_item(msg) {
    grtag = 3;
    if ($('#server_whole_conf_div').length <= 0) {
        $(document.body).append("<div id='server_whole_conf_div' class='ngtos_window_600'></div>");
    }
    authServerWindow('server_whole_conf_div','Auth/Server','windowShow&w=auth_server_whole_conf_window',msg);
}