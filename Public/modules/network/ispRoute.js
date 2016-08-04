var bad_char=/[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im;
function setIspRouteToolBar(){
    var sel_row=$('#tt').datagrid('getChecked');
        if(sel_row.length<1){
            $('#icon_del').linkbutton('disable');
        }else {
            if (getPrivilege("network") != false) {
                $('#icon_del').linkbutton('enable');
            }
        }
}

function addIspRoute(msg){
    if ($('#isp_route_div').length <= 0) {
        $(document.body).append("<div id='isp_route_div' class='ngtos_window_400'></div>");
    }
    open_window('isp_route_div','Network/IspRoute&w=network_isp_route_window','',msg);
}

function addIspAddr(msg){
    if ($('#isp_addr_div').length <= 0) {
        $(document.body).append("<div id='isp_addr_div' class='ngtos_window_500'></div>");
    }
    open_window('isp_addr_div','Network/IspRoute','windowShow&w=network_isp_addr_window',msg);
}

function deleteIspRoute(){
    ngtosPopMessager('confirm',$LANG.DELETE_IT,function(r) {
        if(r) {
            var ids1 = [];
            var ids2 = [];
            var ids3 = [];
            var rows = $('#tt').datagrid('getSelections');
            var pagenum = return_pagenum('tt',rows);
            for(var i=0; i<rows.length; i++){
                ids1.push(rows[i].isp_name);
                ids2.push(rows[i].isp_gw);
                ids3.push(rows[i].isp_dev);
            }
            var name = ids1.join('#');
            var gw = ids2.join('#');
            var dev = ids3.join('#');
            $.ajax({
                url: "?c=Network/IspRoute",
                type: 'delete',
                datatype:'text',
                data:{
                    ispName:name,
                    gw:gw,
                    dev:dev
                },
                success: function(data){
                    if(data == '0'){
                        $('#tt').datagrid('options').pageNumber = pagenum;
                        $('#tt').datagrid('getPager').pagination({pageNumber: pagenum});
                    }else{
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                    $("#tt").datagrid("unselectAll");
                }
            });
        }
    });
}

function clearIspRoute() {
    if ($('#isp_clear_page').length <= 0) {
        $(document.body).append("<div id='isp_clear_page' class='ngtos_window_400'></div>");
    }
    open_window('isp_clear_page','Network/IspRoute','windowShow&w=network_isp_route_clear',$LANG.CLEAR);
}

function ispImport() {
    if ($('#isp_import_page').length <= 0) {
        $(document.body).append("<div id='isp_import_page' class='ngtos_window_500'></div>");
    }
    open_window('isp_import_page','Network/IspRoute','windowShow&w=network_isp_import',$LANG.UPDATE_ISP);
}
