function configAs(){
    if ($('#config_save_window').length <= 0) {
        $(document.body).append("<div id='config_save_window' class='ngtos_window_400'></div>");
    }
    open_window('config_save_window','System/Config','windowShow&w=system_config_saveas',$LANG.SAVE_ASS);
}

/*******菜单栏删除*****/
function deleteConfigItem(){

    var rows=$('#dg').datagrid('getSelections');
    if (rows.length>0) {
        ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r) {
            if (r){
                var filenames=[];
                for (var i=0; i<rows.length; i++) {
                    filenames.push(rows[i].filename);
                }
                filenames = filenames.join('#');
                $.ajax({
                    url: "?c=System/Config&a=del",
                    type: 'POST',
                    dataType:'text',
                    data:{
                        delItems:filenames,
                        mod:'system config_file',
                        delKey:'__NA__'
                    },
                    success: function(data){
                        if(data == 0){
                            ngtosPopMessager("success", $LANG.CONFIGURATION_FILE_DELETE_SUCCESS);
                            datagridReload('dg');
                            $('#dg').datagrid('reload');
                        }else{
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
        }, true);
    }
    else{
        ngtosPopMessager("info", $LANG.SELECT_DEL_OPTION,'');
    }
}

/*******菜单栏保存*****/
function save_item(){
    ngtosPopMessager("confirm", $LANG.SAVE_CURRENT_SYSTEM_CONFIGURATION, function(r) {
        if (r) {
            $.ajax({
                url: "?c=System/Config&a=callFun",
                data:{
                    fun:'simpleHandle',
                    mod:'save'
                },
                type: 'post',
                dataType:'text',
                success: function(data){
                    if(data == '0'){
                        ngtosPopMessager("success", $LANG.SAVE_CONFIG_SUCCESS);
                        $('#dg').datagrid('reload');
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

/*启动配置文件*/
function loadconfig(configname){

    ngtosPopMessager("confirm", $LANG.SET_UP_THIS_PROFILE, function(r) {
        if (r) {
            //waitMegBox();
            $.ajax({
                url: "?c=System/Config&a=callFun",
                type: 'post',
                dataType:'text',
                async:false,
                data:{
                    fun:'simpleHandle',
                    param:configname,
                    parKey:'__NA__',
                    mod:'system config_file',
                    act:'load'
                },
                success: function(data){
                    if(data == '0'){
                        //closeWaitBox();
                        ngtosPopMessager("success", $LANG.START_CONFIGURATION_SUCCESS);
                        $('#dg').datagrid('reload');
                    }
                    else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });

}

/*导出配置选项*/
function export_html(){
    if ($('#config_export_window').length <= 0) {
        $(document.body).append("<div id='config_export_window' class='ngtos_window_400'></div>");
    }
    open_window('config_export_window','System/Config','windowShow&w=system_configHtml_export',$LANG.EXPORT);
}
///*导出配置文件*/
function export_file(id){
    closeWindow('config_export_window');
    exportId = id;
    if ($('#config_save_window').length <= 0) {
        $(document.body).append("<div id='config_save_window' class='ngtos_window_400'></div>");
    }
    open_window('config_save_window','System/Config','windowShow&w=system_config_export',$LANG.EXPORT);
}
//部分导出
function smallexport_file(){
    
    if ($('#config_exprot_window').length <= 0) {
        $(document.body).append("<div id='config_exprot_window' class='ngtos_window_400'></div>");
    }
    //由于向window窗口分配了数据，所以不能使用公共方法
    open_window('config_exprot_window','System/Config','smallwindowExport',$LANG.EXPORT);
}
///*导出配置文件选择明文还是密文*/
function config_save(){
    
    closeWindow('config_save_window');
    var config_type = "";
    if($("#config_block")[0].checked){
        
       config_type = "on";
    }else{

        config_type = "off";
    }
    var rows=$('#dg').datagrid('getSelections');
    if(exportId==0){
        if(rows.length>0){
            var filenames='';
            for(var i=0;i<rows.length;i++){
                if(i==rows.length-1) filenames+=rows[i].filename;
                else  filenames+=rows[i].filename+'<';
            }
         }else{
            ngtosPopMessager("error", $LANG.CHOOSE_THE_CFTE);
        }
    }
    var form=$('<form>');//定义一个form表单
    form.attr('style','display:none');
    form.attr('target','');
    form.attr('method','post');
    form.attr('action','?c=System/Config&a=fileExport');
    var input1=$('<input>');
    input1.attr('type','hidden');
    input1.attr('name','filename');

    //input1.attr('value',rows[0].filename);
    input1.attr('value',filenames);

    var input2=$('<input>');
    input2.attr('type','hidden');
    input2.attr('name','exportId');
    input2.attr('value',exportId);

    var input_username=$('<input>');
    input_username.attr('type','hidden');
    input_username.attr('name','username');
    input_username.attr('value',$.cookie('username'), {secure:true});

    var input_type=$('<input>');
    input_type.attr('type','hidden');
    input_type.attr('name','config_type');
    input_type.attr('value',config_type);
//        input_type.attr('value',$.cookie('username'));
    //var input_hidden='<input type="hidden" name="submit_post" value="system_config_file_export">';
    $('body').append(form);//将表单放置在web中
    form.append(input1);
    form.append(input2);
    form.append(input_username);
    form.append(input_type);
    //form.append(input_hidden);
    form.submit();//表单提交
    form.remove();
}
//部分导出
function smallExprot(type,name){

    closeWindow('config_exprot_window');
    var type = type;
    var name = name;
    var form=$('<form>');//定义一个form表单
    form.attr('style','display:none');
    form.attr('target','');
    form.attr('method','post');
    form.attr('action','?c=System/Config&a=smallFileExport');     
    var input_type=$('<input>');
    input_type.attr('type','hidden');
    input_type.attr('name','type');
    input_type.attr('value',type);
    
    var input_name=$('<input>');
    input_name.attr('type','hidden');
    input_name.attr('name','name');
    input_name.attr('value',name);

    $('body').append(form);//将表单放置在web中
    form.append(input_type);
    form.append(input_name);
    //form.append(input_hidden);
    form.submit();//表单提交
    form.remove();
    
}
function reset_item()
{
    ngtosPopMessager("confirm", $LANG.RESET,function(r){
        if(r){
            $.ajax({
                url: "?c=System/Config&a=callFun",
                type: 'POST',
                dataType:'text',
                data:{
                    mod:'system config',
                    act:'reset',
                    fun:'simpleHandle'
                },
                success: function(data, textStatus){
                    if(data == '0'){
                        ngtosPopMessager("success", $LANG.RESET_SUCCESSFULLY);
                        $('#dg').datagrid('reload');
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    });
}

function setToolBar()
{
    var sel_row=$('#dg').datagrid('getChecked');
    if(sel_row.length<1)
    {
        if(vs_id != 0)
            $('#btncut').linkbutton('disable');
        
        $('#btdelete').linkbutton('disable');
    }
    else if(sel_row.length==1)
    {
        $('#btncut').linkbutton('enable');
        $('#btdelete').linkbutton('enable');
    }
    else if(sel_row.length>1)
    {
        if(vs_id != 0)
            $('#btncut').linkbutton('disable');
        
            $('#btdelete').linkbutton('enable');
    }
}