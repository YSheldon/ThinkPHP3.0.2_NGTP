var natMoveVal = '';
var natMoveData = {};
function moveNat(value) {
    if($('#tt').datagrid('getPager').data('pagination').options.total<2) {
        ngtosPopMessager("error", $LANG.ONLY_ONE_CANNOT);
        return;
    }
    $.ajax({
        url: "?c=Policy/Nat&a=callFun",
        type: 'POST',
        dataType:'json',
        async:false,
        data:{
            fun:'dataShow',
            key:'nat_id',
            mod:'nat policy_webui'
        },
        success: function(data){
            if(data) {
                if(data.rows.length==1) {
                    ngtosPopMessager("error", $LANG.ONLY_ONE_CANNOT);
                    return;
                } else {
                    natMoveVal = value;
                    natMoveData = data.rows;
                    open_window('nat_move','Policy/Nat','windowShow&w=policy_nat_move',$LANG.MOVE);
                }
            }
        }
    });

}

function delNatRow(){
    var rows=$('#tt').datagrid('getSelections');
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var ids = [];
            var pageNum = return_pagenum('tt',rows);
            for(var i=0; i<rows.length; i++){
                ids[i] = rows[i].nat_id;
            }
            $.ajax({
                url: "?c=Policy/Nat&a=del",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    mod:'nat policy',
                    act:'del',
                    delKey:'nat_id',
                    delItems:ids
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

function clearNat() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/Nat&a=clean&mod="+encodeURI('nat policy'),
                type: 'GET',
                dataType:'text',
                async:false,
                success: function(data){
                    $("#tt").datagrid("load");
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

function show_dst(add_input,mod,act,group_mod){
    grtag=9;
    //gaddr_tag = 9;
    addInput = add_input;
    modules = mod;
    action = act;
    groupMod = group_mod;

    open_window('object_public','Policy/Nat','windowShow&w=policy_nat_obj_window',$LANG.SELECT_OBJECT);
}
var natParam = [];
var isClone = '';
//添加
function addNat(){
    natParam[0] = '';
    isClone = '';
    open_window('nat_admin1','Policy/Nat','natWindow',$LANG.ADD);
}

function editSelectNat() {
    var row=$('#tt').datagrid('getSelected');
    editrow(0,row.nat_id,row.orig_src,row.orig_dst,row.orig_service,row.trans_src,row.trans_dst,
        row.trans_service,row.type,row.pat,row.enable,row.sticky,row.vr_id,row.srcarea,row.dstarea,
        row.orig_sport,row.vr_name,row.svlan,row.dvlan,row.users);
}

function insertRow() {
    var row=$('#tt').datagrid('getSelected');
    editrow(1,row.nat_id,row.orig_src,row.orig_dst,row.orig_service,row.trans_src,row.trans_dst,
        row.trans_service,row.type,row.pat,row.enable,row.sticky,row.vr_id,row.srcarea,row.dstarea,
        row.orig_sport,row.vr_name,row.svlan,row.dvlan);
}
//编辑
function editrow(isclone,id1,row_orig_src,row_orig_dst,row_orig_service,row_trans_src,row_trans_dst,
                 row_trans_service,row_type,row_pat,row_enable,row_sticky,row_vsid,row_srcarea,row_dstarea,
                 row_orig_sport,row_vrname,row_srcvlan,row_dstvlan,row_users){
    natParam[0] = id1;
    natParam[1] = row_orig_src;
    natParam[2] = row_orig_dst;
    natParam[3] = row_orig_service;
    natParam[4] = row_trans_src;
    natParam[5] = row_trans_dst;
    natParam[6] = row_trans_service;
    natParam[7] = row_type;
    natParam[8] = row_pat;
    natParam[9] = row_enable;
    natParam[10] = row_sticky;
    natParam[11] = row_vsid;
    natParam[12] = row_srcarea;
    natParam[13] = row_dstarea;
    natParam[14] = row_orig_sport;
    natParam[15] = row_vrname;
    natParam[16] = row_srcvlan;
    natParam[17] = row_dstvlan;
    //users
    natParam[18] = row_users;
    isClone = isclone;
    //datagirdDbclick('tt',index);
    open_window('nat_admin1','Policy/Nat','natWindow',(isclone == 1)?$LANG.CLONE:$LANG.EDIT);
}

function submitAll(switchPhp,id1,insert){
    var trans_src1;            //转换后源地址对象
    var pat1;                  //转换后源端口
    var trans_dst1;            //转换后目的地址对象
    var trans_service1;        //转换后目的端口
    var enable1;               //地址转换开关
    var sticky1;               //sticky NAT开关
    var natid;

    if(id1)
        natid=id1;
    else
        natid='';

//    if($('#nat_admin1').find('#add_sticky')[0].title=='开启')	sticky1='yes';
//    else sticky1='no';

    if($('#nat_admin1').find('input[name="sticky_switch"]:checked').val()==1)
        sticky1='yes';
    else
        sticky1='no';

    var vl=$('#nat_admin1').find('input:radio[name="mode"]:checked').val();
    if(vl==1)
    {
        if($('#nat_admin1').find('#add_trans_src').combotree('getText')=='')
        {
            ngtosPopMessager("error", $LANG.ADD_TRANS_SRC_ADDR);
            return;
        }

        trans_src1=$('#nat_admin1').find('#add_trans_src').combotree('getText');
        if($('#nat_admin1').find('#add_pat')[0].checked) pat1='no';
        else pat1='yes';
        if(trans_src1=='')  pat1='no';
        trans_dst1='';
        trans_service1='';
    }
    else if(vl==2)
    {
        if($('#nat_admin1').find('#add_trans_dst').combotree('getText')=='' && $('#nat_admin1').find('#add_trans_service').combotree('getText')=='')
        {
            ngtosPopMessager("error", $LANG.TRANS_DSTADDR_DSTPORT_NONULL);
            return;
        }
        trans_src1='';
        pat1='yes';
        trans_dst1=$('#nat_admin1').find('#add_trans_dst').combotree('getText');
        trans_service1=$('#nat_admin1').find('#add_trans_service').combotree('getText');
        sticky1='no';
    }
    else if(vl==3)
    {
        if($('#nat_admin1').find('#add_trans_src').combotree('getText')=='')
        {
            ngtosPopMessager("error", $LANG.ADD_TRANS_SRC_ADDR);
            return;
        }
        if($('#nat_admin1').find('#add_trans_dst').combotree('getText')=='' && $('#nat_admin1').find('#add_trans_service').combotree('getText')=='')
        {
            ngtosPopMessager("error", $LANG.TRANS_DSTADDR_DSTPORT_NONULL);
            return;
        }
        trans_src1=$('#nat_admin1').find('#add_trans_src').combotree('getText');
        if($('#nat_admin1').find('#add_pat')[0].checked) pat1='no';
        else pat1='yes';
        trans_dst1=$('#nat_admin1').find('#add_trans_dst').combotree('getText');
        trans_service1=$('#nat_admin1').find('#add_trans_service').combotree('getText');
    }
    else
    {
        trans_src1='';
        pat1='yes';
        trans_dst1='';
        trans_service1='';
        sticky1='no';
    }
//    if($('#nat_admin1').find('#add_enable')[0].title=='开启')	enable1='yes';
//    else enable1='no';
    if($('#nat_admin1').find('input[name="nat_switch"]:checked').val()==1)
        enable1='yes';
    else
        enable1='no';
    $.ajax({
        url: "?c=Policy/Nat&a=natAddSave",
        type: 'POST',
        dataType:'text',
        data:{
            nat_id:natid,
            srcarea:($('#nat_admin1').find('#add_srcarea')[0].value)?('\''+$('#nat_admin1').find('#add_srcarea')[0].value+'\''):'',
            dstarea :((vl==1||vl==4)&&	$('#nat_admin1').find('#add_dstarea')[0].value!='')?('\''+$('#nat_admin1').find('#add_dstarea')[0].value+'\''):'',
            srcvlan:($('#nat_admin1').find('#add_srcvlan')[0].value)?('\''+$('#nat_admin1').find('#add_srcvlan')[0].value+'\''):'',
            dstvlan:((vl==1||vl==4)&&$('#nat_admin1').find('#add_dstvlan')[0].value!='')?('\''+$('#nat_admin1').find('#add_dstvlan')[0].value+'\''):'',
            orig_src:($('#nat_admin1').find('#add_orig_src')[0].value)?('\''+$('#nat_admin1').find('#add_orig_src')[0].value+'\''):'',
            orig_dst:($('#nat_admin1').find('#add_orig_dst')[0].value)?('\''+$('#nat_admin1').find('#add_orig_dst')[0].value+'\''):'',
            orig_sport:($('#nat_admin1').find('#add_orig_sport')[0].value)?('\''+$('#nat_admin1').find('#add_orig_sport')[0].value+'\''):'',
            orig_service:($('#nat_admin1').find('#add_orig_service')[0].value)?('\''+$('#nat_admin1').find('#add_orig_service')[0].value+'\''):'',
            trans_src:trans_src1,
            trans_dst:trans_dst1,
            trans_service:trans_service1,
            pat:pat1,
            sticky:sticky1,
            enable:enable1,
            vr_id:switchPhp=='on'?$('#nat_admin1').find('#add_vr_id')[0].value:'',
            //向控制器中使用post方式传递用户的值
            user:($('#nat_admin1').find('#add_user')[0].value)?('\''+$('#nat_admin1').find('#add_user')[0].value+'\''):'',
            //使能开关状态(1为开启，0为关闭状态)
            energy:$('input[name="energy_switch"]:checked').val()
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

function moveSelectRow()
{
    var row=$('#tt').datagrid('getSelected');
    moveNat(row.nat_id);
}

function natSetToolBar()
{
    var sel_row=$('#tt').datagrid('getChecked');
    if(sel_row.length<1)
    {
        $('#icon_edit').linkbutton('disable');
        $('#icon_insert').linkbutton('disable');
        $('#icon_move').linkbutton('disable');
        $('#icon_delete').linkbutton('disable');
        $('#icon_enable').linkbutton('disable');
        $('#icon_disable').linkbutton('disable');
    }
    else if(sel_row.length==1)
    {
        $('#icon_edit').linkbutton('enable');
        $('#icon_insert').linkbutton('enable');
        $('#icon_move').linkbutton('enable');
        $('#icon_delete').linkbutton('enable');
        $('#icon_enable').linkbutton('enable');
        $('#icon_disable').linkbutton('enable');
    }
    else if(sel_row.length>1)
    {
        $('#icon_edit').linkbutton('disable');
        $('#icon_insert').linkbutton('disable');
        $('#icon_move').linkbutton('disable');
        $('#icon_delete').linkbutton('enable');
        $('#icon_enable').linkbutton('enable');
        $('#icon_disable').linkbutton('enable');
    }
}
//勿删，在vlan模块的js中调用。
function selectVlanRefresh() {
    $('#sel1').empty();
    $.ajax({
        url: '?c=Policy/Interview&a=policyObjShow',
        type: 'POST',
        dataType:'json',
        async:false,
        data:{
            module1:'network vlan',
            action1 :'show'
        },
        success: function(data){
            if(data){
                var q=0;
                var text;
                if($('#sel2')[0].length>0) {
                    $.each(data.rows,function(){
                        q=0;
                        if(this.vlanid < 10){
                            text="vlan.000"+this.vlanid;
                        }else if(this.vlanid >= 10 && this.vlanid <100){
                            text="vlan.00"+this.vlanid;
                        }else if(this.vlanid >= 100 && this.vlanid <1000){
                            text="vlan.0"+this.vlanid;
                        }else{
                            text="vlan."+this.vlanid;
                        }
                        for(var i=0;i<$('#sel2')[0].length;i++) {
                            if(text==$('#sel2')[0].options[i].value) {
                                q=1;
                                i=$('#sel2')[0].length;
                            }
                        }
                        if(q==0) {
                            var opp = new Option(text,text);
                            opp.title = text;
                            $('#sel1')[0].add(opp);
                        }
                    });
                } else {
                    $.each(data.rows,function(){
                        if(this.vlanid < 10){
                            text="vlan.000"+this.vlanid;
                        }else if(this.vlanid >= 10 && this.vlanid <100){
                            text="vlan.00"+this.vlanid;
                        }else if(this.vlanid >= 100 && this.vlanid <1000){
                            text="vlan.0"+this.vlanid;
                        }else{
                            text="vlan."+this.vlanid;
                        }
                        var opp = new Option(text,text);
                        opp.title = text;
                        $('#sel1')[0].add(opp);
                    });
                }
            }
        }
    });
}

function trans_src_combo_reflesh() {
    //源地址转换对象包括：所有地址对象，地址组对象，包含一个接口的区域对象
    $('#add_trans_src').combotree({
        url: '?c=Policy/Nat&a=callFun',
        parent_checked:false,
        required:false,
        editable:true,
        panelHeight:'auto',
        panelMaxHeight:198,
        queryParams:{
            fun: 'comboTree',
            parentNode: 'Address,AddressGroup,Area',
            Address: 'define host,define range,define subnet',
            AddressGroup: 'define group_address',
            Area: 'define area'
        }
    })
}
function trans_dst_combo_reflesh() {
    //目的地址转换对象包括：主机对象，均衡组对象
    $('#add_trans_dst').combotree({
        url: '?c=Policy/Nat&a=callFun',
        parent_checked:false,
        required:false,
        editable:true,
        panelHeight:'auto',
        panelMaxHeight:198,
        queryParams:{
            fun: 'comboTree',
            parentNode: 'Host,Balance',
            Host: 'define host',
            Balance: 'define virtual_server'
        }
    })
}
function trans_service_combo_reflesh() {
    //目的端口包括：类型为UDP、TCP且只有一个端口的服务对象
    $('#add_trans_service').combotree({
        url: '?c=Policy/Nat&a=transServiceJsondata',
        parent_checked:false,
        required:false,
        editable:true,
        panelHeight:'auto',
        panelMaxHeight:198
    })
}

function showHits() {
    if($('#show_hits')[0].checked) {
        $('#tt').datagrid('showColumn','hit_session');
        $.cookie('nat_hits',1, {secure:true});
        $('#tt').datagrid('reload');
    } else {
        $('#tt').datagrid('hideColumn','hit_session');
        $.cookie('nat_hits',0, {secure:true});
    }
}

function enableNatEdit(status) {
    var row=$('#tt').treegrid('getSelections');
    if(status == 'yes') {
        var msg = $LANG.SURE_ENABLE;
    } else {
        var msg = $LANG.SURE_DISABLE;
    }
    ngtosPopMessager("confirm", msg, function(r) {
        if (r) {
            var natId = [];
            for(var i=0;i<row.length;i++) {
                natId[i] = row[i].nat_id;
            }
            $.ajax({
                url: "?c=Policy/Nat&a=callFun",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    fun:'enableEdit',
                    mod:'nat policy',
                    operate:'enable',
                    parKey:'nat_id',
                    parVal:natId,
                    enable:status
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
    });
}

//判断使能如果当前使能是关闭状态，则禁止相对应的按钮
function energySwitch(val){
    var mode_check = $('input[name="mode"]:checked').val();
    if(val == 1){
        $('#add_srcvlan').textbox('enable');
        $('#add_srcarea').textbox('enable');
        $('#add_orig_sport').textbox('enable');
        $('#add_user').textbox('enable');
        $('#add_dstvlan').textbox('enable');
        $('#add_dstarea').textbox('enable');
        $('#add_orig_service').textbox('enable');
        $('#add_srcvlan').siblings("a").linkbutton('enable');
        $('#add_srcarea').siblings("a").linkbutton('enable');
        $('#add_orig_sport').siblings("a").linkbutton('enable');
        $('#add_user').siblings("a").linkbutton('enable');
        $('#add_dstvlan').siblings("a").linkbutton('enable');
        $('#add_dstarea').siblings("a").linkbutton('enable');
        $('#add_orig_service').siblings("a").linkbutton('enable');
    }else{
        if(mode_check == 1){
            $('#add_srcvlan').textbox('disable');
            $('#add_srcarea').textbox('disable');
            $('#add_orig_sport').textbox('disable');
            $('#add_user').textbox('disable');
            $('#add_srcvlan').siblings("a").linkbutton('disable');
            $('#add_srcarea').siblings("a").linkbutton('disable');
            $('#add_orig_sport').siblings("a").linkbutton('disable');
            $('#add_user').siblings("a").linkbutton('disable');
        }else if(mode_check == 2){
            $('#add_orig_service').textbox('disable');
            $('#add_orig_service').siblings("a").linkbutton('disable');
        }else if(mode_check == 3){
            $('#add_srcvlan').textbox('disable');
            $('#add_srcarea').textbox('disable');
            $('#add_orig_sport').textbox('disable');
            $('#add_user').textbox('disable');
            $('#add_srcvlan').siblings("a").linkbutton('disable');
            $('#add_srcarea').siblings("a").linkbutton('disable');
            $('#add_orig_sport').siblings("a").linkbutton('disable');
            $('#add_user').siblings("a").linkbutton('disable');
            $('#add_orig_service').textbox('disable');
            $('#add_orig_service').siblings("a").linkbutton('disable');
        }
/*        $('#add_srcvlan').combobox('disable');
        $('#add_srcarea').combobox('disable');
        $('#add_orig_sport').combobox('disable');
        $('#add_user').combobox('disable');
        $('#add_dstvlan').combobox('disable');
        $('#add_dstarea').combobox('disable');
        $('#add_orig_service').combobox('disable');
        $('#add_srcvlan').siblings("a").linkbutton('disable');
        $('#add_srcarea').siblings("a").linkbutton('disable');
        $('#add_orig_sport').siblings("a").linkbutton('disable');
        $('#add_user').siblings("a").linkbutton('disable');
        $('#add_dstvlan').siblings("a").linkbutton('disable');
        $('#add_dstarea').siblings("a").linkbutton('disable');
        $('#add_orig_service').siblings("a").linkbutton('disable');*/

    }
}
