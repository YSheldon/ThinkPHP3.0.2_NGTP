<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class MacController extends CommonController{
	public function show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_mac_show");

	}
    //rest方式的查询数据的方法
    public function datagridShow(){
        if ($_REQUEST['mac']) {
            $param['address'] = $_REQUEST['mac'];
        }
        if ($_REQUEST['vlan']) {
            $param['vlan'] = $_REQUEST['vlan'];
        }
        $rspString = getResponse("network mac", "show", $param, 1);
        $rspString = parseResponseDatagrid($rspString,0);
        echo json_encode($rspString);
    }
    function showJsondata(){
		$module_name = "network mac";
        if ($_POST['mac']) {
            $param['address'] = $_POST['mac'];
         }
        if ($_POST['vlan']) {
            $param['vlan'] = $_POST['vlan'];
        }
        $rspString = getResponse($module_name, "show", $param, 1);
        $rspString = parseResponseDatagrid($rspString,0);
        echo json_encode($rspString);
	}
//添加弹出框
/*	function addWindow(){
		
            $this->display('/Window/network_mac_add_window');
	}*/
    //rest方式的添加数据的方法
    public function add(){
        $vlan_id = $_POST['vlan'];
        $vlan_id = explode(".",$vlan_id);
        $vlan_id = $vlan_id[1];
        $vlan_id = intval($vlan_id);
        $module_name = "network mac";
        $config['modules'] = $module_name;
        $config['action'] = "add";
        $config['param']['__NA__'] = 'static';
        $config['param']['address'] = $_POST['address'];
        $config['param']['vlan'] = $vlan_id;
        $config['param']['interface'] = $_POST['interfacee'];
        echo sendRequestSingle($config);
    }
//添加数据
	function addSave(){
            $vlan_id = $_POST['vlan'];
            $vlan_id = explode(".",$vlan_id);
            $vlan_id = $vlan_id[1];
            $vlan_id = intval($vlan_id);
            $module_name = "network mac";
            $config['modules'] = $module_name;
            $config['action'] = "add";
            $config['param']['__NA__'] = 'static';
            $config['param']['address'] = $_POST['address'];
            $config['param']['vlan'] = $vlan_id;
            $config['param']['interface'] = $_POST['interfacee'];
            echo sendRequestSingle($config);
	}
//删除数据
	function del(){
        parse_str(file_get_contents('php://input'),$delArr);
        $module_name = "network mac";
        $config['modules'] = $module_name;
        $config['action'] = "delete";
        $config['param']['__NA__'] = "static";
        $config['param']['address'] = $delArr['address'];
        $config['param']['vlan'] = $delArr['vlan'];
        $config['param']['interface'] = $delArr['interface'];
        echo sendRequestSingle($config);
	}
//清空数据
	function clear(){
        $module_name = "network mac";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        $config['param']['__NA__'] = $_POST['type'];
        echo sendRequestSingle($config);
	}

        function allVlanJsondata(){
            $module_name = "network vlan";
            $rspString = getResponse($module_name, "show", '', 0);
            $arr = parseResponseDatagrid($rspString,0);
            $i=0;
                foreach ($arr['rows'] as $k => $v) {
                    $value = $arr['rows'][$k]["vlanid"];
                    if ($value < 10) {
                        $name = "vlan.000".$value;
                    } else if ($value >= 10 && $value < 100) {
                        $name = "vlan.00".$value;
                    } else if ($value >= 100 && $value < 1000) {
                        $name = "vlan.0".$value;
                    } else {
                        $name = "vlan.".$value;
                    }
                    $ret[$k]['text'] =$name;
                    if ($i == 0) {
                        $ret[$k]['selected'] = true;
                        $i++;
                    }
                }
        if($ret == null || $ret == ' '){
            $ret[0]['text'] = " ";
        }
            echo json_encode($ret);
            
        }
        
        function allPhysicsJsondata(){
            $rspString = getResponse("network physicalinterface", "show", '', 1);
            $arr = parseResponseDatagrid($rspString,0);
            $i=0;
            foreach ($arr['rows'] as $k => $v) {
                $ret[$k]['text'] = $v['interface_name'];
                if ($i == 0) {
                    $ret[$k]['selected'] = true;
                    $i++;
                }
            }
            echo json_encode($ret);
        }
        
        function allBondJsondata(){
            $module_name = "network bond";
            $rspString = getResponse($module_name, "show", "", 0);
            $arr = parseResponseDatagrid($rspString,0);
            $i=0;
            foreach ($arr['rows'] as $k => $v) {
                $ret[$k]['text'] = $v['bond_name'];
            }
            echo json_encode($ret);
        }

}
?>