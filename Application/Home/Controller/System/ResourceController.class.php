<?php
namespace Home\Controller\System;
use Think\Controller;
class ResourceController extends Controller {
    
    Public function Resource_show(){
		
		 $rspString = getResponse('system monitor config', 'show', '', 1);
		 $rspString = parseResponse($rspString,0);
		 if(is_array($rspString)){
			 $resource["cpu"] = $rspString["cpu_ratio_threshold"];
			 $resource["memory"] = $rspString["memory_ratio_threshold"];
			 $resource["disk"] = $rspString["disk_ratio_threshold"];
			 $resource["switch"] = $rspString["resource_monitor_switch"];
		 }
		 $this->assign("resource",$resource);
         require_once APP_PATH . 'Home/Common/menupage.php';
         $this->display('/Default/system_resource_show');
    }
//数据提交
	function ResourceSub(){
		
		$config['param']['cpu_ratio_threshold'] = $_POST["cpu"];
		$config['param']['memory_ratio_threshold'] = $_POST["memory"];
		$config['param']['disk_ratio_threshold'] = $_POST["disk"];
		$config['modules'] = "system monitor config";   //模块名
        $config['action'] = "set";              //操作名称
        $config['note'] = L('SUBMIT');            //错误信息自定义头部
		$rspString = sendRequestSingle($config);
		unset($config);
		$config['param']['resource_monitor_switch'] = $_POST["process"];
		$config['modules'] = "system monitor config";   //模块名
        $config['action'] = "";              //操作名称
        $config['note'] = L('SWITCH');
		$rspString = sendRequestSingle($config);
		echo $rspString;
	}
}
?>