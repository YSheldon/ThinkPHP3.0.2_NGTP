<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class SuitstateController extends CommonController{
	public function show(){
            require_once APP_PATH . 'Home/Common/menupage.php';
            $this->display("Default/network_suitstate");
	}
	function groupJson(){
            $rspString = getResponse("network suitstate", "webui-group", "", 1);
            echo parseResponseDatagrid($rspString);
	}

	function statusJson(){
            $rspString = getResponse("network suitstate", "webui-configure", "", 0);
            echo parseResponseDatagrid($rspString);
	}
        
//添加弹出框
	function addWindow(){
            $this->display("/Window/network_suitstate_add_window");
	}
//添加数据
	function add(){
            $name = $_POST['name'];
            $members = $_POST['members'];
            if(strlen($name)>31){
                    echo "名称超长";
                    exit;
            }
            if(count($members)<2){
                    echo "接口数量少于2个";
                    exit;
            }
           $config["param"]['name'] = $name;
           $config["param"]['member'] = "'".implode(" ", $members)."'";
            $config['modules'] = "network suitstate";
            $config['action'] = "add";
            echo sendRequestSingle($config);

	}

	function edit(){
        parse_str(file_get_contents('php://input'),$dataArr);
            $act = "enable";
            if(!empty($dataArr['switch'])){
                if($dataArr['switch'] == 'off')
                    $act = "disable";
                else
                    $act = "enable";
            }else{
                echo "没有确定状态";
                exit;
            }
            $config['modules'] = "network suitstate";
            $config['action'] = $act;
            $config['note'] = "";
            echo sendRequestSingle($config);
	}
        	//设置接口启用和禁用的方法
    function enableOrDisable(){
        
        $setItems = $_POST['name'];
        if(is_string($setItems)) {
            $setItems = explode('#',$setItems);
        }
        if(is_array($setItems) && count($setItems) == 1) {
            $setItems = $setItems[0];
        }
        if(is_array($setItems)) {
            foreach($setItems as $k => $val) {
                $param[$k]['modules'] = 'network suitstate';
                $param[$k]['action'] = 'set';
                $param[$k]['param']['name'] = $val;
                if($_POST['status'] == 'enable'){
                    $param[$k]['param']['__NA__'] = 'up';
                }else{
                    $param[$k]['param']['__NA__'] = 'down';
                }
            }
            echo sendRequestMultiple($param);
        } else {
            $param['modules'] = 'network suitstate';
            $param['action'] = 'set';
            $param['param']['name'] = $setItems;
            if($_POST['status'] == 'enable'){
                $param['param']['__NA__'] = 'up';
            }else{
                $param['param']['__NA__'] = 'down';
            }
            echo sendRequestSingle($param);
        }
//        $config['modules'] = 'network suitstate';
//        $config['action'] = 'set';
//        $config['param']['name'] = $name;
//        if($_POST['status'] == 'enable'){
//            $config['param']['__NA__'] = 'up';
//        }else{
//            $config['param']['__NA__'] = 'down';
//        }
//        echo sendRequestSingle($config);
    }
//删除数据
/*	function deletee(){
		
            $err = '';
            $names = $_POST['names'];
            foreach($names as $v){
                //$param = array();
                $config["param"]['name'] = $v;
                $config['modules'] = "network suitstate";
                $config['action'] = "delete";
                $config['note'] = "删除";
               
                //$rspString = getResponse('network suitstate', 'delete', $param, 2);
                $rspString = sendRequestSingle($config);
            }
            echo $rspString;
	}*/
//清除数据
/*	function clean(){
            
                $config['modules'] = "network suitstate";
                $config['action'] = "clean";
                $config['note'] = "清空";
                echo sendRequestSingle($config);
		//$rspString = getResponse("network suitstate", "clean", "", 2);
	}*/
	

}
?>