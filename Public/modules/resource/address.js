var ip_init_num = 0;
var ip_num = 0;
function setAddrToolBar() {
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1) {
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    } else if(sel_row.length==1) {
        //判断它为虚系统登录并且是共享的信息，shared 共享为on，非共享为--
        if(isShared() && sel_row[0].shared == 'on') {
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        } else {
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }

    } else if(sel_row.length>1) {
        var enable = true;
        if(isShared()) {
            for(var i = 0;i<sel_row.length;i++){
                if(sel_row[i].shared == 'on'){
                    enable = false;
                }
            }
        }
        if(enable){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('enable');
        } else {
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }
    }
}

function editAddrRow(msg){
    var rowData=$('#tt').datagrid('getSelections');
    if(rowData.length==1)
        edit_host_name(rowData[0].name,rowData[0].type_value,rowData[0].ip,rowData[0].ipaddr,rowData[0].mask,rowData[0].macaddr,rowData[0].shared,msg);
    else
        return;
}
function setAddrGroToolBar(){
    var sel_row=$('#tt').treegrid('getSelections');
    if(sel_row.length>1){
        var enable = true;
        if(isShared()) {
            for(var i = 0;i<sel_row.length;i++){
                if(sel_row[i].shared == 'on'){
                    enable = false;
                }
            }
        }
        if(enable){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('enable');
        } else{
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }

        for(var i=0;i<sel_row.length;i++) {
            if(typeof(sel_row[i].member)=='undefined')
                $('#icon_del').linkbutton('disable');
        }
    } else if(sel_row.length==1){
        //如果用户是虚系统并且当前的选择是根系统共享的
        if(isShared() && sel_row[0].shared == "on"){
            $('#icon_edit').linkbutton('disable');
            $('#icon_del').linkbutton('disable');
        }else{
            $('#icon_edit').linkbutton('enable');
            $('#icon_del').linkbutton('enable');
        }

        if(typeof(sel_row[0].member)=='undefined')
            $('#icon_del').linkbutton('disable');
    }else if(sel_row.length<1){
        $('#icon_edit').linkbutton('disable');
        $('#icon_del').linkbutton('disable');
    }
}
function editAddrGroRow(msg){
    var rowData=$('#tt').treegrid('getSelections');
    if(rowData.length==1){
        if(typeof(rowData[0].member)=='undefined')
            edit_host_name(rowData[0].name,rowData[0].type_value,rowData[0].ip,rowData[0].ipaddr,rowData[0].mask,rowData[0].macaddr,rowData[0].shared,msg);
        else
            edit_group_name(rowData[0].name,rowData[0].member,rowData[0].shared,msg);
    }
    else
        return;
}
function addr_group_reload(){
    $('#tt').treegrid('options').url = '?s=Home/Resource/Address&grid=tree';
    $('#tt').treegrid('reload');
    $("#tt").treegrid("unselectAll");
}

function change_type(num){
    if(num == 1) {
        $('#addr1').css("display","");
        $('#addr2').css("display","none");
        $('#addr3').css("display","none");
        $('#addr4').css("display","none");
        $("#ipaddr_mac").textbox({novalidate:true});
        $("#ipaddr_sub").textbox({novalidate:true});
        $("#ipaddr_mask").textbox({novalidate:true});
        $("#ipaddr_st").textbox({novalidate:true});
        $("#ipaddr_end").textbox({novalidate:true});
        var hostInput = $("#addr1").find(":text");
        $.each(hostInput,function() {
            $("#"+$(this).attr('id')).textbox({novalidate:false});
        });
    } else if(num == 2) {
        $('#addr1').css("display","none");
        $('#addr2').css("display","");
        $('#addr3').css("display","none");
        $('#addr4').css("display","none");
        $("#ipaddr_mac").textbox({novalidate:true});
        $("#ipaddr_sub").textbox({novalidate:true});
        $("#ipaddr_mask").textbox({novalidate:true});
        $("#ipaddr_st").textbox({novalidate:false});
        $("#ipaddr_end").textbox({novalidate:false});
        var hostInput = $("#addr1").find(":text");
        $.each(hostInput,function() {
            $("#"+$(this).attr('id')).textbox({novalidate:true});
        });
    } else if(num == 3) {
        $('#addr1').css("display","none");
        $('#addr2').css("display","none");
        $('#addr3').css("display","");
        $('#addr4').css("display","none");
        $("#ipaddr_mac").textbox({novalidate:true});
        $("#ipaddr_sub").textbox({novalidate:false});
        $("#ipaddr_mask").textbox({novalidate:false});
        $("#ipaddr_st").textbox({novalidate:true});
        $("#ipaddr_end").textbox({novalidate:true});
        var hostInput = $("#addr1").find(":text");
        $.each(hostInput,function() {
            $("#"+$(this).attr('id')).textbox({novalidate:true});
        });
    } else if(num == 4) {
        $('#addr1').css("display","none");
        $('#addr2').css("display","none");
        $('#addr3').css("display","none");
        $('#addr4').css("display","");
        $("#ipaddr_mac").textbox({novalidate:false});
        $("#ipaddr_sub").textbox({novalidate:true});
        $("#ipaddr_mask").textbox({novalidate:true});
        $("#ipaddr_st").textbox({novalidate:true});
        $("#ipaddr_end").textbox({novalidate:true});
        var hostInput = $("#addr1").find(":text");
        $.each(hostInput,function() {
            $("#"+$(this).attr('id')).textbox({novalidate:true});
        });
    }
}

function add_host() {
    ip_num++;
    var tbl = $('#host_addr')[0];
    var lastRow = tbl.rows.length;
    var iteration = lastRow+1;
    var row = tbl.insertRow(lastRow);

    var cellCenter = row.insertCell(0);
    var tb1="<img src='"+NG_PATH+"Public/images/icon/mini_clear.gif' width='10' height='10' style='cursor:pointer;' onClick='deleteHost(this)'/>&nbsp;";
    var tb2="<input type='text' class='createInput' id='host_addr"+ ip_num +"' name='host_addr"+ ip_num +"'>&nbsp;";
    var tb3="<img src='"+NG_PATH+"Public/images/icon/mini_add.gif' width='10' height='10' style='cursor:pointer;' onClick='add_host()'/>";
    cellCenter.innerHTML=tb1 + tb2 + tb3;
    $("#host_addr"+ip_num).textbox({
        width : 224,
        required:true,
        novalidate:false,
        validType:'ipFourOripSix'
    });
    if(ip_num < 5) {
        var height = $('#host_div').css("height");
        height = parseInt(height) + 33;
        $('#host_div').css("height", height);
    }

}

function deleteHost(r) {
    ip_num--;
    var i=r.parentNode.parentNode.rowIndex;
    var inputId = $(r).next('input').attr('id');
    $("#"+inputId).textbox({novalidate:true});
    $("#"+inputId).textbox('destroy');
    $('#host_addr')[0].deleteRow(i);
    if(ip_num < 4) {
        var height = $('#host_div').css("height");
        height = parseInt(height) - 33;
        $('#host_div').css("height", height);
    }
}

function search_data() {
    var isValid = $('#searchName').textbox('isValid');
    if(!isValid) {
        return false;
    }
    var aname = $('#searchName').textbox('getValue');
    if(aname == '') {
        ngtosPopMessager("error", $LANG.INPUT_SEARCH);
        return;
    }
    $('#tt').datagrid('options').pageNumber = 1;
    $('#tt').datagrid('getPager').pagination({pageNumber: 1});
    $('#tt').datagrid({
        url: '?s=Home/Resource/Address&search='+encodeURI(aname)
    });
}

function clearSearch() {
    $('#searchName').textbox('clear');
}

function freshItem(newValue) {
    if(newValue == '') {
        $("#tt").datagrid({
            url:'?s=Home/Resource/Address'
        });
    }
}
function delmac() {
    $('.macdom').css('display','none');
}
function addr_map_64(msg){
    var b = arguments[1] ? arguments[1] : '';
    ip_num = 0;
    addr_tag = 1;
    if(b == 'proxy_ip'){
        $("#"+b).combo('hidePanel');
        grtag = 'proxy_ip';
    }

    if(b == 'server_ip'){
        $("#"+b).combo('hidePanel');
        grtag = 'server_ip';
    }

    if ($('#addr_div').length <= 0) {
        $(document.body).append("<div id='addr_div' class='ngtos_window_550'></div>");
    }
    open_window('addr_div','Resource/Address&w=resource_map64_window','',msg,b=='notmac'?delmac:false);
}
function add_addr(msg){
    var b = arguments[1] ? arguments[1] : '';
    ip_num = 0;
    addr_tag = 1;
    if(b == 'proxy_ip'){
        $("#"+b).combo('hidePanel');
        grtag = 'proxy_ip';
    }

    if(b == 'server_ip'){
        $("#"+b).combo('hidePanel');
        grtag = 'server_ip';
    }

    if ($('#addr_div').length <= 0) {
        $(document.body).append("<div id='addr_div' class='ngtos_window_550'></div>");
    }
    open_window('addr_div','Resource/Address&w=resource_address_window','',msg,b=='notmac'?delmac:false);
}

function refresh_login_addr(addrId) {
    $('#'+addrId).combotree({
        url: '?c=Resource/Address&a=callFun',
        queryParams:{
            fun: 'comboTree',
            parentNode: 'Address,AddressGroup',
            Address: 'define host,define range,define subnet',
            AddressGroup: 'define group_address'
        }
    });
}

//proxy 刷新
function refresh_combobox(id1 ,id2) {
    $('#'+id1).combobox({
        url: '?c=Policy/Proxy&a=comboBox',
        queryParams:{
            mod:'define host,define range,define subnet,define mac'
        }
    });
    $('#'+id2).combobox({
        url: '?c=Policy/Proxy&a=comboBox',
        queryParams:{
            mod:'define host,define range,define subnet,define mac'
        }
    });
}

//tag：1,添加地址；2，编辑地址；grtag：1，地址页面；2，地址组页面；3,认证用户添加地址；4,ddos页面添加地址；5,认证导入用户添加地址；6,访问控制页面多选;
//7,认证服务器：本地认证属性;8,认证服务器：三方认证属性，9,地址转换页面多选；10，地址转换页面单选；
// gaddr_tag：1，添加地址组；2，编辑地址组
function add_host_address(formId,tag, grtag, gaddr_tag) {
    var isValid = $('#'+formId).form('validate');
    if(!isValid) {
        return false;
    }
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }

    var sta = $('input[name="addr_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";
    var addrName = $('#addr_name').textbox('getValue');

    var addr_type = $('input[name="add_type"]:checked').val();
    if(addr_type == 1) {
        var ip = $('#ipaddr_host').textbox('getValue');
        $("#host_addr").find(".createInput").each(function() {
            ip = ip + " " +$(this).textbox('getValue');
        });
        ip = "'" + ip + "'";

        $.ajax({
            url: "?s=Home/Resource/Address&type=host",
            type: method,
            datatype:'text',
            data:{
                name:addrName,
                tag:tag,
                ipaddr:ip,
                shared:sha_tag
            },
            success: function(data){
                if(data=='0'){

                    if(grtag == 3) {
                        refresh_login_addr('more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 4) {
                        //gethostName();
                        closeWindow('addr_div');
                    } else if(grtag == 5) {
                        refresh_login_addr('import_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 6) {
                        var opp = new Option(addrName,addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                    } else if(grtag == 7) {
                        refresh_login_addr('local_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 8) {
                        refresh_login_addr('whole_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 9) {
                        var opp = new Option(addrName+'['+$LANG.HOST+']',addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                        trans_src_combo_reflesh(1);
                        trans_dst_combo_reflesh(1);
                    } else if(grtag == 10) {
						closeWindow('add_login_addr');
                        trans_src_combo_reflesh(1);
                        trans_dst_combo_reflesh(1);
                    } else if(grtag == 12) {
                        pfAddrReflesh();
                        closeWindow('add_login_addr');
                    } else if(grtag == 'proxy_ip' || grtag == 'server_ip') {
                        refresh_combobox('proxy_ip','server_ip');
                        closeWindow('addr_div');
                    } else
                        addr_page_show(tag, grtag, gaddr_tag);
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });

    } else if(addr_type == 2) {
        var ip1 = $('#ipaddr_st').textbox('getValue');
        var ip2 = $('#ipaddr_end').textbox('getValue');

        if(checkIpRangeVal(ip1, ip2) == false)
            return false;

        $.ajax({
            url: "?s=Home/Resource/Address&type=range",
            type: method,
            datatype:'text',
            data:{
                name:addrName,
                tag:tag,
                ip1:ip1,
                ip2:ip2,
                shared:sha_tag
            },
            success: function(data){
                if(data=='0'){
                    if(grtag == 3) {
                        refresh_login_addr('more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 4) {
                        //gethostName();
                        closeWindow('addr_div');
                    } else if(grtag == 5) {
                        refresh_login_addr('import_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 6) {
                        var opp = new Option(addrName,addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                    } else if(grtag == 7) {
                        refresh_login_addr('local_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 8) {
                        refresh_login_addr('whole_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 9) {
                        var opp = new Option(addrName+'['+$LANG.RANGE+']',addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                        trans_src_combo_reflesh(1);
                    } else if(grtag == 10) {
                        closeWindow('add_login_addr');
                        trans_src_combo_reflesh(1);
                    } else if(grtag == 12) {
                        pfAddrReflesh();
                        closeWindow('add_login_addr');
                    } else if(grtag == 'proxy_ip' || grtag == 'server_ip') {
                        refresh_combobox('proxy_ip','server_ip');
                        closeWindow('addr_div');
                    } else
                        addr_page_show(tag, grtag, gaddr_tag);
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    } else if(addr_type == 3) {
        var subip = $('#ipaddr_sub').textbox('getValue');
        var submask = $('#ipaddr_mask').textbox('getValue');

        $.ajax({
            url: "?s=Home/Resource/Address&type=subnet",
            type: method,
            datatype:'text',
            data:{
                name:addrName,
                shared:sha_tag,
                tag:tag,
                ipaddr:subip,
                mask:submask
            },
            success: function(data){
                 if(data=='0'){
                    if(grtag == 3) {
                        refresh_login_addr('more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 4) {
                        //gethostName();
                        closeWindow('addr_div');
                    } else if(grtag == 5) {
                        refresh_login_addr('import_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 6) {
                        var opp = new Option(addrName,addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                    } else if(grtag == 7) {
                        refresh_login_addr('local_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 8) {
                        refresh_login_addr('whole_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 9) {
                        var opp = new Option(addrName+'['+$LANG.SUBNET+']',addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                        trans_src_combo_reflesh(1);
                    } else if(grtag == 10) {
                        closeWindow('add_login_addr');
                        trans_src_combo_reflesh(1);
                    } else if(grtag == 12) {
                        pfAddrReflesh();
                        closeWindow('add_login_addr');
                    } else if(grtag == 'proxy_ip' || grtag == 'server_ip') {
                        refresh_combobox('proxy_ip','server_ip');
                        closeWindow('addr_div');
                    } else
                        addr_page_show(tag, grtag, gaddr_tag);
                } else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    } else if(addr_type == 4) {
        $.ajax({
            url: "?s=Home/Resource/Address&type=mac",
            type: method,
            datatype:'text',
            data:{
                name:addrName,
                tag:tag,
                macaddr:$('#ipaddr_mac').textbox('getValue'),
                shared:sha_tag
            },
            success: function(data){
                if(data=='0'){
                    if(grtag == 3) {
                        refresh_login_addr('more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 4) {
                        //gethostName();
                        closeWindow('addr_div');
                    } else if(grtag == 5) {
                        refresh_login_addr('import_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 6) {
                        var opp = new Option(addrName,addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                    } else if(grtag == 7) {
                        refresh_login_addr('local_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 8) {
                        refresh_login_addr('whole_more_login_addr');
                        closeWindow('add_login_addr');
                    } else if(grtag == 9) {
                        var opp = new Option(addrName+'['+$LANG.MAC_ADDR+']',addrName);
                        opp.title = addrName;
                        $('#sel1')[0].add(opp);
                        closeWindow('addr_div');
                        trans_src_combo_reflesh(1);
                    } else if(grtag == 10) {
                        closeWindow('add_login_addr');
                        trans_src_combo_reflesh(1);
                    } else if(grtag == 12) {
                        pfAddrReflesh();
                        closeWindow('add_login_addr');
                    } else if(grtag == 'proxy_ip' || grtag == 'server_ip') {
                        refresh_combobox('proxy_ip','server_ip');
                        closeWindow('addr_div');
                    } else
                        addr_page_show(tag, grtag, gaddr_tag);
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
}

function addr_page_show(tag, grtag){
    $("#addr_div").window("close");
    if(grtag == 1)
        $('#tt').datagrid('reload');
    else{
        if(tag == 2 ) {
            addr_group_reload();
        }else{
            var atype = $('input[name="add_type"]:checked').val();
            add_refresh_addr($('#addr_name').val(),atype);
        }
    }
}

function add_refresh_addr(name,type){
    var options = "";
    if(type == 1)
        name += ' ['+$LANG.HOST+']';
    else if(type == 2)
        name += ' ['+$LANG.RANGE+']';
    else if(type == 3)
        name += ' ['+$LANG.SUBNET+']';
    parent.sourOptions.push(name);
    for(var i=0;i<parent.sourOptions.length;i++)
        options += "<option value='" + parent.sourOptions[i].split(' ')[0] + "'>" + parent.sourOptions[i] +"</option>";

    $('#source_tag').val("");
    $('#addrgroup_item_cid').html(options);
    select_add_title("addrgroup_item_cid");
}

function edit_host_name(addr_name, addr_type, addr_ip, host_ip, sub_mask, mac_addr,sha_tag, msg){
    ip_num = 0;
    addr_tag = 2;

    if ($('#addr_div').length <= 0) {
        $(document.body).append("<div id='addr_div' class='ngtos_window_550'></div>");
    }
    open_window('addr_div','Resource/Address&w=resource_address_window','',msg);

    param[0] = addr_name;
    param[1] = addr_type;
    param[2] = addr_ip;
    param[3] = host_ip;
    param[4] = sub_mask;
    param[5] = mac_addr;
    param[6] = sha_tag;
}

/*******菜单栏删除*****/
function deleteAddressItem(){
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var ids1 = [];
            //var ids2 = [];
            var ids3 = [];
            var rows = $('#tt').datagrid('getSelections');

			for(var i=0; i<rows.length; i++){
				ids1.push(rows[i].name);
				//ids2.push(rows[i].id);
				ids3.push(rows[i].type_value);
			}
            var name = ids1.join('#');
            //var idval = ids2.join('#');
            var typeval = ids3.join('#');
            var options = $('#tt').datagrid('getPager').data("pagination").options;
            var pnum = options.pageNumber;
            var total = options.total;
            var psize = options.pageSize;
            var curSize = (total - (pnum-1)*psize) - (rows.length - 1);
            $.ajax({
                url: "?s=Home/Resource/Address",
                type: 'delete',
                datatype:'text',
                data:{
                    name:name,
                    //id:idval,
                    type:typeval
                },
                success: function(data){
                    if(data=='0'){
                        if(curSize == 1){
                            $('#tt').datagrid('options').pageNumber = pnum -1;
                            $('#tt').datagrid('getPager').pagination({pageNumber: pnum -1});
                        }
                    }else{
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}
//清空功能
function clearAddressItem(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_CITE_NOT_CLEAR,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Address&mod=addrall&all=1",
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

function get_addr_options(){
    var src_from = $("#d_addrgroup_item_cid").get(0);
    parent.moveSelNum = src_from.options.length;
    $('#sel_addr_num').html($LANG.SELECTED+ parent.moveSelNum +$LANG.SEVERAL);
}

function refresh_addr(){
    $.ajax({
        url:'?s=Home/Resource/Address&fun=dataShow&mod=addr',
        type:'get',
        dataType:'json',
        async:false,
        success:function(data){
            var options1 = "";
                $(data.rows).each(function(key,value){

                    if(value.type_value == "1"){
                        options1 += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.HOST+"]</option>";
                        var s = value.name + " ["+$LANG.HOST+"]";
                    }
                    else if(value.type_value == "2"){
                        options1 += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.SUBNET+"]</option>";
                        var s = value.name + " ["+$LANG.SUBNET+"]";
                    }
                    else if(value.type_value == "3"){
                        options1 += "<option value='" + value.name + "'>" + value.name +" ["+$LANG.RANGE+"]</option>";
                        var s = value.name + " ["+$LANG.RANGE+"]";
                    }
                })
                $('#addrgroup_item_cid').html(options1);
                get_mulselect_options('addrgroup_item_cid','d_addrgroup_item_cid');
                select_add_title("addrgroup_item_cid");
            get_addr_options();
        }
    });
}

function addr_type_value(type,val){
    if(type == "1"){
        val += " ["+$LANG.HOST+"]";
    }
    else if(type == "2"){
        val += " ["+$LANG.SUBNET+"]";
    }
    else if(type == "3"){
        val += " ["+$LANG.RANGE+"]";
    }
    return val;
}

function modify_refresh_addr(addr_memb){
    var server_arr = $.trim(addr_memb).split(",");
    $.ajax({
        url:'?s=Home/Resource/Address&fun=dataShow&mod=addr',
        type:'get',
        dataType:'json',
        async:false,
        success:function(data){
            var memVal;
            $(data.rows).each(function(key,value){
                if( $.inArray(value.name, server_arr) > -1 ){    //通过inArray是否在数组中进行判断
                    memVal = addr_type_value(value.type_value,value.name);
                    $('#d_addrgroup_item_cid')[0].add(new Option(memVal,value.name));
                }else{
                    memVal = addr_type_value(value.type_value,value.name);
                    $('#addrgroup_item_cid')[0].add(new Option(memVal,value.name));
                }

            })

            get_mulselect_options('addrgroup_item_cid','d_addrgroup_item_cid');
            select_add_title("addrgroup_item_cid");
            select_add_title("d_addrgroup_item_cid");
            get_addr_options();
        }
    });
}

function add_addrGroup(msg){
    gaddr_tag = 1;

    if ($('#addrGroup_div').length <= 0) {
        $(document.body).append("<div id='addrGroup_div' class='ngtos_window_500'></div>");
    }
    open_window('addrGroup_div','Resource/Address&w=resource_address_group_window','',msg);
}

function edit_group_name(addr_name,addr_member,addr_sha, msg){
    gaddr_tag = 2;
    param[0] = addr_name;
    param[1] = addr_sha;
    param[2] = addr_member;

    if ($('#addrGroup_div').length <= 0) {
        $(document.body).append("<div id='addrGroup_div' class='ngtos_window_500'></div>");
    }
    open_window('addrGroup_div','Resource/Address&w=resource_address_group_window','',msg);
}

function sel_addr_group(tag) {
    var isValid = $("#address_group_form").form('validate');
    if(isValid) {
        var service_item=new Array();
        var s;
        var val;
        $("#d_addrgroup_item_cid option").each(function(){
            service_item.push($(this).val());
        });

        if(service_item.length>128) {
            ngtosPopMessager("error", $LANG.MAX_SELECT128);
            return;
        }
        if(service_item == "")
            var mem = "";
        else
            var mem ="'" + service_item.join(' ') + "'";

        var groupName = $('#gro_name').textbox('getValue');
        var sta = $('input[name="ag_sha"]:checked').val();
        if(sta == 1)
            var sha_tag = "on";
        else
            var sha_tag = "off";

        if(tag == 1) {
            var method = 'post';
        } else {
            var method = 'put';
        }
        $.ajax({
            url: "?s=Home/Resource/Address&type=group",
            type: method,
            datatype:'text',
            data:{
                member:mem,
                tag:tag,
                name:groupName,
                shared:sha_tag
            },
            success: function(data){
                if(data=='0'){
                    if(typeof(grtag)!='undefined' && (grtag==6 || grtag==9)) {
                        if(grtag==9) {
                            var opp = new Option(groupName+'['+$LANG.GROUP+']',groupName);
                            trans_src_combo_reflesh(1);
                        } else
                            var opp = new Option(groupName,groupName);
                            opp.title = groupName;
                            $('#sel1')[0].add(opp);
                            $("#addrGroup_div").window("close");
                    } else {
                        $("#addrGroup_div").window("close");
                        addr_group_reload();
                    }
                } else{
                    ngtosPopMessager("error", data);
                }
            }
        });
    }

}

function before_expand_action(row){
    if(row.member != ''){
        //$('#tt').treegrid('options').url = '?c=Resource/Address&a=addr_jsondata&name=' + encodeURI(row.member) + '&id=' + row.id;
        $('#tt').treegrid('options').url = '?s=Home/Resource/Address&grid=tree&name=' + encodeURI(row.member);
    }
}
function expand_action(){
    $('#tt').treegrid('options').url = '?s=Home/Resource/Address&grid=tree';
}

function add_addrs(msg){
    ip_num = 0;
    addr_tag = 1;

    if ($('#addr_div').length <= 0) {
        $(document.body).append("<div id='addr_div' class='ngtos_window_550'></div>");
    }
    open_window('addr_div','Resource/Address&w=resource_address_window','',msg);
}

/*******地址组删除*****/
function delete_item_check(){
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var ids1 = [];
            var rows = $('#tt').treegrid('getSelections');
            for(var i=0; i<rows.length; i++){
                ids1.push(rows[i].name);
            }
            var pagenum = return_pagenum('tt',rows);
            var name = ids1.join('#');
            $.ajax({
                url: "?s=Home/Common&mod=addrgroup",
                type: 'delete',
                datatype:'text',
                data:{
                    delItems:name
                },
                success: function(data){
                    if(data=='0'){
                        $('#tt').treegrid('options').pageNumber = pagenum;
                        $('#tt').treegrid('getPager').pagination({pageNumber: pagenum});
                    }else{
                        ngtosPopMessager("error", data);
                    }
                        $('#tt').treegrid('reload');
                        $('#tt').treegrid('unselectAll');
                }
            });
        }
    });
}
//地址组清空功能
function clearGroupAddressItem(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?s=Home/Resource/Address&mod=addrgroup&all=1",
                type: 'delete',
                success: function(data){
                    if(data!='0'){
                        ngtosPopMessager("error", data);
                    }
                    addr_group_reload();
                }
            });
        }
    },true);
}

function add_loginAddr(msg,id){
    if(id != ''){
        $("#"+id).combo('hidePanel');
    }

    ip_num = 0;
    if ($('#add_login_addr').length <= 0) {
        $(document.body).append("<div id='add_login_addr' class='ngtos_window_550'></div>");
    }
    open_window('add_login_addr','Resource/Address&w=resource_addressGroup_window','',msg);

}

function changeAddrType(tag) {
    if(tag == 1) {
        $('#addrTr').css("display","");
        $('#addrGroupTr').css("display","none");
        $('#addgrTable').css("display","none");
        change_type(1);
        $("#type_1").prop("checked", true);
    } else {
        $('#addrTr').css("display","none");
        $('#addgrTable').css("display","");
        $('#addrGroupTr').css("display","");
        $("#ipaddr_mac").textbox({novalidate:true});
        $("#ipaddr_sub").textbox({novalidate:true});
        $("#ipaddr_mask").textbox({novalidate:true});
        $("#ipaddr_st").textbox({novalidate:true});
        $("#ipaddr_end").textbox({novalidate:true});
        var hostInput = $("#addr1").find(":text");
        $.each(hostInput,function() {
            $("#"+$(this).attr('id')).textbox({novalidate:true});
        });
    }
}

function add_login_addr_group(formId,tag,grtag) {
    var isValid = $('#'+formId).form('validate');
    if(!isValid) {
        return false;
    }

    var service_item=new Array();
    var s;
    var val;
    $("#d_addrgroup_item_cid option").each(function(){
        service_item.push($(this).val());
    });
    if(service_item.length>128) {
        ngtosPopMessager("error", $LANG.MAX_SELECT128);
        return;
    }
    if(service_item == "")
        var mem = "";
    else
        var mem ="'" + service_item.join(' ') + "'";

    var sta = $('input[name="addr_sha"]:checked').val();
    if(sta == 1)
        var sha_tag = "on";
    else
        var sha_tag = "off";

    var addrName = $("#addr_name").textbox('getValue');
    if(tag == 1) {
        var method = 'post';
    } else {
        var method = 'put';
    }
    $.ajax({
        url: "?s=Home/Resource/Address&type=group",
        type: method,
        datatype:'text',
        data:{
            member:mem,
            tag:tag,
            name:addrName,
            shared:sha_tag
        },
        success: function(data){
           if(data=='0'){
                if(grtag == 3)
                    refresh_login_addr('more_login_addr');
                else if(grtag == 5)
                    refresh_login_addr('import_login_addr');
                else if(grtag == 7)
                    refresh_login_addr('local_more_login_addr');
                else if(grtag == 8)
                    refresh_login_addr('whole_more_login_addr');
                else if(grtag == 12)
                    pfAddrReflesh();
                else if(grtag == 10) {
                    trans_src_combo_reflesh(1);
                } closeWindow('add_login_addr');
            } else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
