<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class VrvethController extends CommonController{
    
    public function show() {
        $vsys_star = getVsysTurn();
        $vsys_name = isVrAdmin();
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->assign("vsys_name",$vsys_name);
        $this->assign("vsys_start",$vsys_star);
        $this->display("Default/network_vrveth_show");

    }
    
/*    function showJsondata() {
         $seach = $_GET['seach'];
         if($seach =="1"){
             $rspString = getResponse('network veth', 'show all', '', 1);
         }else{
             $rspString = getResponse('network veth', 'show', '', 1);
         }
        echo parseResponseDatagrid($rspString);

    }*/
    //rest风格的添加数据的方法
    public function add(){
        $config['modules'] = "vsys veth";
        $config['action'] = "add";
        $config['param']['vsys-name'] = $_POST['vrid1'];
        $config['param']['peer-vsys-name'] = $_POST['vrid2'];
        echo sendRequestSingle($config);
    }
    //rst风格的编辑数据的方法
    public function edit(){
        parse_str(file_get_contents('php://input'),$dataArr);
        $i = 0;
        //描述
        if ($dataArr['description'] != $dataArr['description_old']) {
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
            if ($_POST['description'] == "") {
                $config[$i]['param']['description'] = "' " . "'";
            } else {
                $config[$i]['param']['description'] = "'" . $dataArr['description'] . "'";
            }
            $i++;
        }
        if ($dataArr['ip4addr_items_old'] == 1) { //1：ip发生改变，0：ip没变
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
                    if ($arr[$j]["mask"] != "" && $arr[$j]["ha"] != "") {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "IPv4";
                    $i++;
                }
            }
        }
        //清空ipv6
        if ($dataArr['ip6addr_items_old'] == 1) { //1：ip发生改变，0：ip没变
            $config[$i]['modules'] = "network interface";
            $config[$i]['action'] = "";
            $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
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
                    $config[$i]['param']['__NA__if'] = $dataArr['interface_name'];
                    $config[$i]['param']['__NA__ip'] = "ipv6";
                    $config[$i]['param']['add'] = $arr_ip6[0];
                    $config[$i]['param']['prefix'] = $arr_ip6[1];
                    if ($arr[$j]['ha']) {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "ipv6";
                    $i++;
                }
            }
        }
        echo sendRequestMultiple($config);
    }
//添加弹出框
    function addWindow() {
        $rspString = getResponse('vsys', 'show', '', 1);
        $rspString = parseResponseDatagrid($rspString,0);
        foreach($rspString['rows'] as $k=>$v){
            $list_vsys[]['vsys_name']=$v['vsys_name'];
        }
        $this->assign("list_vsys",$list_vsys);
        $this->display('/Window/network_vrveth_add_window');
    }
    function addSavee() {
        $config['modules'] = "vsys veth";
        $config['action'] = "add"; 
        $config['param']['vsys-name'] = $_POST['vrid1'];
        $config['param']['peer-vsys-name'] = $_POST['vrid2'];
        echo sendRequestSingle($config);
    }
//编辑弹出窗    
/*    function editWindow() {
        $this->display('Window/network_vrveth_edit_window');
    }*/
//编辑提交    
    function editSave(){
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
            $i++;
        }
        if ($_POST['ip4addr_items_old'] == 1) { //1：ip发生改变，0：ip没变
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
                    if ($arr[$j]["mask"] != "" && $arr[$j]["ha"] != "") {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "IPv4";
                    $i++;
                }
            }
        }
        //清空ipv6
        if ($_POST['ip6addr_items_old'] == 1) { //1：ip发生改变，0：ip没变
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
                    if ($arr[$j]['ha']) {
                        $config[$i]['param']['__NA__ha'] = "ha-static";
                    }
                    $config[$i]['note'] = "ipv6";
                    $i++;
                }
            }
        }
        echo sendRequestMultiple($config);
    }
 //rest风格的删除数据的方法
    function del(){
        parse_str(file_get_contents('php://input'),$delArr);
        $config['modules'] = "vsys veth";
        $config['action'] = "del"; 
        $config['param']['vsys-name'] = $delArr['vrid1'];
        $config['param']['peer-vsys-name'] = $delArr['vrid2'];
        echo sendRequestSingle($config);
    }
}
?>