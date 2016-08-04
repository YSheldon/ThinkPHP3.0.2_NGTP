<?php

/**
 *	[NGTOS!] (C)2014-2024 Topsec Inc.
 *  This is NOT a freeware, use is subject to license terms
 *
 *  $Id: ArpController.class.php 4294 2015-10-16 10:20:14Z wang_qizhang $
 */

namespace Home\Controller\Network;
use Home\Controller\CommonController;
class ArpController extends CommonController{
	public function show(){
        $switch = getVsysTurn();
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->assign('switch',$switch);
        $this->display("Default/network_arp_show");
	}
    //rest风格的加载数据的方法
    public function datagridShow(){
        $module_name = "network arp";
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
        echo  parseResponseDatagrid($rspString);
    }
	function showJsondata(){
        $module_name = "network arp";
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
        echo  parseResponseDatagrid($rspString);
	}
//添加数据弹出框
/*	function addWindow(){
		$this->display('/Window/network_arp_add_window');
        }*/
    //rest风格的添加数据的方法
    public function add(){
        $config['modules'] = "network arp";
        $config['action'] = "add";
        $config['param']['ip'] = formatpost($_POST['ip']);
        $config['param']['mac-address'] = formatpost($_POST['mac']);
        $config['param']['dev'] = formatpost($_POST['dev']);
        $config['note'] = "ARP";
        echo sendRequestSingle($config);
    }
//添加数据
	function addSave(){
		$module_name = "network arp";
        $config['modules'] = $module_name;
        $config['action'] = "add";
        $config['param']['ip'] = formatpost($_POST['ip']);
        $config['param']['mac-address'] = formatpost($_POST['mac']);
        $config['param']['dev'] = formatpost($_POST['dev']);
        $config['note'] = "ARP";
        echo sendRequestSingle($config);
	}
//删除数据
//rest风格的删除数据的方法
	function del(){
        //获取前台传过来的数据
        parse_str(file_get_contents('php://input'),$delArr);
        $delIp = $delArr['ip'];
        $delDev = $delArr['dev'];
        if(is_string($delIp) && is_string($delDev)){
            $delIp = explode('#',$delIp);
            $delDev = explode('#',$delDev);
        }
        foreach($delIp as $k => $v){
            $config[$k]['modules'] = "network arp";
            $config[$k]['action'] = 'delete';
            $config[$k]['param']['ip'] = $v;
            $config[$k]['param']['dev'] = $delDev[$k];
            $config[$k]['note'] = L('DELETE');
        }
        echo sendRequestMultiple($config);
	}
//清空数据
/*	function clear(){
        $module_name = "network arp";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        $config['note'] = L('CLEAR');
        echo sendRequestSingle($config);
	}*/
//查询数据弹出窗口
	function searchWindow(){
		$switch = getVsysTurn();
        $rspString = getResponse("network interfaces", "show", '', 0);
        $rspString =  parseResponseDatagrid($rspString,0);
        foreach($rspString['rows'] as $k=>$v){
            $name_list[]['name'] = $v['dev'];
        }
        $this->assign('name_list',$name_list);
        $this->assign('switch',$switch);
        $this->display('/Window/network_arp_search_window');
	}
        
    function allPhysicsComboBoxJson(){
        $rspString = getResponse("network interfaces", "show", '', 0);
        $arr = parseResponseDatagrid($rspString,0);
        $i=0;
        foreach ($arr['rows'] as $k => $v) {
            $ret[$k]['text'] = $v['dev'];
            if ($i == 0) {
                $ret[$k]['selected'] = true;
                $i++;
            }
        }
        if($ret ==null & $ret=="")
            $ret ="";
        echo json_encode($ret);
    }

}
?>