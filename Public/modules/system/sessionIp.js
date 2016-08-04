//ipv4和ipv6弹出框
function superQuery(ip) {
	if ($('#session_search').length <= 0) {
        $(document.body).append("<div id='session_search' class='ngtos_window_400'></div>");
    }
	if (ip == 'ipv4') {
    	open_window('session_search','System/Session','ipv4Search',$LANG.SEARCH);
	} else {
    	open_window('session_search','System/Session','ipv6Search',$LANG.SEARCH);
	}
}
//删除ipv4
function deleteSeesionIpv4() {
    var rows = $('#sessionipv4').datagrid('getSelections');
    var msg;
    if (rows.length>0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if(r) {
            var s1,d1;
            for(var i=0; i<rows.length; i++) {
                s1=rows[i].src_ip_port.split(':');
                d1=rows[i].dst_ip_port.split(':');
                $.ajax({
                    url: "?c=System/Session&a=SessionDelete",
                    type: 'POST',
                    data:{
                        family:'ipv4',
                        protocol:rows[i].protocol,
                        saddr:s1[0],
                        daddr:d1[0],
                        sport:s1[1],
                        dport:d1[1]
                    },
                    success: function(data) {
                        if (data != 'ok') {
                            msg+=i+' '+data+'<br />';
                        }
                    }
                });
            }
            if (msg != "" && msg != null) {
                ngtosPopMessager("error", msg);
            }
            	$('#sessionipv4').datagrid('reload');
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}
//删除ipv6
function deleteSeesionIpv6() {
    var rows=$('#sessionipv6').datagrid('getSelections');
    var arr1,arr2;
    var msg;
    if (rows.length>0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if (r) {
            for (var i=0; i<rows.length; i++) {
                arr1=rows[i].src_ip_port.split(':');
                arr2=rows[i].dst_ip_port.split(':');
                $.ajax({
                    url: "?c=System/Session&a=SessionDelete",
                    type: 'POST',
                    dataType:'text',
                    data:{
                        family:'ipv6',
                        protocol:rows[i].protocol,
                        saddr:rows[i].src_ip_port.replace(':'+arr1[arr1.length-1],''),
                        daddr:rows[i].dst_ip_port.replace(':'+arr2[arr2.length-1],''),
                        sport:arr1[arr1.length-1],
                        dport:arr2[arr2.length-1]
                    },
                    success: function(data) {
                        if (data != 'ok'){
                            msg+=i+' '+data+'<br />';
                        }
                    }
                });
            }
            if (msg != "" && msg != null) {
                ngtosPopMessager("error", msg);
            }
                $('#sessionipv6').datagrid('reload');
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}
//清空连接信息
function deleteAll(str) {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
        if (r) {
	        $.ajax({
	            url: "?c=System/Session&a=DeleteAll",
	            type: 'POST',
	            dataType:'text',
	            async:false,
	            data:{
	                family:str
	            },
	            success: function(data) {
	                if (data == 0) {
	                	if (str == 'ipv4') {
			                $('#sessionipv4').datagrid('reload');
			           	} else {
			                $('#sessionipv6').datagrid('reload');
			            }
		                } else {
		                    ngtosPopMessager("error", data);
	                }
	            }
	        });
        }
    });
}
//编辑ipv4删除按钮
function setSessionIpv4() {
    var crows = $('#sessionipv4').datagrid('getChecked');
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
}
//编辑ipv6删除按钮
function setSessionIpv6() {
    var crows = $('#sessionipv6').datagrid('getChecked');

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
}