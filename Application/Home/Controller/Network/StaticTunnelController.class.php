<?php
namespace Home\Controller\Network;
use Think\Controller;
class StaticTunnelController extends Controller{
	public function TunnelInfo(){
		
            require_once APP_PATH . 'Home/Common/menupage.php';	
            $this->display('Default/network_tunnel_static_show');
	}

	function showalldata(){

            if($_REQUEST['rows'] && $_REQUEST['page']) {
                
                if(formatpost($_REQUEST['page'])=="1"){
                        $param['begin']=1;
                }else{
                        $param['begin']=($_REQUEST['page']-1)*$_REQUEST['rows'];
                }
            }
            if($_REQUEST['rows']) $param['end'] = $param['begin'] + $_REQUEST['rows'];
            $rspString = getResponse("vpn tunnel", "showrange", $param, 2);
            $rspString = handleGetResponse($rspString,0);

            if(is_array($rspString)){
                
                if($rspString['total'] == 0){

                    echo '{"rows":[],"total":"0"}';

                }else{

                    $servTreeArr = array();
                    $totalItems = array();
                    foreach($rspString['rows'] as $i=>$items){
                            $servTreeArr[$i] = $items;
                    }
                    $totalItems['rows'] = $servTreeArr;
                    $totalItems['page']['page']= $rspString['page']['page'];
                    $totalItems['page']['count'] = $rspString['page']['count'];
                    $totalItems['page']['total']= $rspString['rows']['total'];
                    echo json_encode($totalItems);
                }
            }
            else if(is_string($rspString))
            {
                    echo '{"rows":[],"total":"0"}';

            }
	}

	function getsingle(){
		
            $rspString = getResponse("vpn default", "webuiget", '', 1);
            if (is_numeric($rspString) && $rspString == 0) {
                $retArray['type'] = 0;
                $retArray['info'] = "读取数据失败";
            } else if (is_numeric($rspString) && $rspString < 0) {
                $retArray['type'] = 1;
                if ($rspString == -102502) {
                    $retArray['info'] = "登录超时，请重新登录!";
                } else {
                    $retArray['info'] = getErrorInfo($rspString);
                }
            } else if (substr($rspString, 0, 5) == "error") {
                $retArray['type'] = 2;
                $retArray['info'] = substr(strstr($rspString, ":"), 1);
            } else {
                $retArray = handleGetResponse($rspString,0);
            }
            echo json_encode($retArray);
	}
//添加弹出框
	function addWindow(){
            
            require_once APP_PATH . 'Home/Common/menupage.php';	
            $this->display('Window/network_tunnel_add_window');
	}
//添加数据
	function saveadd(){
		
            $floag = $_POST['tag'];
            if ($_POST['name'])
                $config['param']['name'] = formatpost($_POST['name']);
            if ($_POST['description'])
                $config['param']['description'] = formatpost($_POST['description']);
            if ($_POST['treaty'] == 'gmneg_gj' && $_POST['negomode'] == '1') {
                $config['param']['authmode'] = 'psk';
            } else {
                $config['param']['authmode'] = 'rsasig';
            }
            if($_POST['treaty'] == 'gmneg_gm'){
                $config['param']['negomode'] = 'main';
            }else{
                if ($_POST['ike_policy'] == 'main_mode') {
                    $config['param']['negomode'] = 'main';
                } else {
                    $config['param']['negomode'] = 'aggressive';
                }
            }
            if($floag == 2){
                if ($_POST['localid'] == "必须包含@" || $_POST['localid'] == ' ') {
                    $config['param']['localid'] = 'null';
                }else{
                    $config['param']['localid'] = formatpost($_POST['localid']);
                }            
            }else{
                if ($_POST['localid'] != "必须包含@") {
                    $config['param']['localid'] = formatpost($_POST['localid']);
                }
            }        

            if (strpos(formatpost($_POST['network_localsub_cid']), ":") > 0) {
                if($_POST['network_localsub_yid']){
                    $config['param']['localsubnet'] = formatpost($_POST['network_localsub_cid']) . '/' . formatpost($_POST['network_localsub_yid']);
                }else{
                    $config['param']['localsubnet'] = formatpost($_POST['network_localsub_cid']) . '/' . 0;
                }            
            } else if (strpos(formatpost($_POST['network_localsub_cid']) , ".")> 0){
               $config['param']['localsubnet'] = formatpost($_POST['network_localsub_cid']);
                if ($_POST['network_localsub_yid']){
                    if (strpos(formatpost($_POST['network_localsub_yid']), ".") > 0){
                        $config['param']['localsubmask'] = formatpost($_POST['network_localsub_yid']);
                    }else{
                        $mask = $_POST['network_localsub_yid'];
                        $mask = 0xffffffff << (32 - $mask);
                        $mask = long2ip($mask);
                        $config['param']['localsubmask'] = $mask;
                    }               
                } else {
                    $config['param']['localsubmask'] = '0.0.0.0';
                }            
            }else{
                if(strpos(formatpost($_POST['network_peersub_cid']), ":") > 0){
                    $$config['param']['localsubnet'] = '::/0';
                }else{
                   $config['param']['localsubnet'] = '0.0.0.0';
                   $config['param']['localsubmask'] = '0.0.0.0';
                }
            }

            if (strpos(formatpost($_POST['network_peersub_cid']), ":") > 0) {
                if($_POST['network_peersub_yid']){
                    $config['param']['peersubnet'] = formatpost($_POST['network_peersub_cid']) . '/' . formatpost($_POST['network_peersub_yid']);
                }else{
                    $config['param']['peersubnet'] = formatpost($_POST['network_peersub_cid']) . '/' . 0;
                }            
            } else if (strpos(formatpost($_POST['network_peersub_cid']) , ".")> 0){
                $config['param']['peersubnet'] = formatpost($_POST['network_peersub_cid']);
                if ($_POST['network_peersub_yid']){
                    if (strpos(formatpost($_POST['network_peersub_yid']), ".") > 0){
                        $config['param']['peersubmask'] = formatpost($_POST['network_peersub_yid']);
                    }else{
                        $mask = $_POST['network_peersub_yid'];
                        $mask = 0xffffffff << (32 - $mask);
                        $mask = long2ip($mask);
                        $config['param']['peersubmask'] = $mask;
                    }               
                } else {
                    $config['param']['peersubmask'] = '0.0.0.0';
                }            
            }else{
                if(strpos(formatpost($_POST['network_localsub_cid']), ":") > 0){
                   $config['param']['peersubnet'] = '::/0';
                }else{
                    $config['param']['peersubnet'] = '0.0.0.0';
                    $config['param']['peersubmask'] = '0.0.0.0';
                }
            }

            if ($_POST['peersubnet'])
                $config['param']['peerhost'] = formatpost($_POST['peersubnet']);
            if($floag == 2){
                if ($_POST['gj_peerid'] == "必须包含@" || $_POST['gj_peerid'] == ' ') {
                   $config['param']['peerid'] = 'null';
                }else{
                    if ($_POST['gj_peerid']){
                       $config['param']['peerid'] = formatpost("'".$_POST['gj_peerid']."'");
                    }
                }
            }else{
                if ($_POST['gj_peerid'] != "必须包含@") {
                    if ($_POST['gj_peerid']){
                       $config['param']['peerid'] = formatpost("'".$_POST['gj_peerid']."'");
                    }
                }
            }
            if($_POST['treaty'] == 'gmneg_gm' || $_POST['negomode'] == '2'){
               $config['param']['localid'] = 'null';
                $config['param']['peerid'] = 'null';
                if ($_POST['peerid']){
                    $config['param']['peerid'] = formatpost("'".$_POST['peerid']."'");
                }
            }        
            if ($_POST['presharekey']){
                $config['param']['presharekey'] = formatpost($_POST['presharekey']);
            }
            if ($_POST['ISAKMP_life'])
                $config['param']['ike_life_seconds'] = formatpost($_POST['ISAKMP_life']);
            if ($_POST['SA_life_time'])
                $config['param']['ipsec_life_seconds'] = formatpost($_POST['SA_life_time']);
            if ($_POST['consult_num'])
                $config['param']['sa_keying_tries'] = formatpost($_POST['consult_num']);
            if($_POST['treaty'] == 'gmneg_gj'){
                if($_POST['SA_ISAKMP']){
                    $arra = explode(',', trim($_POST['SA_ISAKMP'],","));
                    $arra = array_unique($arra);
                    $arra = implode(',', $arra);                
                    $config['param']['ike_policy'] = $arra;
                }else{
                   $config['param']['ike_policy'] = formatpost($_POST['SA_ONE']) . '-' . formatpost($_POST['SA_TWO']) . '-' . formatpost($_POST['SA_THREE']);
                } 

            }else{
                if($_POST['SA_ISAKMP']){
                    $arra = explode(',', trim($_POST['SA_ISAKMP'],","));
                    $arra = array_unique($arra);
                    $arra = implode(',', $arra);
                   $config['param']['ike_policy'] = $arra;
                }else{
                    $config['param']['ike_policy'] = formatpost($_POST['SA_ONE']) . '-' . formatpost($_POST['SA_TWO']);
                }
            }
           $config['param']['alg_esp'] = formatpost($_POST['encrypt_type']) . '-' . formatpost($_POST['verify_type']);

            if ($_POST['tunnel_ipsecmode'] == 'checked') {
                $config['param']['ipsecpolicy'] = 'tunnel';
            }
            if ($_POST['proto_esp'] == 'checked') {
                $config['param']['ipsecpolicy'].=',' . 'encrypt';
            }
            if ($_POST['proto_ah'] == 'checked') {
                $config['param']['ipsecpolicy'].=',' . 'authenticate';
            }
            if ($_POST['pfs'] == 'checked') {
                $config['param']['ipsecpolicy'].=',' . 'pfs';
            }
            if ($_POST['proto_comp'] == 'checked') {
                $config['param']['ipsecpolicy'].=',' . 'compress';
            }

            if ($_POST['interval_dpd'])
                $config['param']['dpd_delay'] = formatpost($_POST['interval_dpd']);
            if ($_POST['dpd_timeout'])
                $config['param']['dpd_timeout'] = formatpost($_POST['dpd_timeout']);
            if ($_POST['negotiate'] == 'open') {
                $config['param']['auto_negotiate'] = 'on';
            } else {
                $config['param']['auto_negotiate'] = 'off';
            }
            $param['enable'] = 'on';
            if ($_POST['setpdp'] == 'open') {
                $config['param']['use-xauth'] = 'on';
            } else {
                $config['param']['use-xauth'] = 'off';
            }
            if ($_POST['select_auto'] == 1) {
                if ($_POST['auth_service'] == 'service') {
                   $config['param']['as-xs-xc'] = 'xs';
                }
                if ($_POST['auth_service'] == 'client') {
                   $config['param']['as-xs-xc'] = 'xc';
                    if ($_POST['client_user'])
                       $config['param']['xc-username'] = formatpost($_POST['client_user']);
                    if ($_POST['client_pwd'])
                        $config['param']['xc-password'] = formatpost($_POST['client_pwd']);
                }
            }
            if ($_POST['select_auto'] == 2) {
                $config['param']['use-modecfg'] = 'on';
                if ($_POST['auth_service'] == 'service') {
                   $config['param']['as-xs-xc'] = 'xs';
                }
                if ($_POST['auth_service'] == 'client') {
                   $config['param']['as-xs-xc'] = 'xc';
                    if ($_POST['client_user'])
                       $config['param']['xc-username'] = formatpost($_POST['client_user']);
                    if ($_POST['client_pwd'])
                        $config['param']['xc-password'] = formatpost($_POST['client_pwd']);
                }
                if ($_POST['set_mode'] == 'service') {
                   $config['param']['as-ms-mc'] = 'ms';
                }
                if ($_POST['set_mode'] == 'client') {
                   $config['param']['as-ms-mc'] = 'mc';
                }
            }
            if ($_POST['pull_mode'] == 'open') {
                $config['param']['use-modecfg-pull'] = 'on';
            } else {
                $config['param']['use-modecfg-pull'] = 'off';
            }
            if ($_POST['dpd'] == 'open') {
                $config['param']['dpd_switch'] = 'on';
            } else {
                $config['param']['dpd_switch'] = 'off';
            }        
            if ($_POST['treaty'] == 'gmneg_gm') {
               $config['param']['gmneg'] = 'on';
            } else {
                $config['param']['gmneg'] = 'off';
            }
            if ($_POST['localcert_id'] == 'primary') {
                $config['param']['localcert_id'] = 'primary';
            } else {
                $config['param']['localcert_id'] = 'secondary';
            }
            if ($_POST['localnet'])
                $config['param']['localhost'] = formatpost($_POST['localnet']);
            $config['param']['keeplive-flag'] = 'off';
            $config['param']['sa_rekey_margin'] = 540;
            $config['param']['sa_rekey_fuzz'] = 100;
            $config['param']['dpd_action'] = 'clear';
            $config['param']['line-type'] = 'single';
            $config['param']['keep_alive'] = 20;

            if ($floag == 1 || $floag == 3) {

                    $config['modules'] = "vpn tunnel";
                    $config['action'] = "add";
                    $config['note'] = "添加";
                    echo sendRequestSingle($config);
                //$rspString = getResponse('vpn tunnel', "add", $param, 2);
            } else {

                    $config['modules'] = "vpn tunnel";
                    $config['action'] = "modify";
                    $config['note'] = "添加";
        //$rspString = getResponse('vpn tunnel', "modify", $param, 2);
                    echo sendRequestSingle($config);
            }
            if($floag == '1'){
                unset($config);
                $config['modules'] = "vpn default";
                $config['action'] = "set";
                $config['note'] = "添加";
                $config['param']['alg_esp'] = $config['param']['alg_esp'];
                $config['param']['authmode'] = $config['param']['authmode'];
                $config['param']['dpd_action'] = $config['param']['dpd_action'];
                $config['param']['dpd_delay'] = $config['param']['dpd_delay'];
                $config['param']['dpd_switch'] = $config['param']['dpd_switch'];
                $config['param']['dpd_timeout'] = $config['param']['dpd_timeout'];
                $config['param']['ike_life_seconds'] = $config['param']['ike_life_seconds'];
                $config['param']['ipsec_life_seconds'] = $config['param']['ipsec_life_seconds'];
                $config['param']['ipsecpolicy'] = $config['param']['ipsecpolicy'];
                $config['param']['keep_alive'] = $config['param']['keep_alive'];
                $config['param']['negomode'] = $config['param']['negomode'];
                $config['param']['sa_keying_tries'] = $config['param']['sa_keying_tries'];
                $config['param']['sa_rekey_fuzz'] = $config['param']['sa_rekey_fuzz'];
                $config['param']['sa_rekey_margin'] = $config['param']['sa_rekey_margin'];
                $config['param']['ike_policy'] = $config['param']['ike_policy'];
                echo sendRequestSingle($config);
               // $rspString = getResponse('vpn default', "set", $default, 2);
            }
	}
//证书配置弹出窗
	function addExceptDivCert(){

            require_once APP_PATH . 'Home/Common/menupage.php';	
            $this->display('Window/network_static_tunnel_cert_window');
	}
//获取标识
	function addExceptDivTag(){
		
            require_once APP_PATH . 'Home/Common/menupage.php';
            $this->display('Window/network_static_tunnel_tag_window');
	}
//获取标识提交
	function getCertTag(){
		
            $error = "";
            $i = 0;
            $ob_path = "/tmp";
            $arr_file = 'ca_cert';
            $fileElementName = $arr_file; //文件ID
            $filename = $_FILES[$fileElementName]["name"]; //文件的名称
            if (!empty($_FILES[$fileElementName]['error'])) {
                switch ($_FILES[$fileElementName]['error']) {
                    case '1':
                        $error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
                        break;
                    case '2':
                        $error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
                        break;
                    case '3':
                        $error = 'The uploaded file was only partially uploaded';
                        break;
                    case '4':
                        $error = 'No file was uploaded.';
                        break;
                    case '6':
                        $error = 'Missing a temporary folder';
                        break;
                    case '7':
                        $error = 'Failed to write file to disk';
                        break;
                    case '8':
                        $error = 'File upload stopped by extension';
                        break;
                    case '999':
                    default:
                        $error = 'No error code avaiable';
                }
                echo $error;
                
            } else if (empty($_FILES[$fileElementName]['tmp_name']) || $_FILES[$fileElementName]['tmp_name'] == 'none') {
                
                $error = 'No file was uploaded......';
                echo $error;
                
            } else {
                
                mb_internal_encoding('UTF-8');
               //将上传的文件存放于/tmp/目录下
                $newfilename = f0 . $i;
                if (move_uploaded_file($_FILES[$fileElementName]["tmp_name"], $ob_path . '/' . $newfilename)) {
                    $param['certfile'] = $ob_path . '/' . $newfilename;
                    $rspString = getResponse('pki tool', "subjectwebui", $param, 1);
                    echo handleGetResponse($rspString);
                }
            }
	}
//数据恢复默认
	function resete(){
		
            $config['modules'] = "vpn default";
            $config['action'] = "reset";
            $config['note'] = "恢复默认";
            echo sendRequestSingle($config);
		//$rspString = getResponse('vpn default', "reset", "", 2);
	}
//数据删除
	function deletee(){

            if ($_POST['name'])
            $config['param']['name'] = formatpost($_POST['name']);
            $config['modules'] = "vpn tunnel";
            $config['action'] = "delete";
            $config['note'] = "删除";
            echo sendRequestSingle($config);
    //$rspString = getResponse('vpn tunnel', "delete", $param, 2);
	}
//数据编辑
	function single(){

            $param['name'] = $_POST['name'];
            $rspString = getResponse("vpn tunnel", "showwebui", $param, 1);
                    //$retArray = handleGetResponse($rspString,0);
            if (is_numeric($rspString) && $rspString == 0) {
                $retArray['type'] = 0;
                $retArray['info'] = "读取数据失败";
            } else if (is_numeric($rspString) && $rspString < 0) {
                $retArray['type'] = 1;
                if ($rspString == -102502) {
                    $retArray['info'] = "登录超时，请重新登录!";
                } else {
                    $retArray['info'] = getErrorInfo($rspString);
                }
            } else if (substr($rspString, 0, 5) == "error") {
                $retArray['type'] = 2;
                $retArray['info'] = substr(strstr($rspString, ":"), 1);
            } else {
                 $retArray = handleGetResponse($rspString,0);
            }
            echo json_encode($retArray);
	}
//数据清空
	function clear(){
		
            $config['modules'] = "vpn tunnel";
            $config['action'] = "clean";
            $config['note'] = "清空";
            echo sendRequestSingle($config);
            //$rspString = getResponse('vpn tunnel', "clean", "", 2);
	}

	function changeStatus(){
		
            $config['param']['name'] = formatpost($_POST['name']);
            $config['modules'] = "vpn tunnel";
            $config['action'] = "initiate";
            $config['note'] = "切换";
            echo sendRequestSingle($config);
        //$rspString = getResponse('vpn tunnel', "initiate", $param, 2);
	}

	function showPage(){
		
            require_once APP_PATH . 'Home/Common/menupage.php';
            $this->display('Window/network_static_tunnel_detail_window');
	}


}
?>