<?php

namespace Home\Controller\Network;
use Home\Controller\CommonController;
class IpProbeController extends CommonController {
	public function show() {
		require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/network_ipprobe_show');
	}
/*	public function ipProbeShow(){
		$rspString = getResponse("network ip-probe","show",'', 0);
        echo parseResponseDatagrid($rspString);
	}*/
/*	public function ipProbeAdd(){
		$this->display('/Window/network_ipprobe_add_window');
	}*/
    //rest风格的添加和编辑数据的方法
    public function add(){
        //接收前台传来的数据
        parse_str(file_get_contents('php://input'),$dataArr);
        $flag = $dataArr['flag'];
        $config['modules'] = "network ip-probe";
        if($flag == 1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['probe-id'] = $dataArr['probe-id'];
            $config['param']['probe-ip'] = $dataArr['probe-ip'];
            $config['param']['interval'] = $dataArr['interval'];
            $config['param']['dev'] = $dataArr['dev'];
        }else{
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['probe-id'] = $dataArr['probe-id'];
            $config['param']['interval'] = $dataArr['interval'];
            $config['param']['dev'] = $dataArr['dev'];
        }
        echo sendRequestSingle($config);
    }
	public function ipProbeAddHandle(){
        $flag = $_POST['flag'];
        $config['modules'] = "network ip-probe";
        if($flag == 1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['probe-id'] = $_POST['probe-id'];
            $config['param']['probe-ip'] = $_POST['probe-ip'];
            $config['param']['interval'] = $_POST['interval'];
            $config['param']['dev'] = $_POST['dev'];
        }else{
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['probe-id'] = $_POST['probe-id'];
            $config['param']['interval'] = $_POST['interval'];
            $config['param']['dev'] = $_POST['dev'];
        }
        echo sendRequestSingle($config);
	}
/*	public function probeDelete(){
		$config['modules'] = "network ip-probe";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['probe-id'] =$_POST['probe-id'];
        echo sendRequestSingle($config);
	}
	public function probeDeleteAll(){
		$config['modules'] = "network ip-probe";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
	}*/
}
?>