<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class Dhcpv6ClientController extends CommonController{
	//显示客户端左侧接口
/*	public function showInterfaceLeft(){
		$rspString = getResponse("network dhcp6_client_wait","show",'', 0);
        echo parseResponseDatagrid($rspString);
	}*/
	//显示客户端右侧接口
/*	public function showInterfaceRight(){
		$rspString = getResponse("network dhcpv6 dhcpv6_client_start","show",'', 0);
        echo parseResponseDatagrid($rspString);
	}*/
	//客户端开始按钮
	public function Dhcpv6Start(){
		$service_item_cid = formatpost($_POST['msg']);
        $param1 = explode(" ", $service_item_cid);
        $config["param"]["on"] = implode(",", $param1);
        $config['modules'] = "network dhcpv6 client";
        $config['action'] = "start";
        $config['note'] = L('START');
        echo sendRequestSingle($config);
	}
	//客户端停止按钮
/*	public function Dhcpv6Stop(){
		$config['modules'] = "network dhcpv6 client";
        $config['action'] = "stop";
        $config['note'] =L('STOP');
        echo sendRequestSingle($config);
	}*/
}
?>