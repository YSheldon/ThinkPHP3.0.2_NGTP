function addSuitstate() {

	parent.moveSelNum = 0;
	if (!checkSuitstateStatus()) {
		return false;
	}
        $.ajax({
            url: "?c=Network/Suitstate&a=groupJson",
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                if(data.rows!="" && data.rows!=null){
                    
                    $(data.rows).each(function(key) {
                        interfaces_new+=data.rows[key].member+",";
                    })
                    
                }
            }
        })
        if (interfaces_new.length > 0) { 
            interfaces_new = interfaces_new.substr(0, interfaces_new.length - 1); 
        }
        if ($('#add_page').length <= 0) {
            $(document.body).append("<div id='add_page' class='ngtos_window_620'></div>");
        }
         open_window('add_page', 'Network/Suitstate', 'addWindow', $LANG.ADD);
}
//提交按钮
function suitstateSubmit(){
	var add = $('#suitstste_add').form('validate');
        if (add) {
            var bad_char = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im;
            var suitstate_name = $("#suitstate_name_id").val();
            var member_len = $("#suitstate_member_id option").length;
            var member_arr = [];
            if (suitstate_name == '') {
                    ngtosPopMessager('error', $LANG.NAME_CAN_NOT_BE_EMPTY);
                    return false;
            } else if (suitstate_name.length > 31) {
                    ngtosPopMessager('error', $LANG.NAME_MAXIMUM_CHARACTERS);
                    return false;
            } else if (bad_char.test(suitstate_name)) {
                    ngtosPopMessager('error', $LANG.NAME_CONTAINS_IC);
                    return false;
            }
            if (member_len < 2) {
                    ngtosPopMessager('error', $LANG.AT_LEAST_TIAN);
                    return false;
            }
            $("#suitstate_member_id option").each(function(i, v) {
                    member_arr.push($(v).val());
            });
            $.ajax({
                    url: "?c=Network/Suitstate",
                    type: 'POST',
                    data: {
                            name: suitstate_name,
                            members: member_arr
                    },
                    success: function(data) {
                            if (data != '0') {
                                    ngtosPopMessager('error', data);
                            } else {
                                    closeSuitstateWindow();
                                    $('#tt').datagrid("reload");
                            }
                    }
            });
        }
}

function switchSuitstate(id) {
	var target = document.getElementById(id);
	var act = '';
	if (target.title == $LANG.ON) {
		act = 'off';
	}else{
		act = 'on';
	}
	$.ajax({
		url: "?c=Network/Suitstate",
		type: 'put',
		data: {
			switch: act
		},
		success: function(data) {
               
			if (data == "0") {
				setSwitchSuitstate(id, act);
			} else
				ngtosPopMessager("error", data);
		}
	});
}

function setSwitchSuitstate(id,val){
	var obj = document.getElementById(id);
	if (val == 'on') {
		obj.src = NG_PATH+"Public/images/image/start.png";
		obj.title = $LANG.ON;
		$("#suitstate_status_id").html($LANG.ON);
		suitstate_enable = true;
	} else {
		obj.src = NG_PATH+"Public/images/image/stop.png";
		obj.title = $LANG.OFF;
		$("#suitstate_status_id").html($LANG.OFF);
		suitstate_enable = false;
	}

}
function delSuitstate() {

	if (!checkSuitstateStatus()) {
		return false;
	}
	var jq = $('#tt');
	var rows = jq.datagrid('getSelections');
	if (rows.length > 0) {
		ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
			if (r) {
				var post_data = [];
				for (var i = 0, len = rows.length; i < len; i++){
                    post_data.push(rows[i]['name']);
                }
                    post_data = post_data.join('#');
				$.ajax({
					url: "?c=Network/Suitstate&mod=suitstate",
					type: 'delete',
					data: {
                        delItems: post_data,
                        delKey:'name'
                    },
					success: function(data) {
						if (data != '0') {
							ngtosPopMessager("error", data);
						}
					}
				});
				jq.datagrid('reload');
			}
		});
	}
	else {
		ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
	}
}

 function cleanSuitstate() {
	if (!checkSuitstateStatus()) {
		return false;
	}
	var jq = $('#tt');
	var rows = jq.datagrid('getRows');
	if (rows.length == 0)
		return false;

	ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
		if (r) {
			$.ajax({
				url: "?c=Network/Suitstate&mod=suitstate&all=1",
				type: 'delete',
				success: function(data) {
					if (data != '0') {
						ngtosPopMessager("error", data);
					}
				}
			});
			jq.datagrid('reload');
		}
	});

 }

 function checkSuitstateStatus() {

	if (suitstate_enable) {
		ngtosPopMessager("error", $LANG.INTERFACE_LINKKAGE_HBOPCT)
		return false;
	}
	return true;
 }

 function set_suitstate_toolbar() {

	var crows = $('#tt').datagrid('getChecked');


	//删除按钮逻辑
	if (crows.length > 0) {
		$('#icon-delete').linkbutton('enable');
	} else {
		$('#icon-delete').linkbutton('disable');
	}

	var rows = $('#tt').datagrid('getRows');

	//清空按钮逻辑
	if (rows.length > 0) {
		$('#icon-clear').linkbutton('enable');
	} else {
		$('#icon-clear').linkbutton('disable');
	}
             //请用和禁用按钮逻辑
     if(crows.length >0){
         $('#icon-enable').linkbutton('enable');
         $('#icon-disable').linkbutton('enable');
     }else{
         $('#icon-enable').linkbutton('disable');
         $('#icon-disable').linkbutton('disable');
     }
 }

function closeSuitstateWindow() {

	$('#add_page').window("close");
}
//开启接口状态的方法
function changeEnable(){
    ngtosPopMessager("confirm", $LANG.SURE_ENABLE,function(r){
        if(r){
            var ids1 = [];
            var row=$('#tt').datagrid('getSelections');
            for (var i = 0; i < row.length; i++) {
                    ids1.push(row[i].name);
            }
            var name = ids1.join('#');
            $.ajax({
                url: "?c=Network/Suitstate&a=enableOrDisable",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    name:name,
                    status:'enable'
                },
                success: function(data){
                    if(data !='0'){
                        ngtosPopMessager('error',data);
                    }
                }
            });
            $('#tt').datagrid('reload');
        }
    });
}

//关闭接口状态的方法
function changeDisable(){
    ngtosPopMessager("confirm", $LANG.SURE_DISABLE,function(r){
        if(r){
            var ids1 = [];
            var row=$('#tt').datagrid('getSelections');
            for (var i = 0; i < row.length; i++) {
                    ids1.push(row[i].name);
            }
            var name = ids1.join('#');
            $.ajax({
                url: "?c=Network/Suitstate&a=enableOrDisable",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    name:name,
                    status:'disable'
                },
                success: function(data){
                    if(data !='0'){
                        ngtosPopMessager('error',data);
                    }
                }
            });
            $('#tt').datagrid('reload');
        }
    });
}