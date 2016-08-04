<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class GreController extends CommonController{
	public function gre_info(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_gre_info");
	}

/*	function greJsondata(){
        $rspString = getResponse("network tunnel", "show", "", 1);
        echo parseResponseDatagrid($rspString);
	}*/

    //添加弹出框
	function greWindow(){
        $retArray = checkResponse();
        $this->display('Window/network_gre_window');
	}
    //rest风格的添加数据的方法
    public function add(){
        //获取前台传过来的数据
        parse_str(file_get_contents('php://input'),$dataArr);
        if ($dataArr['name'])
            $config['param']['name'] = $dataArr['name'];
        if ($dataArr['yuanaddr'])
            $config['param']['remote'] = $dataArr['yuanaddr'];
        if ($dataArr['hostaddr'])
            $config['param']['local'] = $dataArr['hostaddr'];
            $config['param']['ttl'] = $dataArr['Lifetime'];
        if ($dataArr['open_val'])
            $config['param']['csum'] = $dataArr['open_val'];
        if ($dataArr['open_val2'])
            $config['param']['seq'] = $dataArr['open_val2'];
            $config['param']['key'] = $dataArr['greDesc'];

        $dhcpPool_tag = $dataArr['dhcpPool_tag'];
        $module_name = "network tunnel";
        if ($dhcpPool_tag == 1) {
            $config['modules'] = $module_name;
            $config['action'] = "add";
            $config['note'] = "add";
        } else {
            $config['modules'] = $module_name;
            $config['action'] = "modify";
            $config['note'] = "modify";
        }
        echo sendRequestSingle($config);
    }
    //数据添加
	function addGre(){
        if ($_POST['name'])
            $config['param']['name'] = formatpost($_POST['name']);
        if ($_POST['yuanaddr'])
            $config['param']['remote'] = formatpost($_POST['yuanaddr']);
        if ($_POST['hostaddr'])
            $config['param']['local'] = formatpost($_POST['hostaddr']);
        $config['param']['ttl'] = formatpost($_POST['Lifetime']);
        if ($_POST['open_val'])
            $config['param']['csum'] = formatpost($_POST['open_val']);
        if ($_POST['open_val2'])
            $config['param']['seq'] = formatpost($_POST['open_val2']);
        $config['param']['key'] = formatpost($_POST['greDesc']);

        $dhcpPool_tag = formatpost($_POST['dhcpPool_tag']);
        $module_name = "network tunnel";
        if ($dhcpPool_tag == 1) {
            $config['modules'] = $module_name;
            $config['action'] = "add";
            $config['note'] = "add";
        } else {
            $config['modules'] = $module_name;
            $config['action'] = "modify";
            $config['note'] = "modify";
        }
        echo sendRequestSingle($config);
	}

    //删除数据
/*	function delGre(){
        $config['param']['name'] = formatpost($_POST['name']);
        $config['modules'] = 'network tunnel';
        $config['action'] = "delete";
        $config['note'] = "delete";
        echo $rspString = sendRequestSingle($config);
	}*/

    //清空数据
/*	function cleanGre(){
        $config['modules'] = 'network tunnel';
        $config['action'] = "clean";
        $config['note'] = "delete";
        echo $rspString = sendRequestSingle($config);
	}*/

    //接口属性返回数据
	function InterfaceAttrjsondata(){
        if ($_POST['name'])
        $param['name'] = formatpost($_POST['name']);
        $rspString = getResponse('network greinterface', "show", $param, 1);
        echo parseResponseDatagrid($rspString);
	}

	function interfaceEditWindow(){
        $this->display('Window/network_gre_edit_window');
	}

	function InterfaceAttrHandle(){
        $i = 0;

        $config[$i]['modules'] = "network interface";
        $config[$i]['action'] = "";
        $config[$i]['param']['__NA__if'] = $_POST['name'];
        $config[$i]['param']['__NA__ip'] = "ip";
        $config[$i]['param']['__NA__clean'] = "clean";
        $config[$i]['note'] = "IPv4";
        $i++;

        $ip4 = $_POST['ip4addr_items'];
        if ($ip4 != "[]") {
            $arr = json_decode($ip4, true);
            for ($j = 0; $j < count($arr); $j++) {
                $config[$i]['modules'] = "network interface";
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['name'];
                $config[$i]['param']['__NA__ip'] = "ip";
                $config[$i]['param']['add'] = $arr[$j]["ip"];
                $config[$i]['param']['mask'] = $arr[$j]["mask"];
                $config[$i]['note'] = "IPv4";
                $i++;
            }
        }

        //状态
        $config[$i]['modules'] = "network interface";
        $config[$i]['action'] = "";
        $config[$i]['param']['__NA__if'] = $_POST['name'];
        $config[$i]['note'] = "状态";
        if ($_POST['shutdown'] == 1) {
                $config[$i]['param']['__NA__sd'] = "shutdown";
        } else {
                $config[$i]['param']['no'] = "shutdown";
        }

        $i++;
        echo sendRequestMultiple($config);
	}

    //隧道属性返回数据
	function greEditjsondata(){
        if ($_POST['name'])
        $param['name'] = formatpost($_POST['name']);
        $rspString = getResponse('network tunnel', "display", $param, 1);
        echo parseResponseDatagrid($rspString);
	}

    //隧道属性弹出窗
	function greeWindow(){
        $retArray = checkResponse();
        $this->display('Window/network_gre_window');
    }
}
?>