function addipProbe() {
    changeType = 'post';
    tag = 1;
	if ($('#ipprobe_add').length<=0) {
		$(document.body).append("<div id='ipprobe_add' class='ngtos_window_600'></div>");
	}
	open_window('ipprobe_add','Network/IpProbe','windowShow&w=network_ipprobe_add_window',$LANG.ADD);
}
function ipProbeEdit() {
    var row = $('#tt').datagrid('getSelections');
    if(row.length ==1)
        editIp(row[0]['probe-id'],row[0]['probe-ip'],row[0]['interval']);
    else
        return;
}
//探测编辑弹出框
function editIp(rowid,rowip,rowinterval) {
    tag =2;
    changeType = 'put';
    param[0] = rowid;
    param[1] = rowip;
    param[2] = rowinterval;
    if ($('#ipprobe_add').length<=0) {
        $(document.body).append("<div id='ipprobe_add' class='ngtos_window_600'></div>");
    }
    open_window('ipprobe_add','Network/IpProbe','windowShow&w=network_ipprobe_add_window',$LANG.EDIT);
}
function ipProbeHandle(tag) {
    var id = $("#probe-id").val();
    var ip = $("#probe-ip").val();
    var interval = $("#interval").val();
    var dev = $("#dev").combobox('getValue');
    $.ajax({
        url: '?c=Network/IpProbe',
        type: changeType,
        data: {
            'probe-id':id,
            'probe-ip':ip,
            interval:interval,
            dev:dev,
            flag:tag
        },
        success: function(data) {
            if (data == 0) {
                $("#ipprobe_add").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
//探测删除
function ipProbeDelete() {
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length>0){
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                var id = [];
                for (var i = 0; i < rows.length; i++) {
                    id.push(rows[i]['probe-id']);
                }
                    id = id.join('#');
                    $.ajax({
                        url: "?c=Network/IpProbe&mod=ip_probe",
                        type: 'delete',
                        async: false,
                        data:{
/*                            mod:'network ip-probe',*/
                            delKey: 'probe-id',
                            delItems:id
                        },
                        success: function(data) {
                            if(data == 0) {
                                $('#tt').datagrid('reload');
                            } else {
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
            }
        });
    }else{
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}
//探测清空
function ipProbeDeleteAll() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
        if(r) {
            $.ajax({
                url: "?c=Network/IpProbe&a=clean&mod=ip_probe&all=1",
                type: 'delete',
                success: function(data) {
                    if (data == '0') {
                        $('#tt').datagrid('load');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}
//设置编辑删除按钮
function setIpProbe() {
    var sel_row = $('#tt').datagrid('getChecked');
     if (getPrivilege("network") == false) {
         $('#ipdelete').linkbutton('disable');
         $('#ipedit').linkbutton('disable');
     }else{
        if (sel_row.length<1) {
            $('#ipdelete').linkbutton('disable');
            $('#ipedit').linkbutton('disable');
        } else if(sel_row.length==1) {
            $('#ipdelete').linkbutton('enable');
            $('#ipedit').linkbutton('enable');
        } else if(sel_row.length>1) {
            $('#ipdelete').linkbutton('enable');
            $('#ipedit').linkbutton('disable');
        }
    }
}