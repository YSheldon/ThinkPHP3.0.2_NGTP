function license_item(newValue,oldValue){
    if(!newValue) {
        newValue = $('#sel').combobox('getValue');
    }
    if(newValue==0){
        $('#ser_addr').hide();
        $('#file_name').hide();
        $('#user').hide();
        $('#passwd').hide();
        $('#loc_upload').show();
        $("#serverip").textbox({required:false});
        $("#filename").textbox({required:false});
        $("#serverip").textbox("setValue","");
        $("#filename").textbox("setValue","");
    }else if(newValue==1){
        $('#user').hide();
        $('#passwd').hide();
        $('#ser_addr').show();
        $('#file_name').show();
        $('#loc_upload').hide();
        $("#serverip").textbox({required:true});
        $("#filename").textbox({required:true});
    }else{
        $('#user').show();
        $('#passwd').show();
        $('#ser_addr').show();
        $('#file_name').show();
        $('#loc_upload').hide();
        $("#serverip").textbox({required:true});
        $("#filename").textbox({required:true});
    }
}
//提交数据
function license_tab() {
    //addTan('loding',1);
    var from = $('#lice_form').form('validate');
    if(from){
    $("#window_cover").window("open");
       var selid = $('#sel').combobox('getValue');
       if(selid==1){//tftp
         $.ajax({
             url: "?c=System/Upload&a=licenseTftp",
             type: 'POST',
             datatype:'text',
             data:{
                 ip:$('#serverip').val(),
                 name:$('#filename').val()
             },
             success: function(data) {
                 if(data=='0') {
                     $("#window_cover").window("close");
                     license_reboot();
                 } else {
                     ngtosPopMessager("error", data);
                     $("#window_cover").window("close");
                 }
             }
         })
     } else if(selid==2){ //ftp
         $.ajax({
             url: "?c=System/Upload&a=licenseFtp",
             type: 'POST',
             datatype:'text',
             data:{
                 ip:$('#serverip').val(),
                 name:$('#filename').val(),
                 user:$('#user_name').val(),
                 pass:$('#pass_name').val()
             },
             success: function(data) {
                 if(data=='0') {
                      $("#window_cover").window("close");
                     license_reboot();
                 } else {
                     ngtosPopMessager("error", data);
                     $("#window_cover").window("close");
                 }
             }
         })
     }else if(selid==0){
         $.ajaxFileUpload({
             url:'?c=System/Upload&a=licenseLocal',
             type: 'POST',
             secureuri:false,//secureuri是否启用安全提交，默认为false
             fileElementId:'file',//fileElementId表示文件域ID
             dataType: 'text',
             async:false,
             success: function (data) {
                 if(data=='0') {
                     $("#window_cover").window("close");
                     license_reboot();
                 } else {
                     ngtosPopMessager("error", data);
                     $("#window_cover").window("close");
                 }
             }
         })
     }
 }
}
//重启
function license_reboot(){
    ngtosPopMessager("confirm", $LANG.NEED_TO_RESTART_TO_TAKE_EFFECT,function(tag){
        if(tag){
            $.ajax({
                url: "?c=System/Upload&a=callFun",
                type: 'POST',
                datatype:'text',
                data:{
                    mod:'system reboot',
                    fun:'simpleHandle'
                },
                success: function(data){
                    if(data=='0'){
                        $("#reboot_wait").window("open");
                        display_waiting();
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    })
}

function display_waiting(){
    var value = $('#p').progressbar('getValue');
    if (value < 100){
        value += Math.floor(Math.random() * 10);
        $('#p').progressbar('setValue', value);
        setTimeout(arguments.callee, 5000);
    }
    else
        top.location.href="?c=Index&a=index";
}