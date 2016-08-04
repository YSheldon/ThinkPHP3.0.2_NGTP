<?php
namespace Home\Controller\System;
use Think\Controller;
class SessionController extends Controller {
	public function ipShow() {
        require_once APP_PATH . 'Home/Common/menupage.php';
        if (!$_GET['tabs'] == 'ipv6') {
        	$retArray = checkResponse();
		    if ($retArray['type'] == 1) {
		        $this->display('/Default/network_route_show');
		    }
			endSystem($get_url_param);
            $this->display('/Default/system_session_ipv4_show');
        } else {
        	$retArray = checkResponse();
		    if ($retArray['type'] == 1) {
		        $this->display('/Default/network_route_show');
		    }
			endSystem($get_url_param);
            $this->display('/Default/system_session_ipv6_show');
        }
	}
	public function jsonData() {
        $page = $_REQUEST['page'] ? $_REQUEST['page']:1;
        $count = $_REQUEST['rows'] ? $_REQUEST['rows']:20;

        if ($_GET['family']) $param['family'] = $_GET['family'];
        if ($_GET['flags']) $param['flags'] = $_GET['flags'];
        if ($_GET['protocol']) $param['protocol'] = $_GET['protocol'];
        if ($_GET['saddr']) $param['saddr'] = $_GET['saddr'];
        if ($_GET['daddr']) $param['daddr'] = $_GET['daddr'];
        if ($_GET['sport']) $param['sport'] = $_GET['sport'];
        if ($_GET['dport']) $param['dport'] = $_GET['dport'];
        if ($_GET['vsid'] != '') $param['vsys_name'] = $_GET['vsid'];
        $param['from'] = (($page - 1) * $count) > 0 ? ($page - 1) * $count : 0;
        $param['num'] = $count;
        // if($page > 1) {		//上一个人修改BUG写法
        //     $rspString = getResponse('network session',"search",$param,0);
        //     $tmp = parseResponseDatagrid($rspString,0);
        //     $from = ($page - 1) * $count + $count;
        //     if($from > $tmp['total'][0]) {
        //         $param['from'] = $tmp['total'][0] - $count;
        //         $param['num'] = $count;
        //     } else {
        //         $param['from'] = ($page - 1) * $count;
        //         $param['num'] = $count;
        //     }
        // } else {
        //     $param['from'] = ($page - 1) * $count;
        //     $param['num'] = $count;
        // }
        $rspString = getResponse('network session',"search",$param,0);
        $tmp = parseResponseDatagrid($rspString,0);
        if ($tmp['rows'][0]) {
            echo json_encode($tmp);
        } else {
            echo '{"rows":[],"total":"0"}';
        }
    }
	public function ipv4Search() {
        $rspString = getResponse( 'network vsys_turn', "show" ,'', 0);
        if (is_numeric($rspString) && $rspString == 0) {
            $switch = 'off';
        } else if (is_array($rspString)) {
            $switch = $rspString['rows']['turn'];
        } else if (is_string($rspString)) {
            $switch = 'off';
        }
        $conf_global = getPrivilege('global');
        $vr_admin = isVrAdmin();
        $type = 'ipv4';
        $this->assign('switch',$switch);
        $this->assign('vr_admin',$vr_admin);
        $this->assign('conf_global',$conf_global);
        $this->assign('type',$type);
	    $this->display('/Window/system_session_window');
	}
	public function ipv6Search() {
        $rspString = getResponse( 'network vsys_turn', "show" , "", 0);
        if (is_numeric($rspString) && $rspString == 0){
            $switch = 'off';
        } else if (is_array($rspString)) {
            $switch = $rspString['rows']['turn'];
        } else if (is_string($rspString)) {
            $switch = 'off';
        }
        $conf_global = getPrivilege('global');
        $vr_admin = isVrAdmin();
        $type = 'ipv6';
        $this->assign('switch',$switch);
		$this->assign('vr_admin',$vr_admin);
		$this->assign('conf_global',$conf_global);
		$this->assign('type',$type);
		$this->display('/Window/system_session_window');
	}

	public function SessionDelete() {
        $config['modules'] = "network session";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['family'] = formatpost($_POST['family']);
        $config['param']['protocol'] = formatpost($_POST['protocol']);
        $config['param']['saddr'] = formatpost($_POST['saddr']);
        $config['param']['daddr'] = formatpost($_POST['daddr']);
        $config['param']['sport'] = formatpost($_POST['sport']);
        $config['param']['dport'] = formatpost($_POST['dport']);
        echo sendRequestSingle($config);
    }

    public function DeleteAll() {
    	$config['modules'] = "network session";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['family'] = $_POST['family'];
        echo sendRequestSingle($config);
    }

    public function ProtocoljsonData() {
        $param['family'] = $_GET['family'];
        $param['__NA__'] = "show";
        $rspString = getResponse( 'network session', 'protocol', $param, 0);
	    $protocal = parseResponseDatagrid($rspString,0);

        $arr_tmp1 = array('TCP','UDP',$_GET['family']);
        for($i=0;$i<count($protocal['rows']);$i++) {
            $arr_tmp2[$i] = $protocal['rows'][$i]['protocol_id'];
        }

        $tmp = array();
        if($arr_tmp1)
            $tmp = array_merge_recursive($tmp,  $arr_tmp1);
        if($arr_tmp2)
            $tmp = array_merge_recursive($tmp,  $arr_tmp2);

        for($j=0;$j<count($tmp);$j++) {
            $protocolName[$j]['protocolName'] = $tmp[$j];
        }
        echo json_encode($protocolName);
    }
    public function VrjsonData() {
    	$rspString = getResponse( 'network vsys', 'show', '', 0);
    	$vr = parseResponseDatagrid($rspString,0);
        foreach($vr['rows'] as $k=>$v){
            $vrNames[$k]['vsys_name'] = $v['vsys_name'];
        }
        echo json_encode($vrNames);
    }
}
?>
