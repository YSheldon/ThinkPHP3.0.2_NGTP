function setRegionToolBar(){
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1)  {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    } else if(sel_row.length==1) {
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }
    } else if(sel_row.length>1) {
        var enable = true;
        if(isShared()) {
            for(var i = 0;i<sel_row.length;i++){
                if( sel_row[i].shared == 'on'){
                    enable = false;
                }
            }
        }
        if(enable){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('enable');
        }else{
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }
    }
}
function editRegionRow(msg){
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1)
        edit_group_name(rowData[0].name,rowData[0].attribute,rowData[0].shared,$.trim(rowData[0].comment),msg);
    else
        return;
}

//认证用户刷新下拉框
function anthUserReflesh(id) {
    $('#'+id).combobox({
        url: '?c=Resource/Region&a=comboBox',
        queryParams:{
            mod: 'define area'
        }
    });
}
function sel_attr(tag,grtag) {
    var isValid = $("#region_form").form('validate');
    if(!isValid) {
        return false;
    }

    var service_item=new Array();
    $("#d_area_item_cid option").each(function(){
        service_item.push($(this).val());
    });
    if(service_item.length>128) {
        ngtosPopMessager("error", $LANG.MAX_SELECT128);
        return;
    }
    if(service_item.length == 0) {
        ngtosPopMessager("error", $LANG.SELECT_INTERFACE);
        return;
    }
    var sta = $('input[name="region_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    var memb ="'" + service_item.join(' ') + "'";
    var regionName = $('#reg_name').textbox('getValue');
    var desc = $('#reg_comm').textbox('getValue');
    if(desc == "")
        var commValue ="'" + " " + "'";
    else
        var commValue = "'" + desc + "'";

    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    $.ajax({
        url: "?s=Home/Resource/Region",
        type: method,
        datatype:'text',
        data:{
            name:regionName,
            comment:commValue,
            shared:sha_tag,
            interface:memb,
            tag:tag
        },
        success: function(data){
            if(data=='0'){
                $("#area_div").window("close");
                if(grtag == 3){
                    anthUserReflesh('more_login_area');
                }else if(grtag == 5){
                    anthUserReflesh('import_login_area');
                    //访问控制与地址转换页面引用
                }else if(grtag == 6 || grtag==9){
                    var opp = new Option(regionName,regionName)
                    opp.title = regionName;
                    $('#sel1')[0].add(opp);
                    if(grtag==9)
                        trans_src_combo_reflesh(1);
                }else if(grtag == 11) {
                    area_combobox_reflesh('add_uparea',11);
                    area_combobox_reflesh('add_downarea',11);
                }else if(grtag == 12){
                    area_combobox_reflesh('area',12);
                }else{
                    $('#tt').datagrid('reload');
                }
            }else{
                ngtosPopMessager("error", data);
            }
        }
    })
}

function create_area_div(){
    if ($('#area_div').length <= 0) {
        $(document.body).append("<div id='area_div' class='ngtos_window_500'></div>");
    }
}

function edit_group_name(reg_name,reg_attr,reg_sha,reg_com,msg){
    region_tag = 2;
    param[0] = reg_name;
    param[1] = reg_com;
    param[2] = reg_sha;
    param[3] = reg_attr;

    create_area_div();
    open_window('area_div','Resource/Region&w=resource_region_window','',msg);
}

function add_region(msg,id){
  
    if(id != ''){
        $("#"+id).combo('hidePanel');
    }
    region_tag = 1;
    create_area_div();
    open_window('area_div','Resource/Region&w=resource_region_window','',msg);
}

/*******菜单栏删除*****/
function addressDelete(){
    var rows = $('#tt').datagrid('getSelections');
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
            if(r){
                var ids1 = [];
                var rows = $('#tt').datagrid('getSelections');
                for(var i=0; i<rows.length; i++){
                    ids1.push(rows[i].name);
                }
                var pagenum = return_pagenum('tt',rows);
                var name = ids1.join('#');
                $.ajax({
                    url: "?s=Home/Resource/Region&mod=area",
                    type: 'delete',
                    datatype:'text',
                    data:{
                        delItems:name
                    },
                    success: function(data){
                        if(data=='0'){
                            $('#tt').datagrid('options').pageNumber = pagenum;
                            $('#tt').datagrid('getPager').pagination({pageNumber: pagenum});
                        }else{
                            ngtosPopMessager("error", data);
                        }
                        $('#tt').datagrid('reload');
                    }
                });
            }
        });
}
/*菜单栏清空功能*/
function clearRegionItem(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Region&mod=area&all=1",
                type: 'delete',
                success: function(data){
                    if(data!='0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

function get_region_options(){
    var src_from = $("#d_area_item_cid").get(0);
    parent.moveSelNum = src_from.options.length;
    $('#sel_area_num').html($LANG.SELECTED+ parent.moveSelNum +$LANG.SEVERAL);
}

function refresh_region(){
    $.ajax({
        url: "?s=Home/Resource/Region&fun=dataShow",
        data:{
            mod:'interfaces',
            key:'dev'
        },
        type: 'get',
        dataType:'json',
        async:false,
        success: function(data){
            if(data.rows.length > 0){
                var options="";
                $(data.rows).each(function(key,value){
                    options += "<option value='" + value.dev + "'>" + value.dev +"</option>";
                })
                $('#area_item_cid').html(options);
            }
            get_mulselect_options('area_item_cid','d_area_item_cid');
            select_add_title("area_item_cid");
            get_region_options();
        }
    });
}

function modify_refresh_region(rattr){
    rattr = rattr.replace(/\s+/g,"");
    var server_arr = $.trim(rattr).split(",");
    $.ajax({
        url: "?s=Home/Resource/Region&fun=dataShow",
        data:{
            mod:'interfaces',
            key:'dev'
        },
        type: 'get',
        dataType:'json',
        async:false,
        success: function(data){
            $(data.rows).each(function(key,value){
                if( $.inArray(value.dev, server_arr) > -1 ){    //通过inArray是否在数组中进行判断
                    $('#d_area_item_cid')[0].add(new Option(value.dev,value.dev));
                }else{
                    $('#area_item_cid')[0].add(new Option(value.dev,value.dev));
                }
            })
            get_mulselect_options('area_item_cid','d_area_item_cid');
            select_add_title("area_item_cid");
            select_add_title("d_area_item_cid");
            get_region_options();
        }
    });
}