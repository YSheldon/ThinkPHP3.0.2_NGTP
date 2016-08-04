<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class DhcpServerController extends CommonController {
	public function serverInfo() {
        require_once APP_PATH . 'Home/Common/menupage.php';
            $server = getLicense(0,'DHCP_SERVER');
            $client = getLicense(0,'DHCP_CLIENT');
            $relay = getLicense(0,'DHCP_RELAY');
            $this->assign("server",$server);
            $this->assign("client",$client);
            $this->assign("relay",$relay);
        if ($_GET['tab']==2) {
            $this->display("Default/network_dhcp_bang");
        } else if ($_GET['tab']==3) {
            $this->display('Default/network_dhcp_look');
        } else if ($_GET['tab']==4) {
            $this->display('/Default/network_dhcp_dhcpClient');
        } else if ($_GET['tab']==5) {
            $this->display('/Default/network_dhcp_dhcpRelay');
        } else {
        if ($relay == 1 && $server == 0 && $client == 0) {
            $this->display('/Default/network_dhcp_dhcpRelay');
        }
        if ($server == 0 && $client == 1) {
            $this->display('/Default/network_dhcp_dhcpClient');
        } else if ($server == 1) {
            $this->display("Default/network_dhcp_dhcpServer");
            }
        }
	}
/*	function dhcpAddrjsondata() {
        $rspString = getResponse("network dhcp dhcpd_subnet", "show", '', 1);
        echo parseResponseDatagrid($rspString);
	}*/
/*	function showInterfaceLeft() {
        $rspString = getResponse("network dhcp_server_wait", "show",'', 0);
        echo parseResponseDatagrid($rspString);
	}
	function showInterfaceRight() {
        $rspString = getResponse("network dhcp dhcp_server_start", "show", '', 0);
        echo parseResponseDatagrid($rspString);
	}*/
	function doDhcpStart() {
        $service_item_cid = formatpost($_POST['msg']);
        $param1 = explode(" ", $service_item_cid);
        $config["param"]['on'] = implode(",", $param1);
        $config['modules'] = "network dhcp server";
        $config['action'] = "start";
        $config['note'] = L('START');
        echo sendRequestSingle($config);
	}
/*	function doDhcpStop() {
        $config['modules'] = "network dhcp server";
        $config['action'] = "stop";
        $config['note'] = L('STOP');
        echo sendRequestSingle($config);
	}*/
    //地址池添加页面
/*	function addPool() {
        $this->display('Window/network_dhcp_addPool_window');
	}*/
    //地址池添加数据
    //rest风格的地址池添加数据的方法
	function add() {
        parse_str(file_get_contents('php://input'),$dataArr);
        switch($dataArr['select_add_type']){
            case 'dhcp':
                $config['modules'] = "network dhcp server";
                $config['note'] = L('ADD');
                if($dataArr['subnet']) $config["param"]["subnet"] = $dataArr['subnet'];
                if($dataArr['mask']) $config["param"]["submask"] = $dataArr['mask'];
                if($dataArr['addr_start']) $config["param"]["sub_start"] = $dataArr['addr_start'];
                if($dataArr['addr_stop']) $config["param"]["sub_end"] = $dataArr['addr_stop'];
                if($dataArr['addr_start1']) $config["param"]["reserve_start"] = $dataArr['addr_start1'];
                if($dataArr['addr_stop1']) $config["param"]["reserve_end"] = $dataArr['addr_stop1'];
                $config["param"]["def-lease-day"] = $dataArr['date_start_day'];
                $config["param"]["def-lease-hour"] = $dataArr['date_start_horse'];
                $config["param"]["def-lease-min"] = $dataArr['date_start_min'];
                $config["param"]["max-lease-day"] = $dataArr['date_max_day'];
                $config["param"]["max-lease-hour"] = $dataArr['date_max_horse'];
                $config["param"]["max-lease-min"] = $dataArr['date_max_min'];
                if($dataArr['web_addr']) $config["param"]["gateway"] = $dataArr['web_addr'];
                if($dataArr['dns_main']) $config["param"]["pri_dns"] = $dataArr['dns_main'];
                if($dataArr['dns_second']) $config["param"]["sec_dns"] = $dataArr['dns_second'];
                if($dataArr['yu_name']) $config["param"]["domain"] = $dataArr['yu_name'];
                if($dataArr['client_type']) $config["param"]["pri_wins"] = $dataArr['client_type'];
                if($dataArr['gro_desc']) $config["param"]["sec_wins"] = $dataArr['gro_desc'];
                $dhcpPool_tag  = $dataArr['dhcpPool_tag'];
                if($dhcpPool_tag == 1) {
                    $config['action'] = "add_subnet";
                    echo sendRequestSingle($config);
                } else {
                    $config['action'] = "modify_subnet";
                    echo sendRequestSingle($config);
                }
                break;
            case 'bang':
                $config['modules'] = "network dhcp server";
                $config['note'] = L('ADD');
                if($dataArr['name']) $config["param"]["name"] = $dataArr['name'];
                if($dataArr['phyAddr']) $config["param"]["macaddr"] = $dataArr['phyAddr'];
                if($dataArr['hostAddr']) $config["param"]["ipaddr"] = $dataArr['hostAddr'];
                $dhcpPool_tag  = $dataArr['dhcpPool_tag'];
                if($dhcpPool_tag == 1){
                    $config['action'] = "add_host";
                    echo sendRequestSingle($config);
                }else{
                    $config['action'] = "modify_host";
                    echo sendRequestSingle($config);
                }
                break;
        }

	}
    //地址池编辑弹出返回json数据
/*	function editJsonData() {
        if($_POST['subnet_name']) $param['subnet'] = formatpost($_POST['subnet_name']);
        $rspString = getResponse("network dhcp dhcpd_subnet", "display", $param, 1);
        echo parseResponseDatagrid($rspString);
	}*/
    //地址池编辑页面
/*	function addPooll() {
        $this->display('Window/network_dhcp_addPool_window');
	}*/
    //地址池删除信息
/*	function doDelAddrPool() {
        $config['modules'] = "network dhcp server";
        $config['action'] = "del_subnet";
        $config['note'] = L('DELETE');
        if($_POST['obj_subnet']) $config['param']['subnet'] = formatpost($_POST['obj_subnet']);
        echo sendRequestSingle($config);
	}*/
    //地址池清空数据
/*	function clearPool() {
        $config['modules'] = "network dhcp server";
        $config['action'] = "clean_subnet";
        $config['note'] = L('CLEAR');
        echo sendRequestSingle($config);
	}*/
    //地址绑定页面
	function serverBang() {
        $retArray = checkResponse();
        $retArray_type = $retArray["type"];
        $retArray_info = $retArray['info'];
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/network_dhcp_bang');
	}
/*	function dhcpAddrBangjsondata() {
        $rspString = getResponse ("network dhcp dhcpd_host", "show", '', 1);
        echo parseResponseDatagrid($rspString);
	}*/
    //地址绑定添加页面
/*	function addBang() {
        $this->display('Window/network_dhcp_addBang_window');
	}*/
    //地址绑定添加数据
	function doAddrBang() {
        $config['modules'] = "network dhcp server";
        $config['note'] = L('ADD');
        if($_POST['name']) $config["param"]["name"] = formatpost($_POST['name']);
        if($_POST['phyAddr']) $config["param"]["macaddr"] = formatpost($_POST['phyAddr']);
        if($_POST['hostAddr']) $config["param"]["ipaddr"] = formatpost($_POST['hostAddr']);
        $dhcpPool_tag  = formatpost($_POST['dhcpPool_tag']);
        if($dhcpPool_tag == 1){
            $config['action'] = "add_host";
            echo sendRequestSingle($config);
        }else{
            $config['action'] = "modify_host";
            echo sendRequestSingle($config);
        }
	}
    //地址绑定编辑数据返回json数据
/*	function editJsonDataBang() {
        if($_POST['name']) $param['name'] = formatpost($_POST['name']);
        $rspString = getResponse ("network dhcp dhcpd_host", "display", $param, 1);
        echo parseResponseDatagrid($rspString);
	}*/
    //地址绑定数据编辑
/*	function addBangg() {
        $this->display('Window/network_dhcp_addBang_window');
	}*/
    //地址绑定删除数据
/*	function doDelAddrBang() {
        $config['modules'] = "network dhcp server";
        $config['action'] = "del_host";
        $config['note'] = L('DELETE');
        if($_POST['name']) $config["param"]["name"] = formatpost($_POST['name']);
        echo sendRequestSingle($config);
	}*/
    //地址绑定清空数据
/*	function clearBang() {
        $config['modules'] = "network dhcp server";
        $config['action'] = "clean_host";
        $config['note'] = L('CLEAR');
        echo sendRequestSingle($config);
	}*/
//已分配地址页面
//	function serverLook(){
//		//echo "11";die;
//		require_once APP_PATH . 'Home/Common/menupage.php';
//		$this->display('Default/network_dhcp_look');
//	}
/*	function dhcpLookjsondata() {
        $rspString = getResponse("network dhcp dhcpd_lease", "show", '', 1);
        echo parseResponseDatagrid($rspString);	
	}*/
}
?>