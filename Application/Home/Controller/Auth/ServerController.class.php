<?php
namespace Home\Controller\Auth;
use Home\Controller\CommonController;
class ServerController extends CommonController {
    
    function localShowJsondata(){
        $rspString = getResponse("user auth server", "show", '', 0);
        $rspString = parseResponseDatagrid($rspString,0);
        if(is_array($rspString)) {
            $relist = array();
            if($_GET['type'] == "localdb") {
                foreach ( $rspString['rows'] as $v) {
                    if($v['protocol'] == 'localdb')
                        $relist[] = array('text'=>$v['server_name']);
                }
            } else if($_GET['type'] == "third") {
                foreach ( $rspString['rows'] as $v) {
                    if($v['protocol'] == 'radius' || $v['protocol'] == 'ldap' || $v['protocol'] == 'tacacs')
                        $relist[] = array('text'=>$v['server_name']);
                }
            }
            echo json_encode($relist);
        }
    }
    //认证服务器界面
    function server_info(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/auth_server_show');
    }

    //数据添加
    function serverAdd(){
        if($_POST['hid_serv_name']) $config['param']['name'] = formatpost($_POST['hid_serv_name']);
        if($_POST['hid_serv_addr']) $config['param']['host'] = formatpost($_POST['hid_serv_addr']);
        if($_POST['hid_serv_port']) $config['param']['port'] = formatpost($_POST['hid_serv_port']);
        if($_POST['server_add_tag']) $stag = formatpost($_POST['server_add_tag']);
        if($_POST['hid_serv_type']) $proto = formatpost($_POST['hid_serv_type']);
        if($proto == 'radius') {
            $config['param']['protocol'] = $proto;
            if($_POST['hid_radius_auth']) $config['param']['radius-authmode'] = formatpost($_POST['hid_radius_auth']);
            if($_POST['hid_serv_clientip'])
                $config['param']['radius-clientip'] = formatpost($_POST['hid_serv_clientip']);
            else
                $config['param']['radius-clientip'] = 'null';
            if($_POST['hid_serv_sharesecret']) $config['param']['radius-sharesecret'] = $_POST['hid_serv_sharesecret'];
            if($_POST['hid_serv_radius_max']) $config['param']['time-out'] = formatpost($_POST['hid_serv_radius_max']);
            if($_POST['hid_serv_radius_retry']) $config['param']['retry-times'] = formatpost($_POST['hid_serv_radius_retry']);
            if($_POST['hid_serv_radius_code']) $config['param']['charset'] = formatpost($_POST['hid_serv_radius_code']);
            if($_POST['hid_user_auto_add']) $config['param']['auto-add-user'] = formatpost($_POST['hid_user_auto_add']);
            if($_POST['hid_radius_charge']) $config['param']['radius-useaccount'] = formatpost($_POST['hid_radius_charge']);
            if($_POST['hid_serv_radius_sep']) $config['param']['attr-separator'] = formatpost($_POST['hid_serv_radius_sep']);
        } else if($proto == 'ldap') {
            $config['param']['protocol'] = $proto;
            if($_POST['hid_serv_ldap_dn']) $config['param']['ldap-dn'] = $_POST['hid_serv_ldap_dn'];
            if($_POST['hid_ldap_type']) $config['param']['ldap-subtype'] = formatpost($_POST['hid_ldap_type']);
            if($_POST['hid_ldap_check']) $config['param']['ldap-usequeryaccount'] = formatpost($_POST['hid_ldap_check']);
            if($_POST['hid_serv_ldap_name']) $config['param']['ldap-queryname'] = $_POST['hid_serv_ldap_name'];
            if($_POST['hid_serv_ldap_pass']) $config['param']['ldap-querypasswd'] = $_POST['hid_serv_ldap_pass'];
            if($_POST['hid_serv_ldap_filter'])
                $config['param']['ldap-filterinfo'] = $_POST['hid_serv_ldap_filter'];
            else
                $config['param']['ldap-filterinfo'] = 'null';
            if($_POST['hid_ldap_range']) $config['param']['ldap-scope'] = formatpost($_POST['hid_ldap_range']);
            if($_POST['hid_serv_ldap_max']) $config['param']['time-out'] = formatpost($_POST['hid_serv_ldap_max']);
            if($_POST['hid_serv_ldap_code']) $config['param']['charset'] = formatpost($_POST['hid_serv_ldap_code']);
            if($_POST['hid_user_auto_add']) $config['param']['auto-add-user'] = formatpost($_POST['hid_user_auto_add']);
            if($_POST['hid_serv_ldap_sep']) $config['param']['attr-separator'] = formatpost($_POST['hid_serv_ldap_sep']);
            if($_POST['hid_ldap_user']) $config['param']['attr-username'] = formatpost($_POST['hid_ldap_user']);
            if($_POST['hid_ldap_user_group']) $config['param']['attr-group'] = formatpost($_POST['hid_ldap_user_group']);
        } else if($proto == 'tacacs') {
            $config['param']['protocol'] = $proto;
            if($_POST['hid_tacacs_auth']) $config['param']['tacacs-mode'] = formatpost($_POST['hid_tacacs_auth']);
            if($_POST['hid_serv_sharesecret']) $config['param']['tacacs-key'] = $_POST['hid_serv_sharesecret'];
            if($_POST['hid_serv_tacas_max']) $config['param']['time-out'] = formatpost($_POST['hid_serv_tacas_max']);
            if($_POST['hid_serv_tacas_code']) $config['param']['charset'] = formatpost($_POST['hid_serv_tacas_code']);
            if($_POST['hid_user_auto_add']) $config['param']['auto-add-user'] = formatpost($_POST['hid_user_auto_add']);
        } else {
                if($stag == 1)
                        $config['param']['protocol'] = $proto;
        }
	
	if($stag == 1){
            $config['modules'] = "user auth server";
            $config['action'] = "add";
            $rspString = sendRequestSingle($config);
        }else{
            $config['modules'] = "user auth server";
            $config['action'] = "modify";
            $rspString = sendRequestSingle($config);
        }
//	if($proto == 'localdb') {
            if($_POST['hid_user_member']) $usermem = formatpost($_POST['hid_user_member']);
            if($_POST['hid_group_member']) $gromem = formatpost($_POST['hid_group_member']);
            if($usermem != '') {
                if($_POST['hid_init_user']) $duser = formatpost($_POST['hid_init_user']);
                if($_POST['hid_del_server']) $delserver = formatpost($_POST['hid_del_server']);
                if($duser != ''){
                    if($proto == 'localdb') {
                        $dname = explode(",", $duser);
                        $dserver = explode(",", $delserver);
                        $param['modules'] = "user auth local_user";
                        $param['action'] = "delete";
                        for($m=0;$m<count($dname);$m++) {
                            unset($param['param']);
                            if( $dname[$m] != ''){
                                $param['param']['server-name'] = $dserver[$m];
                                $param['param']['name'] = $dname[$m];
                                $rspString = sendRequestSingle($param);
                            }
                        }
                    }
                }
                $param['modules'] = "user manage user";
                $param['action'] = "modify";
                $user_name = explode(",", $usermem);
                for($j=0;$j<count($user_name);$j++) {
                    unset($param['param']);
                    $param['param']['index-key'] = 'name';
                    $param['param']['index-value'] = $user_name[$j];
                    if($_POST['hid_serv_name']) $param['param']['auth-server'] = formatpost($_POST['hid_serv_name']);
                    $rspString = sendRequestSingle($param);
                    if($stag == 1) {
                        if($proto == 'localdb') {
                            unset($config);
                            $config['modules'] = "user auth local_user";
                            $config['action'] = "add";
                            $config['param']['server-name'] = formatpost($_POST['hid_serv_name']);
                            $config['param']['passwd'] = 'topsec';
                            $config['param']['name'] = $user_name[$j];
                            $rspString = sendRequestSingle($config);
                        }
                    }
                }
                if($proto == 'localdb') {
                    unset($config);
                    $config['modules'] = "user auth server";
                    $config['action'] = "modify-policy";
                    $config['param']['first-login'] = 'yes';
                    $config['param']['global-config'] = 'no';
                    $config['param']['name'] = formatpost($_POST['hid_serv_name']);
                    $rspString = sendRequestSingle($config);
                }
             }

            if($gromem != '') {
                $config['modules'] = "user manage group";
                $config['action'] = "modify";
                $gro_name = explode(",", $gromem);
                for($k=0;$k<count($gro_name);$k++) {
                    unset($config['param']);
                    $config['param']['index-key'] = 'name';
                    $config['param']['index-value'] = $gro_name[$k];
                    if($_POST['hid_serv_name']) $config['param']['auth-server'] = formatpost($_POST['hid_serv_name']);
                    $rspString = sendRequestSingle($config);
                }
            }
            if($stag == 2){
                if($_POST['hid_del_user']) $deluser = formatpost($_POST['hid_del_user']);
                if($deluser != ''){
                    $config['modules'] = "user manage user";
                    $config['action'] = "modify";
                    $dname = explode(",", $deluser);
                    for($m=0;$m<count($dname);$m++) {
                        unset($config['param']);
                        if( $dname[$m] != '') {
                            $config['param']['index-key'] = 'name';
                            $config['param']['index-value'] = $dname[$m];
                            $config['param']['auth-server'] = 'null';
                            $rspString = sendRequestSingle($config);
                        }
                    }
                    unset($config);
                    if($proto == 'localdb') {
                        $config['modules'] = "user auth local_user";
                        $config['action'] = "delete";
                        for($m=0;$m<count($dname);$m++) {
                            unset($config['param']);
                            if( $dname[$m] != '') {
                                $config['param']['server-name'] = formatpost($_POST['hid_serv_name']);
                                $config['param']['name'] = $dname[$m];
                                $rspString = sendRequestSingle($config);
                            }
                        }
                    }
                }

                if($_POST['hid_add_user']) $adduser = formatpost($_POST['hid_add_user']);
                if($adduser != '') {
                    if($proto == 'localdb') {
                        $config['modules'] = "user auth local_user";
                        $config['action'] = "add";
                        $aname = explode(",", $adduser);

                        for($q=0;$q<count($aname);$q++) {
                            unset($config['param']);
                            if( $aname[$q] != ''){
                                $config['param']['server-name'] = formatpost($_POST['hid_serv_name']);
                                $config['param']['passwd'] = 'topsec';
                                $config['param']['name'] = $aname[$q];
                                $rspString = sendRequestSingle($config);
                            }
                        }
                    }
                }

                if($_POST['hid_del_group']) $delgro = formatpost($_POST['hid_del_group']);
                if($delgro != '') {
                    $config['modules'] = "user manage group";
                    $config['action'] = "modify";
                    $dgro = explode(",", $delgro);

                    for($n=0;$n<count($dgro);$n++) {
                        unset($config['param']);
                        if( $dgro[$n] != '') {
                            $config['param']['index-key'] = 'name';
                            $config['param']['index-value'] = $dgro[$n];
                            $config['param']['auth-server'] = 'null';
                            $rspString = sendRequestSingle($config);
                        }
                    }
                }
            }
//        }
            
        echo $rspString;
    }

    //全局认证属性设置
    function authAttrSet() {
        if ($_POST['action'] == 'local_serv_modify') {
            if ($_POST['hid_obey_global_conf'])
                $obeytag = formatpost($_POST['hid_obey_global_conf']);
            if ($_POST['hid_serv_name'])
                $param['param']['name'] = formatpost($_POST['hid_serv_name']);
            if ($obeytag == 'yes') {
                $param['param']['global-config'] = 'yes';
                $param['modules'] = 'user auth server';
                $param['action'] = 'modify-policy';
                echo sendRequestSingle($param);
                exit;
            } else
                $param['param']['global-config'] = 'no';
        }
        // whole conf
        if ($_POST['hid_cert_auth'])
            $param['param']['cert-auth'] = formatpost($_POST['hid_cert_auth']);
        if ($_POST['hid_pass_auth'])
            $param['param']['passwd-auth'] = formatpost($_POST['hid_pass_auth']);
        if ($_POST['hid_msg_auth'])
            $param['param']['sms-auth'] = formatpost($_POST['hid_msg_auth']);
        if ($_POST['hid_more_login_whole'])
            $param['param']['multi-login'] = formatpost($_POST['hid_more_login_whole']);
        if ($_POST['hid_login_num_whole'])
            $param['param']['maxnum-login-addr'] = formatpost($_POST['hid_login_num_whole']);
        if ($_POST['hid_access_ip'] != '' && $_POST['hid_access_ip'] != 'null'){
            $param['param']['access-ip-range'] = formatpost($_POST['hid_access_ip']);
            $param['param']['limit-access-ip'] = 'yes';
        } else {
            $param['param']['access-ip-range'] = 'null';
            $param['param']['limit-access-ip'] = 'no';
        }
        if ($_POST['hid_access_time'] != '' && $_POST['hid_access_time'] != 'null' ){
            $param['param']['access-time-range'] = formatpost($_POST['hid_access_time']);
            $param['param']['limit-access-time'] = 'yes';
        } else {
            $param['param']['access-time-range'] = 'null';
            $param['param']['limit-access-time'] = 'no';
        }
        //local conf_anti_crack
        if ($_POST['hid_fail_login_limit'])
            $param['param']['fail-login-limit'] = formatpost($_POST['hid_fail_login_limit']);
        if ($_POST['hid_max_auth_fail'])
            $param['param']['maxnum-auth-fail'] = formatpost($_POST['hid_max_auth_fail']);
        if ($_POST['hid_accout_lock_time'])
            $param['param']['account-locked-time'] = formatpost($_POST['hid_accout_lock_time']);
        if ($_POST['hid_pass_reset_limit'])
            $param['param']['reset-pass-limit'] = formatpost($_POST['hid_pass_reset_limit']);
        if ($_POST['hid_pass_reset_max'])
            $param['param']['maxnum-reset'] = formatpost($_POST['hid_pass_reset_max']);
        if ($_POST['hid_pass_reset_interval'])
            $param['param']['reset-pass-interval'] = formatpost($_POST['hid_pass_reset_interval']);
        if ($_POST['hid_pass_reset_type'])
            $param['param']['accept-reset-type'] = formatpost($_POST['hid_pass_reset_type']);
        //分隔命令行为两次下发，因命令行长度超过mysql日志记录的规定长度。
        if ($_POST['action'] == 'local_serv_modify'){
            $param['modules'] = 'user auth server';
            $param['action'] = 'modify-policy';
        } else {
            $param['modules'] = 'user auth global-config';
            $param['action'] = 'modify';
        }
        $resInfo = sendRequestSingle($param);
        if($resInfo != 0) {
            echo $resInfo;
            exit;
        }
        unset($param);
        if ($_POST['action'] == 'local_serv_modify') {
            $param['param']['name'] = formatpost($_POST['hid_serv_name']);
            $param['param']['global-config'] = 'no';
        }
        // local conf_Password complexity
        if ($_POST['hid_pass_diff'])
            $param['param']['diff-from-old-pass'] = formatpost($_POST['hid_pass_diff']);
        if ($_POST['hid_pass_account'])
            $param['param']['exclude-account-info'] = formatpost($_POST['hid_pass_account']);
        if ($_POST['hid_char_lower'])
            $param['param']['include-char-lower'] = formatpost($_POST['hid_char_lower']);
        if ($_POST['hid_char_upper'])
            $param['param']['include-char-upper'] = formatpost($_POST['hid_char_upper']);
        if ($_POST['hid_char_digit'])
            $param['param']['include-char-digit'] = formatpost($_POST['hid_char_digit']);
        if ($_POST['hid_char_punct'])
            $param['param']['include-char-punct'] = formatpost($_POST['hid_char_punct']);
        if ($_POST['hid_pass_limit'])
            $param['param']['limit-pass-len'] = formatpost($_POST['hid_pass_limit']);
        if ($_POST['hid_pass_min'])
            $param['param']['min-pass-len'] = formatpost($_POST['hid_pass_min']);
        if ($_POST['hid_pass_max'])
            $param['param']['max-pass-len'] = formatpost($_POST['hid_pass_max']);
        if ($_POST['hid_change_pass'])
            $param['param']['force-change-pass'] = formatpost($_POST['hid_change_pass']);

        //local conf_password_effectively
        if ($_POST['hid_deny_change'])
            $param['param']['deny-change-pass'] = formatpost($_POST['hid_deny_change']);
        if ($_POST['hid_first_login'])
            $param['param']['first-login'] = formatpost($_POST['hid_first_login']);
        if ($_POST['hid_termly_change'])
            $param['param']['termly-change-pass'] = formatpost($_POST['hid_termly_change']);
        if ($_POST['hid_pass_interval'])
            $param['param']['change-pass-interval'] = formatpost($_POST['hid_pass_interval']);
        if ($_POST['hid_pass_invalid'])
            $param['param']['invalid-password'] = formatpost($_POST['hid_pass_invalid']);
        if ($_POST['hid_invalid_period'])
            $param['param']['pass-valid-period'] = formatpost($_POST['hid_invalid_period']);

        //local conf_user_info
        if ($_POST['hid_change_mail'])
            $param['param']['deny-change-mail'] = formatpost($_POST['hid_change_mail']);
        if ($_POST['hid_change_phone'])
            $param['param']['deny-change-phone'] = formatpost($_POST['hid_change_phone']);

        //local email server set
        //if($_POST['hid_pass_reset_type'] == 'mail') {
            $param['param']['mail_server_type'] = $_POST['hid_mail_server_type'];
            $param['param']['mail_time_out'] = intval($_POST['hid_mail_time_out']);
            $param['param']['mail_server_port'] = intval($_POST['hid_mail_server_port']);
            if ($_POST['hid_mail_server_host'])
                $param['param']['mail_server_host'] = $_POST['hid_mail_server_host'];
            else
                $param['param']['mail_server_host'] = 'null';

            if ($_POST['hid_mail_server_auth_user'])
                $param['param']['mail_server_auth_user'] = $_POST['hid_mail_server_auth_user'];
            else
                $param['param']['mail_server_auth_user'] = 'null';

            if ($_POST['hid_mail_server_auth_passwd'])
                $param['param']['mail_server_auth_passwd'] = $_POST['hid_mail_server_auth_passwd'];
            else
                $param['param']['mail_server_auth_passwd'] = 'null';
        //}

        if ($_POST['action'] == 'local_serv_modify'){
            $param['modules'] = 'user auth server';
            $param['action'] = 'modify-policy';
        } else {
            $param['modules'] = 'user auth global-config';
            $param['action'] = 'modify';
        }
        echo sendRequestSingle($param);
    }

    function smsAdd(){
        $config['modules'] = "user auth sms";
        $config['action'] = "modify";
        if($_POST['hid_sms_type']) $config['param']['type'] = formatpost($_POST['hid_sms_type']);
        if($_POST['hid_sms_mode']) $config['param']['support-mode'] = formatpost($_POST['hid_sms_mode']);
        if($_POST['hid_sms_ip']) $config['param']['ip'] = formatpost($_POST['hid_sms_ip']);
        if($_POST['hid_sms_port']) $config['param']['port'] = formatpost($_POST['hid_sms_port']);
        if($_POST['hid_sms_id']) $config['param']['id'] = formatpost($_POST['hid_sms_id']);
        if($_POST['hid_sms_len']) $config['param']['passwd-length'] = formatpost($_POST['hid_sms_len']);
        if($_POST['hid_sms_invalid']) $config['param']['validtime'] = formatpost($_POST['hid_sms_invalid']);
        if($_POST['hid_sms_err']) $config['param']['error-count'] = formatpost($_POST['hid_sms_err']);
        if($_POST['hid_sms_share']) $config['param']['share-secret'] = formatpost($_POST['hid_sms_share']);
        if($_POST['hid_sms_timeout']) $config['param']['timeout'] = formatpost($_POST['hid_sms_timeout']);
        if($_POST['hid_sms_content_req']) $config['param']['passwd-type'] = formatpost($_POST['hid_sms_content_req']);
        if($_POST['hid_sms_info']) $config['param']['info'] = formatpost($_POST['hid_sms_info']);
        echo sendRequestSingle($config);
    }

    //同步设置数据
    function modifySync(){
        if($_POST['sname']) $config['param']['server-name'] = formatpost($_POST['sname']);
        if($_POST['hid_sync_type']) $config['param']['sync-type'] = formatpost($_POST['hid_sync_type']);
        if($_POST['hid_sync_interval']) $config['param']['time-interval'] = formatpost($_POST['hid_sync_interval']);
        if($_POST['hid_query_name']) $config['param']['ldap-queryname'] = $_POST['hid_query_name'];
        if($_POST['hid_query_pass']) $config['param']['ldap-querypasswd'] = $_POST['hid_query_pass'];
        if($_POST['hid_sync_user']) $config['param']['sync-user'] = formatpost($_POST['hid_sync_user']);
        if($_POST['hid_user_filter']) $config['param']['user-filter'] = $_POST['hid_user_filter'];
        if($_POST['hid_sync_group']) $config['param']['sync-group'] = formatpost($_POST['hid_sync_group']);
        if($_POST['hid_group_filter']) $config['param']['group-filter'] = $_POST['hid_group_filter'];
        if($_POST['hid_par_group']) $config['param']['father-groupname'] = formatpost($_POST['hid_par_group']);
        if($_POST['hid_pre_group']) $config['param']['prefix-name'] = formatpost($_POST['hid_pre_group']);
        $config['modules'] = "user auth server-sync";
        $config['action'] = "modify";

        $rspString = sendRequestSingle($config);
        unset($config);
        if(is_numeric($rspString) && $rspString == 0) {
            if($_POST['sname']) $config['param']['server-name'] = formatpost($_POST['sname']);
            $config['modules'] = "user auth server-sync";
            $config['action'] = "run";
            echo  sendRequestSingle($config);
        }else{
            echo $rspString;
        }
    }

    //认证数据设置
    function wholeServModify(){
        $config['modules'] = "user auth server";
        $config['action'] = "modify-policy";
        if($_POST['hid_obey_global_conf']) $obeytag = formatpost($_POST['hid_obey_global_conf']);
        if($obeytag == 'yes') {
            $config['param']['global-config'] = 'yes';
            if($_POST['hid_serv_name']) $config['param']['name'] = formatpost($_POST['hid_serv_name']);
        } else {
            unset($config['param']);
            $config['param']['global-config'] = 'no';
            if($_POST['hid_serv_name']) $config['param']['name'] = formatpost($_POST['hid_serv_name']);
            if($_POST['hid_cert_auth']) $config['param']['cert-auth'] = formatpost($_POST['hid_cert_auth']);
            if($_POST['hid_pass_auth']) $config['param']['passwd-auth'] = formatpost($_POST['hid_pass_auth']);
            if($_POST['hid_msg_auth']) $config['param']['sms-auth'] = formatpost($_POST['hid_msg_auth']);
            if($_POST['hid_more_login_whole']) $config['param']['multi-login'] = formatpost($_POST['hid_more_login_whole']);
            if($_POST['hid_login_num_whole']) $config['param']['maxnum-login-addr'] = formatpost($_POST['hid_login_num_whole']);

            if ($_POST['hid_access_ip'] != '' && $_POST['hid_access_ip'] != 'null'){
                $config['param']['access-ip-range'] = formatpost($_POST['hid_access_ip']);
                $config['param']['limit-access-ip'] = 'yes';
            } else {
                $config['param']['access-ip-range'] = 'null';
                $config['param']['limit-access-ip'] = 'no';
            }
            if ($_POST['hid_access_time'] != '' && $_POST['hid_access_time'] != 'null' ){
                $config['param']['access-time-range'] = formatpost($_POST['hid_access_time']);
                $config['param']['limit-access-time'] = 'yes';
            } else {
                $config['param']['access-time-range'] = 'null';
                $config['param']['limit-access-time'] = 'no';
            }

	    }
        echo sendRequestSingle($config);
    }

    function userGroupJson() {
        $hrspString = getResponse("user manage user", "show all", '', 0);
        $grspString = getResponse("user manage group", "show all", '', 0);

        if(is_numeric($hrspString) && is_numeric($grspString)) {
            echo '{"rows":[],"total":"0"}';
        } else {
            $name = urldecode($_GET['name']);
            $sum_arr = array();
            $userArr = parseResponseDatagrid($hrspString, 0);
            $groupArr = parseResponseDatagrid($grspString, 0);

            if($userArr['rows'][0])
                $sum_arr = array_merge_recursive($sum_arr, $userArr);
            if($groupArr['rows'][0])
                $sum_arr = array_merge_recursive($sum_arr, $groupArr);

            $arrName = '';
            foreach($sum_arr['rows'] as $items){
                if($items['auth_server'] == $name) {
                    $arrName = $arrName . $items['name'] . ',';
                }
            }
            $str_name = explode(",", $arrName);
            $subtree_arr = array();
            for($j=0;$j<count($str_name);$j++) {
                $subtree_arr[$j]['name'] = $str_name[$j];
            }
            $subtreeArr = array();
            $subtreeArr['rows'] = $subtree_arr;
            echo json_encode($subtreeArr);
        }
    }
}
?>