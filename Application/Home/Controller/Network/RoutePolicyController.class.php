<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class RoutePolicyController extends CommonController{
	public function show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_route_policy_show");
	}

/*	function addWindow(){
        $this->display('Window/network_route_policy_add_window');
	}*/

	function showJsondata(){
        $module_name = "network route-policy";
        $rspString = getResponse($module_name, "list", '', 1);
        echo parseResponseDatagrid($rspString);
	}
//rest风格的添加数据的方法
	function add(){
        $module_name = "network route-policy";
        $config['modules'] = $module_name;
        $config['action'] = "add-entry";
        $config['param']['interface'] = $_POST['interface'];
        $config['param']['gw'] = $_POST['gw'];
        if ($_POST['src']) {
            $config['param']['src'] = $_POST['src'];
        }
        if ($_POST['dst']) {
            $config['param']['dst'] = $_POST['dst'];
        }
        if ($_POST['sport']) {
            $config['param']['sport'] = $_POST['sport'];
        }
        if ($_POST['sport2']) {
            $config['param']['sport2'] = $_POST['sport2'];
        }
        if ($_POST['dport']) {
            $config['param']['dport'] = $_POST['dport'];
        }
        if ($_POST['dport2']) {
            $config['param']['dport2'] = $_POST['dport2'];
        }
        if ($_POST['protocol']) {
            $config['param']['protocol'] = $_POST['protocol'];
        }
        if ($_POST['metric']) {
            $config['param']['metric'] = $_POST['metric'];
        }
        if ($_POST['weight']) {
            $config['param']['weight'] = $_POST['weight'];
        }
        //将出接口，探测ID，智能选路算法中的值传给底层进行处理
        if($_POST['dev']){
            $config['param']['dev'] = $_POST['dev'];
        }
        if($_POST['probe_id']){
            $config['param']['probe-id'] = $_POST['probe_id'];
        }
        if($_POST['load_balance']){
            $config['param']['load-balance'] = $_POST['load_balance'];
        }
        echo sendRequestSingle($config);
	}
//删除数据
	
	function del(){
        parse_str(file_get_contents('php://input'),$delArr);
        $config['modules'] = "network route-policy";
        $config['action'] = "del-entry";
        //metric是必选项
        $config['param']['metric'] = $delArr['metric'];
        if($delArr['interface']){
            $config['param']['interface'] = $delArr['interface'];
        }
        if($delArr['gw']){
            $config['param']['gw'] = $delArr['gw'];
        }
        if($delArr['load_balance']){
            $config['param']['load-balance'] = $delArr['load_balance'];
        }
        if($delArr['probe_id']){
            $config['param']['probe-id'] = $delArr['probe_id'];
        }
        if ($delArr['dev']) {
            $config['param']['dev'] = $delArr['dev'];
        }
        if ($delArr['src']) {
            $config['param']['src'] = $delArr['src'];
        }
        if ($delArr['dst']) {
            $config['param']['dst'] = $delArr['dst'];
        }
        if ($delArr['sport'] !='') {
            $config['param']['sport'] = $delArr['sport'];
        }
        if ($delArr['sport2']) {
            $config['param']['sport2'] = $delArr['sport2'];
        }
        if ($delArr['dport'] !='') {
            $config['param']['dport'] = $delArr['dport'];
        }
        if ($delArr['dport2']) {
            $config['param']['dport2'] = $delArr['dport2'];
        }
        if ($delArr['protocol']) {
            $config['param']['protocol'] = $delArr['protocol'];
        }

        if ($delArr['weight']) {
            $config['param']['weight'] = $delArr['weight'];
        }
        echo sendRequestSingle($config);
	}

//清空数据
/*	function clear(){
		
            $module_name = "network route-policy";
            $config['modules'] = $module_name;
            $config['action'] = "clear";
            echo sendRequestSingle($config);
	}*/
//移动数据
/*	function moveWindow(){
		
            $this->display('Window/network_route_policy_move_window');
	}*/

	function listt(){
        $module_name = "network route-policy";
        $rspString = getResponse($module_name, "list", '', 0);
        $array = parseResponseDatagrid($rspString, 0);
        $id_arr = array();
        $ids = '';
        foreach($array['rows'] as $key=>$value){
            $ret = $array['rows'][$key]['pbrentry'];
            $id = getValue("id", $ret);
            $name = getValue("interface", $ret);
            if (!in_array($id, $id_arr) && $name == $_POST['name']) {
                $id_arr[] = $id;
            }
        }
        foreach ($id_arr as $value) {
                $ids .= $value . ",";
        }
        $retArray['type'] = 4;
        $retArray['info'] = substr($ids, 0, strlen($ids) - 1);
        echo json_encode($retArray);
	}
    //rest风格中的编辑方法
	function edit(){
        parse_str(file_get_contents('php://input'),$dataArr);
        switch($dataArr['type']){
            case 'move':
                $config['modules'] = "network route-policy";
                $config['action'] = "moveto";
                if($dataArr['interface'])
                    $config['param']['interface'] = $dataArr['interface'];
                $config['param']['id1'] = $dataArr['id'];
                $config['param']['to'] = $dataArr['dir'];
                $config['param']['id2'] = $dataArr['pid'];
                echo sendRequestSingle($config);
                break;
            //编辑策略路由
            case 'route_policy':
                $module_name = "network route-policy";
                $config['modules'] = $module_name;
                $config['action'] = "mod-entry";
                $config['param']['interface'] = $dataArr['interface'];
                $config['param']['id'] = $dataArr['id'];

                $config['param']['gw'] = $dataArr['gw'];
                if($dataArr['new_gw'] == $dataArr['gw']){
                    unset($dataArr['new_gw']);
                }else{
                    $config['param']['new_gw'] = $dataArr['new_gw'];
                    $config['param']['new_dev'] = $dataArr['dev'];
                }
                if ($dataArr['weight'] == $dataArr['before_weight']){
                    unset($dataArr['weight']);
                    unset($dataArr['before_weight']);
                }else{
                    $config['param']['weight'] = $dataArr['weight'];
                }
                //将出接口，探测ID，智能选路算法中的值传给底层进行处理
                if($dataArr['dev']){
                    $config['param']['dev'] = $dataArr['dev'];
                }
                if($dataArr['new_dev'] == $dataArr['dev']){
                    unset($dataArr['new_dev']);
                }else{
                    $config['param']['new_dev'] = $dataArr['new_dev'];
                    $config['param']['new_gw'] = $dataArr['gw'];
                }
                if($dataArr['probe_id'] == $dataArr['before_probe_id']){
                    unset($dataArr['probe_id']);
                    unset($dataArr['befor_probe_id']);
                }else{
                    $config['param']['probe-id'] = $dataArr['probe_id'];
                }
                if($dataArr['load_balance'] == $dataArr['before_load_balance']){
                    unset($dataArr['load_balance']);
                    unset($dataArr['before_load_balance']);
                }else{
                    $config['param']['load-balance'] = $dataArr['load_balance'];
                }
                $config['param']['metric'] = $dataArr['metric'];
                echo sendRequestSingle($config);
                break;
        }

	}

/*        function allInterfacejsondata(){
            $rspString = getResponse("network interfaces", "show", '', 0);
            $arr = parseResponseDatagrid($rspString,0);
             array_unshift($arr['rows'], array('dev'=>''));
            foreach ($arr['rows'] as $k => $v) {
                $ret[$k]['text'] = $v['dev'];
            }
            if($ret==null && $ret =="")
                $ret ="";
            echo json_encode($ret);
        }*/
}
?>