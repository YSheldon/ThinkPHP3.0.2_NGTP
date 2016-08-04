//添加弹出框
function AddLinkBack() {
    if ($('#linkback_add').length<=0) {
        $(document.body).append("<div id='linkback_add' class='ngtos_window_600'></div>");
    }
        open_window('linkback_add','System/LinkBack','windowShow&w=system_linkback_add_window',$LANG.ADD);
}
//添加链路备份

function AddLink() {
    var addlink = $('#linkback_form').form('validate');
    if (addlink) {
        var dsta = $('#dst1').val()+'/';
        var dstb = $('#dst2').val();
        var dst = dsta+dstb;
        
        $.ajax({
            url: '?c=System/LinkBack&a=IpProbeAddHandle',
            type: 'POST',
            data: {
               dst: dst,
               'master-id': $('#master-id').combobox('getValue'),
               'slave-id': $('#slave-id').combobox('getValue')
            },
            success: function(data) {
                if (data == 0) {
                    $("#linkback_add").window("close");
                    $('#tt').datagrid('reload');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}
//删除链路备份
//由于当前链路备份只能删除一个，所以直接使用循环来执行删除操作
function LinkBackDelete() {
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length>0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r) {
                for (var i = 0; i < rows.length; i++) {
                    var id = rows[i]["id"];
                    $.ajax({
                        url: "?c=System/LinkBack&a=del",
                        type: 'POST',
                        async: false,
                        data:{
                            delItems: id,
                            mod:'network linkbak',
                            delKey:'id'
                        },
                        success: function(data) {
                            if (data == 0) {
                                $('#tt').datagrid('reload');
                            } else {
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
            }
        });
    } else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }
}
//清空链路备份
function LinkBackDeleteAll() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if (r) {
            $.ajax({
                url: "?c=System/LinkBack&a=clean&mod="+encodeURI('network linkbak'),
                type: 'POST',
                success: function(data) {
                    if (data == '0') {
                        $('#tt').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}
//开启链路备份
function enableLinkRoles() {
    var rows = $('#tt').datagrid('getSelections');
    var id = [];
    for (var i = 0; i < rows.length; i++) {
        id.push(rows[i]['id']);
    }
       id = id.join('#');

        $.ajax({
            url:'?c=System/LinkBack&a=callFun',
            type:'POST',
            datatype:'text',
            data : {
                fun:'enableEdit',
                parKey: 'id',
                parVal:id,
                mod:'network linkbak',
                act:'start'
            },
            success : function(data) {
                if (data == 0) {
                    ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                    $('#tt').datagrid('reload');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
}
//停止链路备份
function disableLinkRoles() {
    var rows = $('#tt').datagrid('getSelections');
    var id = [];
    for (var i = 0; i < rows.length; i++) {
       id.push(rows[i]["id"]);
    }
    id = id.join('#');

        $.ajax({
            url:'?c=System/LinkBack&a=callFun',
            type:'POST',
            datatype:'text',
            data : {
                fun:'enableEdit',
                parVal: id,
                parKey:'id',
                mod:'network linkbak',
                act:'stop'
            },
            success : function(data) {
                if (data == 0) {
                    ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                    $('#tt').datagrid('reload');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        })
}
//设置删除按钮
function setLinkBack() {
    var sel_row=$('#tt').datagrid('getChecked');
    if (sel_row.length<1) {
        $('#ipdelete').linkbutton('disable');
    } else if (sel_row.length==1) {
        $('#ipdelete').linkbutton('enable');
    } else if (sel_row.length>1) {
        $('#ipdelete').linkbutton('disable');
    }
}