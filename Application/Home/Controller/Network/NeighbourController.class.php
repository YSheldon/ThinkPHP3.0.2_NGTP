<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class NeighbourController extends CommonController{
	public function show(){
        $switch = getVsysTurn();
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_neighbour_show");
	}
//rest风格的查询数据的方法
    public function datagridShow(){
        $module_name = "network neighbour";
        if ($_GET['interface'] != 'all') {
            $param['dev'] = $_GET['interface'];
        }
        if ($_GET['ip']) {
            $param['ip'] = $_GET['ip'];
        }
        if ($_GET['mac']) {
            $param['mac-address'] = $_GET['mac'];
        }
        $rspString = getResponse($module_name, "show", $param, 1);
        $rspString =  parseResponseDatagrid($rspString,0);
        echo json_encode($rspString);
    }
	function showJsondata(){
		$module_name = "network neighbour";
        if ($_GET['interface'] != 'all') {
            $param['dev'] = $_GET['interface'];
        }

        if ($_GET['ip']) {
            $param['ip'] = $_GET['ip'];
        }
        if ($_GET['mac']) {
            $param['mac-address'] = $_GET['mac'];
        }
        $rspString = getResponse($module_name, "show", $param, 1);
        $rspString =  parseResponseDatagrid($rspString,0);
        echo json_encode($rspString);
	}
//添加弹出框
/*	function addWindow(){
		
            $this->display('/Window/network_neighbour_add_window');
	}*/
    //rest风格的添加数据的方法
    public function add(){
        $config['modules'] = "network neighbour";
        $config['action'] = "add";
        $config['param']['ip'] = formatpost($_POST['ip']);
        $config['param']['mac-address'] = formatpost($_POST['mac']);
        $config['param']['dev'] = formatpost($_POST['dev']);
        $config['note'] = "add";
        echo sendRequestSingle($config);
    }
//添加数据
	function addSave(){
        $module_name = "network neighbour";
        $config['modules'] = $module_name;
        $config['action'] = "add";
        $config['param']['ip'] = formatpost($_POST['ip']);
        $config['param']['mac-address'] = formatpost($_POST['mac']);
        $config['param']['dev'] = formatpost($_POST['dev']);
        $config['note'] = "add";
        echo sendRequestSingle($config);
	}
    //rest风格的删除方法
    public function del(){
        //获取前台传过来的数据
        parse_str(file_get_contents('php://input'),$delArr);
        $delIp = $delArr['ip'];
        $delDev = $delArr['dev'];
        if(is_string($delIp) && is_string($delDev)){
            $delIp = explode('#',$delIp);
            $delDev = explode('#',$delDev);
        }
        foreach($delIp as $k => $v){
            $config[$k]['modules'] = 'network neighbour';
            $config[$k]['action'] = 'delete';
            $config[$k]['param']['ip'] = $v;
            $config[$k]['param']['dev'] = $delDev[$k];
            $config[$k]['note'] = L('DELETE');
        }
        echo sendRequestMultiple($config);
    }
//删除数据
	function deletee(){
        $delIp = $_POST['ip'];
        $delDev = $_POST['dev'];
        if(is_string($delIp) && is_string($delDev)){
            $delIp = explode('#',$delIp);
            $delDev = explode('#',$delDev);
        }
        foreach($delIp as $k => $v){
            $config[$k]['modules'] = 'network neighbour';
            $config[$k]['action'] = 'delete';
            $config[$k]['param']['ip'] = $v;
            $config[$k]['param']['dev'] = $delDev[$k];
            $config[$k]['note'] = L('DELETE');
        }
        echo sendRequestMultiple($config);
	}
//清空数据
/*	function clear(){
        $module_name = "network neighbour";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        $config['note'] = L('CLEAR');
        echo sendRequestSingle($config);

	}*/
//弹出查询窗口
	function searchWindow(){
            $rspString = getResponse("network interfaces", "show", '', 0);
            $rspString =  parseResponseDatagrid($rspString,0);
            foreach($rspString['rows'] as $k=>$v){
                $name_list[]['name'] = $v['dev'];
            }
            $this->assign('name_list',$name_list);
            $switch = getVsysTurn();
            $this->assign('switch',$switch);
            $this->display('/Window/network_neighbour_search_window');
	}
}
?>