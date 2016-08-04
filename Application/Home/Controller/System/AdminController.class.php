<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class AdminController extends CommonController {
    public function pwd_set() {
        $rspString = parseResponse(getResponse('system password-complexity', "show", '', 1));
        $pwdExplain = $rspString['password_complexity'];
        $pwdStat = $pwdExplain;
        $pwdStatText = $pwdStat == 'high' ? L('HIGH') : ($pwdStat == 'low' ? L('LOW') : L('LN'));
        if ($pwdExplain == 'medium')
            $pwdExplain = L('PWD_STRENGTH_DESC_MEDIUM');
        else if ($pwdExplain == 'low')
            $pwdExplain = L('PWD_STRENGTH_DESC_LOW');
        else if ($pwdExplain == 'high')
            $pwdExplain = L('PWD_STRENGTH_DESC_HIGH');
        $this->assign('pwdStatText',$pwdStatText);
        $this->assign('pwdExplain',$pwdExplain);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/system_pwd_set');

		return;
    }
    //rest方法的修改密码的方法
    public function edit(){
        //获取前台传过来的数据
        parse_str(file_get_contents('php://input'),$dataArr);
        if ($dataArr['old_password'])
            $param['old-password'] = $dataArr['old_password'];
        if ($dataArr['new_pwd'])
            $param['new-password'] = $dataArr['new_pwd'];
        if ($dataArr['repeat'])
            $param['new-repeat'] = $dataArr['repeat'];
        $config['modules'] = 'password';
        $config['action'] = '';
        $config['param'] = $param;
        echo sendRequestSingle($config);
        return;
    }
/*    public function pwd_setsave() {
        if ($_POST['old_password'])
            $param['old-password'] = formatpost($_POST['old_password']);
        if ($_POST['new_pwd'])
            $param['new-password'] = formatpost($_POST['new_pwd']);
        if ($_POST['repeat'])
            $param['new-repeat'] = formatpost($_POST['repeat']);
	        $config['modules']='password';
	        $config['action']='';
	        $config['param']=$param;
			echo sendRequestSingle($config);
	    return;
    }*/
//管理员
	function admin_show() {
		$pri = getPrivilege("privilege");
		$admin = getPrivilege("admin");
		$threeman = getLicense(0,"THREEMAN");
        $device = getPrivilege("device-maintenance");
		$vr_switch = getLicense(0, "VSYS");
		require_once APP_PATH . 'Home/Common/menupage.php';
		$this->assign("vr_switch",$vr_switch);
		$this->assign("pri",$pri);
		$this->assign("admin",$admin);
		$this->assign("threeman",$threeman);
        $this->assign("device",$device);
		if ($_GET["tab"]==1) {
			$this->display("Default/system_admin_limit");
		} else if($_GET["tab"]==2) {
			$rspString = getResponse('system admin-auth-policy', "show", '', 1);
			$rspString = $rspString = parseResponseDatagrid($rspString, 0);
			if (is_numeric($rspString) && $rspString == 0) {
			} else if (is_array($rspString)) {
				$password_complexity = $rspString['rows'][0]['password_complexity'];
				$anti_crack = $rspString['rows'][0]['anti_crack'];
				$maxnum_auth_fail = $rspString['rows'][0]['maxnum_auth_fail'];
				$account_locked_time = $rspString['rows'][0]['account_locked_time'];
				$maxnum_admin_online = $rspString['rows'][0]['maxnum_admin_online'];
				$maxnum_same_admin_online = $rspString['rows'][0]['maxnum_same_admin_online'];
				$maxnum_type_webui = $rspString['rows'][0]['maxnum_type_webui'];
				$maxnum_type_ssh = $rspString['rows'][0]['maxnum_type_ssh'];
				$maxnum_type_telnet = $rspString['rows'][0]['maxnum_type_telnet'];
				$first_login = $rspString['rows'][0]['first_login'];
                $passwd_period = $rspString['rows'][0]['passwd_period'];
                $auth_method = $rspString['rows'][0]['auth_method'];
                $server_name = $rspString['rows'][0]['server_name'];
                $shift_local_auth = $rspString['rows'][0]['shift_local_auth'];
			} else if (is_string($rspString)) {
				$retError = showError($rspString);
			}
			$this->assign("password_complexity",$password_complexity);
			$this->assign("anti_crack",$anti_crack);
			$this->assign("maxnum_auth_fail",$maxnum_auth_fail);
			$this->assign("account_locked_time",$account_locked_time);
			$this->assign("maxnum_admin_online",$maxnum_admin_online);
			$this->assign("first_login",$first_login);
			$this->assign("maxnum_type_webui",$maxnum_type_webui);
			$this->assign("maxnum_type_ssh",$maxnum_type_ssh);
			$this->assign("maxnum_type_telnet",$maxnum_type_telnet);
			$this->assign("first_login",$first_login);
            $this->assign("passwd_period",$passwd_period);
			$this->assign("maxnum_same_admin_online",$maxnum_same_admin_online);
			$this->assign("auth_method",$auth_method);
			$this->assign("server_name",$server_name);
                        $this->assign("shift_local_auth",$shift_local_auth);
			$this->display('Default/system_admin_set');
		} else {
			$this->display('Default/system_administrator_show');
		}
		return;
	}

/*	function adminJsondata() {
		$rspString = getResponse('system admin', "show", 1);
		echo parseResponseDatagrid($rspString);
	}*/
/*	function onlineAdminJsondata() {
		if ($_GET['type'] == 1)
			$rspString = getResponse('system admin', "online", $param, 1);
		else
			$rspString = getResponse('system admin', "online", $param, 0);
		echo parseResponseDatagrid($rspString);
	}*/
//管理员->添加数据
	function windowAdmin() {
        $rspString = getResponse('system password-complexity', "show", "", 0);
        if (is_numeric($rspString)) {
            $this->assign('error', L('GET_PWD_COMPLEX_FAIL'));
        } else if (substr($rspString, 0, 5) == "error") {
            $this->assign('error', substr($rspString, 0, 5));
        } else {
            $rs = simpleXml2Array($rspString);
            $complexity = $rs['password_complexity'];
            $this->assign('complexity', $complexity);
        }
        $pri = getPrivilege("privilege");
        $admin = getPrivilege("admin");
        $vr_switch = getLicense(0, "VSYS");
        $this->assign("pri",$pri);
        $this->assign("admin",$admin);
        $this->assign("vr_switch",$vr_switch);
        $this->display('Window/system_admin_add');
	}

	function vsysData(){
		$rspString = getResponse('network vsys', 'show', '', 0);
		$rspString =  parseResponseDatagrid($rspString,0);
            array_shift($rspString['rows']);
            $i=0;
            foreach($rspString['rows'] as $k=>$v) {
                $ret[$k]['text'] = $v['vsys_name'];
                if ($i == 0) {
                    $ret[$k]['selected'] = true;
                    $i++;
                }
            }
            if($ret == null || $ret == "") {
                $ret[0]['text'] = "";
            }
            echo json_encode($ret);
	}
	function adminLimitJsondata() {
		$rspString = getResponse('system privilege map', "show", $param, 0);
		$rspString = parseResponseDatagrid($rspString,0);
            foreach($rspString['rows'] as $k=>$v){
                $ret[$k]['text'] = $v['map_name'];
            }
            echo json_encode($ret);
	}
	function adminEditsave() {
		$pwdedit = 'ok';
		$mapedit = 'ok';
		if (formatpost($_POST['mode_type']) == '1' || formatpost($_POST['mode_type']) == '3') {
			  $config['modules'] = "system admin";   //模块名
			  $config['action'] = "modify-info";              //操作名称
			  $config['note'] = "info"; 
			if ($_POST['name'])
				$config['param']['name'] = formatpost($_POST['name']);
			if ($_POST['passwd'])
				$config['param']['passwd'] = formatpost($_POST['passwd']);
			if ($_POST['comment'] != '')
				$config['param']['comment'] = formatpost($_POST['comment']);
			else
				$config['param']['comment'] = '\' \'';
			$pwdedit = sendRequestSingle($config);
		}
		if (formatpost($_POST['mode_type']) == '2' || formatpost($_POST['mode_type']) == '3') {
				unset($config);
				$config['modules'] = "system admin";
				$config['action'] = "modify-priv";
				$config['note'] = "priv"; 
				$config['param'] = array();
				$config['param']['admin-name'] = formatpost($_POST['name']);
				if ($_POST['map_name'] != '')
					$config['param']['map-name'] = formatpost($_POST['map_name']);
				else
					$config['param']['map-name'] = 'none';
				$config['param']['status'] = formatpost($_POST['status']);
				//$rspString = getResponse('system admin', 'modify-priv', $param, 2);
				$mapedit = sendRequestSingle($config);
		}
		if ($pwdedit == 'ok' && $mapedit == 'ok') {
			echo '0';
		} else {
			$pwdedit = ($pwdedit == 'ok') ? '' : $pwdedit;
			$mapedit = ($mapedit == 'ok') ? '' : $mapedit;
			$msg = $pwdedit . ' ' . $mapedit;
			echo $msg;
		}
		exit;
	}
//管理员->编辑
	function adminAddsave() {
		$config['modules'] = "system admin";
		$config['action'] = "add";
		$config['note'] = "add"; 
		if ($_POST['name'])
			$config['param']['name'] = formatpost($_POST['name']);
		if ($_POST['passwd'])
			$config['param']['passwd'] = formatpost($_POST['passwd']);
		if ($_POST['comment'])
			$config['param']['comment'] = formatpost($_POST['comment']);
		if ($_POST['vsys_name'])
			$config['param']['vsys-name'] = formatpost($_POST['vsys_name']);
		$rspString = sendRequestSingle($config);
		if (is_numeric($rspString) && $rspString == 0) {
			unset($config);
			$config['modules'] = "system admin";
			$config['action'] = "modify-priv";
			$config['note'] = "priv"; 
			if ($_POST['map_name'] == '') {
				echo '0';
				exit;
			}
			if ($_POST['name'] != '')
				$config['param']['admin-name'] = formatpost($_POST['name']);
			if ($_POST['map_name'] != '')
				$config['param']['map-name'] = formatpost($_POST['map_name']);
			echo sendRequestSingle($config);
		} else {
			echo $rspString;
		}
	}

//管理员->启用/禁用
	function adminStatus() {
		$config['modules'] = "system admin"; 
		$config['action'] = "modify-priv";
		$config['note'] = "priv";
		if ($_POST['adminname'])
			$config['param']['admin-name'] = formatpost($_POST['adminname']);
		if ($_POST['status'])
			$config['param']['status'] = formatpost($_POST['status']);
		echo sendRequestSingle($config);
	}
//管理员->强制下线
/*	function forceOnline() {
		$config['modules'] = "system admin"; 
		$config['action'] = "forced-offline";    
		$config['note'] = "offline";
		if ($_POST['userid'] != '')
			$config['param']['session-id'] = formatpost($_POST['userid']);
		echo sendRequestSingle($config);
	}*/
//管理权限
/*	function limitJsondata() {
		$rspString = getResponse('system privilege map', "show", $param, 1);
		echo parseResponseDatagrid($rspString);
	}*/
//管理权限->添加数据
	function windowLimit() {
		$rspString = getResponse('system privilege show-modules-common', "", '', 0);
		$rspString = parseResponseDatagrid($rspString, 0);
		if (is_array($rspString)) {
			for ($i = 0; $i < count($rspString['rows']); $i++) {
				$newArr[$i]['text'] = $rspString['rows'][$i]['module_name'];
				$newArr[$i]['id'] = $rspString['rows'][$i]['module_id'];
			}
		}
		$rsspString = getResponse('system privilege show-modules-root', "", '', 0);
		$rsspString = parseResponseDatagrid($rsspString, 0);
		if (is_array($rsspString)) {
			for ($i = 0; $i < count($rsspString['rows']); $i++) {
				$newVsysArr[$i]['text'] = $rsspString['rows'][$i]['module_name'];
				$newVsysArr[$i]['id'] = $rsspString['rows'][$i]['module_id'];
			}
		}
		$this->assign("newVsysArr",$newVsysArr);
		$this->assign("newArr",$newArr);
		$this->display('Window/system_limit_add');
	}
	function limitAddsave(){
		$config['modules'] = "system privilege map";
		$config['action'] = "create";             
		$config['note'] = "create";
		if ($_POST['limitname'])
			$config['param']['name'] = formatpost($_POST['limitname']);
		if ($_POST['comment'])
			$config['param']['comment'] = formatpost($_POST['comment']);
		if ($_POST['read'])
			$config['param']['r-module'] = formatpost($_POST['read']);
		if ($_POST['write'])
			$config['param']['rw-module'] = formatpost($_POST['write']);
		echo sendRequestSingle($config);
	}
	function limitEditsave() {
		$config['modules'] = "system privilege map";
		$config['action'] = "modify";
		$config['note'] = "modify";
		if ($_POST['limitname'])
			$config['param']['name'] = formatpost($_POST['limitname']);
		if ($_POST['comment']) {
			$config['param']['comment'] = formatpost($_POST['comment']);
		} else {
			$config['param']['comment'] = '\' \'';
		}
		if ($_POST['read'])

			$config['param']['r-module'] = formatpost($_POST['read']);

		if($_POST['write'])

			$config['param']['rw-module'] = formatpost($_POST['write']);
		echo sendRequestSingle($config);
	}
//  管理权限->点击查看权限
	function windowLimitShow() {
		if (isset($_COOKIE["limitname"]) && count($_COOKIE["limitname"]) > 0)
        $LimitName = $_COOKIE["limitname"];
		$editName = $_GET["editName"];
		if ($editName)
			$param['name'] = $editName;
		else {
			echo '{"rows":[],"total":"0"}';
			exit;
		}
		$rspString = getResponse('system privilege map', "show-single-common", $param, 1);
		$rspString = parseResponseDatagrid($rspString, 0);
		if (is_array($rspString)) {
			$map = $rspString['rows'][0]['privilege_map'];
			$mapArr = explode('|', $map);
			for ($i = 0; $i < (count($mapArr) - 1); $i++) {
				$moduleSingleArr = explode(':', $mapArr[$i]);
				
				$newArr[$i]['id'] = $moduleSingleArr[0];
				$newArr[$i]['text'] = $moduleSingleArr[1];
				$newArr[$i]['type'] = $moduleSingleArr[2];
			}	
		}
		$rsspString = getResponse('system privilege map', "show-single-root", $param, 1);
		$rsspString = parseResponseDatagrid($rsspString, 0);
		if (is_array($rsspString)) {
			$mapp = $rsspString['rows'][0]['privilege_map'];
			$mappArr = explode('|', $mapp);
			for ($i = 0; $i < (count($mappArr) - 1); $i++) {
				$moduleSingleArr = explode(':', $mappArr[$i]);
				
				$newRootArr[$i]['id'] = $moduleSingleArr[0];
				$newRootArr[$i]['text'] = $moduleSingleArr[1];
				$newRootArr[$i]['type'] = $moduleSingleArr[2];
			}	
		}
		$this->assign("newRootArrShow",$newRootArr);
		$this->assign("newArrShow",$newArr);
		$this->display('Window/system_limit_show');
	}
//管理权限->编辑
	function windowLimitt() {
		$editName = $_GET["editName"];
		if ($editName)
			$param['name'] = $editName;
		else {
			echo '{"rows":[],"total":"0"}';
			exit;
		}
		$editCom = $_GET["editCom"];
		$rspString = getResponse('system privilege map', "show-single-common", $param, 1);
		$rspString = parseResponseDatagrid($rspString, 0);
		if (is_array($rspString)) {
			$map = $rspString['rows'][0]['privilege_map'];
			$mapArr = explode('|', $map);
			for ($i = 0; $i < (count($mapArr) - 1); $i++) {
				$moduleSingleArr = explode(':', $mapArr[$i]);
				
				$newArr[$i]['id'] = $moduleSingleArr[0];
				$newArr[$i]['text'] = $moduleSingleArr[1];
				$newArr[$i]['type'] = $moduleSingleArr[2];
			}	
		}
		$rsspString = getResponse('system privilege map', "show-single-root", $param, 1);
		$rsspString = parseResponseDatagrid($rsspString, 0);
		if (is_array($rsspString)) {
			$maproot = $rsspString['rows'][0]['privilege_map'];
			$maprootArr = explode('|', $maproot);
			for ($i = 0; $i < (count($maprootArr) - 1); $i++) {
				$moduleSingleArr = explode(':', $maprootArr[$i]);
				
				$newVsysArr[$i]['id'] = $moduleSingleArr[0];
				$newVsysArr[$i]['text'] = $moduleSingleArr[1];
				$newVsysArr[$i]['type'] = $moduleSingleArr[2];
			}	
		}
		$this->assign("editName",$editName);
		$this->assign("editCom",$editCom);
		$this->assign("newVsysArr",$newVsysArr);
		$this->assign("newArr",$newArr);
		$this->display('Window/system_limit_add');
	}
//设置应用
	function setsave() {
		$config['modules'] = "system admin-auth-policy"; 
		$config['action'] = "set";
		$config['note'] = "set";
		if ($_POST['password_complexity'])
			$config['param']['password-complexity'] = formatpost($_POST['password_complexity']);
		if ($_POST['maxnum_auth_fail'])
			$config['param']['maxnum-auth-fail'] = formatpost($_POST['maxnum_auth_fail']);
		if ($_POST['account_locked_time'])
			$config['param']['account-locked-time'] = formatpost($_POST['account_locked_time']);
		if ($_POST['maxnum_admin_online'])
			$config['param']['maxnum-admin-online'] = formatpost($_POST['maxnum_admin_online']);
		if ($_POST['maxnum_same_admin_online'])
			$config['param']['maxnum-same-admin-online'] = formatpost($_POST['maxnum_same_admin_online']);
		if ($_POST['first_login'])
			$config['param']['first-login'] = formatpost($_POST['first_login']);
        if ($_POST['maxnum_type_passward'])
			$config['param']['password-modify-period'] = formatpost($_POST['maxnum_type_passward']);

        $config['param']['auth-method'] = ($_POST['auth_method'] == 'external') ? 'external' : 'local';
        if ($_POST['server_name'])
            $config['param']['server-name'] = formatpost($_POST['server_name']);
        if ($_POST['shift_local_auth'])
			$config['param']['shift-local-auth'] = formatpost($_POST['shift_local_auth']);
		$rspString[1] = sendRequestSingle($config);

		$config['param'] = array();
		if ($_POST['maxnum_type_webui'] != '') {
			unset($config);
			$config['modules'] = "system admin-auth-policy"; 
			$config['action'] = "set";          
			$config['note'] = "set";
			$config['param']['login-type'] = 'webui';
			$config['param']['maxnum-login'] = formatpost($_POST['maxnum_type_webui']);
			$rspString[2] = sendRequestSingle($config);
		}
		if ($_POST['maxnum_type_ssh'] != '') {
			unset($config);
			$config['modules'] = "system admin-auth-policy"; 
			$config['action'] = "set";   
			$config['note'] = "set";
			$config['param']['login-type'] = 'ssh';
			$config['param']['maxnum-login'] = formatpost($_POST['maxnum_type_ssh']);
			$rspString[3] = sendRequestSingle($config);
		}
		if ($_POST['maxnum_type_telnet'] != '') {
			unset($config);
			$config['modules'] = "system admin-auth-policy";   
			$config['action'] = "set";             
			$config['note'] = "set";
			$config['param']['login-type'] = 'telnet';
			$config['param']['maxnum-login'] = formatpost($_POST['maxnum_type_telnet']);
			$rspString[4] = sendRequestSingle($config);
		}
		$Msg = '';
		for ($i = 1; $i < 5; $i++) {
			if (is_numeric($rspString[$i]) && $rspString[$i] == 0) {
				
			} else {
				$Msg.='  ' . $rspString[$i];
			}
		}
		if ($Msg == '')
			echo '0';
		else
			echo $Msg;
	}
    function resetDefault() {
        $config['modules'] = "system admin-auth-policy";
        $config['action'] = "reset";
        $config['note'] = "reset";
        echo sendRequestSingle($config);
    }
    function adminLimitJsondataTwo() { 
        $rspString = getResponse('system privilege map', "vsys-show ", '', 0);
        $rspString = parseResponseDatagrid($rspString,0);
        foreach($rspString['rows'] as $k=>$v){
            $ret[$k]['text'] = $v['map_name'];
        }
        echo json_encode($ret);
    }
}
