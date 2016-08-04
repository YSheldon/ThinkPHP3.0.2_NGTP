<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class DhcpClientController extends CommonController{
//	Public function dhcpClient(){
//
//		//require_once APP_PATH . 'Home/Common/menupage.php';
////		$retArray = checkResponse();
////		$retArray_type = $retArray["type"];
////		$retArray_info = $retArray['info'];
////		$this->assign('retArray_type',$retArray_type);	
////		$this->assign('retArray_info',$retArray_info);
//		require_once APP_PATH . 'Home/Common/menupage.php';
//		$this->display('/Default/network_dhcp_dhcpClient');
//	}

/*	function showInterfaceLeft(){
		
            $rspString = getResponse("network dhcp_client_wait", "show", '', 1);
            echo parseResponseDatagrid($rspString);
	}*/

//	function showInterfaceRight(){
//
//            $rspString = getResponse("network dhcp dhcp_client_start", "show", '', 1);
//            echo parseResponseDatagrid($rspString);
//	}

	function doDhcpStart(){
        $service_item_cid = formatpost($_POST['msg']);
        $param1 = explode(" ", $service_item_cid);
        $config["param"]["on"] = implode(",", $param1);
        $config['modules'] = "network dhcp client";
        $config['action'] = "start";
        $config['note'] = L('START');
        echo sendRequestSingle($config);
	}
/*
	function doDhcpStop(){
            
            $config['modules'] = "network dhcp client";
            $config['action'] = "stop";
            $config['note'] = L('STOP');
            echo sendRequestSingle($config);
		
	}*/
}
?>