<?php

namespace Home\Controller\Network;

use Home\Controller\CommonController;

class PhysicsController extends CommonController {

    public function show() {
        $vsys_name = isVrAdmin();
        $this->assign("vsys_name",$vsys_name);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_physics_show");
    }

    function showJsondata() {
        $rspString = getResponse("network physicalinterface", "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }

/*    function editWindow() {
        $this->display('Window/network_physics_edit_window');
    }*/

/*    function singleJsondata() {
        $param['single'] = $_POST['interface'];
        $rspString = getResponse("network physicalinterface", "show", $param, 1);
        echo parseResponseDatagrid($rspString);
    }*/

//点击“名称”弹出框
/*    function showWindow() {

        $this->display("Window/network_flow_window");
    }*/

//url: "?module=network_common&action=show_flow_jsondata",
//统计“名称”弹出框赋值
    function showFlowJsondata() {

        $param['single'] = $_POST['interface'];
        $rspString = getResponse("network interfaceflow", "show", $param, 1);
        $arr = parseResponseDatagrid($rspString, 0);
        if(is_string($arr)){
            echo $arr;
            exit;
        }
        $arr['rows'][0]['rx_speed'] = get_rx_speed_by_interface($param['single']);
        $arr['rows'][0]['tx_speed'] = get_tx_speed_by_interface($param['single']);
        echo json_encode($arr);
    }

    function editSave() {

        $module_name = "network interface";
        $i = 0;
        

        if ($_POST['comm_type'] != "slave") {
            //MTU
            if ($_POST['mtu'] != $_POST['mtu_old']) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                $config[$i]['param']['mtu'] = $_POST['mtu'];
                $config[$i]['note'] = "mtu";
                $i++;
            }

            //MSS
            if ($_POST['mss'] != $_POST['mss_old']) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                $config[$i]['param']['__NA__mss'] = "mss-adjust";
                $config[$i]['param']['__NA__val'] = $_POST['mss'];
                $config[$i]['note'] = "mss";
                $i++;
            }
        }

         //路由交换
        if ($_POST['comm_type'] == "routing") {
            if ($_POST['comm_type_old'] == 'switching') {   //如果原配置为交换，取消交换模式进行路由模式配置
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                $config[$i]['param']['no'] = "switchport";
                $config[$i]['note'] = "路由";
                $i++;
            }

            if ($_POST['ip4addr_items_old'] == 1) {
                //1：ip发生改变，0：ip没变；或者切换了vsid
                $ip4 = $_POST['ip4addr_items'];
                $ip4old = $_POST['ip4addr_itemsOld'];
                $resip = self::isEditIp($ip4,$ip4old,'ipv4');
                
                $valadd = [];
                $valnoadd = [];
                $n = 0;
                if($resip['addip'][0]['ip'] != '') {
                    for ($j = 0; $j < count($resip['addip']); $j++) {
                        $configs[$n]['modules'] = $module_name;
                        $configs[$n]['action'] = ""; 
                        $configs[$n]['param']['__NA__if'] = $_POST['interface_name'];
                        $configs[$n]['param']['__NA__ip'] = "ip";
                        $configs[$n]['param']['add'] = $resip['addip'][$j]["ip"];
                        $configs[$n]['param']['mask'] = $resip['addip'][$j]["mask"];
                        if ($resip['addip'][$j]["ha"] == 'ha_static') {
                            $configs[$n]['param']['__NA__ha'] = 'ha-static';
                        }
                        $configs[$n]['note'] = 'IPv4';
                        
                        $retvals = sendRequestMultiple($configs);
                        if(gettype($retvals)== 'integer'){
                            array_push($valadd,$resip['addip'][$j]["ip"]);
                        }else{
                            $echoval = $retvals;
                            array_push($valnoadd,$resip['addip'][$j]["ip"]);
                        }
                    }
                    
                    if(count($valnoadd) !== 0){
                        $deln = 0;
                        for ($d = 0; $d < count($valadd); $d++) {
                            $configss[$deln]['modules'] = $module_name;
                            $configss[$deln]['action'] = "";
                            $configss[$deln]['param']['__NA__if'] = $_POST['interface_name'];
                            $configss[$deln]['param']['__NA__ip'] = 'ip';
                            $configss[$deln]['param']['delete'] = $valadd[$d];
                            $configss[$deln]['note'] = 'IPv4';
                            $deln++;
                        }
                        $delvalss = sendRequestMultiple($configss);
                        if(gettype($delvalss)== 'integer'){
                            echo $echoval; //  全部删除成功 提示之前添加错误的信息
                        }else{
                            echo $delvalss;    //  删除失败 提示删除错误的信息
                        }
                    }
                    
                    if($resip['delip'][0]['ip'] != '') {
                        for ($d = 0; $d < count($resip['delip']); $d++) {
                            $config[$i]['modules'] = $module_name;
                            $config[$i]['action'] = "";
                            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                            $config[$i]['param']['__NA__ip'] = 'ip';
                            $config[$i]['param']['delete'] = $resip['delip'][$d]['ip'];
                            $config[$i]['note'] = 'IPv4';
                            $i++;
                        }
                    }
                }              
            }

            //清空ipv6
            if ($_POST['ip6addr_items_old'] == 1) {
                //1：ip发生改变，0：ip没变；或者切换了vsid
                $ip6 = $_POST['ip6addr_items'];
                $ip6old = $_POST['ip6addr_itemsOld'];
                $resip6 = self::isEditIp($ip6,$ip6old,'ipv6');
                
                $valadd = [];
                $valnoadd = [];
                $n = 0;
                if($resip6['addip'][0]['ip'] != '') {
                    for ($j = 0; $j < count($resip6['addip']); $j++) {
                        $config[$n]['modules'] = $module_name;
                        $config[$n]['action'] = "";
                        $config[$n]['param']['__NA__if'] = $_POST['interface_name'];
                        $config[$n]['param']['__NA__ip'] = "ipv6";
                        $config[$n]['param']['add'] = $resip6['addip'][$j]['ip'];
                        $config[$n]['param']['prefix'] = $resip6['addip'][$j]['mask'];
                        if ($resip6['addip'][$j]['ha'] == 'ha_static') {
                            $config[$n]['param']['__NA__ha'] = 'ha-static';
                        }
                        $config[$n]['note'] = 'ipv6';
                        
                        $retvals = sendRequestMultiple($configs);
                        if(gettype($retvals)== 'integer'){
                            array_push($valadd,$resip6['addip'][$j]["ip"]);
                        }else{
                            $echoval = $retvals;
                            array_push($valnoadd,$resip6['addip'][$j]["ip"]);
                        }
                    }
                    
                    if(count($valnoadd) !== 0){
                        $deln = 0;
                        for ($d = 0; $d < count($valadd); $d++) {
                            $configss[$deln]['modules'] = $module_name;
                            $configss[$deln]['action'] = "";
                            $configss[$deln]['param']['__NA__if'] = $_POST['interface_name'];
                            $configss[$deln]['param']['__NA__ip'] = 'ip';
                            $configss[$deln]['param']['delete'] = $valadd[$d];
                            $configss[$deln]['note'] = 'IPv6';
                            $deln++;
                        }
                        $delvalss = sendRequestMultiple($configss);
                        if(gettype($delvalss)== 'integer'){
                            echo $echoval; //  全部删除成功 提示之前添加错误的信息
                        }else{
                            echo $delvalss;    //  删除失败 提示删除错误的信息
                        }
                    }

                    if($resip6['delip'][0]['ip'] != '') {
                        for ($j = 0; $j < count($resip6['delip']); $j++) {
                            $config[$i]['modules'] = $module_name;
                            $config[$i]['action'] = "";
                            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                            $config[$i]['param']['__NA__ip'] = 'ipv6';
                            $config[$i]['param']['delete'] = $resip6['delip'][$j]['ip'];
                            $config[$i]['note'] = 'ipv6';
                            $i++;
                        }
                    }
                }
            }
        } else if ($_POST['comm_type'] == "switching") {
            if ($_POST['comm_type_old'] != 'switching') { //如何原配置为交换，不需再配置
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                $config[$i]['param']['__NA__wp'] = "switchport";
                $config[$i]['note'] = "交换";
                $i++;
            }
            if (getLicense(0, "QINQ") == 1) {    //判断QinQ权限
                if ($_POST['vlanvpn'] != $_POST['vlanvpn_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    if ($_POST['vlanvpn'] == 1) {
                        $config[$i]['param']['vlan-vpn'] = "enable";
                    } else {
                        $config[$i]['param']['vlan-vpn'] = "disable";
                    }
                    $config[$i]['note'] = "QinQ";
                    $i++;
                }

                if ($_POST['tpid'] != $_POST['tpid_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['vlan-vpn'] = "tpid";
                    $config[$i]['param']['__NA__tp'] = $_POST['tpid'];
                    $config[$i]['note'] = "QinQ";
                    $i++;
                }
            }

            //交换模式
            if ($_POST['switch_type'] == "access") {
                if ($_POST['switch_type_old'] != "access") {
                    $config[$i]['modules'] = $module_name;
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['mode'] = "access";
                    $config[$i]['note'] = "access";
                    $i++;
                }

                //access
                if ($_POST['access'] != $_POST['access_old']) {
                    $config[$i]['modules'] = $module_name;
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['access-vlan'] = $_POST['access'];
                    $config[$i]['note'] = "access";
                    $i++;
                }
            } else {
                if ($_POST['switch_type_old'] != "switch") {
                    $config[$i]['modules'] = $module_name;
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['mode'] = "trunk";
                    $config[$i]['note'] = "trunk";
                    $i++;
                }

                //trunk
                if ($_POST['allowed'] != $_POST['allowed_old']) {
                    $config[$i]['modules'] = $module_name;
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['__NA__tk'] = "trunk";
                    $config[$i]['param']['allowed-vlan'] = $_POST['allowed'];
                    $config[$i]['note'] = "trunk";
                    $i++;
                }

                if ($_POST['native'] != $_POST['native_old']) {
                    $config[$i]['modules'] = $module_name;
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                    $config[$i]['param']['__NA__wp'] = "switchport";
                    $config[$i]['param']['__NA__tk'] = "trunk";
                    $config[$i]['param']['native-vlan'] = $_POST['native'];
                    $config[$i]['note'] = "trunk";
                    $i++;
                }
            }
        } else if ($_POST['comm_type'] == "virtualline" && $_POST['comm_type_old'] != 'virtualline') {
            $config[$i]['modules'] = "network virtual-line";
            $config[$i]['action'] = "add";
            $config[$i]['param']['dev1'] = $_POST['interface_name'];
            $config[$i]['param']['dev2'] = $_POST['face'];
            $config[$i]['note'] = "虚拟线";
            $i++;
        }
		
		//描述
        if ($_POST['description'] != $_POST['description_old']) {
            $config[$i]['modules'] = $module_name;
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

        //非管理口可配
        if ($_POST['manager'] == 0) {
            //duplex
            if ($_POST['duplex'] != $_POST['duplex_old']) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                $config[$i]['param']['duplex'] = $_POST['duplex'];
                $config[$i]['note'] = "双工模式";
                $i++;
            }

            //speed
            if ($_POST['speed'] != $_POST['speed_old']) {
                $config[$i]['modules'] = $module_name;
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
                $config[$i]['param']['speed'] = $_POST['speed'];
                $config[$i]['note'] = "速率";
                $i++;
            }

            //状态
            if ($_POST['shutdown'] != $_POST['shutdown_old']) {
                $config[$i]['modules'] = $module_name;
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
        }

        if(count($valnoadd) == 0){
            echo sendRequestMultiple($config);
        }
    }

    function vsysDataAll() {
        $rspString = getResponse('network vsys', 'show', '', 0);
        echo responseToJson($rspString);
    }

   function allPhysicsJsondata() {
        $param['__NA__'] = 'unslave';
        $rspString = getResponse("network interfaces", "show", $param,0);
        echo  parseResponseDatagrid($rspString);
    }

    function alPhysicsJsondata(){
        $rspString = getResponse("network physicalinterface", "show", '',0);
        echo  parseResponseDatagrid($rspString);
    }
    
    function allPhysicsJsondataTwo(){
        $rspString = getResponse("network physicalinterface", "show", '', 1);
        $rspString = parseResponseDatagrid($rspString,0);
        $rspString_bond = getResponse('network bond', "show", "", 1);
        $rspString_bond = parseResponseDatagrid($rspString_bond,0);

        foreach($rspString['rows'] as $v_interface){
            $arr_interface[] = $v_interface['interface_name'];
        }
        if(count($arr_interface)>0){
            $j = 0;
            for($i=0;$i<count($arr_interface);$i++){
                $ret[$i]['text'] = $arr_interface[$i];
                if ($j == 0) {
                    $ret[$i]['selected'] = true;
                    $j++;
                }
            }
            
        }
        foreach($rspString_bond['rows'] as $v_bond){
            $arr_bond[] = $v_bond['bond_name'];
        }
        if(count($arr_bond)>0){
            $j = 0;
            for($i=0;$i<count($arr_bond);$i++){
                $ret[$i]['text'] = $arr_bond[$i];
                if ($j == 0) {
                    $ret[$i]['selected'] = true;
                    $j++;
                }
            }
        }
        if(count($arr_interface)>0 && count($arr_bond)>0){
            
            $array = array_merge($arr_interface,$arr_bond);
            $j = 0;
            for($i=0;$i<count($array);$i++){
                $ret[$i]['text'] = $array[$i];
                if ($j == 0) {
                    $ret[$i]['selected'] = true;
                    $j++;
                }
            }
        }
        if($ret==null && $ret=="")
            $ret ="";
        echo json_encode($ret);
    }

    function allPhysicsComboBoxJson() {
        $rspString = getResponse("network interfaces", "show", "", 1);
        $rspString = parseResponseDatagrid($rspString, 0);
        $j = '';
        foreach($rspString['rows'] as $v){
            $arr[] = $v['dev'];
        }
        if($arr){
            $j==0;
            for($i=0;$i<count($arr);$i++){
                $ret[$i]['text'] = $arr[$i];
                if ($j == 0) {
                    $ret[$i]['selected'] = true;
                    $j++;
                }
            }
            echo json_encode($ret);
        }
        
    }

    function allPhysicstateJson(){
        $rspString = getResponse("network physicalinterface", "show", "", 0);
        echo parseResponseDatagrid($rspString);
    }

    function allInterfacejsondata() {

        $rspString = getResponse("network interfaces", "show", '', 0);
        echo parseResponseDatagrid($rspString);
    }
//高可用性    
    function allHaInterfacejsondata() {

        $rspString = getResponse("network interfaces", "show all", '', 0);
        echo parseResponseDatagrid($rspString);
    }

    function haIfJsondata() {

        $array = array();
        $rspString = getResponse("network physicalinterface", "show", "", 0);
        $parr = parseResponseDatagrid($rspString, 0);
        if (isset($parr['rows'])) {
            foreach ($parr['rows'] as $val) {
                if ($val["is_management"] != 1) {
                    $array[] = $val["interface_name"];
                }
            }
        }

        $rspString = getResponse("network vlan", "show", "", 0);
        $varr = parseResponseDatagrid($rspString, 0);
        if (isset($varr['rows'])) {
            foreach ($varr['rows'] as $val) {
                $array[] = self::vlan_format($val["vlanid"]);
            }
        }

        $rspString = getResponse("network bond", "show", "", 0);
        $barr = parseResponseDatagrid($rspString, 0);
        if (isset($barr['rows'])) {
            foreach ($barr['rows'] as $val) {
                $array[] = $val["bond_name"];
            }
        }

        echo json_encode($array);
    }

    function vlan_format($value) {

        if ($value < 10) {
            $value = "vlan.000" . $value;
        } else if ($value >= 10 && $value < 100) {
            $value = "vlan.00" . $value;
        } else if ($value >= 100 && $value < 1000) {
            $value = "vlan.0" . $value;
        } else {
            $value = "vlan." . $value;
        }
        return $value;
    }
//   修改物理接口的状态的方法
    function saveStatus(){
        $module_name = "network interface";
        $config['modules'] = $module_name;
        $config['action'] = "";
        $config['param']['__NA__eth'] = $_POST['interface_name'];
        $config['note'] = "状态";
        if ($_POST['shutdown'] == 1) {
            $config['param']['__NA__sh'] = "shutdown";
        } else {
            $config['param']['no'] = "shutdown";
        }
        echo sendRequestSingle($config);
    }

    //编辑接口时的ip修改操作
    function isEditIp($listIp,$oldListIp,$type) {
        $arr = json_decode($listIp, true);
        $arrOld = explode(',',$oldListIp);

        //拼接组装成和原ip数据相同的一维数组，用于和原ip对比
        $k = 0;
        $ipArr = array();
        if($type == 'ipv4') {
            foreach($arr as $val) {
                $tmpMask = ($val['mask'] != '')? '/'.$val['mask']:'/255.0.0.0';
                $tmpHa = ($val['ha'] != '')?'/ha_static' : '/no_ha_static';
                $ipArr[$k] = $val['ip'] . $tmpMask . $tmpHa . '/' . $val['secondary'];
                $k++;
            }
        } else {
            foreach($arr as $val) {
                $tmpHa = ($val['ha'] != '')?'/ha_static':'/no_ha_static';
                $ipArr[$k] = $val['ip'] . $tmpHa . '/' . $val['linklocal'] . '/' . $val['secondary'];
                $k++;
            }
            //去除ip6的linklocal
            foreach($arrOld as $j=>$v) {
                if(strpos($v,'/linklocal')) {
                    array_splice($arrOld, $j, 1);
                    break;
                }
            }
        }

        $ipDel = array_diff($arrOld,$ipArr);
        $ipAdd = array_diff($ipArr,$arrOld);
        //将删除和添加的ip恢复成二维数组。
        $ipDelList = array();
        $ipAddList = array();
        $delKey = 0;
        $addKey = 0;
        foreach($ipDel as $val) {
            $deltmp = explode('/',$val);
            $ipDelList[$delKey]['ip'] = $deltmp[0];
            $ipDelList[$delKey]['mask'] = $deltmp[1];
            $ipDelList[$delKey]['ha'] = $deltmp[2];
            //增加主从ip的字段，从ip会自动删除
            if($type == 'ipv4') {
                $ipDelList[$delKey]['secondary'] = $deltmp[3];
            } else {
                $ipDelList[$delKey]['secondary'] = $deltmp[4];
            }
            $delKey++;
        }
        //添加则无需主从ip字段，后台会自动设置同网段第一个添加的为主ip
        foreach($ipAdd as $val) {
            $addtmp = explode('/',$val);
            $ipAddList[$addKey]['ip'] = $addtmp[0];
            $ipAddList[$addKey]['mask'] = $addtmp[1];
            $ipAddList[$addKey]['ha'] = $addtmp[2];
            $addKey++;
        }
        //去除要删除ip的从ip
        $ipDelList2 = $ipDelList;
        if($type == 'ipv4') {
            foreach($ipDelList as $v) {
                if($v['secondary'] == 'no_secondary') {
                    for($j=0;$j<count($ipDelList2);$j++) {
                        $ipfull1 = $v['ip'] . '/' . $v['mask'];
                        $ipfull2 = $ipDelList2[$j]['ip'] . '/' . $ipDelList2[$j]['mask'];
                        if(($ipDelList2[$j]['secondary'] != 'no_secondary') && cmpIpv4($ipfull1,$ipfull2)) {
                            array_splice($ipDelList2,$j,1);
                            $j--;
                        }
                    }
                }
            }
        }

        $resArr['delip'] = $ipDelList2;
        $resArr['addip'] = $ipAddList;
        return $resArr;
    }

}
