//添加
var policyParam = [];
function addrow(){
    policyParam[0] = '';
    open_window('admin1', 'Policy/Interview', 'policyWindow',$LANG.ADD);
}

//编辑
function editInterviewRow(id1,row_srcarea,row_src,row_dstarea,row_dst,row_service,row_schedule,row_action,row_enable,row_log,row_comment,
                 row_user,row_group_name,row_orig_dst,row_max_active_session,row_permanent,row_switch_statistic,appid,row_srcvlan,
                 row_dstvlan,row_hopopts,row_dstopts,row_routing,row_fragment,row_ah,row_esp,row_profile,row_slog,row_srcport){
    policyParam[0] = id1;
    policyParam[1] = row_srcarea;
    policyParam[2] = row_src;
    policyParam[3] = row_dstarea;
    policyParam[4] = row_dst;
    policyParam[5] = row_service;
    policyParam[6] = row_schedule;
    policyParam[7] = row_action;
    policyParam[8] = row_enable;
    policyParam[9] = row_log;
    policyParam[10] = row_comment;
    policyParam[11] = row_user;
    policyParam[12] = row_group_name;
    policyParam[13] = row_orig_dst;
    policyParam[14] = row_max_active_session;
    policyParam[15] = row_permanent;
    policyParam[16] = row_switch_statistic;
    policyParam[17] = appid;
    policyParam[18] = row_srcvlan;
    policyParam[19] = row_dstvlan;
    policyParam[20] = row_hopopts;
    policyParam[21] = row_dstopts;
    policyParam[22] = row_routing;
    policyParam[23] = row_fragment;
    policyParam[24] = row_ah;
    policyParam[25] = row_esp;
    policyParam[26] = row_profile;
    policyParam[27] = row_slog;
    policyParam[28] = row_srcport;

    open_window('admin1', 'Policy/Interview', 'policyWindow',$LANG.EDIT);

}

function interviewSuperQuery() {
    open_window('policy_search','Policy/Interview','windowShow&w=policy_interview_search',$LANG.SEARCH);
}

var moveVal = '';
var moveType = '';
var moveAllData = {};
function movePolicy(value,type) {
    moveVal = value;
    moveType = type;
    if(type=='group') {
        //获取策略组
        $.ajax({
            url: "?c=Policy/Interview&a=showPolicyGroup",
            type: 'POST',
            dataType:'json',
            async:false,
            success: function(data, textStatus){
                if(data) {
                    if(data.rows.length<3 ) {
                        ngtosPopMessager("error", $LANG.NOT_MOVE);
                        return;
                    }
                    moveAllData = data.rows;
                    open_window('interview_move', 'Policy/Interview', 'windowShow&w=policy_interview_move',$LANG.MOVE_POLICY_GROUP);
                }
            }
        });
    } else {
        //获取所有策略的id
        $.ajax({
            url: "?c=Policy/Interview&a=callFun",
            type: 'POST',
            dataType:'json',
            async:false,
            data: {
                fun:'dataShow',
                mod:'firewall policy',
                key:'id'
            },
            success: function(data, textStatus){
                if(data) {
                    if(data.rows.length==1) {
                        ngtosPopMessager("error", $LANG.ONLY_ONE_CANNOT);
                        return;
                    } else {
                        moveAllData = data.rows;
                        open_window('interview_move', 'Policy/Interview', 'windowShow&w=policy_interview_move',$LANG.MOVE_POLICY);
                    }
                }
            }
        });
    }
}

function delInterview(){
    var rows=$('#tt').treegrid('getSelections');
    var msg='';
    var isPolicy = false;
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var pid = [];
            var gid = [];
            var pNum = 0;
            var gNum = 0;
            var pageNum = return_pagenum('tt',rows);
            for(var i=0; i<rows.length; i++){
                if(typeof(rows[i]._parentId)!='undefined' && rows[i]._parentId.length>0) {
                    isPolicy = true;
                    pid[pNum] = rows[i].id;
                    pNum++;
                } else {
                    gid[gNum] = rows[i].id;
                    gNum++;
                }
            }
            if(pid.length > 0) {
                $.ajax({
                    url: "?c=Policy/Interview&a=del",
                    type: 'POST',
                    dataType:'text',
                    async:false,
                    data:{
                        mod:'firewall policy',
                        delItems:pid,
                        delKey:'id'
                    },
                    success: function(data){
                        if(data != '0'){
                            msg+=data+'<br>';
                        }
                    }
                });
            }

            if(gid.length > 0) {
                $.ajax({
                    url: "?c=Policy/Interview&a=del",
                    type: 'POST',
                    dataType:'text',
                    async:false,
                    data:{
                        mod:'firewall group_policy',
                        delItems:gid
                    },
                    success: function(data){
                        if(data != '0'){
                            msg+=data+'<br>';
                        }
                    }
                });
            }
            if(msg != ''){
                ngtosPopMessager("error", msg);
            } else {
                //临时代码，后续需调整为：如果根据策略分页，那就删除策略成功时执行，否则策略组删除成功时执行
                if(isPolicy) {
                    $('#tt').treegrid('options').pageNumber = pageNum;
                    $('#tt').treegrid('getPager').pagination({pageNumber: pageNum});
                }
            }
            $('#tt').treegrid('unselectAll');
            $('#tt').treegrid('reload');
        }
    });
}


var oldGroupName = '';

function editGroupWindow(beforename,title){
    oldGroupName = beforename;
    insertNmae = '';
    open_window('admin_policy_group', 'Policy/Interview', 'windowShow&w=policy_interview_group', title);
}

function clearInterviewGroup() {
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/Interview&a=clean&mod="+encodeURI('firewall group_policy'),
                type: 'GET',
                dataType:'text',
                async:false,
                success: function(data, textStatus){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').treegrid('unselectAll');
                    $('#tt').treegrid('reload');
                }
            });
        }
    });
}

function addPolicyGroup(tag) {
    insertNmae = '';
    oldGroupName = '';
    open_window('admin_policy_group', 'Policy/Interview', 'windowShow&w=policy_interview_group', tag);
}

function showInterviewHits()
{
    if($('#show_hits')[0].checked)
    {
        $('#tt').treegrid('showColumn','allhits');
        $.cookie('hits',1, {secure:true});
        $('#tt').treegrid('reload');
    }
    else
    {
        $('#tt').treegrid('hideColumn','allhits');
        $.cookie('hits',0, {secure:true});
    }

}

function clearInterview(){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/Interview&a=clean&mod="+encodeURI('firewall policy'),
                type: 'GET',
                dataType:'text',
                async:false,
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                    $('#tt').treegrid('unselectAll');
                    $('#tt').treegrid('reload');
                }
            });
        }
    });
}


/*20140826*/
function editInterview(titleVal) {
    var row=$('#tt').treegrid('getSelected');
    if(typeof(row._parentId)!='undefined'){
        editInterviewRow(row.id,row.srcarea,row.src,row.dstarea,row.dst,row.service,row.schedule,row.action,row.enable,
            row.log,row.comment,row.userid,row.group_name,row.orig_dst,row.max_active_session,
            row.permanent,row.switch_statistic, row.app,row.srcvlan,row.dstvlan,
            row.hopopts,row.dstopts,row.routing,row.fragment,row.ah,row.esp,row.profile,row.slog,row.profile,row.srcport,titleVal);
    } else if(row.id=='none')
        return;
    else
        editGroupWindow(row.id, titleVal);
}

var insertNmae = '';
function insertGroupRow(title) {
    var row=$('#tt').treegrid('getSelected');
    insertNmae = row.id;
    oldGroupName = '';
    open_window('admin_policy_group', 'Policy/Interview', 'windowShow&w=policy_interview_group', title);
}
function moveInterview()
{
    var row=$('#tt').treegrid('getSelected');
    if(typeof(row._parentId)!='undefined'){
        movePolicy(row.id);
    }
    else if(row.id=='none')
        return;
    else
        movePolicy(row.id,'group');
}
function enableSelectRow(status) {
    var row=$('#tt').treegrid('getSelections');
    if(status == 'yes') {
        var msg = $LANG.SURE_ENABLE;
    } else {
        var msg = $LANG.SURE_DISABLE;
    }
    ngtosPopMessager("confirm", msg, function(r) {
        if (r) {
            var pid = [];
            for(var i=0;i<row.length;i++) {
                pid[i] = row[i].id;
            }
            $.ajax({
                url: "?c=Policy/Interview&a=callFun",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    fun:'enableEdit',
                    mod:'firewall policy',
                    parKey:'id',
                    parVal:pid,
                    enable:status
                },
                success: function(data){
                    if(data != '0'){
                        ngtosPopMessager("error", data);
                    }
                }
            });
            $('#tt').treegrid('unselectAll');
            $('#tt').treegrid('reload');
        }
    });
}

function changeAction(id,num,obj) {
    if(num==1)
        var text=$LANG.POLICY_MODIFY_ACCEPT;
    else
        var text=$LANG.POLICY_MODIFY_DENY;

    ngtosPopMessager("confirm", text, function(r) {
        if(r==1) {
            $.ajax({
                url: "?c=Policy/Interview&a=callFun",
                type: 'POST',
                dataType:'text',
                async:false,
                data:{
                    fun:'enableEdit',
                    mod:'firewall policy',
                    parVal:id,
                    parKey:'id',
                    operate:'action',
                    enable:num == 0 ? 'deny' : 'accept'
                },
                success: function(data){
                    if(data=='0'){
                        $('#tt').treegrid('unselectAll');
                        $('#tt').treegrid('reload');
                    } else {
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

function setInterviewToolBar()
{
    var sel_row=$('#tt').treegrid('getSelections');
    var tag=0;
    if(sel_row.length>1)
    {
        $('#icon_edit').linkbutton('disable');
        $('#icon_insert').linkbutton('disable');
        $('#icon_move').linkbutton('disable');
        $('#icon_delete').linkbutton('enable');
        $('#icon_move').linkbutton('disable');
        for(var i=0;i<sel_row.length;i++)
        {
            if(typeof(sel_row[i]._parentId)=='undefined')
            {
                tag=1;
                if(sel_row[i].id=='none')
                {
                    $('#icon_delete').linkbutton('disable');
                    break;
                }
            }
        }
        if(tag==1)
        {
            $('#icon_enable').linkbutton('disable');
            $('#icon_disable').linkbutton('disable');
        }
        else
        {
            $('#icon_enable').linkbutton('enable');
            $('#icon_disable').linkbutton('enable');
        }
    }
    else if(sel_row.length==1)
    {
        $('#icon_edit').linkbutton('enable');
        $('#icon_move').linkbutton('enable');
        $('#icon_delete').linkbutton('enable');

        if(typeof(sel_row[0]._parentId)=='undefined')
        {
            $('#icon_insert').linkbutton('enable');
            $('#icon_enable').linkbutton('disable');
            $('#icon_disable').linkbutton('disable');
            if(sel_row[0].id=='none')
            {
                $('#icon_insert').linkbutton('disable');
                $('#icon_edit').linkbutton('disable');
                $('#icon_move').linkbutton('disable');
                $('#icon_delete').linkbutton('disable');
            }

        }
        else
        {
            $('#icon_insert').linkbutton('disable');
            $('#icon_enable').linkbutton('enable');
            $('#icon_disable').linkbutton('enable');
        }

    }
    else
    {
        $('#icon_edit').linkbutton('disable');
        $('#icon_insert').linkbutton('disable');
        $('#icon_move').linkbutton('disable');
        $('#icon_delete').linkbutton('disable');
        $('#icon_enable').linkbutton('disable');
        $('#icon_disable').linkbutton('disable');
    }
}
