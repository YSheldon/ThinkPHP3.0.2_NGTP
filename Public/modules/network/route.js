function deleteselectrow() {
    var rows = $('#tt').datagrid('getSelections');
    if (rows.length > 0) {
        ngtosPopMessager("confirm",$LANG.DELETE_IT, function(r) {
            if (r) {
                var msg;
                var dst = [];
                var gw = [];
                var family = [];
                var metric = [];
                var dev = [];
                for (var i = 0; i < rows.length; i++) {
                    dst.push(rows[i].dst);
                    gw.push(rows[i].gw);
                    family.push(rows[i].family);
                    metric.push(rows[i].metric);
                    dev.push(rows[i].oif);
                }
                    dst = dst.join('#');
                    gw = gw.join('#');
                    family = family.join('#');
                    metric = metric.join('#');
                    dev = dev.join('#');

                    $.ajax({
                        url: "?c=Network/Route",
                        type: 'delete',
                        async:false,
                        data: {
                            dst: dst,
                            gw: gw,
                            family: family,
                            metric: metric,
                            dev: dev
                        },
                        success: function(data) {
                            if (data  != '0') {
                                msg += i + ' ' + data + '<br />';
                            }
                        }
                    });
                if (msg != "" && msg != null) {
                    ngtosPopMessager("error", msg);
                }
                datagridReload('tt');
            }
        });
    }
    else {
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION);
    }

}

function cleanRoutes(value){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?c=Network/Route&mod=route&all=1",
                type: 'delete',
                dataType: 'text',
                data: {
                    param: value,
                    parKey:'family'
                },
                success: function(data) {
                    if (data == '0') {
                        $('#tt').datagrid('reload');
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}


/*添加路由*/
function addRoute() {

//    addTan('admin3');
    /*添加路由，调用ajax*/
    var type = 'ipv4';
    var mask = '';
    if ($("#add_dst").val().indexOf(':') < 0) {
        mask = $('#add_masks').val();
    } else {
        type = 'ipv6';
    }
    //接口与网关必须填写其中一个
    if ($('#add_dev').combobox('getValue') == '' && $("#add_gw")[0].value == ''){
        ngtosPopMessager("error", $LANG.IF_GW_MUST_SELECT_ONE);
        return;
    }
    $.ajax({
        url: "?c=Network/Route",
        type: 'POST',
        dataType: 'text',
        data: {
            dst: $('#add_dst').val() + '/' + $('#add_masks').val(),
            family: type,
            gw: $('#add_gw').val(),
            metric: $('#add_metric').val(),
            dev: $('#add_dev').combobox('getValue')
        },
        success: function(data) {

            if (data == '0') {
                closeWindow('route_add_window');
                $('#tt').datagrid('reload');
            }else{
				//alert("error");
                ngtosPopMessager("error", data);
            }
        }

    });
}
function editSelectRow(){
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1 && rowData[0].option=='Y')
        editRoute(rowData[0].dst,rowData[0].family,rowData[0].metric,rowData[0].vr,rowData[0].route_id,rowData[0].gw,rowData[0].oif,rowData[0].weight,rowData[0].search_id,rowData[0].flags);
    else
        return;
}

/*编辑路由：先删除该路由，然后添加该路由*/
function  editRoute() {
        /*删除路由*/
        $.ajax({
            url: "?c=Network/Route&a=routeDelete",
            type: 'POST',
            dataType: 'text',
            async: false,
            data: {
                dst: editDst,
                family: editFamily,
                metric: editMetric,
                gw: editGw,
                dev: editOif,
                vr_id: editVr.split(':')[0]
            },
            success: function(data) {
                if (data == '0') {
                    /*添加路由*/
                    $.ajax({
                        url: "?c=Network/Route&a=routeAddsave",
                        type: 'POST',
                        dataType: 'text',
                        data: {
                            dst: editDst,
                            family: editFamily,
                            gw: $('#add_gw').val(),
                            metric: $('#add_metric').val(),
                            dev: $('#add_dev')[0].value,
                            vr_id: editVr.split(':')[0]
                        },
                        success: function(data) {
                            if (data == '0') {
                                closeWindow('route_add_window');
                                $('#tt').datagrid('reload');
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }else{
                    ngtosPopMessager("error", data);
                }

            }
        });
}

function searchRoute() {
    var vr = switch_tag == 'on' ? $('#virtualId')[0].value : '';
    var family = $('#ipchose')[0].value;
    $("#tt").datagrid('options').url = '?c=Network/Route&family=' + family + '&vr=' + vr;
    $('#tt').datagrid('reload');
}

function setToolBar(){
    var rows=$('#tt').datagrid('getChecked');
    if(getPrivilege("network") == false){
        $('#icon_delete').linkbutton('disable');
    }else{
        if(rows.length==0){
            $('#icon_delete').linkbutton('disable');
        }else if(rows.length==1 && rows[0].option=='Y'){
            $('#icon_delete').linkbutton('enable');
        }else if(rows.length>1){
            $('#icon_delete').linkbutton('enable');
            for(var i=0;i<rows.length;i++){
                if(rows[i].option=='N'){
                    $('#icon_delete').linkbutton('disable');
                    return;
                }

            }
        }
    }
}

function addRouteWindow(){
	
    var oper=0;
    if ($('#route_add_window').length <= 0) {
        $(document.body).append("<div id='route_add_window' class='ngtos_window_650'></div>");
    }
    open_window('route_add_window','Network/Route','routeWindow',$LANG.ADD);

}

