<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class SnmpController extends CommonController {

    public function snmp_show() {
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tab']==2)
            $this->display('/Default/system_snmp_control_show');
        else if($_GET['tab']==3)
            $this->display('/Default/system_snmp_SNMPV3_show');
        else
            $this->display('/Default/system_snmp_show');
	return;
    }
    //rest方式的显示数据的方法
    public function datagridShow(){
        if($_REQUEST['mod']){
            parent::datagridShow();
            exit;
        }
        global $global;
        $f = 0;
        $page = ($_GET['page']||$_POST['page'])?$_POST['page']:1;
        $count = ($_GET['rows']||$_POST['rows'])?$_POST['rows']:$global['rows'];
        $page = ($page)?$page:$_GET['page'];
        $count = ($count)?$count:$_GET['rows'];

        if($page=="1" || empty($_SESSION["snmpStr"])){
            $glpage = $page;
            $_POST['page'] = 1;
            $hrspString = parseResponseDatagrid(getResponse("system snmp managehost", "show", "", 2),0);
            $grspString = parseResponseDatagrid(getResponse("system snmp managesubnet", "show", "", 2),0);

            if(is_numeric($hrspString) && $hrspString == 0 && is_numeric($grspString) && $grspString == 0){
                $f =1;
            }else{
                $sum_arr = array();
                if($hrspString != null)
                    $sum_arr = array_merge_recursive($sum_arr,  $hrspString);
                if($grspString != null)
                    $sum_arr = array_merge_recursive($sum_arr,  $grspString);

                $_SESSION["snmpStr"] = $sum_arr;
                $all_str = getFilterResultLocal($_SESSION["snmpStr"], $glpage, $count);
            }
        }else{
            $all_str = getFilterResultLocal($_SESSION["snmpStr"], $page, $count);
        }
        if($f == 1){
            echo '{"rows":[],"count":0}';
        }else{
            echo get_jsondata($all_str);
        }
        return;
    }
    public function snmp_manage_show(){
        global $global;
        $f = 0;
        $page = ($_GET['page']||$_POST['page'])?$_POST['page']:1;
        $count = ($_GET['rows']||$_POST['rows'])?$_POST['rows']:$global['rows'];
        $page = ($page)?$page:$_GET['page'];
        $count = ($count)?$count:$_GET['rows'];

        if($page=="1" || empty($_SESSION["snmpStr"])){
            $glpage = $page;
            $_POST['page'] = 1;
            $hrspString = parseResponseDatagrid(getResponse("system snmp managehost", "show", "", 2),0);
            $grspString = parseResponseDatagrid(getResponse("system snmp managesubnet", "show", "", 2),0);

            if(is_numeric($hrspString) && $hrspString == 0 && is_numeric($grspString) && $grspString == 0){
                $f =1;
            }else{
                $sum_arr = array();
                if($hrspString != null)
                    $sum_arr = array_merge_recursive($sum_arr,  $hrspString);
                if($grspString != null)
                    $sum_arr = array_merge_recursive($sum_arr,  $grspString);

                $_SESSION["snmpStr"] = $sum_arr;
                $all_str = getFilterResultLocal($_SESSION["snmpStr"], $glpage, $count);
            }
        }else{
            $all_str = getFilterResultLocal($_SESSION["snmpStr"], $page, $count);
        }
        if($f == 1){
            echo '{"rows":[],"count":0}';
        }else{
            echo get_jsondata($all_str);
        }
        return;
    }
    
/*    public function setlocationShow(){
        $rspString = parseResponseDatagrid(getResponse("system snmp", "location_show", "", 1),1);
        echo $rspString;
        return;
    }
    public function setcontactShow(){
        $rspString = parseResponseDatagrid(getResponse("system snmp", "contact_show", "", 1),1);
        echo $rspString;
        return;
    }
    public function showSnmp(){
        $rspString = parseResponseDatagrid(getResponse("system snmp", "status_show", "", 1),1);
        echo $rspString;
        return;
    }*/
    public function snmp_addHost1(){
        $this->display('/Window/system_snmp_addHost1_window');
	return;
    }
    //rest方式的添加数据的方法
    public function add(){
        switch($_REQUEST['type']){
            //添加snmp管理主机
            case 'host':
                if($_POST['hostName'])
                    $param['name'] = formatpost($_POST['hostName']);
                $snmp_tag = formatpost($_POST['snmp_tag']);

                if($snmp_tag == 1){
                    if($_POST['hostIp'])
                        $param['hostip'] = formatpost($_POST['hostIp']);
                    if($_POST['community'])
                        $param['community'] = formatpost($_POST['community']);
                    $config['modules']='system snmp managehost';
                    $config['action']='add';
                    $config['param']=$param;
                    $rspString = sendRequestSingle($config);
                }else{
                    if($_POST['subnetIp'])
                        $subnetIp = formatpost($_POST['subnetIp']);
                    if($_POST['subnetIp_stop'])
                        $subnetIp_stop = formatpost($_POST['subnetIp_stop']);
                    $param['subnet'] = $subnetIp."/".$subnetIp_stop;
                    if($_POST['community'])
                        $param['community'] = formatpost($_POST['community']);
                    $config['modules']='system snmp managesubnet';
                    $config['action']='add';
                    $config['param']=$param;
                    $rspString = sendRequestSingle($config);
                }
                echo $rspString;
                return;
                break;
            //添加snmp陷阱主机的方法
            case 'control':
                if($_POST['hostName1']!='')
                    $param['name'] = formatpost($_POST['hostName1']);
                if($_POST['hostIp1']!='')
                    $param['hostip'] = formatpost($_POST['hostIp1']);
                $config['modules']='system snmp traphost';
                $config['action']='add';
                $config['param']=$param;
                $rspString = sendRequestSingle($config);
                echo $rspString;
                return;
                break;
            case 'snmpv3':
                if($_POST['userName']!='')
                    $param['name'] = formatpost($_POST['userName']);
                if($_POST['snmp_user_lev_type'])
                    $param['securitylevel'] = formatpost($_POST['snmp_user_lev_type']);
                if($_POST['userPassword'])
                    $param['authpass'] = formatpost($_POST['userPassword']);
                if($_POST['userSelfpassword'])
                    $param['privpass'] = formatpost($_POST['userSelfpassword']);
                $config['param']=$param;
                $flag = $_POST['tag'];
                if($flag == 1){
                    $config['action']='add';
                }else{
                    $config['action']='modify';
                }
                $config['modules']='system snmp snmpv3user';
                echo $rspString = sendRequestSingle($config);
                return;
                break;
        }

    }
    public function snmp_manage_add(){
        if($_POST['hostName'])
        $param['name'] = formatpost($_POST['hostName']);
        $snmp_tag = formatpost($_POST['snmp_tag']);

        if($snmp_tag == 1){
            if($_POST['hostIp'])
                $param['hostip'] = formatpost($_POST['hostIp']);
            if($_POST['community'])
                $param['community'] = formatpost($_POST['community']);
                $config['modules']='system snmp managehost';
                $config['action']='add';
                $config['param']=$param;
                $rspString = sendRequestSingle($config);
        }else{
            if($_POST['subnetIp'])
                $subnetIp = formatpost($_POST['subnetIp']);
            if($_POST['subnetIp_stop'])
                $subnetIp_stop = formatpost($_POST['subnetIp_stop']);
            $param['subnet'] = $subnetIp."/".$subnetIp_stop;
            if($_POST['community'])
                $param['community'] = formatpost($_POST['community']);
                $config['modules']='system snmp managesubnet';
                $config['action']='add';
                $config['param']=$param;
                $rspString = sendRequestSingle($config);
        }
        echo $rspString;
        return;
    }
    public function control_show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/system_snmp_control_show');
	return;
    }
/*    public function snmp_control_show(){
         $rspString = parseResponseDatagrid(getResponse("system snmp traphost", "show", "", 1));
        echo $rspString;
        return;
    }*/
/*    public function snmp_addHost2(){
        $this->display('/Window/system_snmp_addHost2_window');
	return;
    }*/
    public function snmp_control_add(){
        if($_POST['hostName1']!='')
        $param['name'] = formatpost($_POST['hostName1']);
        if($_POST['hostIp1']!='')
        $param['hostip'] = formatpost($_POST['hostIp1']);
        $config['modules']='system snmp traphost';
        $config['action']='add';
        $config['param']=$param;
        $rspString = sendRequestSingle($config);
        echo $rspString;
        return;
    }
    public function del_snmpControl(){
        if($_POST['name']!='')
        $param['name'] = formatpost($_POST['name']);
        $config['modules']='system snmp traphost';
        $config['action']='delete';
        $config['param']=$param;
        $rspString = sendRequestSingle($config);
        echo $rspString;
        return;
    }
    public function del(){
        //如果检测到有mod参数的时候使用父类中的删除的方法
        if($_REQUEST['mod']){
            parent::del();
        }
        //获取前台传过来的数据
        parse_str(file_get_contents('php://input'),$delArr);
        if($delArr['ip'] == 1){
            $config['modules']='system snmp managehost';
        }else{
            $config['modules']='system snmp managesubnet';
        }
        unset($delArr['ip']);
        $config['action']='delete';
        $config['param']=$delArr;
            $rspString = sendRequestSingle($config);
            echo $rspString;
            return;
    }

/*    public function snmp_SNMPV3_show(){
        $rspString = parseResponseDatagrid(getResponse("system snmp snmpv3user", "show", "", 1));
        echo $rspString;
        return;
    }*/
/*    public function snmp_addHost3(){
        $this->display('/Window/system_snmp_addHost3_window');
	return;
    }*/
    public function snmp_SNMPV3_add(){
        if($_POST['userName']!='')
            $param['name'] = formatpost($_POST['userName']);
        if($_POST['snmp_user_lev_type'])
            $param['securitylevel'] = formatpost($_POST['snmp_user_lev_type']);
        if($_POST['userPassword'])
            $param['authpass'] = formatpost($_POST['userPassword']);
        if($_POST['userSelfpassword'])
            $param['privpass'] = formatpost($_POST['userSelfpassword']);
        $config['param']=$param;
        $flag = $_POST['tag'];
        if($flag == 1){
            $config['modules']='system snmp snmpv3user';
            $config['action']='add';
        }else{
            $config['modules']='system snmp snmpv3user';
            $config['action']='modify';
        }
        echo $rspString = sendRequestSingle($config);
        return;
    }

    public function snmp_btn_app(){
        $i = 0;

        $config[$i]['modules'] = "system snmp set";
        $config[$i]['action'] = "";
        $config[$i]['param']['contact'] = $_POST['call'];
        $i++;

        $config[$i]['modules'] = "system snmp set";
        $config[$i]['action'] = "";
        $config[$i]['param']['location'] = $_POST['position'];
        $i++;
        $retError = sendRequestMultiple($config);
        echo $retError;
        return;
    }
    public function snmp_btn_start(){
        $config['modules']='system snmp';
        $config['action']='start';
        $rspString = sendRequestSingle($config);
        echo $rspString;
        return;
    }
    public function snmp_btn_stop(){
        $config['modules']='system snmp';
        $config['action']='stop';
        $rspString = sendRequestSingle($config);
        echo $rspString;
        return;
    }
    //获得snmp中的位置和地址
    public function snmpGetPositionAddress(){
        $val = $_REQUEST['v'];
        if($val == 'setlocationShow'){
            $act = 'location_show';
        }else if($val == 'setcontactShow'){
            $act = 'contact_show';
        }else if($val == 'showSnmp'){
            $act = 'status_show';
        }
        $rspString = parseResponseDatagrid(getResponse('system snmp', $act, "", 1),1);
        echo $rspString;
        return;
    }
}
