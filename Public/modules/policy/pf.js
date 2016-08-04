var ids;
var names;
var area;
var addressname;
function editSelectPf(msg){
    var row=$('#tt').datagrid('getSelections');
    editpf(row[0].id,row[0].name,row[0].area,row[0].addressname,msg);
}

function editpf(rowid,rowname,rowarea,rowaddressname,msg) {
    ids = rowid;
    names = rowname;
    area = rowarea;
    addressname = rowaddressname;
    open_window('adduserDiv','Policy/Pf&w=policy_pf_window','',msg);
}

function addPf(msg){
    ids = '';
    names = '';
    area = '';
    addressname = '';
    open_window('adduserDiv','Policy/Pf&w=policy_pf_window','',msg);
}

function pfAddrReflesh(){
    $('#adduserDiv').find('#addressname').combotree({
        url: '?c=Policy/Pf&a=callFun',
        parent_checked:false,
        required:false,
        panelHeight:'auto',
        panelMaxHeight:198,
        multiple:false,
        editable:true,
        queryParams:{
            fun: 'comboTree',
            parentNode: 'Address,AddressGroup',
            Address: 'define host,define range,define subnet',
            AddressGroup: 'define group_address'
        }
    });
    if($("#toolbar2").size() == 0){
        $('#addressname').combotree('panel').after(comboBut("add_loginAddr('"+$LANG.ADDR_ATTR+"','addressname')","toolbar2"));
    }
}

function area_combobox_reflesh(id,grtagValue) {
    grtag=grtagValue;
    //目的端口包括：类型为UDP、TCP且只有一个端口的服务对象
    $('#adduserDiv').find('#'+id).combobox({
        url: '?c=Resource/Region&a=comboBox',
        valueField:'name',
        textField:'name',
        panelHeight:'auto',
        panelMaxHeight:198,
        required:false,
        editable:true,
        multiple:false,
        queryParams:{
            mod: 'define area'
        }
    });
    if($("#toolbar1").size() == 0){
        $('#'+id).combobox('panel').after(comboBut("add_region('"+$LANG.ADD_REGION+"','"+id+"')","toolbar1"));
    }

}

function changType(newval, oldval) {
    if(newval=='dhcp') {
        $('#adduserDiv').find('#addr_tr').hide();
    } else {
        $('#adduserDiv').find('#addr_tr').show();
        pfAddrReflesh();
    }
}

function delPfRow() {
    var rows = $('#tt').datagrid('getSelections');
    ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
        if (r) {
            var ids = [];
            var pagenum = return_pagenum('tt', rows);
            for (var i = 0; i < rows.length; i++) {
                ids[i] = rows[i].id;
            }
            ids = ids.join('#');
            $.ajax({
                url: "?s=Home/Policy/Pf&mod=pf",
                type: 'delete',
                async: false,
                data: {
                    delItems: ids,
                    delKey: 'id'
                },
                success: function(data) {
                    if (data != '0') {
                        ngtosPopMessager("error", data);
                    } else {
                        $('#tt').datagrid('options').pageNumber = pagenum;
                        $('#tt').datagrid('getPager').pagination({pageNumber: pagenum});
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function delPfAll() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL, function(r) {
        if (r) {
            $.ajax({
                url: "?s=Home/Policy/Pf&&mod=pf&all=1",
                type: 'delete',
                success: function(data) {
                    if (data != '0') {
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('load');
                }
            });
        }
    });
}

function setToolBar() {
    var sel_row = $('#tt').datagrid('getChecked');
    if (sel_row.length < 1) {
        $('#delExcepBtn').linkbutton('disable');
        $('#icon_edit').linkbutton('disable');
    } else if (sel_row.length == 1) {
        $('#delExcepBtn').linkbutton('enable');
        $('#icon_edit').linkbutton('enable');
    } else if (sel_row.length > 1) {
        $('#delExcepBtn').linkbutton('enable');
        $('#icon_edit').linkbutton('disable');
    }
}

// pf本机服务使用提交函数
function submit(id) {
    var isValid = $("#pf_form").form('validate');
    if(!isValid) {
        return false;
    }
    var name=$('#adduserDiv').find('#name').combobox('getValue');

    if(name=='dhcp') {
        if($('#adduserDiv').find( "#area").combobox('getText')=='') {
            ngtosPopMessager("error", $LANG.REGION_NOT_NULL);
            return;
        }
        var address='none';
    } else {
        if($('#adduserDiv').find( "#area").combobox('getText')==''&&$('#adduserDiv').find( "#addressname").combotree('getText')=='') {
            ngtosPopMessager("error", $LANG.REGION_ADDR_NOT_ALLNULL);
            return;
        }
        var address=($('#adduserDiv').find('#addressname').combotree('getText')!='')?('\''+$.trim($('#adduserDiv').find('#addressname').combotree('getText'))+'\''):((id && id!='' && id!='undefined')?'none':'');
    }
    if(id != '') {
        var method = 'put';
    } else {
        var method = 'post';
    }

    $.ajax({
        url: "?s=Home/Policy/Pf",
        type: method,
        dataType:'text',
        data:{
            id:(id && id!='' && id!='undefined')?id:'',
            name:name,
            area:($('#adduserDiv').find('#area').combobox('getText')!='')?('\''+$.trim($('#adduserDiv').find('#area').combobox('getText'))+'\''):((id && id!='' && id!='undefined')?'none':''),
            addressname:address
        },
        success: function(data){
            if(data=='0'){
                $("#adduserDiv").window('close');
                $('#tt').datagrid('reload');
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}