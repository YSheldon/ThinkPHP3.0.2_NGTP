<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class DynamicMacController extends CommonController{
    
   Public function show(){
       require_once APP_PATH . 'Home/Common/menupage.php';
       $this->display("Default/network_dynamic_mac_show");
   }
       //rest风格的显示数据的方法
    public function datagridShow(){
        $module_name = "network dynamicmac";
        if ($_REQUEST['rows'] && $_REQUEST['page']) {
            $param['from'] = ($_REQUEST['page'] - 1) * $_REQUEST['rows'] + 1;
            $param['num'] = $_REQUEST['rows']+1;
        }
        if ($_REQUEST['mac'] != '') {
            $param['mac'] = $_REQUEST['mac'];
        }
        if ($_REQUEST['vlan'] != '') {
            $param['vlan'] = $_REQUEST['vlan'];
        }
        if ($_REQUEST['interface'] != '') {
            $param['interface'] = $_REQUEST['interface'];
        }
        $rspString = getResponse($module_name, "show", $param, 2);
        if ((is_numeric($rspString) && $rspString == 0) || substr($rspString, 0, 5) == "error") {
            echo '{"rows":[],"total":"0"}';
        } else{

            $rspString  = parseResponseDatagrid($rspString,0);
            if ($rspString['total'] == 0) {
                echo '{"rows":[],"total":"0"}';
            } else {
                if (isset($rspString['rows'])) {
                    $servTreeArr = array();
                    $totalItems = array();
                    foreach ($rspString['rows'] as $i => $items) {
                        $servTreeArr[$i] = $items;
                    }
                    $totalItems['rows'] = $servTreeArr[0] == null?"":$servTreeArr;
                    $totalItems['total'] = $rspString['total'][0];
                    echo json_encode($totalItems);
                } else {
                    echo '{"rows":[],"total":"0"}';
                }
            }
        }
        return;
    }

   function showJsondata(){
        $module_name = "network dynamicmac";
        if ($_REQUEST['rows'] && $_REQUEST['page']) {
            $param['from'] = ($_REQUEST['page'] - 1) * $_REQUEST['rows'] + 1;
            $param['num'] = $_REQUEST['rows']+1;
        }
        if ($_POST['mac'] != '') {
            $param['mac'] = $_POST['mac'];
        }
        if ($_POST['vlan'] != '') {
            $param['vlan'] = $_POST['vlan'];
        }
        if ($_POST['interface'] != '') {
            $param['interface'] = $_POST['interface'];
        }
        $rspString = getResponse($module_name, "show", $param, 2);
        if ((is_numeric($rspString) && $rspString == 0) || substr($rspString, 0, 5) == "error") {
            echo '{"rows":[],"total":"0"}';
        } else{
		
            $rspString  = parseResponseDatagrid($rspString,0);
            if ($rspString['total'] == 0) {
                echo '{"rows":[],"total":"0"}';
            } else {
                if (isset($rspString['rows'])) {
                    $servTreeArr = array();
                    $totalItems = array();
                    foreach ($rspString['rows'] as $i => $items) {
                        $servTreeArr[$i] = $items;
                    }
                    $totalItems['rows'] = $servTreeArr[0] == null?"":$servTreeArr;
                    $totalItems['total'] = $rspString['total'][0];
                    echo json_encode($totalItems);
                } else {
                    echo '{"rows":[],"total":"0"}';
                }
            }
        }
		return;
   }

    //动态mac清空数据
    function clearmac(){
        $module_name = "network mac";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        $config['param']['__NA__'] = $_POST['type'];
        echo sendRequestSingle($config);
    }
    //rest风格的清空数据的方法
    public function clean(){
        parse_str(file_get_contents('php://input'),$delArr);
        $config['modules'] = "network mac";
        $config['action'] = "clean";
        $config['param']['__NA__'] = $delArr['type'];
        echo sendRequestSingle($config);
    }
}
?>