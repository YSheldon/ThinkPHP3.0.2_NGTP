<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class DhcpRelayController extends CommonController{
//	Public function dhcpRelay(){
////		$retArray = checkResponse();
////		$retArray_type = $retArray["type"];
////		$retArray_info = $retArray['info'];
////		$this->assign('retArray_type',$retArray_type);	
////		$this->assign('retArray_info',$retArray_info);
//		require_once APP_PATH . 'Home/Common/menupage.php';
//		$this->display('/Default/network_dhcp_dhcpRelay');	
//	}

/*	function showInterfaceLeft(){
		
            $rspString = getResponse("network dhcp_relay_wait", "show", '', 1);
            echo parseResponseDatagrid($rspString);

	}*/

/*	function showInterfaceRight(){
		
            $rspString = getResponse("network dhcp dhcp_relay_start", "show", '', 1);
            echo parseResponseDatagrid($rspString);
	}*/

/*	function showServerIp(){
		
            $rspString = getResponse("network dhcp dhcrelay_ip", "show", '', 1);
            echo parseResponseDatagrid($rspString);
	}*/

	function doDhcpStart(){
        $interface_str = formatpost($_POST['msg']);
        $config["param"]["on"] = $interface_str;
        $config["param"]["dhcp_server"] = formatpost($_POST['server_msg']);
        $config['modules'] = "network dhcp relay";
        $config['action'] = "start";
        $config['note'] = L('START');
        echo sendRequestSingle($config);
	}

/*	function doDhcpStop(){
		
            $config['modules'] = "network dhcp relay";
            $config['action'] = "stop";
            $config['note'] = L('STOP');
            echo sendRequestSingle($config);
	}*/
}
?>