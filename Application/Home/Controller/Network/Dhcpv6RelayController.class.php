<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class Dhcpv6RelayController extends CommonController{
	//显示中继左侧接口
/*	public function showInterfaceLeft(){
		$rspString = getResponse("network dhcp6_relay_wait", "show",'', 0);
        echo parseResponseDatagrid($rspString);
	}*/
	
	//显示中继右侧接口
/*	public function showInterfaceRight(){
		$rspString = getResponse("network dhcpv6 dhcpv6_relay_start", "show",'', 0);
        echo parseResponseDatagrid($rspString);
	}*/

	//中继开始按钮
	public function Dhcpv6Start(){
		$service_item_cid = formatpost($_POST['msg']);
        $paramOld = explode(" ", $service_item_cid);
        $config["param"]["server_interface"] = $paramOld[0];
        $config["param"]["client_interface"] = $paramOld[1];
        $config['modules'] = "network dhcpv6 relay";
        $config['action'] = "start";
        $config['note'] = L('START');
        echo sendRequestSingle($config);
	}
	//中继停止按钮
/*	public function Dhcpv6Stop(){
		$config['modules'] = "network dhcpv6 relay";
        $config['action'] = "stop";
        $config['note'] = L('STOP');
        echo sendRequestSingle($config);
	}*/
	
}
?>