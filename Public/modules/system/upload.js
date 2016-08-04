function import_file(msg){
    //openPopWindow('import');
    if ($('#import_div').length <= 0) {
        $(document.body).append("<div id='import_div' class='ngtos_window_500'></div>");
    }
    open_window('import_div', 'System/Upload', 'uploadWindow', msg);
}
function sel_item(){
    var selid = document.getElementById("sel");
    if (selid.options[1].selected == true)
    {
        $('#user').hide();
        $('#passwd').hide();
        $('#ser_addr').show();
        $('#file_name').show();
        $('#desc').show();
        $('#loc_upload').hide();
    }else if (selid.options[2].selected == true){
        $('#user').show();
        $('#passwd').show();
        $('#ser_addr').show();
        $('#file_name').show();
        $('#desc').show();
        $('#loc_upload').hide();
    }else if (selid.options[0].selected == true){
        $('#ser_addr').hide();
        $('#file_name').hide();
        $('#user').hide();
        $('#passwd').hide();
        $('#desc').show();
        $('#loc_upload').show();
    }
}
function change_upload(filename){
    ngtosPopMessager("confirm", $LANG.WHETHER_TRTCOS, function(tag1) {
        if (tag1) {
            ngtosPopMessager("confirm", $LANG.SAVE_CURRENT_CONFIGURATION, function(tag2) {
                $('#window_cover').window('open');
                if (tag2)
                    replace_firm(filename, 1);
                else
                    replace_firm(filename, 0);
            });
        }
    });
}
function replace_firm(filename, tag){
    $.ajax({
        url: "?c=System/Upload&a=serviceLoad",
        type: 'POST',
        datatype: 'text',
        data: {
            load_filename: filename,
            replace_tag: tag
        },
        success: function(data) {

            $('#window_cover').window('close');
                if (data == '0') {
                    $('#reboot_wait').window('open');
                    $('#tt').datagrid('reload');
                    display_waiting();
                }else {
                    ngtosPopMessager("error", data);
                }
        }
    });
}

function setSysToolBar(){
    var sel_row = $('#tt').datagrid('getSelections');
    if (sel_row.length > 0)
        $('#icon_del').linkbutton('enable');
    else
        $('#icon_del').linkbutton('disable');
}

function display_waiting(){

    var value = $('#p').progressbar('getValue');
  //  if (value < 100) {
        value += Math.floor(Math.random() * 10);
        $('#p').progressbar('setValue', value);
        setTimeout(arguments.callee, 5000);
   // }
   // else
        top.location.href = $.cookie('urlorg');
}
//固件维护->导入->->选中替换框->升级方式为ftp与tftp
function load_firmware(umethod, ipval, nameval, desval, userval, passval, save_tag){
    $.ajax({
        url: "?c=System/Upload&a=serviceReboot",
        type: 'POST',
        datatype: 'text',
        data: {
            upload_method: umethod,
            ip: ipval,
            name: nameval,
            des: desval,
            user: userval,
            pass: passval,
            tag: save_tag
            //action: upload_action
        },
        success: function(data) {
            //alert(data);
            if (data == 'ok') {

                $('#window_cover').window('close');
                $("#import_div").window("close");
                $('#tt').datagrid('reload');
            }
            else if (data == 'rebootok') {
                $('#window_cover').window('close');
                $("#import_div").window("close");
                $('#reboot_wait').window('open');
                display_waiting();
            }
            else {
                ngtosPopMessager("error", data);
                $('#window_cover').window('close');
            }
        }
    })
}
//固件维护导入数据提交
function import_tab() {

    $('#window_cover').window('open');

    var selid = document.getElementById("sel");
    if (selid.options[1].selected == true)
        var umethod = "tftp";
    else if (selid.options[2].selected == true)
        var umethod = "ftp";
    else if (selid.options[0].selected == true)
        var umethod = "local";

    if (umethod == "local"){
        var des = document.getElementById("comments").value;
        var fval = document.getElementById("file").value;
        if (fval == ""){
            ngtosPopMessager("error", $LANG.PLEASE_SELECT_AIFSAIF);
            $('#window_cover').window('close');
            return;
        }
        var tag = document.getElementById("change_conf");
        if (tag.checked == true){
            $('#window_cover').window('close');
            ngtosPopMessager("confirm", $LANG.SAVE_CURRENT_CONFIGURATION, function(tag2) {
                if (tag2) {
                    var rtype = 1;
                    local_package_update(rtype, des);
                }
                else {
                    var rtype = 2;
                    local_package_update(rtype, des);
                }
            });
        } else {
            $.ajaxFileUpload({
                url: '?c=System/Upload&a=localImport',
                type: 'POST',
                secureuri: false, //secureuri是否启用安全提交，默认为false
                fileElementId: 'file', //fileElementId表示文件域ID
                dataType: 'text',
                async: false,
                data: {des: des},
                success: function(data) {
                    if (data == '0') {
                        $('#window_cover').window('close');
                        $("#import_div").window("close");
                        $('#tt').datagrid('reload');
                    } else {
                        ngtosPopMessager("error", data);
                        $('#window_cover').window('close');
                    }
                }
            })
        }
    }else{
        var ip = document.getElementById("serverip");
        var name = document.getElementById("filename");
        var user = document.getElementById("user_name");
        var pass = document.getElementById("pass_name");
        var des = document.getElementById("comments");
        var ipval = ip.value;
        var nameval = name.value;
        var userval = user.value;
        var passval = pass.value;
        var desval = des.value;

        var tag = document.getElementById("change_conf");

        if (tag.checked == true){
            $('#window_cover').window('close');
            ngtosPopMessager("confirm", $LANG.SAVE_CURRENT_CONFIGURATION, function(tag2) {
                if (tag2)
                    load_firmware(umethod, ipval, nameval, desval, userval, passval, 1);
                else
                    load_firmware(umethod, ipval, nameval, desval, userval, passval, 0);
            });
        }else{
            $.ajax({
                url: "?c=System/Upload&a=serviceUpload",
                type: 'POST',
                datatype: 'text',
                data: {
                    upload_method: umethod,
                    ip: ipval,
                    name: nameval,
                    des: desval,
                    user: userval,
                    pass: passval
                },
                success: function(data) {
                    if (data == '0') {
                        ngtosPopMessager('info',$LANG.CHANGE_SUCCESS,function(){
                            $('#window_cover').window('close');
                            $("#import_div").window("close");
                            $('#tt').datagrid('reload');
                        });
                    }else {
                        ngtosPopMessager("error", data);
                        $('#window_cover').window('close');
                    }
                }
            })
        }
    }
}
/*******菜单栏删除*****/
function delete_item() {
        ngtosPopMessager("confirm", $LANG.DELETE_IT, function(r) {
            if (r){
                var ids1 = [];
                var rows = $('#tt').datagrid('getSelections');
                for (var i = 0; i < rows.length; i++) {
                    ids1.push(rows[i].filename);
                }

                var name = ids1.join(';');

                $.ajax({
                    url: "?c=System/Upload&a=serviceDel",
                    type: 'POST',
                    datatype: 'text',
                    data: {
                        del_filename: name
                    },
                    success: function(data) {
                        if (data == '0') {
                            $('#tt').datagrid('reload');
                        }else {
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
        });
}

//固件维护->导入->->选中替换框->升级方式本地
function local_package_update(rtype, des) {

    $.ajaxFileUpload({
        url: '?c=System/Upload&a=localUpdate',
        type: 'POST',
        secureuri: false, //secureuri是否启用安全提交，默认为false
        fileElementId: 'file', //fileElementId表示文件域ID
        dataType: 'text',
        async: false,
        data: {reboot_tag: rtype, des: des},
        success: function(data) {
            if (data == 'rebootok') {
                $('#window_cover').window('close');
                $("#import_div").window("close");
                $('#reboot_wait').window('open');
                display_waiting();
            }else if (data == '0') {
                $('#window_cover').window('close');
                $("#import_div").window("close");
                $('#tt').datagrid('reload');
            }else if ((typeof data == 'string') && (data.indexOf('}') < 0)) {
                ngtosPopMessager("error", data);
                $("#import_div").window("close");
                $("#window_cover").window("close");
            } else {
                var obj = jQuery.parseJSON(data);
                if (obj["rows"] != "") {
                    var delArr = [];
                    $(obj["rows"]).each(function(key, value) {
                        delArr.push(value.version);
                    })
                    var delVal = delArr.join(',') + $LANG.AFTER_YOU_NTRTCOS;
                    ngtosPopMessager("confirm", delVal, function(dtag) {
                        if (dtag) {
                            $("#window_cover").window("open");
                            $.ajax({
                                url: "?c=System/Upload&a=packagePpdate",
                                type: 'POST',
                                dataType: 'text',
                                data: {
                                    dtag: "yes"
                                },
                                success: function(data) {
                                       $("#window_cover").window("close");
                                    if (data == 'rebootok') {
                                        $("#import_div").window("close");
                                        $('#reboot_wait').window('open');
                                        display_waiting();
                                    }else
                                        ngtosPopMessager("error", data);
                                }
                            });
                        }else {
                            $.ajax({
                                url: "?c=System/Upload&a=updateCancel",
                                type: 'POST',
                                dataType: 'text',
                                data: {
                                    dtag: "no"
                                },
                                success: function(data) {
                                    if (data == '0') {
                                        $('#window_cover').window('close');
                                    }
                                    else
                                        ngtosPopMessager("error", data);
                                }
                            });
                        }
                    });
                }else
                    ngtosPopMessager("error", data);
                $("#window_cover").window("close");
            }
        }
    })
}