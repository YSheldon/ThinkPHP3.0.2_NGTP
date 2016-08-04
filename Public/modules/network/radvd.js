//添加弹出框
function addRadvd() {
    tag = 1;
    changeType = 'post';
    if ($('#radvd_add').length<=0) {
        $(document.body).append("<div id='radvd_add' class='ngtos_window_620'></div>");
    }
    open_window('radvd_add','Network/Radvd','windowShow&w=network_radvd_window',$LANG.ADD);
}
//处理添加数据
function radvdHandle(tag) {
    var interfaces = $('#interface').combobox('getValue');
    var prefix = $('#prefix').val();
    var valid_life_day = $("#valid_life_day").val();
    var clock = $("#clock_cid").val();
    var clock_arr = clock.split(':');
    var lease_hour = clock_arr[0];
    var lease_min = clock_arr[1];
    var max_interval = $("#max_interval").val();
    var min_interval = $("#min_interval").val();
    var reachable = $("#reachable").val();
    var retrans = $("#retrans").val();
    var cur_limit = $("#cur_limit").val();
    $.ajax({
        url: '?c=Network/Radvd',
        type: changeType,
        datatype: 'text',
        data : {
            interface : interfaces,
            prefix : prefix,
            // prefix2 : prefix2,
            valid_life_day : valid_life_day,
            valid_life_hour : lease_hour,
            valid_life_min : lease_min,
            max_ra_interval : max_interval,
            min_ra_interval : min_interval,
            reachable_t : reachable,
            retrans_t : retrans,
            cur_hop_limit : cur_limit,
            tag : tag
        },
        success: function(data) {
            if (data == 0) {
                $("#radvd_add").window("close");
                datagridReload("tt");
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}
//删除radvd
function deleteRadvd(){
    var row = $('#tt').datagrid('getSelections');
    ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
        if (r) {
            var interface = [];
            for (var i=0; i<row.length; i++) {
                interface.push(row[i]['interface']);
            }
            interface = interface.join('#');
            $.ajax({
                url: "?c=Network/Radvd&mod=radvd",
                type: 'delete',
                dataType:'json',
                async: false,
                data: {
/*                    mod:'network radvd',*/
                    delItems : interface,
                    delKey:'interface'
                },
                success : function(data) {
                    if (data == 0) {
                        datagridReload("tt");
                    } else {
                        ngtosPopMessager("error",data);
                    }
                }
            });
        }
    });
}
//清空radvd
function deleteAllRadvd(){
   ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
        if(r) {
            $.ajax({
                 url: "?c=Network/Radvd&mod=radvd&all=1",
                type: 'delete',
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('load');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}
//编辑radvd
function editRadvd() {
    var row = $('#tt').datagrid('getSelections');
    if (row.length == 1)
        editDvd(row[0]['interface'],row[0]['prefix'],row[0]['lease_day'],row[0]['lease_hour'],row[0]['lease_min'],row[0]['max_ra_interval'],row[0]['min_ra_interval'],row[0]['cur_hop_limit'],row[0]['reachable_t'],row[0]['retrans_t']);
    else
        return;
}
function editDvd(interface,prefix,lease_day,lease_hour,lease_min,max_ra_interval,min_ra_interval,cur_hop_limit,reachable_t,retrans_t) {
    tag = 2;
    changeType = 'put';
    param[0] = interface;
    param[1] = prefix;
    param[2] = lease_day;
    param[5] = lease_hour;
    param[6] = lease_min;
    param[7] = max_ra_interval;
    param[8] = min_ra_interval;
    param[9] = reachable_t;
    param[10] = retrans_t;
    param[11] = cur_hop_limit;
    if ($('#radvd_add').length<=0) {
        $(document.body).append("<div id='radvd_add' class='ngtos_window_620'></div>");
    }
    open_window('radvd_add','Network/Radvd','windowShow&w=network_radvd_window',$LANG.MODIFY);
}
//开启和关闭radvd
function RadvdRoles(id) {
    var target = document.getElementById(id);
    var act = target.title == $LANG.ON ?'start':'stop';

    $.ajax({
        url:'?c=Network/Radvd&a=callFun',
        data:{
            fun:'simpleHandle',
            mod:'network radvd',
            act:act 
        },
        type: 'POST',
        datatype: 'text',
        success : function(data) {
            if (data == 0) {
                ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
            status_ret(id);
        } 
    });
}
function status_ret(id) {
    $.ajax({
        url:'?c=Network/Radvd&a=status',
        type: 'POST',
        datatype: 'text',
        success: function(data) {
            if(data == 'disable' || data == 'enable'){
				var ret = data == 'disable'?'off':'on';
				setStatus(id, ret);
			}
        }
    });
}
function setStatus(id,val){
    var obj = document.getElementById(id);
    if (val == 'on') {
            obj.src = NG_PATH+"Public/images/image/start.png";
            obj.title = $LANG.OFF;
            $("#suitstate_status_id").html($LANG.ON);
    } else {
            obj.src = NG_PATH+"Public/images/image/stop.png";
            obj.title = $LANG.ON;
            $("#suitstate_status_id").html($LANG.OFF);
    }
}
//关闭radvd
/*function RadvdRoles() {
    $.ajax({
        url: '?c=Network/Radvd&a=callFun',
        data:{
            fun:'simpleHandle',
            mod:'network radvd',
            act:'stop'
        },
        type: 'POST',
        datatype: 'text',
        success: function(data) {
            if (data == 0) {
                ngtosPopMessager("info",$LANG.OPERATION_SUCCESS);
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    })
}*/
function setRadvd() {
    var sel_row = $('#tt').datagrid('getChecked');
    if (getPrivilege("network") == false) {
        $('#ipedit').linkbutton('disable');
        $('#ipdelete').linkbutton('disable');
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