function map66ShowDst(add_input){
    grtag=9;
    //gaddr_tag = 9;
    addInput = add_input;
    open_window('nat_obj_public','Policy/Map66','windowShow&w=policy_natmap66_obj_window',$LANG.SELECT_OBJECT);
}

var natMap66Par = [];
//var isClone = '';
//添加
function addNatMap66(){
    natMap66Par[0] = '';
    //isClone = '';
    open_window('nat_admin1','Policy/Map66','windowShow&w=policy_map66_window',$LANG.ADD);
}

function editMap66row(id1,row_orig_src,row_trans_src,row_enable){
    natMap66Par[0] = id1;
    natMap66Par[1] = row_orig_src;
    natMap66Par[2] = row_trans_src;
    natMap66Par[3] = row_enable;
    //datagirdDbclick('tt',index);
    open_window('nat_admin1','Policy/Map66','windowShow&w=policy_map66_window',$LANG.EDIT);
}

function editMap66Nat() {
    var row=$('#tt').datagrid('getSelected');
    editMap66row(row.nat_id,row.orig_src,row.trans_src,row.enable);
}

function addMap66Addr(){
    open_window('addr_div','Policy/Map66','windowShow&w=policy_map66_addr_window',$LANG.ADD);
}

function transSrcMap66Reflesh() {
    $('#add_trans_src').combobox({
        url: '?c=Policy/Map66&a=tranSrcJsondata',
        required:true,
        valueField:'name',
        textField:'name',
        editable:true,
        panelHeight:'auto',
        panelMaxHeight:198,
        multiple:false
    })
}

function addSubnet(tag) {
    var isValid = $("#map66_addr_form").form('validate');
    if(!isValid) {
        return false;
    }
    var sta = $('input[name="addr_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";
    var addrName = $('#addr_name').textbox('getValue');

    var subip = $('#ipaddr_sub').textbox('getValue');
    var submask = $('#ipaddr_mask').textbox('getValue');

    $.ajax({
        url: "?c=Resource/Address&a=subnet_add",
        type: 'POST',
        datatype:'text',
        data:{
            host_name:addrName,
            addr_tag:tag,
            sub_ip:subip,
            sub_mask:submask,
            addr_sha:sha_tag

        },
        success: function(data, textStatus){
            if(data=='0'){
                var opp = new Option(addrName,addrName);
                opp.title = addrName;
                $('#sel1')[0].add(opp);
                closeWindow('addr_div');
            } else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function submitMap66(natId){
    var isValid = $("#map66_form").form('validate');
    if(!isValid) {
        return false;
    }
    if($('input[name="nat_switch"]:checked').val()==1)
        var enable='yes';
    else
        var enable='no';
    $.ajax({
        url: "?c=Policy/Map66&a=natAddSave",
        type: 'POST',
        dataType:'text',
        data:{
            nat_id: (natId != '') ? natId : '',
            origSrc: $("#add_orig_src").val(),
            transSrc: $("#add_trans_src").combobox('getValue'),
            enable: enable
        },
        success: function(data){
            if(data == '0'){
                $("#nat_admin1").window('close');
                $('#tt').datagrid('reload');
            } else {
                ngtosPopMessager("error", data);
            }
        }
    });
}

function setToolBar() {
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_move').linkbutton('disable');
        $('#icon_delete').linkbutton('disable');
        $('#icon_enable').linkbutton('disable');
        $('#icon_disable').linkbutton('disable');
    } else if(sel_row.length==1) {
        $('#icon_edit').linkbutton('enable');
        $('#icon_move').linkbutton('enable');
        $('#icon_delete').linkbutton('enable');
        $('#icon_enable').linkbutton('enable');
        $('#icon_disable').linkbutton('enable');
    } else if(sel_row.length>1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_move').linkbutton('disable');
        $('#icon_delete').linkbutton('enable');
        $('#icon_enable').linkbutton('enable');
        $('#icon_disable').linkbutton('enable');
    }
}

function enableRowMap66(status) {
    var row=$('#tt').treegrid('getSelections');
    if(status == 'yes') {
        var msg = $LANG.SURE_ENABLE;
    } else {
        var msg = $LANG.SURE_DISABLE;
    }
    ngtosPopMessager("confirm", msg, function(r) {
        if (r) {
            var map66Id = [];
            for(var i=0;i<row.length;i++) {
                map66Id[i] = row[i].nat_id;
            }
            $.ajax({
                url: "?c=Policy/Map66&a=callFun",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    fun:'enableEdit',
                    mod:'nat map66policy',
                    parKey:'nat_id',
                    parVal:map66Id,
                    enable:status
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                }
            });
            $('#tt').datagrid('reload');
        }
    });
}

var natMoveMap66Val = '';
var natMoveMap66Data = {};
function moveNatMap66() {
    if($('#tt').datagrid('getPager').data('pagination').options.total<2) {
        ngtosPopMessager("error", $LANG.ONLY_ONE_CANNOT);
        return;
    }
    var row=$('#tt').datagrid('getSelected');
    $.ajax({
        url: "?c=Policy/Map66&a=callFun",
        type: 'POST',
        dataType:'json',
        async:false,
        data:{
            fun:'dataShow',
            key:'nat_id',
            mod:'nat map66policy_webui'
        },
        success: function(data){
            if(data) {
                if(data.rows.length==1) {
                    ngtosPopMessager("error", $LANG.ONLY_ONE_CANNOT);
                    return;
                } else {
                    natMoveMap66Val = row.nat_id;
                    natMoveMap66Data = data.rows;
                    open_window('nat_move','Policy/Map66','windowShow&w=policy_map66_move',$LANG.MOVE);
                }
            }
        }
    });

}
function delMap66Row(){
    var rows=$('#tt').datagrid('getSelections');
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var ids = [];
            var pageNum = return_pagenum('tt',rows);
            for(var i=0; i<rows.length; i++){
                ids[i] = rows[i].nat_id;
            }
            $.ajax({
                url: "?c=Policy/Map66&a=del",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    mod:'nat map66policy',
                    act:'del',
                    delItems:ids,
                    delKey:'nat_id'
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    } else {
                        $('#tt').datagrid('options').pageNumber = pageNum;
                        $('#tt').datagrid('getPager').pagination({pageNumber: pageNum});
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function clearMap66Row() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/Map66&a=clean&mod="+encodeURI('nat map66policy'),
                type: 'GET',
                dataType:'text',
                async:false,
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $("#tt").datagrid("load");
                }
            });
        }
    });
}