/*导入选项*/
function import_html(){
    open_window('import_div','System/Config','windowShow&w=system_config_importHtml_window',$LANG.IMPORT_CONFIGURATION_FILE);
}

/*导入配置文件操作说明*/
function import_file(id){
    importId = id;
    if(importId==1)
        open_window('import_div','System/Config','windowShow&w=system_config_importWord_window',$LANG.IMPORT_WORD_DESC);
    else 
        open_window('import_div','System/Config','windowShow&w=system_config_import_window',$LANG.IMPORT_CONFIGURATION_FILE);
}
/*导入配置文件*/
function importWord_file(id) {
    importId = id;
    open_window('import_div','System/Config','windowShow&w=system_config_import_window',$LANG.IMPORT_CONFIGURATION_FILE);
}
//部分导入
function smallimport_file(){
     if ($('#import_div').length <= 0) {
        $(document.body).append("<div id='import_div' class='ngtos_window_500'></div>");
    }
    //由于这个方法向window窗口中分配变量，所以无法使用公共方法
    open_window('import_div','System/Config','windowShow&w=system_config_smallimport_window',$LANG.PARTIAL_ICF);
}

function loadfType(obj){
	if(!obj.checked){
		$("#import").css('background-color','#A1BBD7');
		$("#import").attr('disabled',true);
	}else{
		$("#import").css('background-color','#1f637b');
		$("#import").attr('disabled',false);
	}
}
var buttonDisable = 0;
function importFile_handle() {
    if (buttonDisable == 1) {
        //$('#import').attr('disabled',true);
        //ngtosPopMessager('info',$LANG.WAITING);
        return false;
    } else {
        buttonDisable = 1;
    }
    
    // 判断文件是否合法
    var str = "[@/'\"#$%&^*()]+";
    var res = document.getElementById("file").value;
    var reg = new RegExp(str);
    if (reg.test(res)) {
        ngtosPopMessager('error',$LANG.FILE_NAME_IS_NOT_LEGAL);
        return false;
    }
    if(importId==1){
        var tag = 0;
    }else{
        if ($("#loadf")[0].checked) {
            var tag = 1;
        } else {
            var tag = 0;
        }
    }
    var des = $( "#des").val();
    $.ajaxFileUpload({
        url:'?c=System/Config&a=importHandle',
        type: 'POST',
        secureuri:false,//secureuri是否启用安全提交，默认为false
        fileElementId:'file',//fileElementId表示文件域ID
        dataType: 'text',
        async:false,
        data:{
            importId:importId,
            des:des,
            tag:tag
        },
        success: function (data) {
            if (data == "0") {
                setTimeout(function() {
                    $('#dg').datagrid('reload');
                    $("#import_div").window("close");
                    buttonDisable = 0;
                    ngtosPopMessager("info", $LANG.UPLOAD_CFS);
                },3000);

            } else if (data == "succes") {//替换配置成功回掉函数
                setTimeout(function() {
                    $('#dg').datagrid('reload');
                    $("#import_div").window("close");
                    buttonDisable = 0;
                    ngtosPopMessager("info",$LANG.SUCCESSFULLY_RC);
                },3000);
            } else {
                setTimeout(function() {
                    ngtosPopMessager("error", data);
                    $("#import_div").window("close");
                    buttonDisable = 0;
                },3000);
            }
        }
    })
    return false;
}
//部分导入
function smallimportFile_handle(){
    
    var str = "[@/'\"#$%&^*()]+";
    var res = document.getElementById("file").value;
    if(res == "")
    {
        ngtosPopMessager("error", $LANG.PLEASE_SELECT_AIFSAIF);
        return;
    }
    var reg = new RegExp(str);
    if (reg.test(res)) {
        alert($LANG.FILE_NAME_IS_NOT_LEGAL);
        return false;
    }
    $.ajaxFileUpload({
        url:'?c=System/Config&a=smallimportHandle',
        type: 'POST',
        secureuri:false,//secureuri是否启用安全提交，默认为false
        fileElementId:'file',//fileElementId表示文件域ID
        dataType: 'text',
        async:false,
        success: function (data) {
            if(data.indexOf("parent.window.location")>=0)
            {
                ngtosPopMessager("error", $LANG.LOGIN_TIMEOUT_PLEASE_RELOGIN, "login");
            }else if (data == "0") {
                                  
                $('#dg').datagrid('reload');
                 ngtosPopMessager("info", $LANG.OPERATION_SUCCESS);
                 $("#import_div").window("close");
                 
            }else{
                if(data.indexOf('102684') > -1)
                {
                    var str = data.split(':')[1];
                    ngtosPopMessager("info", str);
                }
                else
                    ngtosPopMessager("error", data);
            }
         }
    })
}