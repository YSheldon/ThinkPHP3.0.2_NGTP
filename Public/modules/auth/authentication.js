function setUserToolBar() {
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1) {
        $('#user_edit').linkbutton('disable');
        $('#user_del').linkbutton('disable');
        $('#user_enable').linkbutton('disable');
        $('#user_disable').linkbutton('disable');
    } else if(sel_row.length==1) {
        $('#user_edit').linkbutton('enable');
        $('#user_del').linkbutton('enable');
        $('#user_enable').linkbutton('enable');
        $('#user_disable').linkbutton('enable');
    } else if(sel_row.length>1) {
        $('#user_edit').linkbutton('disable');
        $('#user_del').linkbutton('enable');
        $('#user_enable').linkbutton('enable');
        $('#user_disable').linkbutton('enable');
    }
}
function editUserRow(msg) {
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1)
        edit_user(rowData[0].name,rowData[0].description,rowData[0].group,rowData[0].address_name,rowData[0].timer_name,rowData[0].type,rowData[0].auth_server,rowData[0].area_name,msg);
    else
        return;
}
/*function myformatter(date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
function myparser(s){
	if (!s) return new Date();
	var ss = (s.split('-'));
	var y = parseInt(ss[0],10);
	var m = parseInt(ss[1],10);
	var d = parseInt(ss[2],10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
	return new Date(y,m-1,d);
	} else {
	return new Date();
	}
}*/

function get_user_options() {
    var src_from = $("#d_service_item_cid_user").get(0);
    parent.moveSelNum = src_from.options.length;
    $('#sel_user_num').html($LANG.SELECTED+ parent.moveSelNum + $LANG.SEVERAL);
}

function refresh_group() {
    $.getJSON(
        "?c=Auth/User&a=userAndGroup",
        function(data){
            var options="";
            if(data) {
                $(data.rows).each(function(key,value){
                    if(value.gTag == undefined){
                        options += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.USER+"]</option>";
                        var s = value.name + " ["+$LANG.USER+"]";
                    } else {
                        options += "<option value='" + value.name + "'>" + value.name +"["+$LANG.GROUP+"]</option>";
                        var s = value.name + " ["+$LANG.GROUP+"]";
                    }
                })

                $('#service_item_cid_user').html(options);
                get_mulselect_options('service_item_cid_user','d_service_item_cid_user');
            }
            get_user_options();
        });
}

function add_group(msg) {
    group_tag = 1;
    if ($('#userGroup_div').length <= 0) {
        $(document.body).append("<div id='userGroup_div' class='ngtos_window_500'></div>");
    }
    open_window('userGroup_div','Auth/User','windowShow&w=auth_user_group_window',msg);
}

function scan_user(msg) {
    if ($('#userScan_div').length <= 0) {
        $(document.body).append("<div id='userScan_div' class='ngtos_window_500'></div>");
    }
    open_window('userScan_div','Auth/User','windowShow&w=auth_user_scan_window',msg);
}

function modify_refresh_group(node) {
    $.ajax({
        url: "?c=Auth/User&a=callFun",
        type: 'POST',
        dataType:'json',
        data:{
            fun:'dataShow',
            mod:'user manage group',
            parKey:'name',
            param:node.text
        },
        success: function(data){
            if(data.rows.length > 0) {
                $('#belong_group').combobox({
                    url: '?c=Auth/User&a=groupnameJsondata&name='+encodeURI(node.text),
                    valueField:'name',
                    textField:'name'
                })
                var pnode = $('#tt1').tree('getParent',node.target);
                if(pnode != null)
                    $('#belong_group').combobox('setValue',pnode.text);
                $('#gro_name').textbox('setValue',node.text);
                //var obj = jQuery.parseJSON(data);
                if(data.rows[0].description == "null")
                    data.rows[0].description = '';
                $('#gro_desc').textbox('setValue',data.rows[0].description);
                $("#d_service_item_cid_user").html("");

                var selName = '';
                var selUser = '';
                var selGroup = '';
                var userSelGroup='';
                $.ajaxSetup({async:false});
                $.getJSON(
                    "?c=Auth/User&a=usergroupJsondata&name="+encodeURI(node.text),
                    function(data){
                        $(data.rows).each(function(key,value){
                            selName = selName + value.name + ',';
                        })
                    });

                var sel_arr = $.trim(selName).split(",");
                $.getJSON(
                    "?c=Auth/User&a=userAndGroup&group=" + encodeURI(node.text),
                    function(data){
                        $(data.rows).each(function(key,value){
                            if(value.gTag == undefined) {
                                if( $.inArray(value.name, sel_arr) > -1 ) {
                                    var s = value.name + " ["+$LANG.USER+"]";
                                    $('#d_service_item_cid_user')[0].add(new Option(s,value.name));
                                    selUser = selUser + value.name + ',';
                                    userSelGroup = userSelGroup + value.name + '#' + value.group + '&';
                                } else {
                                    var s = value.name + " ["+$LANG.USER+"]";
                                    $('#service_item_cid_user')[0].add(new Option(s,value.name));
                                    //parent.sourOptions.push(s);
                                }
                            } else {
                                if( $.inArray(value.name, sel_arr) > -1 ) {
                                    var s = value.name + " ["+$LANG.GROUP+"]";
                                    $('#d_service_item_cid_user')[0].add(new Option(s,value.name));
                                    selGroup = selGroup + value.name + ',';
                                    //parent.selOptions.push(s);
                                } else {
                                    var s = value.name + " ["+$LANG.GROUP+"]";
                                    $('#service_item_cid_user')[0].add(new Option(s,value.name));
                                    //parent.sourOptions.push(s);
                                }
                            }
                        })
                        get_mulselect_options('service_item_cid_user','d_service_item_cid_user');
                        get_user_options();
                    });
                    $.ajaxSetup({async:true});

                $("#addUserGroup").click(function(){
                    add_user_group(group_tag, selUser, userSelGroup, selGroup);
                });
            }
        }
    });
}

function modify_group(msg) {
    group_tag = 2;
    var node =$("#tt1").tree("getSelected");
    if(node == null) {
        ngtosPopMessager("error", $LANG.SELECTED_GROUP_NODE);
        return;
    }
    var pnode = $('#tt1').tree('getParent',node.target);
    if(pnode == null) {
        ngtosPopMessager("error", $LANG.ROOT_DIR_NOT_MODIFY);
        return;
    }
    if(node == null) {
        ngtosPopMessager("error", $LANG.SELECTED_GROUP_NODE);
        return;
    } else {
        param[0] = node;
        if ($('#userGroup_div').length <= 0) {
            $(document.body).append("<div id='userGroup_div' class='ngtos_window_500'></div>");
        }
        open_window('userGroup_div','Auth/User','windowShow&w=auth_user_group_window',msg);
    }
}

function expi_time(tag) {
	if(tag == 1) {
        $("input[name='expir_time'][value='1']").attr("checked",true);
		$("#st_date").datebox({  
            required: false,
            disabled: true
        });
		$('#st_time').timespinner({
            disabled: true
        });
	} else {
        $("input[name='expir_time'][value='2']").attr("checked",true);
		$("#st_date").datebox({
            required: true,
            disabled: false  
        });
        $('#st_time').timespinner({
            disabled: false
        });
	}
}
function sel_server_type(newValue,oldValue) {
    if(!newValue) {
        newValue = $('#auth_server1').combobox('getValue');
    }
    if(newValue == 2) {
        $('#server_span1').show();
        $('#server_span2').hide();
        $('#local_conf1').show();
        $('#local_conf2').show();
        $('#local_conf3').show();
        $('#local_conf4').show();
        $('#local_conf5').show();
        $('#auth_server2').combobox('enableValidation');
        $('#auth_server3').combobox('disableValidation');
        $('#auth_server_mail').textbox({required:true});
        $('#auth_server_phone').textbox({required:true});
        if(user_tag == 1 || auth_tag != 2)
            $('#auth_server_pass').textbox('enableValidation');
    } else if(newValue == 3) {
        $('#server_span2').show();
        $('#server_span1').hide();
        $('#local_conf1').hide();
        $('#local_conf2').hide();
        $('#local_conf3').hide();
        $('#local_conf4').hide();
        $('#local_conf5').hide();
        $('#auth_server2').combobox('disableValidation');
        $('#auth_server3').combobox('enableValidation');
        $('#auth_server_pass').textbox('disableValidation');
        $('#auth_server_mail').textbox({required:false});
        $('#auth_server_phone').textbox({required:false});
    } else {
        $('#server_span1').hide();
        $('#server_span2').hide();
        $('#local_conf1').hide();
        $('#local_conf2').hide();
        $('#local_conf3').hide();
        $('#local_conf4').hide();
        $('#local_conf5').hide();
        $('#auth_server2').combobox('disableValidation');
        $('#auth_server3').combobox('disableValidation');
        $('#auth_server_pass').textbox('disableValidation');
        $('#auth_server_mail').textbox({required:false});
        $('#auth_server_phone').textbox({required:false});
    }
}

function add_user_group(tag, selUser, userSelGroup, selGroup) {
	var isValid = $("#user_group_form").form('validate');
    if(!isValid) {
        return false;
    }
	var user_item=new Array();
	var group_item=new Array();
	var umem='';
	var gmem='';
	$("#d_service_item_cid_user option").each(function(){
            //alert($(this).text().indexOf("用户"));
		if($(this).text().indexOf($LANG.USER)>=0)
			user_item.push($(this).val());
		else
			group_item.push($(this).val());
        });
	if(user_item != ""){
        umem = user_item.join(',');
    }
    if(group_item != ""){
        gmem = group_item.join(',');
    }
	var delUser = '';
	var addUser = '';
	var delGroup = '';
	var delGro = '';

	if(tag == "2") {
		var sUser = selUser.split(',');
		for(var i=0;i<sUser.length;i++) {
			if(umem.indexOf(sUser[i]) < 0) {
				delUser = delUser + sUser[i] + ',';
				var info1 = userSelGroup.split('&');
				for(var j=0;j<info1.length;j++) {
					var info2 = info1[j].split('#');
					if(info2[0] == sUser[i])
						delGroup = delGroup + info2[1] + '*';
				}
			}
		}
		var aUser = umem.split(',');
		for(var i=0;i<aUser.length;i++) {
			if(selUser.indexOf(aUser[i]) < 0) {
				addUser = addUser + aUser[i] + ',';
			}
		}
		
		var sGr = selGroup.split(',');
		for(var i=0;i<sGr.length;i++) {
			if(gmem.indexOf(sGr[i]) < 0) {
				delGro = delGro + sGr[i] + ',';
			}
		}
	}

    var name2 = $('#gro_name').textbox('getValue');
	var name1 = name2 + ',';
	var delInfo = delGroup.split('*');
	var groupInfo = '';
	for(var i=0;i<delInfo.length;i++) {
                //alert(delInfo[i]);
		delInfo[i] = delInfo[i].replace(name1, '');
		delInfo[i] = delInfo[i].replace(name2, '');
		groupInfo = groupInfo + delInfo[i] + "*";
	}
	var pgroup = $('#belong_group').combobox('getText');
	if(pgroup == "/")
		pgroup = "null";

    if($('#gro_desc').textbox('getValue') == "")
        var gdesc = "null";
    else
        var gdesc = "'" + $('#gro_desc').textbox('getValue') + "'";

	$.ajax({
		url: "?c=Auth/User&a=usergroupAdd",
		type: 'POST',
		datatype:'text',
		data:{
			hid_group_desc:gdesc,
			hid_group_parent:pgroup,
			group_tag:tag,			
			hid_group_name:name2,
			hid_user_member:umem,
			hid_group_member:gmem,
			hid_del_user:delUser,
			hid_del_group:groupInfo,
			hid_add_user:addUser,
			hid_del_gro:delGro
		},
		success: function(data, textStatus){
            if(data=='0'){
                if(typeof(grtag)!='undefined' && grtag==6) {
                    var opp = new Option(name2,name2);
                    opp.title = name2;
                    $('#sel1')[0].add(opp);
                    closeWindow("userGroup_div");
                } else {
                    $("#userGroup_div").window("close");
                    window.location.reload();
                }

			} else {
                ngtosPopMessager("error", data);
			}
		}
	});
}

function child_user() {
    $("#tt").datagrid('options').url='?c=Auth/User&a=alluserJsondata';
    $("#tt").datagrid('getPager').pagination({pageNumber:1});
    var queryParams=$('#tt').datagrid('options').queryParams;
    if(allnode == "")
        $("#tt").datagrid('options').url='?c=Auth/User&a=userinfoJsondata';
    else
        queryParams.allGroupNode = allnode;
}

function add_userinfo(tag,add_input) {
    var isValid = $('#user_form').form('validate');
    if(!isValid) {
        return false;
    }

	var stype;
	var sname="null";
	var spass;
	var smail;
	var sphone;
	var etime;
	var userNames = $('#auth_username').textbox('getValue');
	var authServerType = $('#auth_server1').combobox('getValue');
	if(authServerType == 2) {
		stype = 2;
		sname = $('#auth_server2').combobox('getText');
        if(sname == "") {
            ngtosPopMessager("error", $LANG.AUTH_SERVER_NOT_NULL);
            return false;
        }
		spass = $('#auth_server_pass').textbox('getValue');
        smail = $('#auth_server_mail').textbox('getValue');
        sphone = $('#auth_server_phone').textbox('getValue');

		var type = $('input[name="expir_time"]:checked').val();
		if(type == 2) {
			var date = $("#st_date").datebox('getValue');
			var time = $("#st_time").val();
            date = $.trim(date);
            time = $.trim(time);
            /*if(date == "" || time == "") {
                ngtosPopMessager("error", "请填入过期时间");
                return;
            }*/
			etime =date + "-" + time;
		}
        else
            etime = "0";
	} else if(authServerType == 3) {
		sname = $('#auth_server3').combobox('getText');
		if(sname == "") {
            ngtosPopMessager("error", $LANG.AUTH_SERVER_NOT_NULL);
			return false;
		}
		stype = 3;
	} else if(authServerType == 1)
		stype = 1;
    else if(authServerType == 4)
        stype = 4;
		
	if($("#able_more_login").attr("checked")=="checked")
		var utype = "anonymity";
	else
		var utype = "actuality";

    if($('#auth_userdesc').textbox('getValue') == "")
        var udesc = "null";
    else
        var udesc = "'" + $('#auth_userdesc').textbox('getValue') + "'";

    var access_ip = $('#more_login_addr').combotree('getText');
    if(access_ip == '')
        access_ip= 'null';
    var access_time = $('#more_login_time').combotree('getText');
    if(access_time == '')
        access_time= 'null';
    var access_range = $('#more_login_area').combobox('getText');
    if(access_range == '')
        access_range= 'null';

    if($("#able_vrc").attr("checked")=="checked"){
        var vrcTag = '1';
        var vrcVal = $('#vrc_val').textbox('getValue');
        if(vrcVal == '') {
            ngtosPopMessager("error", "请选择vrc权限");
            return;
        }
    } else {
        var vrcTag = '0';
        var vrcVal = '';
    }

	$.ajax({
		url: "?c=Auth/User&a=userAdd",
		type: 'POST',
		datatype:'text',
		async:false,
		data:{
			hid_user_name:userNames,
			hid_user_desc:udesc,
			hid_user_group:$('#user_sel_group').combobox('getText'),			
			hid_server_type:stype,
			hid_server_name:sname,
			old_server_name:$('#auth_oldServer').val(),
			hid_server_pass:spass,
			hid_server_mail:smail,
			hid_server_phone:sphone,
			hid_expir_time:etime,
			hid_user_type:utype,
			hid_user_addr:access_ip,
			hid_user_time:access_time,
            hid_user_area:access_range,
			user_tag:tag,
            hid_vrc_tag:vrcTag,
            hid_vrc_val:vrcVal
		},
		success: function(data){
                if(data=='0'){
                if(typeof(grtag)!='undefined' && grtag==6) {
                    var opp = new Option(userNames,userNames);
                    opp.title = userNames;
                    $('#sel1')[0].add(opp);
                    closeWindow('userAdd_div');
				} else {
                    $("#userAdd_div").window("close");
                    child_user();
                    allnode = "";
                    param = [];
                    checktotal = "";
                    checkmsg = "";
                    $('#tt').datagrid('reload');
                }
			} else if(data.indexOf('userok') >= 0) {
				var daEr=data.split('#');
				if(daEr[1] != '')
                    ngtosPopMessager("error", daEr[1]);
                if(typeof(grtag)!='undefined' && grtag==6) {
                    var opp = new Option(userNames,userNames);
                    opp.title = userNames;
                    $('#sel1')[0].add(opp);
                    closeWindow('userAdd_div');
                } else {
                    $("#userAdd_div").window("close");
                    child_user();
                    allnode = "";
                    param = [];
                    checktotal = "";
                    checkmsg = "";
                    $('#tt').datagrid('reload');
                }
			} else if(data.indexOf('authuser_ok') >= 0) {
                var daEr=data.split('#');
                if(daEr[1].indexOf('103218') >=0) {
                    if(typeof(grtag)!='undefined' && grtag==6) {
                        var opp = new Option(userNames,userNames);
                        opp.title = userNames;
                        $('#sel1')[0].add(opp);
                        closeWindow('userAdd_div');
                    } else {
                        $("#userAdd_div").window("close");
                        child_user();
                        allnode = "";
                        param = [];
                        checktotal = "";
                        checkmsg = "";
                        $('#tt').datagrid('reload');
                    }
                } else
                    ngtosPopMessager("error", daEr[1]);
            } else{
                ngtosPopMessager("error", data);
			}
		}
	});
}

/*function change_leftmenu(src) {
	var src_div = document.getElementById(src);
	var center_div = document.getElementById("content_div");
	var rimg_div = document.getElementById("rimg");
	var tt_div = document.getElementById("tt");
	if(src_div.style.display=='block'|| src_div.style.display=='') {
		rimg_div.style.display='block';
		src_div.style.display='none';  	
		$("#rimg").appendTo($("#pleft_div"));
		$("#pleft_div").css("width","16px");
		$("#content_div").parent().css("left","1px");
	} else {
		src_div.style.display='block';
		rimg_div.style.display='none';
		$("#content_div").parent().css("left","225px");
	}
}*/

function download_module() {
    var file_type = $('input[name="import_meth"]:checked').val();
    location.href="?c=Auth/User&a=moduleDownload&file_type="+file_type;
}

function module_import() {
	var type = $('input[name="import_meth"]:checked').val();
    var ctype = $('input[name="same_user"]:checked').val();
    var fileName = $("#file").filebox('getValue');
	if(type == 1) {
        if(fileName.indexOf(".txt") < 0 && fileName.indexOf(".TXT") < 0) {
            ngtosPopMessager("error", $LANG.SELECT_TXT_FILE);
			return false;
		}
        var file_type = "txt";
	} else if(type == 2) {
        if(fileName.indexOf(".csv") < 0 && fileName.indexOf(".CSV") < 0) {
            ngtosPopMessager("error", $LANG.SELECT_CSV_FILE);
			return false;
		}
        var file_type = "csv";
	}

    if(ctype == 1)
        var import_cognominal = "overwrite";
    else if(ctype == 2)
        var import_cognominal = "ignore";

    var import_more_user = "actuality";
    $('#window_cover').css("display","block");
    $.ajaxFileUpload({
        url:'?c=Auth/User&a=moduleImport',
        type: 'POST',
        secureuri:false,//secureuri是否启用安全提交，默认为false
        fileElementId:'file',//fileElementId表示文件域ID
        dataType: 'text',
        async:false,
        data:{
            hid_import_file_type:file_type,
            hid_import_loc:$('#user_sel_group_import').combobox('getText'),
            hid_import_more_user:import_more_user,
            hid_import_login_addr:$('#import_login_addr').combotree('getText'),
            hid_import_login_time:$('#import_login_time').combotree('getText'),
            hid_import_login_area:$('#import_login_area').combotree('getText'),
            hid_import_cognominal:import_cognominal
        },
        success: function (data,textstatus){
            if(data == "0"){
                $('#window_cover').css("display","none");
                $("#import_user_div").window("close");
                allnode = "";
                param = [];
                checktotal = "";
                checkmsg = "";
                $('#tt').datagrid('reload');
            }else{
                ngtosPopMessager("error", data);
                $('#window_cover').css("display","none");
            }
        }
    })
}

function module_export() {
    //var cf = document.forms[0];
    var cf = document.getElementById('export_user_form');

    var isValid = $("#export_user_form").form('validate');
    if(!isValid) {
        return false;
    }
	var node =$("#tt1").tree("getSelected");
    var allnode="";
    var type = $('input[name="export_type"]:checked').val();
    if(node == null || node.text == "/")
        allnode = "null";
    else
        allnode = node.text;

    cf.hid_export_name.value = $('#export_name').val();
    cf.hid_export_type.value = type;
    cf.hid_export_group.value = allnode;
    cf.hid_export_child.value = $('input[name="export_cont"]:checked').val();
    cf.action = "?c=Auth/User&a=moduleExport";
    cf.submit();
    setTimeout("closeWindow('export_user_div')",1000);
}

function del_group() {
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r) {
            //var node =$("#tt1").tree("getSelected");
            var node =$("#tt1").tree("getChecked");
            var groupArr = [];
            for(var i in node) {
                groupArr.push(node[i].text);
            }
            var groupNames = groupArr.reverse().join("#");
            //groupNames = groupNames.substring(0,groupNames.length - 1);
            groupNames = groupNames.replace(/#\//g, '');
            //alert(groupNames);return;
            $.ajax({
                url: "?c=Auth/User&a=del",
                type: 'POST',
                datatype:'text',
                data:{
                    mod:'user manage group',
                    act:'delete index-key name ',
                    delKey:'index-value',
                    delItems:groupNames
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt1').tree('reload');
                    $("#tt").datagrid('options').url='?c=Auth/User&a=userinfoJsondata';
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

/*function clear_group() {
    ngtosPopMessager('confirm',$LANG.SURE_CLEAR_ALL,function(r) {
        if(r){
            $.ajax({
                url: "?c=Auth/User&a=userGroupClear",
                type: 'GET',
                dataType:'text',
                async:false,
                success: function(data, textStatus){
                    if(data=='0'){
                        $("#tt1").tree('reload');
                        //location.reload();
                    } else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}*/
/*******用户删除*****/
function delete_user_item(){
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var ids1 = [];
            var ids2 = [];
            var rows = $('#tt').datagrid('getSelections');
            for(var i=0; i<rows.length; i++){
                ids1.push(rows[i].name);
            }
            for(var j=0; j<rows.length; j++){
                ids2.push(rows[j].auth_server);
            }
            var pageNum = return_pagenum('tt',rows);
            var uname = ids1.join(';');
            var userver = ids2.join(';');

            $.ajax({
                url: "?c=Auth/User&a=userinfoDel",
                type: 'POST',
                datatype:'text',
                data:{
                    del_user_name:uname,
                    del_serv:userver
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

function but_enable_handle(opt) {
    if(opt == 'no')
        var msg = $LANG.SURE_ENABLE;
    else
        var msg = $LANG.SURE_DISABLE;
    ngtosPopMessager('confirm',msg,function(r) {
        if(r) {
            var rows = $('#tt').datagrid('getSelections');
            var ids1 = [];
            for(var i=0; i<rows.length; i++){
                ids1.push(rows[i].name);
            }
            //var names = ids1.join('#');
            $.ajax({
                url: "?c=Auth/User&a=callFun",
                type: 'post',
                dataType:'text',
                data:{
                    fun:'enableEdit',
                    mod:'user manage user',
                    act:'modify index-key name',
                    operate:'invalid',
                    enable:opt,
                    parKey:'index-value',
                    parVal:ids1
                },
                success: function(data){
                    if(data == '0'){
                        if(opt == 'no') {
                            $("#enable_div").fadeIn();
                            setTimeout('$("#enable_div").fadeOut()','1000');
                        } else {
                            $("#disable_div").fadeIn();
                            setTimeout('$("#disable_div").fadeOut()','1000');
                        }
                    } else {
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function search_gro_name() {
    var val = $("#searchGroup").val();
    if(val == '' || val == $LANG.INPUT_SEARCH) {
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    $('#tt1').tree('options').url = '?c=Auth/User&a=searchUserGroup&name='+encodeURI(val);
    $('#tt1').tree('reload');

}

function freshGroupItem(val) {
    if(val == '') {
        $("#tt1").tree('options').url='?c=Auth/User&a=groupJsondata';
        $('#tt1').tree('reload');
    }
}

function searchUser() {
    var val = $("#searchUname").val();
    var type = $("#searchType").combobox('getValue');
    if(val == '' || val == $LANG.INPUT_SEARCH) {
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    $('#tt').datagrid('getPager').pagination({pageNumber: 1});
    $("#tt").datagrid({
        pageNumber:1,
        url:'?c=Auth/User&a=searchUserName&name='+encodeURI(val)+'&type='+type
    });
    /*$('#tt').datagrid('options').url = '?c=Auth/User&a=searchUserName&name='+encodeURI(val)+'&type='+type;
     $('#tt').datagrid('reload');*/
}

function freshUserItem(val) {
    if(val == '') {
        $("#tt").datagrid('options').url='?c=Auth/User&a=userinfoJsondata';
        $('#tt').datagrid('reload');
    }
}

function checkSearchInfo(id) {
    $('#'+id).focus(function(){
        if($(this).val() == $LANG.INPUT_SEARCH){
            $(this).val("");
            $(this).removeClass("searchbox-prompt");
        }
    })
    $('#'+id).blur(function(){
        if($(this).val() == ""){
            $(this).val($LANG.INPUT_SEARCH);
            $(this).addClass("searchbox-prompt");
        }
    })
}

function removeSearchClass(id) {
    if($('#'+id).val() != $LANG.INPUT_SEARCH)
        $('#'+id).removeClass("searchbox-prompt");
}

function check_scan_group(index,value,text,tag,selId) {
    var selText = $('#'+selId).combobox('getText');
    var selValue = $('#'+selId).combobox('getValue');
    var values=texts='';
    if(tag==true) {
        values = selValue + "," + value;
        texts = selText + "," + text;
    } else {
        var arr = selValue.split(',');
        var arrt = selText.split(',');
        for(var i=0;i<arr.length;i++) {
            if(arr[i] == value) {
                arr.splice(i,1);
                arrt.splice(i,1);
                break;
            }
        }
        values = arr.join(',');
        texts = arrt.join(',');
    }

    $('#'+selId).combo('setValue', values).combo('setText', texts);
}

function set_scan_group(values,selId,checkName) {
    $('#'+selId).combo('setValue', values).combo('setText', values);

    $("input[type='checkbox'][name='"+checkName+"']").each(function(){
        if(values == $(this).val()) {
            $(this).prop("checked",true);
            $(this).attr("disabled", "disabled");
            return;
        }
    });
}

function get_scan_info() {
    var isValid = $("#user_scan_form").form('validate');
    if(!isValid) {
        return false;
    }
    var ip1 = $('#sip').val();
    var ip2 = $('#eip').val();
    if(checkIpRangeVal(ip1, ip2) == false)
        return false;

    $('#window_cover').css("display","block");
    $.ajax({
        url: "?c=Auth/User&a=getScanUser",
        type: 'POST',
        datatype:'text',
        data:{
            scan_ip1:ip1,
            scan_ip2:ip2,
            scan_group:$('#user_scan_group').combobox('getText'),
            scan_type:$('#authType').combobox('getValue'),
            scan_sta:$('input[name="user_sta"]:checked').val()
        },
        success: function(data){
            if(data=='0'){
                $('#window_cover').css("display","none");
                $("#userScan_div").window("close");
                allnode = "";
                param = [];
                checktotal = "";
                checkmsg = "";
                $('#tt').datagrid('reload');
            }
            else{
                $('#window_cover').css("display","none");
                ngtosPopMessager("error", data);
            }
        }
    });
}

function getSelectPos(id){
    var esrc = document.getElementById(id);

    if(esrc.createTextRange) {
        var rtextRange =esrc.createTextRange();
        rtextRange.moveStart('character',esrc.value.length);
        rtextRange.collapse(true);
        rtextRange.select();
    } else {
        esrc.setSelectionRange(esrc.value.length,esrc.value.length);
        esrc.focus();
    }

}

function searchGroup(val,obj,selId,divId,checkName,checkId,searchId) {
    //$("#"+divId)[0].innerHTML = "";
    checktotal = "<input type='checkbox' name='" + checkName + "' id='" + checkId + "0' value='/' checked disabled><label for='sgruser0'>/</label><br/>";

    if(val != "/") {
        for(var i=1; i<obj.length; i++) {
            if(obj[i].name.indexOf(val) != -1) {
                checkmsg = "<input type='checkbox' name='" + checkName + "' id='" + checkId + i + "' value='" + obj[i].name +"'><label for='" + checkId + i + "'>" + obj[i].name + "</label><br/>";
                checktotal = checktotal + checkmsg;
            }
        }
    }

    $("#"+divId)[0].innerHTML = searchStr  + checktotal;
    $('#'+searchId).val(val);
    $("").appendTo($('#'+selId).combo('panel'));
    $('#'+divId).appendTo($('#'+selId).combo('panel'));
    $('#'+searchId).keyup(function(){
        searchGroup($(this).val(),obj,selId,divId,checkName,checkId,searchId)
    })

    getSelectPos(searchId);
    removeSearchClass(searchId)
    checkSearchInfo(searchId);

    for(var i=0; i<sobj.length; i++) {
        $('#'+checkId+i).attr('num',i);
        $('#'+checkId+i).click(function(){
            check_scan_group($(this).attr('num'),$(this).val(),$(this).next('label').text(),$(this).prop("checked"),selId)
        })
    }

    var selText = $('#'+selId).combobox('getText');
    var selValue = selText.split(',');
    $("input[type='checkbox'][name='"+checkName+"']").each(function(){
        if( $.inArray($(this).val(), selValue) > -1 ) {
            //$(this).attr("checked", "checked");
            $(this).prop("checked", true);
        }
    });
}

function make_user_group(selId,divId,checkName,checkId,searchId) {
    
    checktotal = "";
    $.ajax({
        url: "?c=Auth/User&a=groupnameJsondata",
        type: 'GET',
        dataType:'text',
        async:false,
        success: function(data){
            if(data.indexOf("error")>=0) {
                ngtosPopMessager("error", $LANG.GET_INFO_FAIL);
            } else {
                     sobj = JSON.parse(data);
                for(var i=0; i<sobj.length; i++) {
                    checkmsg = "<input type='checkbox' name='" + checkName + "' id='" + checkId + i + "' value='" + sobj[i].name +"'><label for='" + checkId + i + "'>" + sobj[i].name + "</label><br/>";
                    checktotal = checktotal + checkmsg;
                }
                searchStr = "<input type='text' name='" + searchId + "' id='" + searchId + "' class='searchbox-prompt' value='"+$LANG.INPUT_SEARCH+"' style'width:127px'><br/>";
                //$("#"+divId)[0].innerHTML = "";
                $("#"+divId)[0].innerHTML = searchStr  + checktotal;
                
                for(var i=0; i<sobj.length; i++) {
                    $('#'+checkId+i).attr('num',i);
                    $('#'+checkId+i).click(function(){
                        check_scan_group($(this).attr('num'),$(this).val(),$(this).next('label').text(),$(this).prop("checked"),selId)
                    })
                }
                $('#'+searchId).keyup(function(){
                    searchGroup($(this).val(),sobj,selId,divId,checkName,checkId,searchId)
                })
            }
        }
    });
    $('#'+selId).combo({
        width: 157,
        panelHeight: 'auto',
        panelMaxHeight: 198,
        required: true,
        editable: false,
        multiple: true
    });

    $('#'+divId).appendTo($('#'+selId).combo('panel'));
    checkSearchInfo(searchId);

    $("input[type='checkbox'][name='"+checkName+"']").each(function(){
        //$(this).attr("checked", false);
        $(this).prop("checked", false);
    });
    set_scan_group("/",selId,checkName);
}


function export_user(msg) {
    if ($('#export_user_div').length <= 0) {
        $(document.body).append("<div id='export_user_div' class='ngtos_window_500'></div>");
    }
    open_window('export_user_div','Auth/User','windowShow&w=auth_user_export_window',msg);
}

function import_user(msg) {
    grtag = 5;
    if ($('#import_user_div').length <= 0) {
        $(document.body).append("<div id='import_user_div' class='ngtos_window_500'></div>");
    }
    open_window('import_user_div','Auth/User','windowShow&w=auth_user_import_window',msg);
}

function add_user(msg) {
    auth_tag = 1;
    if(grtag!=6)
        grtag = 3;
    user_tag = 1;
    if ($('#userAdd_div').length <= 0) {
        $(document.body).append("<div id='userAdd_div' class='ngtos_window_600'></div>");
    }
    open_window('userAdd_div','Auth/User','windowShow&w=auth_user_add_window',msg);
}

/*function check_group() {
    var values=texts='';
    $("input[type='checkbox'][name='usergroup']").each(function(){
        //if ($(this).attr("checked")) {
        if ($(this).prop("checked")) {
            if (values != '') {
                values += ",";
                texts += ",";
            }
            values += $(this).val();
            texts += $(this).next('label').text();
        }
    });
    $('#user_sel_group').combo('setValue', values).combo('setText', texts);
}

function check_group_import() {
    var values=texts='';
    $("input[type='checkbox'][name='usergroup_import']").each(function(){
        if ($(this).attr("checked")) {
            if (values != '') {
                values += ",";
                texts += ",";
            }
            values += $(this).val();
            texts += $(this).next('label').text();
        }
    });
    $('#user_sel_group_import').combo('setValue', values).combo('setText', texts);
}*/

function set_group(values) {
    $('#user_sel_group').combo('setValue', values).combo('setText', values);
    str = values.split(',');

    for(var i=0; i<str.length; i++) {
        $("input[type='checkbox'][name='usergroup']").each(function(){
            if(str[i] == $(this).val())
            {
                //$(this).attr("checked", "checked");
                $(this).prop("checked", true);
                if(str[i] == '/')
                    $(this).attr("disabled", "disabled");
                return;
            }
        });
    }
}

function edit_user(username, userdes, usergroup, useraddr, usertime, usertype, servername, userarea, msg) {
    auth_tag = 1;
    grtag = 3;
    user_tag = 2;
    if ($('#userAdd_div').length <= 0) {
        $(document.body).append("<div id='userAdd_div' class='ngtos_window_600'></div>");
    }
    open_window('userAdd_div','Auth/User','windowShow&w=auth_user_add_window',msg);

    param[0] = username;
    param[1] = userdes;
    param[2] = usergroup;
    param[3] = useraddr;
    param[4] = usertime;
    param[5] = usertype;
    param[6] = servername;
    param[7] = userarea;
}

function vrc_disabled() {
    if($("#able_vrc").prop("checked")) {
        $("#vrc_val").textbox({disabled:false,editable:false});
        $('#vrc_sel').linkbutton({
            disabled:false
        })
    } else {
        $("#vrc_val").textbox({disabled:true});
        $('#vrc_sel').linkbutton({
            disabled:true
        })
    }
}

function sel_vrc_mem(msg) {
    if ($('#selVrc_div').length <= 0) {
        $(document.body).append("<div id='selVrc_div' class='ngtos_window_500'></div>");
    }
    open_window('selVrc_div','auth_user','sel_vrc_window',msg);
}

function get_vrc_options(){
    var src_from = $("#d_vrc_item_cid").get(0);
    parent.moveSelNum = src_from.options.length;
    $('#sel_addr_num').html($LANG.SELECTED+ parent.moveSelNum + $LANG.SEVERAL+parent.curstr);
}

/*function add_vrc(msg) {

}

function user_sel_vrc() {
    var vrc_item=new Array();
    $("#d_vrc_item_cid option").each(function(){
        vrc_item.push($(this).val());
    });
    if(vrc_item == "")
        var mem = "";
    else
        var mem =vrc_item.join(',');

    closeWindow('selVrc_div');
    $("#vrc_val").val(mem);
}

function refresh_vrcitem() {
    $.getJSON(
        "?module=auth_user&action=vrc_access_show",
        function(data){
            var options="";
            if(data) {
                $(data).each(function(key,value){
                    if( $.inArray(value.name, param) > -1 ){    //通过inArray是否在数组中进行判断
                        $('#d_vrc_item_cid')[0].add(new Option(value.name,value.name));
                    }else{
                        $('#vrc_item_cid')[0].add(new Option(value.name,value.name));
                    }
                })
            }
            get_mulselect_options('vrc_item_cid','d_vrc_item_cid');
            select_add_title("vrc_item_cid");
            select_add_title("d_vrc_item_cid");
            get_vrc_options();
        });
}

function sel_vrc_up() {
    var dst_to = $("#d_vrc_item_cid").get(0);
    var index = 0;
    var options="";
    var len = dst_to.options.length;
    for (var m = 0; m < len; m++) {
        if (dst_to.options[m].selected) {
            var tmp = dst_to.options[m].value;
            dst_to.options[m].value = dst_to.options[m-1].value;
            dst_to.options[m-1].value = tmp;
        }
    }
    for (var m = 0; m < len; m++) {
        options += "<option value='" + dst_to.options[m].value + "'>" + dst_to.options[m].value +"</option>";
    }
    $('#d_vrc_item_cid').html(options);
}

function sel_vrc_down() {
    var dst_to = $("#d_vrc_item_cid").get(0);
    var index = 0;
    var options="";
    var len = dst_to.options.length;
    for (var m = 0; m < len; m++) {
        if (dst_to.options[m].selected) {
            var tmp = dst_to.options[m].value;
            dst_to.options[m].value = dst_to.options[m+1].value;
            dst_to.options[m+1].value = tmp;
        }
    }
    for (var m = 0; m < len; m++) {
        options += "<option value='" + dst_to.options[m].value + "'>" + dst_to.options[m].value +"</option>";
    }
    $('#d_vrc_item_cid').html(options);
}*/
