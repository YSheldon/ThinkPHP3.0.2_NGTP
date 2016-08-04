//添加
//由于在弹出window窗口的时候存在判断，所以不能调用公共方法
function addGre() {
    dhcpPool_tag = 1;
    changeType = 'post';
    if ($('#gre_div').length <= 0) {
        $(document.body).append("<div id='gre_div' class='ngtos_window'></div>");
    }
    open_window('gre_div','Network/Gre','greWindow',$LANG.ADD);
}
//编辑
//由于在弹出window窗口的时候存在判断，所以不能调用公共方法
function editGreAttr(name) {
    changeType = 'put';
    dhcpPool_tag = 2;
    if ($('#gre_div').length <= 0) {
        $(document.body).append("<div id='gre_div' class='ngtos_window_600'></div>");
    }
    $.ajax({
        url: "?c=Network/Gre&a=greEditjsondata",
        type: 'POST',
        dataType:'json',
        data:{
            name:name
        },
        success: function(data) {
            if(data){
                $(data.rows).each(function(key,value){
                    param[0] = name;
                    param[1] = value.remote;
                    param[2] = value.local;
                    param[3] = value.key;
                    param[4] = value.ttl;
                    param[5] = value.csum;
                    param[6] = value.seq;
                    open_window('gre_div','Network/Gre','greeWindow',$LANG.EDIT);
                })
            }
        }
    });
}
function add_addrGre_submit(tag) {
    var name = $("#name").val();
    var yuanaddr = $("#yuanaddr").val();
    var hostaddr = $("#hostaddr").val();
    var greDesc = $("#greDesc").val();
    var Lifetime = $("#Lifetime").val();
    if ( name.substr(0,4) != "gre-") {
        ngtosPopMessager("info", $LANG.TUNNEL_NAME_MUST_BEGIN_WITH_GRE);
        return false;
    }

    var open_val = '';
    if ($('#check1').attr("title") == $LANG.STOP) {
        open_val = "off";
    } else {
        open_val = "on";
    }

    var open_val2 = '';
    if ($('#check2').attr("title") == $LANG.STOP) {
        open_val2 = "off";
    } else {
        open_val2 = "on";
    }

    $.ajax({
        url: "?c=Network/Gre",
        type: changeType,
        datatype:'text',
        data:{
            name:name,
            yuanaddr:yuanaddr,
            hostaddr:hostaddr,
            greDesc:greDesc,
            Lifetime:Lifetime,
            open_val:open_val,
            open_val2:open_val2,
            dhcpPool_tag:tag
        },
        success: function(data) {
            if(data != 0) {
                ngtosPopMessager("error", data);
            }
            $("#gre_div").window("close");
            datagridReload("gre");
        }
    });
}

//删除
function delete_Row(){
    var rows = $('#gre').datagrid('getChecked');
    if (rows.length == 0) {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    } else {
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if (r){
                var rows=$('#gre').datagrid('getChecked');
                var name = [];
                for(var i=0; i<rows.length; i++) {
                    name.push(rows[i].name);
                }
                name = name.join('#');
                $.ajax({
                    url: "?c=Network/Gre&mod=tunnel",
                    type: 'delete',
                    dataType: 'json',
                    async:false,
                    data:{
/*                        mod:'network tunnel',*/
                        delItems:name
                    },
                    success: function(data) {
                        if (data=='0') {
                            datagridReload("gre");
                        } else {
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }

        })
    }
}

//清空
function clearGreRow() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r) {
        if(r){
            $.ajax({
                url: "?c=Network/Gre&a=clean&mod=tunnel",
                type: 'delete',
                success: function(data) {
                    if (data=='0') {
                        location.reload();
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);
}
function changBtState_gre(obj) {
    if (obj.title==$LANG.START) {
        obj.src=NG_PATH+"Public/images/image/stop.png";
        obj.title=$LANG.STOP;
    } else {
        obj.src=NG_PATH+"Public/images/image/start.png";
        obj.title=$LANG.START;
    }
}

function setBtState_gre(obj, opt) {

    var obj = "#"+obj;
    if (opt=='stop') {
        $(obj).attr("src",NG_PATH+"Public/images/image/stop.png");
        $(obj).attr("title",$LANG.STOP);
    } else {
        $(obj).attr("src",NG_PATH+"Public/images/image/start.png");
        $(obj).attr("title",$LANG.START);
    }
}
function addIpv4() {
    var obj;
    var ipaddr=$("#ip4_cid").val();
    var mask=$("#mask4_cid").val();
    var ha = ($('#ha4_cid').attr("checked") == "checked")?"HA":"";
    if(!ipaddr){
        return false;
    }
    if (mask == "" && ha == "HA") {
        ngtosPopMessager("info",$LANG.PLEASE_ENTER_A_MASK,"",true);
        return;
    }
    var data = $("#ip4_list_cid").datagrid("getData");
    for (var i=0; i<data.rows.length; i++) {
        if (ipaddr == data.rows[i]['ip']) {
            ngtosPopMessager("info", $LANG.THE_ADDRESS_HBAPRE,"",true);
            return;
        }
    }
    var rowid = data.rows.length;
    obj = {id: rowid, ip: ipaddr, mask: mask, ha: ha};
    $("#ip4_list_cid").datagrid("appendRow",obj);
    $("#ip4_cid").textbox('setValue','');
    $("#mask4_cid").textbox('setValue','');
}

function delRow4(id) {
   var rows = $("#ip4_list_cid").datagrid('getSelections');
    if((rows.length>0)) {
        ngtosPopMessager('confirm', $LANG.DELETE_IT, function(r) {
            if (r) {
                for(var j=rows.length-1;j>=0;j--) {
                    $("#ip4_list_cid").datagrid("deleteRow", rows[j].id);
                }
                var data = $("#ip4_list_cid").datagrid("getData");
                if(data.rows.length == 0) return;
                $.each(data.rows,function(key,val) {
                    this.id = key;
                });
                $("#ip4_list_cid").datagrid("loadData",data);
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}
function loadDatagrid() {
    $('#ip4_list_cid').datagrid({
        width: '524',
        height: '165',
        striped: true,
        loadMsg:$LANG.WAITING,
        rownumbers: true,
        columns:[[
            {field:'ck',checkbox:true},
            {field: 'id', title: 'id', width: 10},
            {field:'ip',title: $LANG.ADDRESS,width: 200},
            {field:'mask',title: $LANG.MASK,width: 200}
        ]],
        toolbar: [{
                text: $LANG.DELETE,
                iconCls: 'icon-delete',
                handler: function (){
                    delRow4();
                }
            }]
    });
    $("#ip4_list_cid").datagrid('loadData',load_objdata());
    $("#ip4_list_cid").datagrid('hideColumn','id');
}
function getIp4Data(ip4) {
    var ip4_arr = new Array();
    var ip4_json_ele = "";
    if (ip4 !="" && ip4 !=null) {
        ip4_arr = ip4.split(',');
        for (var i=0; i<ip4_arr.length; i++) {
            ele = ip4_arr[i].split("/");
            ip4_json_ele += '{"id":"' + i + '","ip":"'+ele[0]+'","mask":"'+ele[1]+'"},';
        }
    }

    ip4_json_ele = ip4_json_ele.substr(0,ip4_json_ele.length-1);
    var ip4_json_head = '"rows":[';
    var ip4_json_end = ']';
    var ip4_json = ip4_json_head + ip4_json_ele + ip4_json_end;
    var grid_data_ip4="{"+ip4_json+"}";
    eval('grid_data_ip4='+grid_data_ip4);
    var my_load_objdata4=load_objdata(grid_data_ip4);
    return my_load_objdata4;
}
//操作接口属性的方法
function editInterfaceAttr(name) {
    if ($('#gre_interface').length <= 0) {
        $(document.body).append("<div id='gre_interface' class='ngtos_window_600'></div>");
    }
    $.ajax({
        url: "?c=Network/Gre&a=InterfaceAttrjsondata",
        type: 'POST',
        dataType:'json',
        data:{
            name:name
        },
        success: function(data) {
            if(data){
                $(data.rows).each(function(key,value) {
                    param[0] = name;
                    param[1] = data["rows"][0]["shutdown"];
                    param[2] = data["rows"][0]["ip4"];
                    open_window('gre_interface','Network/Gre','interfaceEditWindow',$LANG.IF_ATTR);
                })
            }
        }
    })
}

function greInterface_handle() {
    var name = $("#interface_name").val();
    if ($('#shutdown_cid').attr("title") == $LANG.STOP) {
        var shutdown_val = 1;
    } else {
        var shutdown_val = 0;
    }
    var data_address4_list = $("#ip4_list_cid").datagrid("getRows");

    $.ajax({
        url: "?c=Network/Gre&a=InterfaceAttrHandle",
        type: 'POST',
        data:{
            name:name,
            shutdown:shutdown_val,
            ip4addr_items:json_to_string(data_address4_list)
        },
        success: function(data) {
            if (data == 0) {
                $("#gre_interface").window("close");
                datagridReload("gre");
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}

function set_toolbar() {
    var crows = $('#gre').datagrid('getChecked');
    //删除按钮逻辑
    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
    var rows = $('#gre').datagrid('getRows');
    //清空按钮逻辑
    if (rows.length > 0) {
        $('#icon-clear').linkbutton('enable');
    } else {
        $('#icon-clear').linkbutton('disable');
    }
}