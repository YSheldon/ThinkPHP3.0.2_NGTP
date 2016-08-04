<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class HaController extends CommonController {

    public function show() {
        $rspString = getResponse("network interfaces", "show", '', 0);
        $last_array = parseResponseDatagrid($rspString, 0);
        foreach ($last_array['rows'] as $key => $val) {
            $arr[$key]['dev'] = $last_array['rows'][$key]['dev'];
        }
        $this->assign("dev", $arr);
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tab'] == 2){
            $this -> display('Default/system_ha_set_link');
        }else{
            $this->display('Default/system_ha_set');
        }

    }

    /*function interfaceAllJsondata(){
      $rspString = getResponse("network interfaces", "show", '', 0);
      echo parseResponseDatagrid($rspString);die;
      }
    */

    function haGroupJson() {
        $rspString = getResponse("ha show", "webui-group", "", 1);
        $rspString = parseResponseDatagrid($rspString, 0);
        if (is_numeric($rspString) && $rspString == 0) {
            echo '{"rows":[],"total":"0"}';
        } else if (is_array($rspString)) {
            echo json_encode($rspString);
        } else if (is_string($rspString)) {
            echo '{"rows":[],"total":"0"}';
        }
    }

    function haShow() {

        $rspString = getResponse("ha show", "webui-configure", "", 1);
        echo parseResponseDatagrid($rspString);
    }

//开启按钮
/*    function haStart() {

        $config['modules'] = "ha start";   //模块名
        $config['action'] = "";              //操作名称
        $config['note'] = "";
        echo sendRequestSingle($config);
        //$rspString = getResponse('ha start', '', '', 2);
    }*/

//停止按钮
/*    function haStop() {

        $config['modules'] = "ha stop";   //模块名
        $config['action'] = "";              //操作名称
        $config['note'] = "";
        echo sendRequestSingle($config);
        //$rspString = getResponse('ha stop', '', '', 2);
    }*/

//立即同步
/*    function haSync() {

        $config['modules'] = "ha sync-config-to-peer";   //模块名
        $config['action'] = "";              //操作名称
        $config['note'] = "";
        echo sendRequestSingle($config);
        //$rspString = getResponse('ha sync-config-to-peer', '', '', 2);
    }*/

    function haSave() {
        
        $config['modules'] = "ha mode";   //模块名
        $config['action'] = "set";              //操作名称
        $config['note'] = "set";
        $err = '';
        $param = array();
        if ($_POST['mode'])
            $config['param']['__NA__'] = $_POST['mode'];
        $rspString =  sendRequestSingle($config);
        
        if (is_string($rspString)) {
            $err = $rspString;
        }
        unset($config['param']['__NA__']);
        //获取数据
        if ($_POST['interface_old']) {
            
            $config['modules'] = "ha interface";   //模块名
            $config['action'] = "delete";              //操作名称
            $config['note'] = "delete";
            $config['param']['__NA__old'] = formatpost($_POST['interface_old']);
            $rspString = sendRequestSingle($config);
            unset($config['param']['__NA__old']);
        }
        if ($_POST['local']) {

            $config['modules'] = "ha interface";   //模块名
            $config['action'] = "add";              //操作名称
            $config['note'] = "add";
            if ($_POST['interface']) {
                $config['param']['__NA__'] = formatpost($_POST['interface']);
            }
            if ($_POST['local']) {
                $config['param']['local'] = formatpost($_POST['local']);
            }
            if ($_POST['remote']) {
                $config['param']['remote'] = formatpost($_POST['remote']);
            }
            //下发配置
             $rspString = sendRequestSingle($config);
        }
        if (is_string($rspString)) {
            $err = $rspString;
        }
        if (!empty($err)) {
            echo $err;
        } else {
            echo '0';
        }
    }

//添加数据弹出界面
    function addWindow() {
        $this->display('Window/system_ha_add_window');
    }
    
    function hagroupSave() {
        $msg = '';
        if ($_POST['id'])
            $config['param']['__NA__'] = formatpost($_POST['id']);
        if ($_POST['mode']) {
            $config['modules'] = "ha group";        //模块名
            $config['action'] = "";                 //操作名称
            $config['note'] = "";
            $config['param']['mode'] = formatpost($_POST['mode']);
            $sr = sendRequestSingle($config);
            if($sr != 0){
                $msg .= $sr;
            }
        }
        unset($config['param']['mode']);
        if ($_POST['preempt']) {
            $config['modules'] = "ha group";        //模块名
            $config['action'] = "";                 //操作名称
            $config['note'] = "";
            $config['param']['preempt'] = formatpost($_POST['preempt']);
            $sr = sendRequestSingle($config);
            if($sr != 0){
                $msg .= $sr;
            }
        }
        unset($config['param']['preempt']);
        if ($_POST['preempt_delay']) {
            $config['modules'] = "ha group";   //模块名
            $config['action'] = "";              //操作名称
            $config['note'] = "";
            $config['param']['preempt-delay'] = formatpost($_POST['preempt_delay']);
            $sr = sendRequestSingle($config);
            if($sr != 0){
                $msg .= $sr;
            }
        }
        unset($config);
        $i = 0;
        if ($_POST['dev']) {
            $dev = explode(",", $_POST['dev']);
            foreach ($dev as $value) {
                $config[$i]['modules'] = "network interface";
                $config[$i]['action'] = "";
                $config[$i]['param']['__NA__'] = $value;
                $config[$i]['param']['tgid'] = $_POST['id'];
                $config[$i]['note'] = "设置TGID";
                $i++;
            }
            $sr = sendRequestMultiple($config);
            if($sr != 0){
                $msg .= $sr;
            }
        }
        if($msg != ''){
            echo $msg;
        }else{
            echo 0;
        }        
    }

//编辑弹出界面
    function editWindow() {

        $this->display('Window/system_ha_edit_window');
    }

//删除数据
    function haGroupDel() {
        $config['modules'] = "ha group";   //模块名
        $config['action'] = "";              //操作名称
        $config['note'] = "";
        if ($_POST['id'])
            $config['param']['__NA__id'] = formatpost($_POST['id']);
        $config['param']['__NA__del'] = "delete";
        $rspString = sendRequestSingle($config);
        //$rspString = getResponse('ha group', '', $param, 2);
        unset($config);
        $i = 0;
        if ($_POST['dev']) {
            $dev = explode(",", $_POST['dev']);
            foreach ($dev as $value) {
                if ($value) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__'] = $value;
                    $config[$i]['param']['tgid'] = 0;
                    $config[$i]['note'] = "设置TGID";
                    $i++;
                }
            }
            $rspString = sendRequestMultiple($config);
        }
        echo $rspString;
    }

    //数据编辑       
    function haGroupEditSave() {

        if ($_POST['id'])
            $config['param']['__NA__'] = formatpost($_POST['id']);
        if ($_POST['preempt']) {

            $config['modules'] = "ha group";   //模块名
            $config['action'] = "";              //操作名称
            $config['note'] = "";
            $config['param']['preempt'] = formatpost($_POST['preempt']);
            //下发配置
            $rspString = sendRequestSingle($config);
        }
        unset($config['param']['preempt']);
        if ($_POST['preempt_delay']) {

            $config['modules'] = "ha group";   //模块名
            $config['action'] = "";              //操作名称
            $config['note'] = "";
            $config['param']['preempt-delay'] = formatpost($_POST['preempt_delay']);
            //下发配置
            $rspString = sendRequestSingle($config);
        }
        unset($config['param']['preempt-delay']);
        $i = 0;
        unset($config);
        $dev = explode(",", $_POST['dev']);
        $dev_old = explode(",", $_POST['dev_old']);

        $diff = array_diff($dev, $dev_old);
        if(count($diff) > 0) {
            foreach ($diff as $value) {
                if ($value) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__'] = $value;
                    $config[$i]['param']['tgid'] = $_POST['id'];
                    $config[$i]['note'] = "设置TGID";
                    $i++;
                }
            }
        }

        //$rspString = sendRequestMultiple($config);
        $diff2 = array_diff($dev_old, $dev);
        if(count($diff2) > 0) {
            foreach ($diff2 as $value) {
                if ($value) {
                    $config[$i]['modules'] = "network interface";
                    $config[$i]['action'] = "";
                    $config[$i]['param']['__NA__'] = $value;
                    $config[$i]['param']['tgid'] = 0;
                    $config[$i]['note'] = "设置TGID";
                    $i++;
                }
            }
        }
        if(count($diff) > 0 || count($diff2) > 0)
            $rspString = sendRequestMultiple($config);

        //处理结果
        if ($rspString == 0) {
            echo "0";
        } else {
            echo $rspString;
        }
    }
    //手动切换的方法
    function manualSwitch(){
        $config['modules'] = 'ha switchover';
        $config['action'] = '';
        $config['param']['id'] = $_POST['id'];
        $rspString = sendRequestSingle($config);
        echo $rspString;
    }
    //ha bind开关的方法
    function bindSwitch(){
        $config['modules'] = 'ha bind';
        $config['action'] = 'switch';
        $config['param']['__NA__'] = $_POST['switch'];
        echo sendRequestSingle($config);
    }
    //判断当前ha bind开关的状态
    function haBindStatus(){
        $rspString = getResponse("ha bindswitch", "show", '', 0);
        $res = parseResponse($rspString);
        echo json_encode($res);
    }
    //链路绑定设置中添加数据
    function addHaLink(){
        $config['param']['probe-id'] = $_POST['probe_id'];
        if($_POST['vsys_name'])
        $config['param']['vsys-name'] = $_POST['vsys_name'];
        $config['modules'] = 'ha bind';
        $config['action'] = 'add';
        echo sendRequestSingle($config);
    }
    //清空链路绑定设置的数据
    function linkClean(){
        $config['modules'] = 'ha bind';
        $config['action'] = 'clean';
        echo sendRequestSingle($config);
    }
    //删除链路绑定设置的数据
    function delLink(){
        $probeArr = $_POST['probeId'];
        $vsysArr = $_POST['vsysName'];
        if(is_string($probeArr)) {
            $probeArr = explode('#',$probeArr);
        }
        if(is_string($vsysArr)){
            $vsysArr = explode('#',$vsysArr);
        }
        if(is_array($probeArr)) {
            foreach($probeArr as $k => $val) {
                $param[$k]['modules'] = 'ha bind';
                $param[$k]['action'] = 'delete';
                $param[$k]['param']['probe-id'] = $val;
                if($vsysArr[$k]){
                    $param[$k]['param']['vsys-name'] = $vsysArr[$k];
                }
            }
            echo sendRequestMultiple($param);
        } else {
            $param['modules'] = 'ha bind';
            $param['action'] = 'delete';
            $param['param']['probe-id'] = $probeArr;
            if($vsysArr){
                $param['param']['vsys-name'] = $vsysArr;
            }
            echo sendRequestSingle($param);
        }
    }
    //获取链路探测设置中表格的数据
    function linkData(){
        $rspString = getResponse("ha bindcfg", "show", "", 0);
        $rspString = parseResponseDatagrid($rspString, 0);
        if (is_numeric($rspString) && $rspString == 0) {
            echo '{"rows":[],"total":"0"}';
        } else if (is_array($rspString)) {
            echo json_encode($rspString);
        } else if (is_string($rspString)) {
            echo '{"rows":[],"total":"0"}';
        }
    }
}

?>