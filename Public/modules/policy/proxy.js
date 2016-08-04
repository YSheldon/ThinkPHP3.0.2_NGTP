//httpProfile
function addHttp(){
    taghttp = 1;
    if ($('#http_window_div').length <= 0) {
        $(document.body).append("<div id='http_window_div' class='ngtos_window_600'></div>");
    }
    open_window('http_window_div','Policy/HTTP','windowShow&w=policy_http_window',$LANG.ADD);
}
function editHttpRow(){
    var rowData=$('#http').datagrid('getSelections');
    if(rowData.length ==1)
        editHttp(rowData[0].id,rowData[0].name,rowData[0].vs_name,rowData[0].max_request_len,rowData[0].max_body_len,rowData[0].ignore_invalid_header,rowData[0].content_type,rowData[0].uri,rowData[0].keyword,rowData[0].rewrite_request_head,rowData[0]['set-cookie']);
    else
        return;
}
function editHttp(id,name,vs_name,max_request_len,max_body_len,ignore_invalid_header,content_type,uri,keyword,setcookie,rewrite_request_head){
    taghttp = 2;
    if ($('#http_window_div').length <= 0) {
        $(document.body).append("<div id='http_window_div' class='ngtos_window_600'></div>");
    }
    param[0] = id;
    param[1] = name;
    param[2] = vs_name;
    param[3] = max_request_len;
    param[4] = max_body_len;
    param[5] = ignore_invalid_header;
    param[6] = content_type;
    param[7] = uri;
    param[8] = keyword;
    param[9] = setcookie;
    param[10] = rewrite_request_head;
    open_window('http_window_div','Policy/HTTP','windowShow&w=policy_http_window',$LANG.EDIT);
}

function addHttpProfile(tag){
    var id = $("#id").val();
    var name = $("#name").val();
    var vs_name = $("#vs_name").val();
    var max_request_len = $("#max_request_len").val();
    var max_body_len = $("#max_body_len").val();
    var  ignore_invalid_header = $('input[name="ignore_invalid_header"]:checked').val();
    if(ignore_invalid_header == 'enable'){
        ignore_invalid_header = 'on';
    }else{
        ignore_invalid_header = 'off';
    }

    var content_type = $("#content_type").val();
    var uri = $("#uri").val();
    var keyword = $("#keyword").val();
    var setcookie = $("#setcookie").val();

    var  rewrite_request_head = $('input[name="rewrite_request_head"]:checked').val();
    if(rewrite_request_head == 'enable'){
        rewrite_request_head = 'on';
    }else{
        rewrite_request_head = 'off';
    }
    $.ajax({
        url: "?c=Policy/HTTP&a=addHttpProfileHandle",
        type: 'POST',
        data:{
            id:id,
            name:name,
            vs_name:vs_name,
            max_request_len:max_request_len,
            max_body_len:max_body_len,
            ignore_invalid_header:ignore_invalid_header,
            content_type:content_type,
            uri:uri,
            keyword:keyword,
            'set-cookie':setcookie,
            rewrite_request_head:rewrite_request_head,
            flag:tag
        },
        success: function(data){
            if(data == 0){
                $("#http_window_div").window("close");
                datagridReload("http");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}

function deleteHttp(){
    deleteAgent('http','proxy http_profile');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#http').datagrid('getChecked');
                var ids = [];
                for(var i=0; i<rows.length; i++){
                   ids.push(rows[i].id);
                }
                    ids = ids.join('#');
                    $.ajax({
                        url: "?c=Policy/HTTP&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:ids,
                            mod:'proxy http_profile',
                            delKey:'id'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("http");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
        })*/
}

//HTTP清空功能
function clearHttp(){
    cleanAgent('http','proxy http_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/HTTP&a=clean&mod="+encodeURI('proxy http_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("http");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}

function setHttp(){
    linkButton('http');
/*    var crows = $('#http').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

function addFtp(){
    tagftp = 1;
    if ($('#ftp_window_div').length <= 0) {
        $(document.body).append("<div id='ftp_window_div' class='ngtos_window_620'></div>");
    }
    open_window('ftp_window_div','Policy/FTP','windowShow&w=policy_ftp_window',$LANG.ADD);
}
function editFtpRow(){
    var rowData=$('#ftp').datagrid('getSelections');
    if(rowData.length ==1)
        editFtp(rowData[0].id,rowData[0].name,rowData[0].expect_buffer,rowData[0].expect_timer,rowData[0].upstream_data_mode);
    else
        return;
}
function editFtp(id,name,expect_buffer,expect_timer,upstream_data_mode){
    tagftp = 2;
    if ($('#ftp_window_div').length <= 0) {
        $(document.body).append("<div id='ftp_window_div' class='ngtos_window_620'></div>");
    }
    param[0] = id;
    param[1] = name;
    param[2] = expect_buffer;
    param[3] = expect_timer;
    param[4] = upstream_data_mode;
    open_window('ftp_window_div','Policy/FTP','windowShow&w=policy_ftp_window',$LANG.EDIT);
}
function addFtpProfile(tag){
    var id = $("#id").val();
    var name = $("#name").val();
    var expect_buffer = $("#expect_buffer").val();
    var expect_timer = $("#expect_timer").val();
    var upstream_data_mode = $("#upstream_data_mode").combobox('getValue');
    $.ajax({
        url: "?c=Policy/FTP&a=addFtpProfileHandle",
        type: 'POST',
        data:{
            id:id,
            name:name,
            expect_buffer:expect_buffer,
            expect_timer:expect_timer,
            upstream_data_mode:upstream_data_mode,
            flag:tag
        },
        success: function(data){
            if(data == 0){
                $("#ftp_window_div").window("close");
                datagridReload("ftp");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
function deleteFtp(){
    deleteAgent('ftp','proxy ftp_profile');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#ftp').datagrid('getChecked');
                var ids = [];
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].id);
                }
                    ids = ids.join('#');
                    $.ajax({
                        url: "?c=Policy/FTP&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:ids,
                            delKey:'id',
                            mod:'proxy ftp_profile'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("ftp");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
            }
        })*/
}
//FTP清空功能
function clearFtp(){
    cleanAgent('ftp','proxy ftp_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/FTP&a=clean&mod="+encodeURI('proxy ftp_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("ftp");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}
function setFtp(){
    linkButton('ftp');
/*    var crows = $('#ftp').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

//sslProfile
function addSslServer(){
    tagssls = 1;
    if ($('#ssl_server_window').length <= 0) {
        $(document.body).append("<div id='ssl_server_window' class='ngtos_window_600'></div>");
    }
    open_window('ssl_server_window','Policy/SSL','windowShow&w=policy_sslserver_window',$LANG.ADD);
}

function editSslSrow(){
    var rowData=$('#ssl').datagrid('getSelections');
    if(rowData.length ==1)
        editSslServer(rowData[0].name,rowData[0].proxy_cert,rowData[0].proxy_cert_key,rowData[0].proxy_name,rowData[0].proxy_trusted_cert,rowData[0].proxy_verify,rowData[0].proxy_verify_depth,rowData[0].proxy_ssl_cert_trans,rowData[0].id,rowData[0].proxy_crl);
    else
        return;
}

function editSslServer(name,proxy_cert,proxy_cert_key,proxy_name,proxy_trusted_cert,proxy_verify,proxy_verify_depth,proxy_ssl_cert_trans,id,proxy_crl){
    tagssls = 2;
    if ($('#ssl_server_window').length <= 0) {
        $(document.body).append("<div id='ssl_server_window' class='ngtos_window_600'></div>");
    }

    param[0] = name;
    param[1] = proxy_cert;
    param[2] = proxy_cert_key;
    param[3] = proxy_name;
    param[4] = proxy_trusted_cert;
    param[5] = proxy_verify;
    param[6] = proxy_verify_depth;
    param[7] = proxy_ssl_cert_trans;
    param[8] = id;
    param[9] = proxy_crl;
    open_window('ssl_server_window','Policy/SSL','windowShow&w=policy_sslserver_window',$LANG.EDIT);
}

function addSslServerProfile(tag){
    var  id = $('#id').val();
    var  name = $('#name').val();
    var  proxy_cert = $('#proxy_cert').combobox('getValue');
    var  proxy_cert_key = $('#proxy_cert_key').combobox('getValue');
    var  proxy_name = $('#proxy_name').val();
    var  proxy_trusted_cert = $("#proxy_trusted_cert").combobox('getValue');

    var  proxy_verify = $('input[name="proxy_verify"]:checked').val();
    if(proxy_verify == 'enable'){
        proxy_verify = 'on';
    }else{
        proxy_verify = 'off';
    }

    var  proxy_ssl_cert_trans = $('input[name="proxy_ssl_cert_trans"]:checked').val();
    if(proxy_ssl_cert_trans == 'enable'){
        proxy_ssl_cert_trans = 'on';
    }else{
        proxy_ssl_cert_trans = 'off';
    }

    var  proxy_crl = $('#proxy_crl').combobox('getValue');
    var  proxy_verify_depth = $("#proxy_verify_depth").val();
    $.ajax({
        url:'?c=Policy/SSL&a=addSslServerProfile',
        type:'post',
        data:{
            id:id,
            name:name,
            proxy_cert:proxy_cert,
            proxy_cert_key:proxy_cert_key,
            proxy_name:proxy_name,
            proxy_trusted_cert:proxy_trusted_cert,
            proxy_verify:proxy_verify,
            proxy_ssl_cert_trans:proxy_ssl_cert_trans,
            proxy_crl:proxy_crl,
            proxy_verify_depth:proxy_verify_depth,
            flag:tag
        },
        success: function (data){
            if(data == 0){
                $("#ssl_server_window").window("close");
                datagridReload("ssl");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//SSLserver中的删除功能
function deleteSssl(){
    deleteAgent('ssl','proxy ssl_server_profile','','del');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#ssl').datagrid('getChecked');
                var ids = [];
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].id);
                }
                    ids = ids.join('#');
                    $.ajax({
                        url: "?c=Policy/SSL&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            act:'del',
                            delItems:ids,
                            mod:'proxy ssl_server_profile',
                            delKey:'id'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("ssl");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
        })*/
}

//SSLserver中的清空功能
function clearSssl(){
    cleanAgent('ssl','proxy ssl_server_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/SSL&a=clean&mod="+encodeURI('proxy ssl_server_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("ssl");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}

function addSslClient(){
    tagsslc = 1;
    if ($('#ssl_window_div').length <= 0) {
        $(document.body).append("<div id='ssl_window_div' class='ngtos_window_750'></div>");
    }
    open_window('ssl_window_div','Policy/SSL','windowShow&w=policy_sslclient_window',$LANG.ADD);
}
function editSslCrow(){
    var rowData=$('#ssl').datagrid('getSelections');
    if(rowData.length ==1)
        editSslClient(rowData[0].name,rowData[0].ssl,rowData[0].ssl_cert,rowData[0].ssl_cert_key,rowData[0].ssl_crl,rowData[0].ssl_session_tickets,rowData[0].ssl_session_cache,rowData[0].ssl_session_timeout,rowData[0].ssl_verify_client,rowData[0].ssl_trusted_cert,rowData[0].ssl_client_cert,rowData[0].ssl_verify_depth,rowData[0].ssl_ciphers,rowData[0].id,rowData[0].ssl_session_ticket_key);
    else
        return;
}
function editSslClient(name,ssl,ssl_cert,ssl_cert_key,ssl_crl,ssl_session_tickets,ssl_session_cache,ssl_session_timeout,ssl_verify_client,ssl_trusted_cert,ssl_client_cert,ssl_verify_depth,ssl_ciphers,id,ssl_session_ticket_key){
    tagsslc = 2;
    if ($('#ssl_window_div').length <= 0) {
        $(document.body).append("<div id='ssl_window_div' class='ngtos_window_750'></div>");
    }

    param[0] = name;
    param[1] = ssl;
    param[2] = ssl_verify_depth;
    param[3] = ssl_ciphers;
    param[4] = ssl_verify_client;
    param[5] = ssl_cert;
    param[6] = ssl_cert_key;
    param[7] = ssl_client_cert;
    param[8] = ssl_trusted_cert;
    param[9] = ssl_crl;
    param[10] = ssl_session_tickets;
    param[11] = ssl_session_cache;
    param[12] = ssl_session_timeout;
    param[13] = id;
    param[14] = ssl_session_ticket_key;
    open_window('ssl_window_div','Policy/SSL','windowShow&w=policy_sslclient_window',$LANG.EDIT);
}

function addSslProfile(tag){
    var  id = $("#id").val();
    var  name = $("#name").val();
    var  ssl = $('input[name="ssl"]:checked').val();
    if(ssl == 'enable'){
        ssl = 'on';
    }else{
        ssl = 'off';
    }
    var  ssl_crl = $('#ssl_crl').combobox('getValue');
    var  ssl_session_ticket_key = $('#ssl_session_ticket_key').combobox('getValue');
    var  ssl_cert = $('#ssl_cert').combobox('getValue');
    var  ssl_cert_key = $('#ssl_cert_key').combobox('getValue');
    var  ssl_client_cert = $('#ssl_client_cert').combobox('getValue');
    var  ssl_trusted_cert = $('#ssl_trusted_cert').combobox('getValue');
    var  ssl_session_cache = $("#ssl_session_cache").val();//设置会话缓存

    if(ssl_session_cache != 0){
        if(ssl_session_cache < 32768 || ssl_session_cache > 20971520){
            ngtosPopMessager("info", $LANG.SESSION_REUSE_BUFFER_SIZE_BETWEEN);
            return false;
        }
    }

    var  ssl_session_tickets = $('input[name="ssl_session_tickets"]:checked').val();//会话复用使能
    if(ssl_session_tickets == 'enable'){
        ssl_session_tickets = 'on';
    }else{
        ssl_session_tickets = 'off';
    }
    var  ssl_session_timeout = $("#ssl_session_timeout").val();//会话缓存超时
    var  ssl_verify_client = $('input[name="ssl_verify_client"]:checked').val();//验证客户端证书使能
    if(ssl_verify_client == 'enable'){
        ssl_verify_client = 'on';
    }else{
        ssl_verify_client = 'off';
    }
    var  ssl_verify_depth = $("#ssl_verify_depth").val();//验证客户端证书链深度
    var  ssl_ciphers = $("#ssl_ciphers").val();//设置可支持加密套件

    $.ajax({
        url:'?c=Policy/SSL&a=addSslProfileHandle',
        type:'post',
        data:{
            id:id,
            name:name,
            ssl:ssl,
            ssl_crl:ssl_crl,
            ssl_session_ticket_key:ssl_session_ticket_key,
            ssl_cert:ssl_cert,
            ssl_cert_key:ssl_cert_key,
            ssl_client_cert:ssl_client_cert,
            ssl_trusted_cert:ssl_trusted_cert,
            ssl_session_tickets:ssl_session_tickets,
            ssl_session_cache:ssl_session_cache,
            ssl_session_timeout:ssl_session_timeout,
            ssl_verify_client:ssl_verify_client,
            ssl_verify_depth:ssl_verify_depth,
            ssl_ciphers:ssl_ciphers,
            flag:tag
        },
        success: function (data){
            if(data == 0){
                $("#ssl_window_div").window("close");
                datagridReload("ssl");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//SSLclient删除功能
function deleteSsl(){
    deleteAgent('ssl','proxy ssl_client_profile','','del');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#ssl').datagrid('getChecked');
                var ids = [];
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].id);
                }
                    ids = ids.join('#');
                    $.ajax({
                        url: "?c=Policy/SSL&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:ids,
                            act:'del',
                            mod:'proxy ssl_client_profile',
                            delKey:'id'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("ssl");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
            }
        })*/
}

//SSLclient清空功能
function clearSsl(){
    cleanAgent('ssl','proxy ssl_client_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/SSL&a=clean&mod="+encodeURI('proxy ssl_client_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("ssl");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}
function setSsl(){
    linkButton('ssl');
/*    var crows = $('#ssl').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

//ldap_profile
function addLdap(){
    tagldap = 1;
    if ($('#ldap_window_div').length <= 0) {
        $(document.body).append("<div id='ldap_window_div' class='ngtos_window_600'></div>");
    }
    open_window('ldap_window_div','Policy/LDAP','windowShow&w=policy_ldap_window',$LANG.ADD);
}

function addLdapProfile(tag){
    var id = $("#id").val();
    var proxy_name = $("#proxy_name").val();
    $.ajax({
        url: "?c=Policy/LDAP&a=addLdapProfileHandle",
        type: 'POST',
        data:{
            id:id,
            proxy_name:proxy_name,
            flag:tag
        },
        success: function(data){
            if(data == 0){
                $("#ldap_window_div").window("close");
                datagridReload("ldap");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//LDAP删除功能
function deleteLdap(){
            deleteAgent('ldap','proxy ldap_profile')
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#ldap').datagrid('getChecked');
                var ids = [];
                for(var i=0; i<rows.length; i++){
                    ids.push(rows[i].id);
                }
                    ids = ids.join('#');
                    $.ajax({
                        url: "?c=Policy/LDAP&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:ids,
                            delKey:'id',
                            mod:'proxy ldap_profile'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("ldap");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
            }
        })*/
}
//LDAP清空功能
function clearLdap(){
    cleanAgent('ldap','proxy ldap_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/LDAP&a=clean&mod="+encodeURI('proxy ldap_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("ldap");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}
function setLdap(){
    linkButton('ldap');
/*    var crows = $('#ldap').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

//radius_profile
function addRadius(){
    tagradius = 1;
    if ($('#radius_window_div').length <= 0) {
        $(document.body).append("<div id='radius_window_div' class='ngtos_window_600'></div>");
    }
    open_window('radius_window_div','Policy/RADIUS','windowShow&w=policy_radius_window',$LANG.ADD);
}
function editRadiusRow(){
    var rowData=$('#radius').datagrid('getSelections');
    if(rowData.length ==1)
        editRadius(rowData[0].id,rowData[0].proxy_name,rowData[0].radius_dictpath,rowData[0].radius_key,rowData[0].radius_dictname);
    else
        return;
}
function editRadius(id,proxy_name,radius_dictpath,radius_key,radius_dictname){
    tagradius = 2;
    if ($('#radius_window_div').length <= 0) {
        $(document.body).append("<div id='radius_window_div' class='ngtos_window_600'></div>");
    }
    param[0] = id;
    param[1] = proxy_name;
    param[2] = radius_dictpath;
    param[3] = radius_key;
    param[4] = radius_dictname;
    open_window('radius_window_div','Policy/RADIUS','windowShow&w=policy_radius_window',$LANG.EDIT);
}
function addRadiusProfile(tag){
    var id = $("#id").val();
    var proxy_name = $("#proxy_name").val();
    var radius_dictpath = $("#radius_dictpath").val();
    var radius_key = $("#radius_key").val();
    var radius_dictname = $("#radius_dictname").val();
    $.ajax({
        url: "?c=Policy/RADIUS&a=addRadiusProfileHandle",
        type: 'POST',
        data:{
            id:id,
            proxy_name:proxy_name,
            radius_dictpath:radius_dictpath,
            radius_key:radius_key,
            radius_dictname:radius_dictname,
            flag:tag
        },
        success: function(data){
            if(data == 0){
                $("#radius_window_div").window("close");
                datagridReload("radius");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//Radius删除功能
function deleteRadius(){
    deleteAgent('radius','proxy radius_profile');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#radius').datagrid('getChecked');
                for(var i=0; i<rows.length; i++){
                    $.ajax({
                        url: "?c=Policy/RADIUS&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:rows[i].id,
                            delKey:'id',
                            mod:'proxy radius_profile'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("radius");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
            }
        })*/
}
//Radius清空功能
function clearRadius(){
    cleanAgent('radius','proxy radius_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/RADIUS&a=clean&mod="+encodeURI('proxy radius_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("radius");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}
function setRadius(){
    linkButton('radius');
/*    var crows = $('#radius').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

//tacacs_plus_profile
function addTacacs(){
    tagtacacs = 1;
    if ($('#tacacs_window_div').length <= 0) {
        $(document.body).append("<div id='tacacs_window_div' class='ngtos_window_600'></div>");
    }
    open_window('tacacs_window_div','Policy/TACACS','windowShow&w=policy_tacacs_window',$LANG.ADD);
}
function editTacacsRow(){
    var rowData=$('#tacacs').datagrid('getSelections');
    if(rowData.length ==1)
        editTacacs(rowData[0].id,rowData[0].proxy_name,rowData[0].tacacs_key);
    else
        return;
}
function editTacacs(id,proxy_name,tacacs_key){
    tagtacacs = 2;
    if ($('#tacacs_window_div').length <= 0) {
        $(document.body).append("<div id='tacacs_window_div' class='ngtos_window_600'></div>");
    }
    param[0] = id;
    param[1] = proxy_name;
    param[2] = tacacs_key;
    open_window('tacacs_window_div','Policy/TACACS','windowShow&w=policy_tacacs_window',$LANG.EDIT);
}
function addTacacsProfile(tag){
    var id = $("#id").val();
    var proxy_name = $("#proxy_name").val();
    var tacacs_key = $("#tacacs_key").val();
    $.ajax({
        url: "?c=Policy/TACACS&a=addTacacsProfileHandle",
        type: 'POST',
        data:{
            id:id,
            proxy_name:proxy_name,
            tacacs_key:tacacs_key,
            flag:tag
        },
        success: function(data){
            if(data == 0){
                $("#tacacs_window_div").window("close");
                datagridReload("tacacs");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//删除TACACS功能
function deleteTacacs(){
    deleteAgent('tacacs','proxy tacacs_plus_profile');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#tacacs').datagrid('getChecked');
                for(var i=0; i<rows.length; i++){
                    $.ajax({
                        url: "?c=Policy/TACACS&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:rows[i].id,
                            delKey:'id',
                            mod:'proxy tacacs_plus_profile'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("tacacs");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
            }
        })*/
}

//清空TACACS功能
function clearTacacs(){
    cleanAgent('tacacs','proxy tacacs_plus_profile');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/TACACS&a=clean&mod="+encodeURI('proxy tacacs_plus_profile'),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("tacacs");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}
function setTacacs(){
    linkButton('tacacs');
/*    var crows = $('#tacacs').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

//proxy_profile
function addProxy(){
    tagproxy = 1;
    if ($('#proxy_window_div').length <= 0) {
        $(document.body).append("<div id='proxy_window_div' class='ngtos_window_600'></div>");
    }
    open_window('proxy_window_div','Policy/Proxy','windowShow&w=policy_proxy_window',$LANG.ADD);
}
function editProxyRow(){
    var rowData=$('#proxy').datagrid('getSelections');
    if(rowData.length ==1)
        editProxy(rowData[0].id,rowData[0].proxy_ip,rowData[0].proxy_port,rowData[0].mode,rowData[0].server_ip,rowData[0].server_port,rowData[0].l7_profile,rowData[0].ssl_profile);
    else
        return;
}
function editProxy(id,proxy_ip,proxy_port,mode,server_ip,server_port,l7_profile,ssl_profile){
    tagproxy = 2;
    if ($('#proxy_window_div').length <= 0) {
        $(document.body).append("<div id='proxy_window_div' class='ngtos_window_600'></div>");
    }
    param[0] = id;
    param[1] = proxy_ip;
    param[2] = proxy_port;
    param[3] = mode;
    param[4] = server_ip;
    param[5] = server_port;
    param[6] = l7_profile;
    param[7] = ssl_profile;
    open_window('proxy_window_div','Policy/Proxy','windowShow&w=policy_proxy_window',$LANG.EDIT);
}
function addProxyProfile(tag){
    var id = $("#id").val();
    var l7_profile = $("#l7_profile").combobox('getValue');
    var proxy_ip = $("#proxy_ip").combobox('getValue');
    var proxy_port = $("#proxy_port").val();
    var mode = $("#mode").combobox('getValue');
    var server_port = $("#server_port").val();
    var server_ip = $("#server_ip").combobox('getValue');
    var ssl_profile = $("#ssl_profile").combobox('getValues');
    $.ajax({
        url: "?c=Policy/Proxy&a=addProxyHandle",
        type: 'POST',
        data:{
            id:id,
            l7_profile:l7_profile,
            proxy_ip:proxy_ip,
            proxy_port:proxy_port,
            mode:mode,
            server_port:server_port,
            server_ip:server_ip,
            ssl_profile:ssl_profile,
            flag:tag
        },
        success: function(data){
            if(data == 0){
                $("#proxy_window_div").window("close");
                datagridReload("proxy");
            }else{
                ngtosPopMessager("error", data);
            }
        }
    });
}
//删除代理策略功能
function deleteProxy(){
    deleteAgent('proxy','proxy policy');
/*        ngtosPopMessager("confirm", $LANG.SURE_DEL_SELECT,function(r){
            if(r){
                var rows=$('#proxy').datagrid('getChecked');
                for(var i=0; i<rows.length; i++){
                    $.ajax({
                        url: "?c=Policy/Proxy&a=del",
                        type: 'POST',
                        dataType: 'text',
                        async:false,
                        data:{
                            delItems:rows[i].id,
                            delKey:'id',
                            mod:'proxy policy'
                        },
                        success: function(data){
                            if(data=='0'){
                                datagridReload("proxy");
                            }else{
                                ngtosPopMessager("error", data);
                            }
                        }
                    });
                }
            }
        })*/
}

//清空代理策略功能
function clearProxy(){
    cleanAgent('proxy','proxy policy');
/*    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/Proxy&a=clean&mod="+encodeURI('proxy policy '),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload("proxy");
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);*/
}
function setProxy(){
    linkButton('proxy');
/*    var crows = $('#proxy').datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }*/
}

//安全策略代理中的删除方法
/*
*   id 需要删除的列表的id
*   mod 需要删除的列表中的命令
*   delKey 需要删除的列表中的识别符
*   act 需要删除的列表中的action
* */
function deleteAgent(id,mod,delKey,act){
    if(!delKey || delKey == ''){
        delKey = 'id'
    }
    if(!act){
        act = 'delete';
    }
    ngtosPopMessager("confirm", $LANG.DELETE_IT,function(r){
        if(r){
            var rows=$('#'+id).datagrid('getChecked');
            var ids = [];
            for(var i=0; i<rows.length; i++){
                ids.push(rows[i].id);
            }
                ids = ids.join('#');
                $.ajax({
                    url: "?c=Policy/Proxy&a=del",
                    type: 'POST',
                    dataType: 'text',
                    async:false,
                    data:{
                        delItems:ids,
                        delKey:delKey,
                        mod:mod,
                        act:act
                    },
                    success: function(data){
                        if(data=='0'){
                            datagridReload(id);
                        }else{
                            ngtosPopMessager("error", data);
                        }
                    }
                });
        }
    })
}
//安全策略代理中的清空方法
/*
 * id 需要删除的列表的id
 * mod 需要删除的列表的命令
 */
function cleanAgent(id,mod){
    ngtosPopMessager("confirm", $LANG.SURE_CLEAR_ALL,function(r){
        if(r){
            $.ajax({
                url: "?c=Policy/Proxy&a=clean&mod="+encodeURI(mod),
                type: 'POST',
                success: function(data){
                    if(data=='0'){
                        datagridReload(id);
                    }else{
                        ngtosPopMessager("error", data);
                    }
                }
            });
        }
    },true);
}

//控制按钮隐藏和显示的方法
/*
* id 控制显示和隐藏按钮的列表的id值
* */
function linkButton(id){
    var crows = $('#'+id).datagrid('getChecked');

    if (crows.length == 1) {
        $('#icon-edit').linkbutton('enable');
    } else {
        $('#icon-edit').linkbutton('disable');
    }

    if (crows.length > 0) {
        $('#icon-delete').linkbutton('enable');
    } else {
        $('#icon-delete').linkbutton('disable');
    }
}
