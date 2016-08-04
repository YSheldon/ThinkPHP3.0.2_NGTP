<?php

namespace Home\Controller\System;
use Home\Controller\CommonController;
class LinkBackController extends CommonController {
	public function LinkShow() {
		require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/system_linkback_show');
	}
    //显示链路备份
/*    public function Show() {
        $rspString = getResponse("network linkbak","show",'', 0);
        echo parseResponseDatagrid($rspString);
    }*/
    //链路备份添加弹出框
/*    public function LinkBackAdd() {
        $this->display('/Window/system_linkback_add_window');
    }*/
    //显示链路探测ID
    public function ProbeShow() {
        $rspString = getResponse("network ip-probe","show",'', 0);        
        $arr = parseResponseDatagrid($rspString,0);
        $res = array();
        foreach ($arr['rows'] as $k => $v) {
            $res[$k]['text'] = $v['probe-id'];
        }
        echo json_encode($res);
    }
    //链路备份添加处理
    public function IpProbeAddHandle() {
        $config['modules'] = "network linkbak";
        $config['action'] = "set";
        $config['note'] = "set";
        $config['param']['dst'] = $_POST['dst'];
        $config['param']['master-id'] = $_POST['master-id'];
        $config['param']['slave-id'] = $_POST['slave-id'];
        echo sendRequestSingle($config);
    }
    //删除链路备份
/*    public function LinkDelete() {
        $config['modules'] = "network linkbak";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }*/
    //清空链路备份
/*    public function LinkDeleteAll() {
    	$config['modules'] = "network linkbak";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
    }*/
    //链路备份开启按钮
/*    public function enableRoles() {
        $config['modules'] = "network linkbak";
        $config['action'] = "start";
        $config['note'] = "start";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }*/
    //链路备份禁用按钮
/*    public function disableRoles() {
        $config['modules'] = "network linkbak";
        $config['action'] = "stop";
        $config['note'] = "停止";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }*/
}
?>