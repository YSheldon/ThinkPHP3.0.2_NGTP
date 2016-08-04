<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class Dhcpv6ServerController extends CommonController {
	public function serverInfoV6() {
		require_once APP_PATH . 'Home/Common/menupage.php';
		if ($_GET['tab'] == 2) {
                $this->display("Default/network_dhcpv6_bang");
            } else if ($_GET['tab'] == 3) {
                $this->display('Default/network_dhcpv6_look');
            } else if ($_GET['tab'] == 4) {
                $this->display('/Default/network_dhcpv6_dhcpClient');
            } else if ($_GET['tab'] == 5) {
                $this->display('/Default/network_dhcpv6_dhcpRelay');
            } else {
                 $this->display("Default/network_dhcpv6_dhcpServer");
            }
		}
    //显示服务端左侧接口
/*    public function showInterfaceLeft() {
        $rspString = getResponse("network dhcp6_server_wait","show",'',0);
        echo parseResponseDatagrid($rspString);
    }*/
    //显示服务端右侧接口
/*    public function showInterfaceRight() {
        $rspString = getResponse("network dhcpv6 dhcpv6_server_start","show",'',0);
        echo parseResponseDatagrid($rspString);
    }*/
    //服务端开始按钮
    public function Dhcpv6Start() {
        $service_item_cid = formatpost($_POST['msg']);
        $param1 = explode(" ", $service_item_cid);
        $config["param"]['on'] = implode(",", $param1);
        $config['modules'] = "network dhcpv6 server";
        $config['action'] = "start";
        $config['note'] = L('START');
        echo sendRequestSingle($config);
    }
    //服务端停止按钮
/*    public function Dhcpv6Stop() {
        $config['modules'] = "network dhcpv6 server";
        $config['action'] = "stop";
        $config['note'] = L('STOP');
        echo sendRequestSingle($config);
    }*/
    //地址池显示
/*    public function dhcpv6Jsondata() {
        $rspString = getResponse("network dhcpv6 dhcpdv6_subnet", "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }*/
    //地址池添加/编辑页面
/*    public function addPool() {
        $this->display('Window/network_dhcpv6_addPool_window');
    }*/
    //rest风格地址池中添加和编辑数据的方法
    public function add(){
        parse_str(file_get_contents('php://input'),$dataArr);
        switch($dataArr['select_add_type']){
            case 'dhcp_pool';
                $config["param"]["sub_start"] = $dataArr['sub_start'];
                $config["param"]["sub_end"] = $dataArr['sub_end'];
                $config["param"]["reserve_start"] = $dataArr['reserve_start'];
                $config["param"]["reserve_end"] = $dataArr['reserve_end'];
                $config["param"]["lease_day"] = $dataArr['lease_day'];
                $config["param"]["lease_hour"] = $dataArr['lease_hour'];
                $config["param"]["lease_min"] = $dataArr['lease_min'];
                $config["param"]["sub_name"] = $dataArr['sub_name'];
                $config["param"]["pri_dns"] = $dataArr['pri_dns'];
                $config["param"]["sec_dns"] = $dataArr['sec_dns'];
                $config["param"]["domain"] = $dataArr['domain'];
                $config['modules'] = "network dhcpv6 server";
                if ($dataArr['dhcpPool_tag'] == 1) {
                    $config["param"]["prefix"] = $dataArr['prefix'];
                    $config['action'] = "add_subnet";
                    $config['note'] = "添加";
                } else {
                    $config["param"]["prefix"] = $dataArr['prefi'];
                    $config['action'] = "modify_subnet";
                    $config['note'] = "编辑";
                }
                echo sendRequestSingle($config);
                break;
            case 'dhcp_bang':
                $config['modules'] = "network dhcpv6 server";
/*                $config["param"]["name"] = formatpost($_POST['name']);
                $config["param"]["duid"] = formatpost($_POST['duid']);
                $config["param"]["ipaddr"] = formatpost($_POST['ipaddr']);*/
                if ($dataArr['dhcpPool_tag'] == 1) {
                    $config['action'] = "add_host";
                    $config['note'] = "添加";
                } else {
                    $config['action'] = "modify_host";
                    $config['note'] = "编辑";
                }
                unset($dataArr['select_add_type']);
                unset($dataArr['dhcpPool_tag']);
                $config['param'] = $dataArr;
                echo sendRequestSingle($config);
                break;
        }
    }
    //地址池添加数据
    public function doAddrPool() {
        $dhcpPool_tag  = formatpost($_POST['dhcpPool_tag']);
        $config["param"]["sub_start"] = formatpost($_POST['sub_start']);
        $config["param"]["sub_end"] = formatpost($_POST['sub_end']);
        $config["param"]["reserve_start"] = formatpost($_POST['reserve_start']);
        $config["param"]["reserve_end"] = formatpost($_POST['reserve_end']);
        $config["param"]["lease_day"] = formatpost($_POST['lease_day']);
        $config["param"]["lease_hour"] = formatpost($_POST['lease_hour']);
        $config["param"]["lease_min"] = formatpost($_POST['lease_min']);
        $config["param"]["sub_name"] = formatpost($_POST['sub_name']);
        $config["param"]["pri_dns"] = formatpost($_POST['pri_dns']);
        $config["param"]["sec_dns"] = formatpost($_POST['sec_dns']);
        $config["param"]["domain"] = formatpost($_POST['domain']);
        $config['modules'] = "network dhcpv6 server";
        if ($dhcpPool_tag == 1) {
            $config["param"]["prefix"] = formatpost($_POST['prefix']);
            $config['action'] = "add_subnet";
            $config['note'] = "添加";
        } else {
            $config["param"]["prefix"] = formatpost($_POST['prefi']);
            $config['action'] = "modify_subnet";
            $config['note'] = "编辑";
        }
        echo sendRequestSingle($config);
    }
    //删除地址池信息
/*    public function doDelAddrPool() {
        $config['modules'] = "network dhcpv6 server";
        $config['action'] = "del_subnet";
        $config['note'] = "删除";
        $config['param']['sub_name'] = formatpost($_POST['sub_name']);
        echo sendRequestSingle($config);
    }*/
    //地址池清空数据
/*    public function doClearPool() {
        $config['modules'] = "network dhcpv6 server";
        $config['action'] = "clean_subnet";
        $config['note'] = "清空";
        echo sendRequestSingle($config);
    }*/
    //地址池编辑弹出返回json数据
/*    public function editJsonData() {
        $param['prefix'] = formatpost($_POST['sub_name']);
        $rspString = getResponse("network dhcpv6 dhcpdv6_subnet", "display", $param, 1);
        echo parseResponseDatagrid($rspString);
    }*/
    //地址绑定添加弹出框
/*    public function addBangg() {
        $this->display('Window/network_dhcpv6_addBang_window');
    }*/
    //地址绑定显示
/*    public function dhcpv6Bangjsondata() {
        $rspString = getResponse("network dhcpv6 dhcpdv6_host", "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }*/
    //已分配地址显示
/*    public function dhcpLookJsondata() {
        $rspString = getResponse("network dhcpv6 dhcpdv6_lease", "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }*/
    //地址绑定添加数据
    public function doAddrBang() {
        $config['modules'] = "network dhcpv6 server";
        $config["param"]["name"] = formatpost($_POST['name']);
        $config["param"]["duid"] = formatpost($_POST['duid']);
        $config["param"]["ipaddr"] = formatpost($_POST['ipaddr']);
        $dhcpPool_tag  = $_POST['dhcpPool_tag'];
        if ($dhcpPool_tag == 1) {
            $config['action'] = "add_host";
            $config['note'] = "添加";
        } else {
            $config['action'] = "modify_host";
            $config['note'] = "编辑";
        }
        echo sendRequestSingle($config);
    }
    //清空地址绑定
/*    public function clearBang(){
        $config['modules'] = "network dhcpv6 server";
        $config['action'] = "clean_host";
        $config['note'] = "清空";
        echo sendRequestSingle($config);
    }*/
    //删除地址绑定数据
/*    public function doDelAddrBang(){
        $config['modules'] = "network dhcpv6 server";
        $config['action'] = "del_host";
        $config['note'] = "删除";
        $config["param"]["name"] = formatpost($_POST['name']);
        echo sendRequestSingle($config);
    }*/
}

?>