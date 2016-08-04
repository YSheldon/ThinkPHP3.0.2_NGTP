<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class RouteController extends CommonController{
	public function route_show(){
		$vr_switch = getLicense(0, "VSYS");
		require_once APP_PATH . 'Home/Common/menupage.php';
		$this->assign("vr_switch",$vr_switch);
		$this->display("Default/network_route_show");
    }
    //rest风格的查询数据的方法
    public function datagridShow(){
        if ($_GET['family'])
            $param['family'] = trim($_GET['family']);

        if ($_GET['vr'] == '') {
        } else if ($_GET['vr'] == 0)
            $param['vr_id'] = '0';
        else if ($_GET['vr'])
            $param['vr_id'] = $_GET['vr'];

        $rspString = getResponse('network route', "show", $param, 1);
        echo parseResponseDatagrid($rspString);
    }
	function routeJsondata(){
		if ($_GET['family'])
			$param['family'] = trim($_GET['family']);

		if ($_GET['vr'] == '') {
			
		} else if ($_GET['vr'] == 0)
			$param['vr_id'] = '0';
		else if ($_GET['vr'])
			$param['vr_id'] = $_GET['vr'];

		$rspString = getResponse('network route', "show", $param, 1);
		echo parseResponseDatagrid($rspString);
	}
	
	function routeWindow(){
        $switch = getLicense(0, "VSYS");
		$this->assign("switch",$switch);
		$this->display('Window/network_route_add');
	}
//rest风格的添加数据的方法
    public function add(){
        $config['modules'] = "network route";
        $config['action'] = "add";
        $config['param']['dst'] = $_POST['dst'];
        $config['param']['family'] = $_POST['family'];
        $config['param']['gw'] = $_POST['gw'];
        $config['param']['metric'] = $_POST['metric'];
        $config['param']['dev'] = $_POST['dev'];
        echo sendRequestSingle($config);
    }
	function routeAddsave(){
         $config['modules'] = "network route";
		 $config['action'] = "add"; 
		 $config['param']['dst'] = $_POST['dst'];   
		 $config['param']['family'] = $_POST['family'];
		 $config['param']['gw'] = $_POST['gw'];
		 $config['param']['metric'] = $_POST['metric'];
		 $config['param']['dev'] = $_POST['dev'];
		 $config['note'] = L('ROUTE');
		 echo sendRequestSingle($config);
	}
//rest风格的删除数据的方法
	function del(){
        parse_str(file_get_contents('php://input'),$delArr);
        $delDst = $delArr['dst'];
        $delFamily = $delArr['family'];
        $delGw = $delArr['gw'];
        $delMetric = $delArr['metric'];
        $delDev = $delArr['dev'];
        if(is_string($delDst) && is_string($delFamily) && is_string($delGw) && is_string($delMetric) && is_string($delDev)){
            $delDst = explode('#',$delDst);
            $delFamily = explode('#',$delFamily);
            $delGw = explode('#',$delGw);
            $delMetric = explode('#',$delMetric);
            $delDev = explode('#',$delDev);
        }
        foreach($delDst as $k => $v){
            $config[$k]['modules'] = 'network route';
            $config[$k]['action'] = 'delete';
            $config[$k]['param']['dst'] = $v;
            $config[$k]['param']['family'] = $delFamily[$k];
            $config[$k]['param']['gw'] = $delGw[$k];
            $config[$k]['param']['metric'] = $delMetric[$k];
            $config[$k]['param']['dev'] = $delDev[$k];
            $config[$k]['note'] = L('DELETE_ROUTE');
        }
		 echo sendRequestMultiple($config);

	}

/*	function routeClean(){
        if ($_POST['vr'] != '') {
                $config['param']['vr_id'] = $_POST['vr'];
        }
        $config['param']['family'] = $_POST['family'];
        $config['modules'] = "network route";
        $config['action'] = "clean";
        $config['note'] = "清空路由";
        echo sendRequestSingle($config);
    }*/
    
/*    function allPhysicsComboBoxJson(){
        
        $rspString = getResponse("network interfaces", "show", '', 0);
        $arr = parseResponseDatagrid($rspString,0);
        
        //加入一个空元素
        array_unshift($arr['rows'], array('dev'=>''));
        
        foreach ($arr['rows'] as $k => $v) {
            $ret[$k]['text'] = $v['dev'];
        }
        if($ret== null && $ret =="")
            $ret="";
        echo json_encode($ret);
    }*/

}
?>