function chooseMode(num) {
    var enger_wstich = $('input[name="energy_switch"]:checked').val();
	if(num==1) {
        $('.org_tr').show();
        $('.trans_tr').hide();
        $('#sticky_tr').show();
		$('#other2').show();
        $('#otherText').show();
//        if($('#other2')[0].checked)
            $('.otherTr2').show();
//        else
//            $('.otherTr2').hide();
        $('#oto_switch').show();
	}
	if(num==2) {
        $('.trans_tr').show();
        $('.org_tr').hide();
        $('#sticky_tr').hide();
        $('#other2').hide();
        $('#otherText').hide();

        $('#dst_vlan').hide();
        $('#dst_area').hide();
        $('#oto_switch').show();
	}
	if(num==3) {
        $('.trans_tr').show();
        $('.org_tr').show();
        $('#sticky_tr').show();
        $('#other2').hide();
        $('#otherText').hide();

        $('#dst_vlan').hide();
        $('#dst_area').hide();
        $('#oto_switch').show();
	}
	if(num==4) {
        $('.trans_tr').hide();
        $('.org_tr').hide();
        $('#sticky_tr').hide();
        $('#other2').show();
        $('#otherText').show();

//        if($('#other2')[0].checked)
            $('.otherTr2').show();
//        else
//            $('.otherTr2').hide();
        $('#oto_switch').hide();
	}

    //判断如果当前使能的状态为关闭的时候禁止input中需要禁止的linkbutton
    if(enger_wstich != 1){
        //初始化input框的状态为可点击的状态
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
        if(num == 1){
            $('#add_srcvlan').textbox('disable');
            $('#add_srcarea').textbox('disable');
            $('#add_orig_sport').textbox('disable');
            $('#add_user').textbox('disable');
            $('#add_srcvlan').siblings("a").linkbutton('disable');
            $('#add_srcarea').siblings("a").linkbutton('disable');
            $('#add_orig_sport').siblings("a").linkbutton('disable');
            $('#add_user').siblings("a").linkbutton('disable');
        }else if(num == 2){
            $('#add_orig_service').textbox('disable');
            $('#add_orig_service').siblings("a").linkbutton('disable');
        }else if(num == 3){
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
    }
}
//map64弹出框的显示和隐藏
function chooseModeMap64(num) {
    if(num==1) {
        $('.org_tr').show();
//        $('.trans_tr').hide();
        $('#sticky_tr').show();
        $('#other2').show();
        $('#otherText').show();
//        if($('#other2')[0].checked)
        $('.otherTr2').show();
        $('#trans_tr').show();
//        else
//            $('.otherTr2').hide();
    }
    if(num==2) {
        $('.org_tr').show();
//        $('.trans_tr').hide();
        $('#sticky_tr').show();
        $('#other2').show();
        $('#otherText').show();
//        if($('#other2')[0].checked)
        $('.otherTr2').show();
        $('#trans_tr').hide();
    }
    if(num==3) {
        $('.trans_tr').show();
        $('.org_tr').show();
        $('#sticky_tr').show();
        $('#other2').hide();
        $('#otherText').hide();

        $('#dst_vlan').hide();
        $('#dst_area').hide();
    }
    if(num==4) {
        $('.trans_tr').hide();
        $('.org_tr').hide();
        $('#sticky_tr').hide();
        $('#other2').show();
        $('#otherText').show();

//        if($('#other2')[0].checked)
        $('.otherTr2').show();
//        else
//            $('.otherTr2').hide();
    }
}

var addInput = '',modules = '',action = '',groupMod = '',grtag,gaddr_tag;
function addObjectToSelect(add_input,mod,act,group_mod){
    grtag=6;
    gaddr_tag = 6;
    addInput = add_input;
    modules = mod;
    action = act;
    groupMod = group_mod;
    open_window('object_public','Policy/Interview','windowShow&w=policy_interview_add_object',$LANG.SELECT_OBJECT);
}

function sortSelBefore()
{
    sortMe($('#sel1')[0]);
}
function sortSelAfter()
{
    sortMe($('#sel2')[0]);
}



//从小到大排序
function sortMe(oSel){
    var ln = oSel.options.length;
    if(ln<1)
        return;
    //将所有的option  text按照类型分为两个数组：数字型和字符串型
    var arrNum = new Array();
    var arrStr = new Array();
    var countN=0;
    var strN=0;
// 将select中的所有option的value值将保存在Array中
    for (var i = 0; i < ln; i++)
    {
        if(!isNaN(oSel.options[i].text))
        {
            arrNum[countN]=oSel.options[i].text;
            countN++;
        }
        else
        {

            arrStr[strN]=oSel.options[i].text;
            strN++;
        }
    }

    if(oSel.name=='2'||oSel.name=='0')
    {
        //数字从小往大排序
        arrNum.sort(function(a,b){return a-b});
        arrStr.sort();
        oSel.name='1';
    }
    else
    {
        arrNum.sort(function(a,b){return b-a});    //从大到小排序
        arrStr.sort(function(a,b){return a<b?1:-1});    //从大到小排序
        oSel.name='0';
    }

    // 清空Select中全部Option
    while (ln--)
    {
        oSel.options[ln] = null;
    }
    // 将排序后的数组重新添加到Select中
    for (i = 0; i < arrNum.length; i++)
    {
        oSel.add (new Option(arrNum[i],arrNum[i].split(' ')[0]));
    }
    for (i = 0; i < arrStr.length; i++)
    {
        oSel.add (new Option(arrStr[i],arrStr[i].split(' ')[0]));
    }
}

function checkboxSet(obj,value) {
    if($.trim(value)=='setup') {
        obj.checked=true;
    } else {
        obj.checked=false;
    }
}

function setSelectOptions(url)
{
    $.ajax({
        url: url,
        type: 'POST',
        dataType:'json',
        async:false,
        success: function(data, textStatus){
            if(data){
                $.each(data.rows,function(){
                    if(this.name=='none'){
                        $('#admin1').find('#add_group_name')[0].add(new Option($LANG.DEFAULT_GROUP,this.name));
                    }else
                        $('#admin1').find('#add_group_name')[0].add(new Option(this.name,this.name));
                });
            }
        }
    });
}

function valueRowLineTooltip(value,splitStr,type)
{
    var tit='';
    if(typeof(value)!='undefined' && value!='')
    {
        var objs=value.split(splitStr);
        var str='';
        if(objs.length<=4)
        {
            for(var i=0;i<objs.length;i++)
            {
                str+='<div class="simpletooltip right-top pastelblue objecthover" style="width:150px;" onmouseover="showResoureTooltip(this,\''+objs[i]+'\',\''+type+'\')">'+objs[i]+'</div>';
            }
            return str;
        }
        else
        {
            //正在进行“更多”‘收起’功能
            var c='<div style="width: 100%">';
            for(var i=0;i<4;i++)
            {
//                c+=objs[i]+'<br>';
                c+='<div class="simpletooltip right-top pastelblue objecthover" style="width:150px;" onmouseover="showResoureTooltip(this,\''+objs[i]+'\',\''+type+'\')">'+objs[i]+'</div>';
            }
            c+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" id="asd" class="moreTd" onclick="showAllValueTooltip(\''+value+'\',this,\''+splitStr+'\',\''+type+'\');">'+$LANG.MORE+'</a></div>';
            return c;
        }
    }
}
function showAllValueTooltip(value,obj,splitStr,type)
{
    var objs=value.split(splitStr);
    var str='';
    for(var i=0;i<objs.length;i++)
    {
        str+='<div class="simpletooltip right-top pastelblue objecthover" style="width:150px;" onmouseover="showResoureTooltip(this,\''+objs[i]+'\',\''+type+'\')">'+objs[i]+'</div>';
    }
    $(obj).parent().html(str+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" class="moreTd" onclick="showPartValueTooltip(\''+value+'\',this,\''+splitStr+'\',\''+type+'\')">'+$LANG.RETRACT+'</a>');
    if(splitStr==',')
        $('#tt').datagrid('resize');
}
function showPartValueTooltip(value,obj,splitStr,type)
{
    var objs= $.trim(value).split(splitStr);
    var c='';
    for(var i=0;i<4;i++)
    {
        c+='<div class="simpletooltip right-top pastelblue" style="width:150px;" onmouseover="showResoureTooltip(this,\''+objs[i]+'\',\''+type+'\')">'+objs[i]+'</div>';
    }
    c+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" id="asd" class="moreTd" onclick="showAllValueTooltip(\''+value+'\',this,\''+splitStr+'\',\''+type+'\');">'+$LANG.MORE+'</a>';
    $(obj).parent().html(c);
    if(splitStr==',')
        $('#tt').datagrid('resize');
}

function showResoureTooltip(obj,objectname,type)
{
    //获取对象信息
    $.ajax({
        url: "?c=Policy/Object&a="+type,
        type: 'POST',
        dataType:'text',
        async:false,
        data:{
            name:objectname
        },
        success: function(data, textStatus){
            if(data) {
                if(data.indexOf('wrong')==0){
                    ngtosPopMessager("error", data);
                } else {
                    $(obj).tooltip({
//                        position:'right',
                        deltaX: -50,
                        content: data,
                        onShow: function(){
                            $(this).tooltip('tip').css({
//                                boxShadow: '1px 1px 3px #292929'
                            });
                        }
                    });
                    $(obj).tooltip('show');
                }
            }
        }
    });

}

function valueRowLine(value,splitStr)
{
    if(typeof(value)!='undefined' && value!='')
    {
        var objs=value.split(splitStr);
        if(objs.length<=4)
        {
            if(splitStr==',')
                return value.replace(/\,/g,'<br>');
            else if(splitStr==' ')
                return value.replace(/\ /g,'<br>');
        }
        else
        {
            //正在进行“更多”‘收起’功能
            var c='<div style="width: 100%">';
            for(var i=0;i<4;i++)
            {
                c+=objs[i]+'<br>';
            }
            c+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" id="asd" class="moreTd" onclick="showAllValue(\''+value+'\',this,\''+splitStr+'\');">'+$LANG.MORE+'</a></div>';
            return c;
        }
    }
}
function showAllValue(value,obj,splitStr)
{
    if(splitStr==',')
        $(obj).parent().html($.trim(value).replace(/\,/g,'<br>')+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" class="moreTd" onclick="showPartValue(\''+value+'\',this,\',\')">'+$LANG.RETRACT+'</a>');
    else if(splitStr==' ')
        $(obj).parent().html($.trim(value).replace(/\ /g,'<br>')+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" class="moreTd" onclick="showPartValue(\''+value+'\',this,\' \')">'+$LANG.RETRACT+'</a>');
    if(splitStr==',')
        $('#tt').datagrid('resize');

}
function showPartValue(value,obj,splitStr)
{
    var objs= $.trim(value).split(splitStr);
    var c='';
    for(var i=0;i<4;i++)
    {
        c+=objs[i]+'<br>';
    }
    c+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="font-size: 10px" id="asd" class="moreTd" onclick="showAllValue(\''+value+'\',this,\''+splitStr+'\');">'+$LANG.MORE+'</a>';
    $(obj).parent().html(c);
    if(splitStr==',')
        $('#tt').datagrid('resize');
}

function showSubmintValue(id,priValue,type) {
    if(typeof(type)!='undefined' && type==1) {
        var s='';
        if($(id)[0].checked)
            s='setup'
        else
            s='notset';
        if((s=='setup' && priValue=='setup') || (s=='notset' && priValue==''))
            return '';
        else
            return s;

    } else if(typeof(type)!='undefined' && type==2) {
        if($.trim($(id).combobox('getText'))==priValue)
            return '';
        else if($.trim($(id).combobox('getText')).length==0)
            return 'none';
        else
            return $.trim($(id).combobox('getText'));
    }
    if($.trim($(id).textbox('getValue'))==priValue)
        return '';
    else if($.trim($(id).textbox('getValue')).length==0)
        return 'none';
    else
        return $.trim($(id).textbox('getValue'));
}

//移植到了pf.js。但不确定其他模块是否调用。故备份。
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