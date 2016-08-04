<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class VlanController extends CommonController {
	public function show() {
//        $vsys_start = getVsysTurn();
//        $vsys_name = isVrAdmin();
        require_once APP_PATH . 'Home/Common/menupage.php';
/*        $this->assign("vsys_name",$vsys_name);
        $this->assign("vsys_start",$vsys_start);*/
        $this->display("Default/network_vlan_show");
	}
    //使用rest方式来获取表格中的数据
//    public function datagridShow(){
//        $module_name = "network vlan";
//        $DEBUG_SWITCH = 0;
//        $seach = $_GET['seach'];
//        if ($seach ==1) {
//            $rspString = getResponse($module_name, "show all", '', 1);
//            if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
//                //空值或者错误
//                echo '{"rows":[],"total":"0"}';
//            } else {
//                $list_arr = parseResponseDatagrid($rspString,0);
//                //把数组转成json
//                echo json_encode($list_arr);
//            }
//        } else {
//            $rspString = getResponse($module_name, "show", '', 1);
//            if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
//                //空值或者错误
//                echo '{"rows":[],"total":"0"}';
//            } else {
//                $list_arr = parseResponseDatagrid($rspString,0);
//                foreach ($list_arr['rows'] as $key => $val) {
//                    unset($param);
//                    $param['vlan'] = $list_arr['rows'][$key]['vlanid'];
//                    $rspIf = getResponse("network spantree","show", $param, 0);
//                    $arrayIf = parseResponse($rspIf);
//                    $list_arr['rows'][$key]['status'] = $arrayIf['rows']['state'];
//                }
//                //把数组转成json
//                echo json_encode($list_arr);
//            }
//        }
//    }
//由于取数据的模式不是普通的模式，所以不能使用公共方法
	function showJsondata() {
        $module_name = "network vlan";
        $DEBUG_SWITCH = 0;
        $seach = $_GET['seach'];
        if ($seach ==1) {
            $rspString = getResponse($module_name, "show all", '', 1);
            if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
                //空值或者错误
                echo '{"rows":[],"total":"0"}';
            } else {
                $list_arr = parseResponseDatagrid($rspString,0);
                //把数组转成json
                echo json_encode($list_arr);
            }
        } else {
            $rspString = getResponse($module_name, "show", '', 1);
            if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
                //空值或者错误
                echo '{"rows":[],"total":"0"}';
            } else {
                $list_arr = parseResponseDatagrid($rspString,0);
                foreach ($list_arr['rows'] as $key => $val) {
                    unset($param);
                    $param['vlan'] = $list_arr['rows'][$key]['vlanid'];
                    $rspIf = getResponse("network spantree","show", $param, 0);
                    $arrayIf = parseResponse($rspIf);
                    $list_arr['rows'][$key]['status'] = $arrayIf['rows']['state'];
                }
                //把数组转成json
                echo json_encode($list_arr);
            }
        }
	}

//添加弹出框
/*	function addWindow() {
        $this->display("/Window/network_vlan_add_window");
	}*/
//rest方式添加的方法
    public function add(){
        //获取前台提交过来的数据
//        parse_str(file_get_contents("php://input"),$dataArr);
        $config['modules'] = 'network vlan';
        $config['action'] = "add";
        if ($_POST['type'] == "single") {
            $config['param']['id'] = $_POST['id'];
        } else {
            $range_start = $_POST['range_start'];
            $range_end = $_POST['range_end'];
            $config['param']['range'] = $range_start . "-" . $range_end;
        }
        echo sendRequestSingle($config);
    }
    //rest方式的编辑方法
    public function edit(){
        parse_str(file_get_contents("php://input"),$dataArr);
        $i = 0;
        //描述
        if ($dataArr['description'] != $dataArr['description_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            if ($dataArr['description'] == "") {
                $config[$i]['param']['description'] = "' " . "'";
            } else {
                $config[$i]['param']['description'] = "'" . $dataArr['description'] . "'";
            }
            $config[$i]['note'] = "描述";
            $i++;
        }
        //MTU
        if ($dataArr['mtu'] != $dataArr['mtu_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            $config[$i]['param']['mtu'] = $dataArr['mtu'];
            $config[$i]['note'] = "mtu";
            $i++;
        }
        //MSS
        if ($dataArr['mss'] != $dataArr['mss_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            $config[$i]['param']['__NA__mss'] = "mss-adjust";
            $config[$i]['param']['__NA__val'] = $dataArr['mss'];
            $config[$i]['note'] = "mss";
            $i++;
        }
        if ($dataArr['ip4addr_items_old'] == 1 || (($dataArr['vsid'] != "") && ($dataArr['vsid'] != $dataArr['vsid_old']))) {
            //1：ip发生改变，0：ip没变；或者切换了vsid
            //路由模式 清空ipv4
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            $config[$i]['param']['__NA__ip'] = "ip";
            $config[$i]['param']['__NA__clean'] = "clean";
            $config[$i]['note'] = "IPv4";
            $i++;
            $ip4 = $dataArr['ip4addr_items'];
            if ($ip4 != "[]") {
                $arr = json_decode($ip4, true);
                for ($j = 0; $j < count($arr); $j++) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__ip'] = "ip";
                    $config[$i]['param']['add'] = $arr[$j]["ip"];
                    $config[$i]['param']['mask'] = $arr[$j]["mask"];
                    if ($arr[$j]["ha"] != "") {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "IPv4";
                    $i++;
                }
            }
        }
        if ($dataArr['ip6addr_items_old'] == 1) {
            //1：ip发生改变，0：ip没变；或者切换了vsid
            //清空ipv6
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            $config[$i]['param']['__NA__ip'] = "ipv6";
            $config[$i]['param']['__NA__clean'] = "clean";
            $config[$i]['note'] = "ipv6";
            $i++;
            $ip6 = $dataArr['ip6addr_items'];
            if ($ip6 != "[]") {
                $arr = json_decode($ip6, true);
                for ($j = 0; $j < count($arr); $j++) {
                    $arr_ip6 = explode("/", $arr[$j]['ip']);
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__ip'] = "ipv6";
                    $config[$i]['param']['add'] = $arr_ip6[0];
                    $config[$i]['param']['prefix'] = $arr_ip6[1];
                    if ($arr[$j]["ha"] != "") {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "ipv6";
                    $i++;
                }
            }
        }
        //状态
        if ($dataArr['shutdown'] != $dataArr['shutdown_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            $config[$i]['note'] = "状态";
            if ($dataArr['shutdown'] == 1) {
                $config[$i]['param']['__NA__sd'] = "shutdown";
            } else {
                $config[$i]['param']['no'] = "shutdown";
            }
            $i++;
        }
        //错误信息关键字
        if (count($config) > 0) {
            $config[0]['error'][0] = "DHCP";
            $config[0]['error'][1] = "双工";
            $config[0]['error'][2] = "接口不支持此操作";
        }
        echo sendRequestMultiple($config);
    }
	function addSave() {
        $module_name = "network vlan";
        $config['modules'] = $module_name;
        $config['action'] = "add";
        $config['note'] = "VLAN";
        if ($_POST['type'] == "single") {
            $config['param']['id'] = $_POST['id'];
        } else {
            $range_start = $_POST['range_start'];
            $range_end = $_POST['range_end'];
            $config['param']['range'] = $range_start . "-" . $range_end;
        }
        echo sendRequestSingle($config);
	}
//编辑数据
/*	function editWindow() {
        $this->display("/Window/network_vlan_edit_window");
	}*/
/*	function singleJsondata() {
        $module_name = "network vlan";
        $param['id'] = $_POST['vlanid'];;
        $rspString = getResponse($module_name, "show", $param, 1);
        echo parseResponseDatagrid($rspString);
	}*/
//编辑确定按钮
	function editSave() {
        $i = 0;
        //描述
        if ($_POST['description'] != $_POST['description_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            if ($_POST['description'] == "") {
                $config[$i]['param']['description'] = "' " . "'";
            } else {
                $config[$i]['param']['description'] = "'" . $_POST['description'] . "'";
            }
            $config[$i]['note'] = "描述";
            $i++;
        }
        //MTU
        if ($_POST['mtu'] != $_POST['mtu_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['param']['mtu'] = $_POST['mtu'];
            $config[$i]['note'] = "mtu";
            $i++;
        }
        //MSS
        if ($_POST['mss'] != $_POST['mss_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['param']['__NA__mss'] = "mss-adjust";
            $config[$i]['param']['__NA__val'] = $_POST['mss'];
            $config[$i]['note'] = "mss";
            $i++;
        }
        if ($_POST['ip4addr_items_old'] == 1 || (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old']))) {
            //1：ip发生改变，0：ip没变；或者切换了vsid
            //路由模式 清空ipv4
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
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
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__ip'] = "ip";
                    $config[$i]['param']['add'] = $arr[$j]["ip"];
                    $config[$i]['param']['mask'] = $arr[$j]["mask"];
                    if ($arr[$j]["ha"] != "") {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "IPv4";
                    $i++;
                }
            }
        }
        if ($_POST['ip6addr_items_old'] == 1) {
            //1：ip发生改变，0：ip没变；或者切换了vsid
            //清空ipv6
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['param']['__NA__ip'] = "ipv6";
            $config[$i]['param']['__NA__clean'] = "clean";
            $config[$i]['note'] = "ipv6";
            $i++;
            $ip6 = $_POST['ip6addr_items'];
            if ($ip6 != "[]") {
                $arr = json_decode($ip6, true);
                for ($j = 0; $j < count($arr); $j++) {
                    $arr_ip6 = explode("/", $arr[$j]['ip']);
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__ip'] = "ipv6";
                    $config[$i]['param']['add'] = $arr_ip6[0];
                    $config[$i]['param']['prefix'] = $arr_ip6[1];
                    if ($arr[$j]["ha"] != "") {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "ipv6";
                    $i++;
                }
            }
        }
        //状态
        if ($_POST['shutdown'] != $_POST['shutdown_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['note'] = "状态";
            if ($_POST['shutdown'] == 1) {
                $config[$i]['param']['__NA__sd'] = "shutdown";
            } else {
                $config[$i]['param']['no'] = "shutdown";
            }
            $i++;
        }
        //错误信息关键字
        if (count($config) > 0) {
            $config[0]['error'][0] = "DHCP";
            $config[0]['error'][1] = "双工";
            $config[0]['error'][2] = "接口不支持此操作";
        }
        echo sendRequestMultiple($config);
	}
    //删除数据
/*	function deletee() {
        $module_name = "network vlan";
        $config['modules'] = $module_name;
        $config['action'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
	}*/
    //清空数据
/*	function clear() {
        $module_name = "network vlan";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        echo sendRequestSingle($config);
	}*/

/*	function allVlanJsondata() {
        $module_name = "network vlan";
        $rspString = getResponse($module_name, "show", '', 0);
        echo parseResponseDatagrid($rspString);
	}*/
    //范围删除vlan弹出框
/*    public function deleteRangeVlan() {
        $this->display('/Window/network_vlan_delete_range');
    }*/
    //范围删除vlan
/*    public function delete_Rvlan() {
        $module_name = "network vlan";
        $config['modules'] = $module_name;
        $config['action'] = "delete";
        $config['note'] = "VLAN";
        $range = $_POST['range'];
        $config['param']['range'] = $range;
        echo sendRequestSingle($config);
    }*/
    //生成树显示
    public function show_tr() {
        $param['vlan'] = $_POST['id'];
        $rspString = getResponse("network spantree", "show",$param, 0);
        echo parseResponseDatagrid($rspString);
    }
    //生成树设定弹出框
    public function show_tree(){
        $this->display('/Window/network_spantree_window');
    }
    //生成树设定
    public function set_tree() {
        $i=0;
        if($_POST['priority']) {
            $config[$i]['param']['vlan'] = $_POST['vlanid'];
            $config[$i]['param']['priority'] = $_POST['priority'];
            $config[$i]['modules'] = "network spantree";
            $config[$i]['action'] = 'set';
            $i++;
        }
        if($_POST['hello']) {
            $config[$i]['param']['vlan'] = $_POST['vlanid'];
            $config[$i]['param']['hello'] = $_POST['hello'];
            $config[$i]['modules'] = "network spantree";
            $config[$i]['action'] = 'set';
            $i++;
        }
        if($_POST['fwddelay']) {
            $config[$i]['param']['vlan'] = $_POST['vlanid'];
            $config[$i]['param']['fwddelay'] = $_POST['fwddelay'];
            $config[$i]['modules'] = "network spantree";
            $config[$i]['action'] = 'set';
            $i++;
        }
        if($_POST['maxage']) {
            $config[$i]['param']['vlan'] = $_POST['vlanid'];
            $config[$i]['param']['maxage'] = $_POST['maxage'];
            $config[$i]['modules'] = "network spantree";
            $config[$i]['action'] = 'set';
            $config[$i]['note'] = "spantree";
            $i++;
        }
        if($_POST['eable']) {
            $config[$i]['param']['vlan'] = $_POST['vlanid'];
            $config[$i]['param']['__NA__ii'] = $_POST['eable'];
            $config[$i]['modules'] = "network spantree";
            $config[$i]['action'] = 'set';
            $config[$i]['note'] = "spantree";
            $i++;
        }
        if($_POST['dable']) {
            $config[$i]['param']['vlan'] = $_POST['vlanid'];
            $config[$i]['param']['__NA__aa'] = $_POST['dable'];
            $config[$i]['modules'] = "network spantree";
            $config[$i]['action'] = 'set';
            $config[$i]['note'] = "spantree";
            $i++;
        }
        echo sendRequestMultiple($config);
    }
    //设为根桥
    public function set_span() {
        $config['param']['vlan'] = $_POST['vlanid'];
        $config['modules'] = "network spantree";
        $config['action'] = 'set root';
        $config['note'] = "设为根桥";
        echo sendRequestSingle($config);
    }
    //rest方式中的删除方法
    public function del(){
        if($_REQUEST['fun']){
            parent::callFun();
        }else{
            parent::del();
        }
    }
}
?>