<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class BondController extends CommonController {
    public function show() {
        $vsys = isVrAdmin();
        $this->assign("vsys",$vsys);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_bond_show");
    }
    //rest风格的数据获取方法
    public function datagridShow(){
        $module_name = "network bond";
        $rspString = getResponse($module_name, "show", "", 1);
//      $list_arr = parseResponseDatagrid($rspString,0);
        if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
            //空值或者错误
            echo '{"rows":[],"total":"0"}';
        } else {
            //整理数组
            $list_arr = parseResponseDatagrid($rspString,0);
            foreach ($list_arr['rows'] as $key => $val) {
                unset($param);
                $param['single'] = $list_arr['rows'][$key]['bond_name'];
                $rspIf = getResponse("network physicalinterface", "show", $param, 1);
                $arrayIf = parseResponse($rspIf);
                $list_arr['rows'][$key]['ip4'] = $arrayIf['rows']['ip4'];
                $list_arr['rows'][$key]['ip6'] = $arrayIf['rows']['ip6'];
                $list_arr['rows'][$key]['shutdown'] = $arrayIf['rows']['shutdown'];
//                拼接状态和模式的数组
                $list_arr['rows'][$key]['status'] = $arrayIf['rows']['shutdown'];
                $list_arr['rows'][$key]['mode'] = $arrayIf['rows']['comm_type'];
            }
            echo json_encode($list_arr);
        }
    }
    function showJsondata() {
        $module_name = "network bond";
        $rspString = getResponse($module_name, "show", "", 1);
//      $list_arr = parseResponseDatagrid($rspString,0);
        if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
        //空值或者错误
            echo '{"rows":[],"total":"0"}';
        } else {
        //整理数组          
            $list_arr = parseResponseDatagrid($rspString,0);
            foreach ($list_arr['rows'] as $key => $val) {
                unset($param);
                $param['single'] = $list_arr['rows'][$key]['bond_name'];
                $rspIf = getResponse("network physicalinterface", "show", $param, 1);
                $arrayIf = parseResponse($rspIf);
                $list_arr['rows'][$key]['ip4'] = $arrayIf['rows']['ip4'];
                $list_arr['rows'][$key]['ip6'] = $arrayIf['rows']['ip6'];
                $list_arr['rows'][$key]['shutdown'] = $arrayIf['rows']['shutdown'];
//                拼接状态和模式的数组
                $list_arr['rows'][$key]['status'] = $arrayIf['rows']['shutdown'];
                $list_arr['rows'][$key]['mode'] = $arrayIf['rows']['comm_type'];
            }
            echo json_encode($list_arr);
        }
    }

    function allBondJsondata() {
        $bond_id = array();
        $module_name = "network bond";
        $rspString = getResponse($module_name, "show", "", 0);
        $arr = parseResponseDatagrid($rspString,0);
        if($arr['rows']){
            foreach ($arr['rows'] as $k => $v) {   
               array_push($bond_id,$arr['rows'][$k]["bond_id"]);
            }
        }
        for ($j = 0; $j < 8; $j++) {
            if (!in_Array($j,$bond_id)) {
                $ret[]['text']=$j;
                $ret[0]['selected']= true;
            }
       }
        echo json_encode($ret);
    }
    //数据添加页面        
/*    function addWindow() {
        $this->display('/Window/network_bond_add_window');
    }*/
    //rest风格的数据提交方法
    public function add(){
        $module_name = "network bond";
        $i = 0;
        $config[$i]['modules'] = $module_name;
        $config[$i]['action'] = "add";
        $config[$i]['param']['id'] = $_POST['id'];
        $config[$i]['param']['load-balance'] = $_POST['load'];
        $config[$i]['note'] = "聚合链路";
        $i++;
        if ($_POST['dev']) {
            $dev = explode(" ", $_POST['dev']);
            foreach ($dev as $value) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "join";
                $config[$i]['param']['id'] = $_POST['id'];
                $config[$i]['param']['dev'] = $value;
                $config[$i]['note'] = "聚合链路";
                $i++;
            }
        }
        echo sendRequestMultiple($config);
    }
    //数据提交
    function addSave() {
        $module_name = "network bond";
        $i = 0;
        $config[$i]['modules'] = $module_name;
        $config[$i]['action'] = "add";
        $config[$i]['param']['id'] = $_POST['id'];
        $config[$i]['param']['load-balance'] = $_POST['load'];
        $config[$i]['note'] = "聚合链路";
        $i++;
        if ($_POST['dev']) {
            $dev = explode(" ", $_POST['dev']);
            foreach ($dev as $value) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "join";
                $config[$i]['param']['id'] = $_POST['id'];
                $config[$i]['param']['dev'] = $value;
                $config[$i]['note'] = "聚合链路";
                $i++;
            }
        }
        echo sendRequestMultiple($config);
    }
    //编辑弹出页面
/*    function editWindow() {
        $this->display('Window/network_bond_edit_window');
    }*/
    //rest风格的编辑方法
    public function edit(){
        if($_REQUEST['attr']){
            $this -> attrSave();
        }else{
            $this -> editSave();
        }
    }
    //编辑提交
    function editSave() {
        parse_str(file_get_contents("php://input"),$dataArr);
        $module_name = "network bond";
        $i = 0;
        $config[$i]['modules'] = $module_name;
        $config[$i]['action'] = "modify";
        $config[$i]['param']['id'] = $dataArr['id'];
        $config[$i]['param']['load-balance'] = $dataArr['load'];
        $config[$i]['note'] = "聚合链路";
        $i++;
        if ($dataArr['dev'] == '' && $dataArr['dev_old']) {
            $dev = explode(" ", $dataArr['dev_old']);
            foreach ($dev as $value) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "leave";
                $config[$i]['param']['id'] = $dataArr['id'];
                $config[$i]['param']['dev'] = $value;
                $config[$i]['note'] = "聚合链路";
                $i++;
            }
        }
        if ($dataArr['dev'] && $dataArr['dev_old'] == '') {
            $dev = explode(",", $dataArr['dev']);
            foreach ($dev as $value) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "join";
                $config[$i]['param']['id'] = $dataArr['id'];
                $config[$i]['param']['dev'] = $value;
                $config[$i]['note'] = "聚合链路";
                $i++;
            }
        }
        if ($dataArr['dev'] && $dataArr['dev_old']) {
            $dev = explode(",", $dataArr['dev']);
            $dev_old = explode(" ", $dataArr['dev_old']);
            $diff = array_diff($dev_old, $dev);
            foreach ($diff as $value) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "leave";
                $config[$i]['param']['id'] = $dataArr['id'];
                $config[$i]['param']['dev'] = $value;
                $config[$i]['note'] = "聚合链路";
                $i++;
            }
            
            $diff = array_diff($dev, $dev_old);
            foreach ($diff as $value) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "join";
                $config[$i]['param']['id'] = $dataArr['id'];
                $config[$i]['param']['dev'] = $value;
                $config[$i]['note'] = "聚合链路";
                $i++;
            }
//            $diff = array_diff($dev_old, $dev);
//            foreach ($diff as $value) {
//                $config[$i]['modules'] = $module_name;
//                $config[$i]['action'] = "leave";
//                $config[$i]['param']['id'] = $dataArr['id'];
//                $config[$i]['param']['dev'] = $value;
//                $config[$i]['note'] = "聚合链路";
//                $i++;
//            }
        }
       echo sendRequestMultiple($config);
    }
    //属性弹出框
/*    function attrWindow() {
        $this->display('Window/network_bond_attr_window');
    }*/
        
    function singleJsondata() {
        $param['single'] = $_POST['interface'];
        $rspString = getResponse("network physicalinterface", "show", $param, 1);
        echo parseResponseDatagrid($rspString);
    }
    //属性提交
    function attrSave() {
        parse_str(file_get_contents('php://input'),$dataArr);
        $i = 0;
        //虚系统ID
        if (($dataArr['vsid'] != "") && ($dataArr['vsid'] != $dataArr['vsid_old'])) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            $config[$i]['param']['vsid'] = $dataArr['vsid'];
            $config[$i]['note'] = "vsid";
            $i++;
        }
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
        //路由交换
        if ($dataArr['comm_type'] == "routing") {
            if ($dataArr['comm_type_old'] == 'switching') {   //如果原配置为交换，取消交换模式进行路由模式配置
                $config[$i]['modules'] = "network interface";
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                $config[$i]['param']['no'] = "switchport";
                $config[$i]['note'] = "路由";
                $i++;
            }
            if ($dataArr['ip4addr_items_old'] == 1) {
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
                    for ($j = 0; $j < count($arr); $j ++) {
                        $config[$i]['modules'] = "network interface";
                        $config[$i]['action'] = "";
                        $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                        $config[$i]['param']['__NA__ip'] = "ip";
                        $config[$i]['param']['add'] = $arr[$j]["ip"];
                        $config[$i]['param']['mask'] = $arr[$j]["mask"];
                        if ($arr[$j] ["ha"] != "") {
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
                    for ($j = 0; $j < count($arr); $j ++) {
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
        } else {
            if ($dataArr['comm_type_old'] != 'switching') { //如何原配置为交换，不需再配置
                $config[$i]['modules'] = "network interface";
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                $config[$i]['param']['__NA__wp'] = "switchport";
                $config[$i]['note'] = "交换";
                $i++;
            }
            if (getLicense(0, "QINQ") == 1) {    //判断QinQ权限
                if ($dataArr['vlanvpn'] != $dataArr['vlanvpn_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    if ($dataArr['vlanvpn'] == 1) {
                        $config[$i]['param']['vlan-vpn'] = "enable";
                    } else {
                        $config[$i]['param']['vlan-vpn'] = "disable";
                    }
                    $config[$i]['note'] = "QinQ";
                    $i++;
                }

                if ($dataArr['tpid'] != $dataArr['tpid_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['vlan-vpn'] = "tpid";
                    $config[$i]['param']['__NA__tp'] = $dataArr['tpid'];
                    $config[$i]['note'] = "QinQ";
                    $i++;
                }
            }
            //交换模式
            if ($dataArr['switch_type'] == "access") {
                if ($dataArr['switch_type_old'] != "access") {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['mode'] = "access";
                    $config[$i]['note'] = "access";
                    $i++;
                }
                //access
                if ($dataArr['access'] != $dataArr['access_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['access-vlan'] = $dataArr['access'];
                    $config[$i]['note'] = "access";
                    $i++;
                }
            } else {
                if ($dataArr['switch_type_old'] != "switch") {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['mode'] = "trunk";
                    $config[$i]['note'] = "trunk";
                    $i++;
                }
                //trunk
                if ($dataArr['allowed'] != $dataArr['allowed_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['__NA__tk'] = "trunk";
                    $config[$i]['param']['allowed-vlan'] = $dataArr['allowed'];
                    $config[$i]['note'] = "trunk";
                    $i++;
                }
                if ($dataArr['native'] != $dataArr['native_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['__NA__tk'] = "trunk";
                    $config[$i]['param']['native-vlan'] = $dataArr['native'];
                    $config[$i]['note'] = "trunk";
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
        echo sendRequestMultiple($config);
    }
    //数据删除
/*    function delete() {
        $module_name = "network bond";
        $config['modules'] = $module_name;
        $config['action'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }*/
    //数据清空
/*    function clear(){
        $module_name = "network bond";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        echo sendRequestSingle($config);
    }*/
}
?>