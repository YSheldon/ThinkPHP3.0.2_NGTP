function setPortalToolBar() {
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    } else if(sel_row.length==1) {
        $('#icon_edit').linkbutton('enable');
        $('#icon_del').linkbutton('enable');
    } else if(sel_row.length>1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('enable');
    }
}
function editPortalRow(msg) {
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1)
        edit_portal(rowData[0].name,rowData[0].server_name,rowData[0].address,rowData[0].port,msg);
    else
        return;
}
function add_portal(msg) {
    portal_tag = 1;
    if ($('#portal_div').length <= 0) {
        $(document.body).append("<div id='portal_div' class='ngtos_window_500'></div>");
    }
    open_window('portal_div','Auth/Portal','windowShow&w=auth_portal_window',msg);
}

function add_more_portal(tag) {
    var isValid = $("#portal_form").form('validate');
    if(!isValid) {
        return false;
    }
    var pserver = $('#portal_server').combobox('getValue');
    $.ajax({
        url: "?c=Auth/Portal&a=portalAdd",
        type: 'POST',
        datatype:'text',
        data:{
            hid_portal_name:$('#pname').val(),
            portal_tag:tag,
            hid_portal_address:$('#paddress').val(),
            hid_portal_port:$('#pport').val(),
            hid_portal_server:pserver
        },
        success: function(data){
            if(data=='0'){
                $("#portal_div").window("close");
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}

function edit_portal(name, sname, address, port, msg) {
    portal_tag = 2;
    param[0] = name;
    param[1] = sname;
    param[2] = address;
    param[3] = port;
    if ($('#portal_div').length <= 0) {
        $(document.body).append("<div id='portal_div' class='ngtos_window_500'></div>");
    }
    open_window('portal_div','Auth/Portal','windowShow&w=auth_portal_window',msg);
}

function delete_item() {
    var rows = $('#tt').datagrid('getSelections');
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r) {
            var ids1 = [];
            var rows = $('#tt').datagrid('getSelections');
            for(var i=0; i<rows.length; i++){
                ids1.push(rows[i].name);
            }
            var pageNum = return_pagenum('tt',rows);
            var name = ids1.join('#');
            $.ajax({
                url: "?c=Auth/Portal&a=del",
                type: 'POST',
                datatype:'text',
                data:{
                    delItems:name,
                    mod:'user auth portal'
                },
                success: function(data){
                    if(data=='0'){
                        $('#tt').datagrid('options').pageNumber = pageNum;
                        $('#tt').datagrid('getPager').pagination({pageNumber: pageNum});
                    } else{
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function clear_item() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Auth/Portal&a=clean&mod="+encodeURI('user auth portal'),
                type: 'GET',
                success: function(data){
                    if(data=='0'){
                        $('#tt').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}