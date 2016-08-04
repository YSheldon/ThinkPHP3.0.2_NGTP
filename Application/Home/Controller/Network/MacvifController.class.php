<?php

namespace Home\Controller\Network;

use Home\Controller\CommonController;

class MacvifController extends CommonController {

    public function show() {
/*         $vsys_star = getVsysTurn();
        $vsys_name = isVrAdmin();*/
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tabs'] == 'tag'){
            $this->display("Default/network_tagvif_show");
        }else{
/*            $this->assign("vsys_name",$vsys_name);
            $this->assign("vsys_start",$vsys_star);*/
            $this->display("Default/network_macvif_show");
        }
    }

    function showJsondata() {
        $module_name = "network macvif";
        $seach =$_GET['seach'];
        if($seach == "1"){
            $rspString = getResponse($module_name, "show all", '', 1);
        }else{  
            $rspString = getResponse($module_name, "show", '', 1);
        }
        echo  parseResponseDatagrid($rspString);
    }

/*    function addWindow() {
        $this->display("/Window/network_macvif_add_window");
    }*/
    //REST方式的添加方法
    public function add(){
        parse_str(file_get_contents("php://input"),$dataArr);
        switch($dataArr['changeType']){
            //macvif中的添加方法
            case 'macvif':
                $config['modules'] = "network interface";
                $config['action'] = "";
                $config['param']['__NA__interface'] = $dataArr['interface'];
                $config['param']['__NA__macvif'] = "macvif";
                $config['param']['__NA__add'] = "add";
                if ($dataArr['type'] == "single") {
                    $config['param']['id'] = $dataArr['id'];
                } else {
                    $range_start = $dataArr['range_start'];
                    $range_end = $dataArr['range_end'];
                    $config['param']['range'] = $range_start . "-" . $range_end;
                }
                echo sendRequestSingle($config);
                break;
            case 'tagvif':
                //tagvif中的添加方法
                $config['modules'] = "network interface";
                $config['action'] = "";
                $config['param']['__NA__interface'] = $dataArr['interface'];
                $config['param']['__NA__tagvif'] = "tagvif";
                $config['param']['__NA__add'] = "add";
                if ($dataArr['type'] == "single") {
                    $config['param']['tagid'] = $dataArr['id'];
                } else {
                    $range_start = $dataArr['range_start'];
                    $range_end = $dataArr['range_end'];
                    $config['param']['range'] = $range_start . "-" . $range_end;
                }
                echo sendRequestSingle($config);
                break;
        }

        }
    function add_Save() {
        $config['modules'] = "network interface";
        $config['action'] = "";
        $config['param']['__NA__interface'] = $_POST['interface'];
        $config['param']['__NA__macvif'] = "macvif";
        $config['param']['__NA__add'] = "add";
        $config['note'] = "子接口";

        if ($_POST['type'] == "single") {
            $config['param']['id'] = $_POST['id'];
        } else {
            $range_start = $_POST['range_start'];
            $range_end = $_POST['range_end'];
            $config['param']['range'] = $range_start . "-" . $range_end;
        }
        echo sendRequestSingle($config);
    }

//数据修改
/*    function editWindow() {
        $this->display("/Window/network_macvif_edit_window");
    }*/

    function singleJsondata() {
        $param['single'] = $_POST['macvif'];
        $module_name = "network macvif";
        $rspString = getResponse($module_name, "show", $param, 1);
        $arr = parseResponseDatagrid($rspString, 0);
        foreach ($arr['rows'] as $key => $val) {
            $arr['rows'][$key]['rx_speed'] = get_rx_speed_by_interface($val['interface_name']);
            $arr['rows'][$key]['tx_speed'] = get_tx_speed_by_interface($val['interface_name']);
        }
        echo json_encode($arr);
    }
//rest风格的编辑方法
    public function edit(){
        parse_str(file_get_contents("php://input"),$dataArr);
        //判断当前编辑的类型
        switch($dataArr['changeType']){
            case 'macvif':
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

                if ($dataArr['ip4addr_items_old'] == 1/* || (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old']))*/) {
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

                if ($dataArr['ip6addr_items_old'] == 1/* || (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old']))*/) {
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
                break;
            case 'tagvif':
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
                    $config[$i]['note'] = L('DESCRIPTION');
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
                    $config[$i]['note'] = "IPv6";
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
                            $config[$i]['note'] = "IPv6";
                            $i++;
                        }
                    }
                }

                //状态
                if ($dataArr['shutdown'] != $dataArr['shutdown_old']) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['note'] = L('STATE');
                    if ($dataArr['shutdown'] == 1) {
                        $config[$i]['param']['__NA__sd'] = "shutdown";
                    } else {
                        $config[$i]['param']['no'] = "shutdown";
                    }
                    $i++;
                }
                //路由和交换模式的切换
                if($dataArr['comm_type'] != $dataArr['comm_type_old']){
                    if($dataArr['comm_type'] == 'switching'){
                        $config[$i]['modules'] = "network interface";
                        $config[$i]['action'] = "";
                        $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                        $config[$i]['param']['__NA__wp'] = "switchport";
                        $config[$i]['note'] = "交换";
                    }else{
                        $config[$i]['modules'] = "network interface";
                        $config[$i]['action'] = "";
                        $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                        $config[$i]['param']['no'] = "switchport";
                        $config[$i]['note'] = "路由";
                    }
                    $i++;
                }
                break;
        }
        echo sendRequestMultiple($config);
    }
//编辑提交按钮
    function editSave() {

        $i = 0;
        //虚系统ID
        /*if (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old'])) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['param']['vsid'] = $_POST['vsid'];
            $config[$i]['note'] = "vsid";
            $i++;
        }*/
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

        if ($_POST['ip4addr_items_old'] == 1/* || (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old']))*/) {
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

        if ($_POST['ip6addr_items_old'] == 1/* || (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old']))*/) {
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
        echo sendRequestMultiple($config);
    }
    //REST方法中的删除方法
    public function del(){
        parse_str(file_get_contents("php://input"),$dataArr);
        switch($dataArr['changeType']){
            case 'macvif':
                $macvif = $dataArr['macvif'];
                foreach($macvif as $k => $val) {
                    $config[$k]['modules'] = "network interface";
                    $config[$k]['action'] = "";
                    $config[$k]['param']['__NA__if'] = strtok($val, "mv");
                    $config[$k]['param']['__NA__macvif'] = "macvif";
                    $config[$k]['param']['__NA__delete'] = "delete";
                    $config[$k]['param']['id'] = strtok("mv");
                }
                break;
            case 'tagvif':
                $tagvif = $dataArr['tagvif'];
                foreach($tagvif as $k => $val) {
                    $config[$k]['modules'] = "network interface";
                    $config[$k]['action'] = "";
                    $config[$k]['param']['__NA__if'] = strtok($val, ".");
                    $config[$k]['param']['__NA__tagvif'] = "tagvif";
                    $config[$k]['param']['__NA__delete'] = "delete";
                    $config[$k]['param']['id'] = strtok(".");
                }
                break;
        }
        echo sendRequestMultiple($config);
    }
//删除数据
    function deletee() {
        $macvif = $_POST['macvif'];
        foreach($macvif as $k => $val) {
            $config[$k]['modules'] = "network interface";
            $config[$k]['action'] = "";
            $config[$k]['param']['__NA__if'] = strtok($val, "mv");
            $config[$k]['param']['__NA__macvif'] = "macvif";
            $config[$k]['param']['__NA__delete'] = "delete";
            $config[$k]['param']['id'] = strtok("mv");
        }
        echo sendRequestMultiple($config);
    }

//清空数据弹出窗口
/*    function clearWindow() {
        $this->display("/Window/network_macvif_clear_window");
    }*/
//REST类型的删除方法
    public function clean(){
        parse_str(file_get_contents("php://input"),$dataArr);
        switch($dataArr['changeType']){
            case 'macvif':
                $config['modules'] = "network interface";
                $config['action'] = "";
                $config['param']['__NA__if'] = $dataArr['interface'];
                $config['param']['__NA__macvif'] = "macvif";
                $config['param']['__NA__clear'] = "clean";
                break;
            case 'tagvif':
                $config['modules'] = "network interface";
                $config['action'] = "";
                $config['param']['__NA__if'] = $dataArr['interface'];
                $config['param']['__NA__tagvif'] = "tagvif";
                $config['param']['__NA__clear'] = "clean";
                break;
        }
        echo sendRequestSingle($config);
    }
//清空数据按钮
    function clear() {
        $config['modules'] = "network interface";
        $config['action'] = "";
        $config['param']['__NA__if'] = $_POST['interface'];
        $config['param']['__NA__macvif'] = "macvif";
        $config['param']['__NA__clear'] = "clean";
        echo sendRequestSingle($config);
    }

    function interfaceJsondata() {
        $rspString = getResponse("network physicalinterface", "show", "", 1);
        $arr = parseResponseDatagrid($rspString, 0);
        //$i = 0;
        foreach ($arr['rows'] as $k => $v) {
            $ret[$k]['text'] = $v['interface_name'];
        }
        echo json_encode($ret);
    }

    /*============================TAG子接口==========================================*/

    public function addTagvifWindow() {
        $this->display('/Window/network_tagvif_add_window');
    }

    public function editTagvifWindow() {
        $this->display('/Window/network_tagvif_edit_window');
    }

    public function clearTagvifWindow() {
        $this->display('/Window/network_tagvif_clear_window');
    }

    function addTagvifSave() {

        $config['modules'] = "network interface";
        $config['action'] = "";
        $config['param']['__NA__interface'] = $_POST['interface'];
        $config['param']['__NA__tagvif'] = "tagvif";
        $config['param']['__NA__add'] = "add";
        //$config['note'] = L('SUBIF');

        if ($_POST['type'] == "single") {
            $config['param']['tagid'] = $_POST['id'];
        } else {
            $range_start = $_POST['range_start'];
            $range_end = $_POST['range_end'];
            $config['param']['range'] = $range_start . "-" . $range_end;
        }

        echo sendRequestSingle($config);
    }

    //删除数据
    function delTagvif() {
        $tagvif = $_POST['tagvif'];
        foreach($tagvif as $k => $val) {
            $config[$k]['modules'] = "network interface";
            $config[$k]['action'] = "";
            $config[$k]['param']['__NA__if'] = strtok($val, ".");
            $config[$k]['param']['__NA__tagvif'] = "tagvif";
            $config[$k]['param']['__NA__delete'] = "delete";
            $config[$k]['param']['id'] = strtok(".");
        }
        echo sendRequestMultiple($config);
    }

    //清空数据按钮
    function clearTagvif() {
        $config['modules'] = "network interface";
        $config['action'] = "";
        $config['param']['__NA__if'] = $_POST['interface'];
        $config['param']['__NA__tagvif'] = "tagvif";
        $config['param']['__NA__clear'] = "clean";
        echo sendRequestSingle($config);
    }

/*    public function tagSubifShow() {
        $rspString = getResponse('network tagvif','show','',1);
        echo parseResponseDatagrid($rspString);
    }*/

    function singleTagvif() {
        $param['single'] = $_POST['tagvif'];
        $rspString = getResponse("network tagvif", "show", $param, 1);
        $arr = parseResponseDatagrid($rspString, 0);
        if(is_string($arr)) {
            echo $arr;
            exit;
        }
        foreach ($arr['rows'] as $key => $val) {
            $arr['rows'][$key]['rx_speed'] = get_rx_speed_by_interface($val['interface_name']);
            $arr['rows'][$key]['tx_speed'] = get_tx_speed_by_interface($val['interface_name']);
        }
        echo json_encode($arr);
    }

    //编辑提交按钮
    function editTagvifSave() {

        $i = 0;
        //虚系统ID
        /*if (($_POST['vsid'] != "") && ($_POST['vsid'] != $_POST['vsid_old'])) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['param']['vsid'] = $_POST['vsid'];
            $config[$i]['note'] = "vsid";
            $i++;
        }*/
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
            $config[$i]['note'] = L('DESCRIPTION');
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

        if ($_POST['ip4addr_items_old'] == 1) {
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
            $config[$i]['note'] = "IPv6";
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
                    $config[$i]['note'] = "IPv6";
                    $i++;
                }
            }
        }

        //状态
        if ($_POST['shutdown'] != $_POST['shutdown_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $_POST['interface_name'];
            $config[$i]['note'] = L('STATE');
            if ($_POST['shutdown'] == 1) {
                $config[$i]['param']['__NA__sd'] = "shutdown";
            } else {
                $config[$i]['param']['no'] = "shutdown";
            }
            $i++;
        }
        echo sendRequestMultiple($config);
    }

    //获取物理接口和bond接口
    function getInterfaceComboBoxJson() {
        $param['__NA__'] = 'eth-no-mnp';
        $rspString = getResponse("network interfaces", "show", $param, 0);
        $arr = parseResponseDatagrid($rspString, 0);
        $i = 0;
        foreach ($arr['rows'] as $k => $v) {
            $ret[$k]['text'] = $v['dev'];
            if ($_GET['clear'] != 'clear' && $i == 0) {
                $ret[$k]['selected'] = true;
                $i++;
            }
        }
        if($ret ==null && $ret=="")
            $ret =="";
        echo json_encode($ret);
    }
}
