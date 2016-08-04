var newArr = new Array();
var id = '';
function addProuteRow() {
    id = 0;
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_650'></div>");
    }
    open_window('add_page', 'Network/RoutePolicy&w=network_route_policy_add_window','', $LANG.ADD);
}
/*编辑功能的按钮弹出框*/
function editProuteRow(){
    id = 1;
    var row=$('#tt').datagrid('getSelected');
    editProuteRowAfter(row);
}
//编辑策略的方法
function editProuteRowAfter(row){
    var arr = row.pbrentry.split(' ');
    for(var i = 0;i < arr.length; i++){
        if(arr[i] == 'interface'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'gw'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'src'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'src'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'dst'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'sport'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'sport2'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'dport'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'dport2'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'protocol'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'metric'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'weight'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'dev'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'probe-id'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'load-balance'){
            newArr[arr[i]] = arr[i+1];
        }else if(arr[i] == 'id'){
            newArr[arr[i]] = arr[i+1];
        }
    }
    if ($('#add_page').length <= 0) {
        $(document.body).append("<div id='add_page' class='ngtos_window_650'></div>");
    }
    open_window('add_page', 'Network/RoutePolicy&w=network_route_policy_edit_window','', $LANG.EDIT);
}
/*提交数据*/
function  addProuteSubmit() {
    if ($('#sport_add').val() != "" && $('#sport2_add').val() != "" &&
            Number($('#sport_add').val()) >= Number($('#sport2_add').val())) {
        ngtosPopMessager("info", $LANG.THE_PORT_OTSPSB);
        return;
    }

    if ($('#dport_add').val() != "" && $('#dport2_add').val() != "" && Number($('#dport_add').val())
            >= Number($('#dport2_add').val())) {
        ngtosPopMessager("info", $LANG.PORT_OF_THE_DPSBGTTP);
        return;
    }

    if ($('#sport_add').val() == "" && $('#sport2_add').val() != "") {
        ngtosPopMessager("info", $LANG.SINGLE_PORT_FILL_START_PORT);
        return;
    }

    if ($('#dport_add').val() == "" && $('#dport2_add').val() != "") {
        ngtosPopMessager("info", $LANG.SINGLE_PORT_FILL_START_PORT);
        return;
    }
    $.ajax({
        url: "?c=Network/RoutePolicy",
        type: 'POST',
        async: false,
        data: {
            interface: $("#name_add").combobox('getValue'),
            src: $('#src_add').val(),
            sport: $('#sport_add').val(),
            sport2: $('#sport2_add').val(),
            dst: $('#dst_add').val(),
            dport: $('#dport_add').val(),
            dport2: $('#dport2_add').val(),
            protocol: $('#protocol_add').combobox('getValue'),
            gw: $('#gw_add').val(),
            metric: $('#metric_add').val(),
            weight: $('#weight_add').val(),
//            获取出接口，探测ID，只能选录算法中的数据
            dev:$('#out_interface').combobox('getValue'),
            probe_id:$('#probe_id').combobox('getValue'),
            load_balance:$('#load_blance').combobox('getValue')
        },
        success: function(data) {
            if (data == 0) {
                $("#add_page").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}

/*修改数据*/
function  editProuteSubmit() {
    if ($('#sport_add').val() != "" && $('#sport2_add').val() != "" &&
        Number($('#sport_add').val()) >= Number($('#sport2_add').val())) {
        ngtosPopMessager("info", $LANG.THE_PORT_OTSPSB);
        return;
    }

    if ($('#dport_add').val() != "" && $('#dport2_add').val() != "" && Number($('#dport_add').val())
        >= Number($('#dport2_add').val())) {
        ngtosPopMessager("info", $LANG.PORT_OF_THE_DPSBGTTP);
        return;
    }

    if ($('#sport_add').val() == "" && $('#sport2_add').val() != "") {
        ngtosPopMessager("info", $LANG.SINGLE_PORT_FILL_START_PORT);
        return;
    }

    if ($('#dport_add').val() == "" && $('#dport2_add').val() != "") {
        ngtosPopMessager("info", $LANG.SINGLE_PORT_FILL_START_PORT);
        return;
    }
    $.ajax({
        url: "?c=Network/RoutePolicy",
        type: 'PUT',
        async: false,
        data: {
            //获取接口信息
            interface:newArr['interface'],
            //获取网关中新的数据
            new_gw: $('#gw_add').val(),
            //获取网关中原始的数据
            gw:newArr['gw'],
            //获取原始权重的值
            before_weight:newArr['weight'],
            //获取权重的值
            weight: $('#weight_add').val(),
            //获取出接口，探测ID，只能选录算法中的数据
            new_dev:$('#out_interface').combobox('getValue'),
            //获取原始出接口的数据
            dev:newArr['dev'],
            //获取度量值
            metric: newArr['metric'],
            //获取原始的探测ID的值
            before_probe_id:newArr['probe-id'],
            probe_id:$('#probe_id').combobox('getValue'),
            load_balance:$('#load_blance').combobox('getValue'),
            before_load_balance:newArr['load-balance'],
            id:newArr['id'],
            type:'route_policy'
        },
        success: function(data) {
            if (data == 0) {
                $("#add_page").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data,function(){
                    $('#tt').datagrid('reload');
                });
            }
        }
    });
}

function moveProuteRow() {
    var rows = $('#tt').datagrid('getSelections');
    var pbrentry = rows[0].pbrentry;
    bind = param[0] = get_value("bind", pbrentry);
    name = param[1] = get_value("interface", pbrentry);   
    id = param[2] = get_value("id", pbrentry);
    var flag = movePrepareCheck(name, id);
    if (flag) {
        param[3] = flag;
        if ($('#move_page').length <= 0) {
            $(document.body).append("<div id='move_page' class='ngtos_window'></div>");
        }
        open_window('move_page', 'Network/RoutePolicy', 'windowShow&w=network_route_policy_move_window', $LANG.MOVE);
    }
}

function movePrepareCheck(name, id) {
    //获取所有策略的id
    var ret = 0;
    $.ajax({
        url: "?c=Network/RoutePolicy&a=listt",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            name: name
        },
        success: function(data) {
                if (id == data['info']) {
                    ngtosPopMessager("info", $LANG.THE_INTERFACE_HAS_ONLY_ONE_STRATEGY_NO_NEED_TO_MOVE);
                } else {
                    //返回ids
                    ret = data['info'];
                }
        }
    });
    return ret;
}

function moveProuteRowInit() {
    //初始化移动界面的内容
    $("#curid").val(param[2]);
    $('#moveid')[0].innerHTML = ''+$LANG.MOVE_POLICY+' &nbsp;&nbsp;' + param[2] + '&nbsp;&nbsp;'+$LANG.TO_POLICY+'&nbsp;';
    var arr = param[3].split(",");
    $('#selectedid').empty();
    for (var i = 0; i < arr.length; i++) {
        if (param[2] != arr[i]) {
            $('#selectedid')[0].add(new Option(arr[i], arr[i]));
        }
    }
}

/*提交数据*/
function moveProuteSubmit() {
    //alert(param[2]);
    $.ajax({
        url: "?c=Network/RoutePolicy",
        type: 'put',
        dataType: 'json',
        async: false,
        data: {
           // bind: param[0],
            interface: param[1],
            id: param[2],
            pid: $("#selectedid")[0].value,
            dir: $("#position").combobox('getValue'),
            type:'move'
        },
        success: function(data) {
            if (data == 0) {
                $("#move_page").window("close");
                $('#tt').datagrid('reload');
            } else if (data == 2) {
                ngtosPopMessager("error", data['info']);
            }
        }
    });
}


/*菜单栏删除*/
function deleteProuteRow() {
    var msg;
    var row = $('#tt').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r){
               var pageNum = return_pagenum('tt',row);
                  
                for (var i = 0; i < row.length; i++) {
                    $.ajax({
                        url: "?c=Network/RoutePolicy",
                        type: 'delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            interface: get_value("interface", row[i].pbrentry),
                            src: get_value("src", row[i].pbrentry),
                            sport: get_value("sport", row[i].pbrentry),
                            sport2: get_value("sport2", row[i].pbrentry),
                            dst: get_value("dst", row[i].pbrentry),
                            dport: get_value("dport", row[i].pbrentry),
                            dport2: get_value("dport2", row[i].pbrentry),
                            protocol: get_value("protocol", row[i].pbrentry),
                            gw: get_value("gw", row[i].pbrentry),
                            metric: get_value("metric", row[i].pbrentry),
                            weight: get_value("weight", row[i].pbrentry),
                            dev:get_value('dev',row[i].pbrentry),
                            load_balance:get_value('load-balance',row[i].pbrentry),
                            probe_id:get_value('probe-id',row[i].pbrentry)
                        },
                        success: function(data) {

                            if (data == 2) {
                                msg += data['info'];
                            }
                        }
                    });
                }
            if (msg != "" && msg != null) {
                ngtosPopMessager("error", msg);
            }else{
                $('#tt').datagrid('options').pageNumber = pageNum;
                $('#tt').datagrid('getPager').pagination({pageNumber: pageNum});

            }
            $('#tt').datagrid('reload');
        }
        }, true);
}

/*菜单栏清空*/
function clearProuteRow() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/RoutePolicy&mod=route-policy&act=cl&all=1",
//                data:{
//                    mod:'network route-policy',
//                    act:'clear'
//                },
                type: 'delete',
                dataType: 'json',
                async: false,
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    } else if (data == 2) {
                        ngtosPopMessager("error", data['info']);
                    }
                }
            });
        }
    }, true);
}

function get_value(key, string) {
        if(string !="" && string !=null){
            var arr = string.split(' ');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == key)
                    return arr[i + 1];
            }
        return "";
     }
}

//function getRouteVr(id) {
//    var sid = "#" + id;
//    var vr_state = getVsysTurn();
//    if (vr_state) {
//        $.ajax({
//            url: "?c=System/Virtual&a=vrDataAll",
//            type: 'POST',
//            dataType: 'json',
//            async: false,
//            success: function(data) {
//                if (data)
//                {
//                    $.each(data.rows, function() {
//                        $(sid)[0].add(new Option(this.vr_name, this.vr_name));
//                    });
//                }
//            }
//        });
//    }
//}

function set_proute_toolbar() {
    var crows = $('#tt').datagrid('getChecked');
    //移动按钮逻辑
        if (crows.length == 1) {
            $('#icon_move').linkbutton('enable');
        } else {
            $('#icon_move').linkbutton('disable');
        }

        //删除按钮逻辑
        if (crows.length > 0) {
            $('#icon_delete').linkbutton('enable');
        } else {
            $('#icon_delete').linkbutton('disable');
        }
        //编辑按钮逻辑
        if (crows.length == 1) {
            $('#icon_edit').linkbutton('enable');
        } else {
            $('#icon_edit').linkbutton('disable');
        }

//    var rows = $('#tt').datagrid('getRows');
//
//    //清空按钮逻辑
//    if (rows.length > 0) {
//        $('#icon_clear').linkbutton('enable');
//    } else {
//        $('#icon_clear').linkbutton('disable');
//    }
}
