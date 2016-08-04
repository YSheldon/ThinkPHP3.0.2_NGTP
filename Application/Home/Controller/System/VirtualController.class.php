<?php
namespace Home\Controller\System;
use Home\Controller\CommonController;
class VirtualController extends CommonController{
        public function vsys_show(){
            require_once APP_PATH . 'Home/Common/menupage.php';
            $this->display('Default/system_vsys_show');
        }
        
        function vsysData(){
            
            $rspString = getResponse('vsys show', '', '', 1);
            echo parseResponseDatagrid($rspString);
        }
//数据添加界面
        function addVsysWindow(){

           $bag_license = getLicenseValue(MAXSESSION,0);
           $oper = $_GET["oper"];
           $this->assign("oper",$oper);
           $this->assign("bag_license",$bag_license);
           $this->display('Window/system_vsys_add');
           
        }
        
        function showInterfaceLeft(){
            
            $rspString = getResponse("network interfaces", "show all",'', 0);
            echo  parseResponseDatagrid($rspString);
        }

        
        
 //添加数据       
        function vsysAdd(){
            
             $config['modules'] = "vsys";   //模块名
             $config['action'] = "add";              //操作名称
             $config['note'] = "add";            //错误信息自定义头部        
             $config['param']['vsys-name'] = trim($_POST['vsys_name']);
             $config['param']['vsys-mode'] = trim($_POST['vsys_pattern']);
             $config['param']['quota'] = trim($_POST['vsys_quota']);
             $config['param']['rate'] = trim($_POST['vsys_rate']);
             echo sendRequestSingle($config);
        }
//编辑数据
        function vsysEdit(){
           //去使能
            $i=0;
            if($_POST['vsys_name'] !="root_vsys"){
                if($_POST['vsys_enable']){
                    if($_POST['vsys_enable'] == "disable"){
                        $config[$i]['modules'] = "vsys";   //模块名
                        $config[$i]['action'] = "disable"; //操作名称
                        $config[$i]['note'] = "disable";  
                        $config[$i]['param']['vsys-name'] = trim($_POST['vsys_name']);
                    }else{
                        $config[$i]['modules'] = "vsys";   //模块名
                        $config[$i]['action'] = "enable";  //操作名称
                        $config[$i]['note'] = "enable";  
                        $config[$i]['param']['vsys-name'] = trim($_POST['vsys_name']);
                     }
                     $i++;
                }
            }
                //修改配额
            if($_POST['vsys_quota']){
                $config[$i]['modules'] = "vsys";   //模块名
                $config[$i]['action'] = "set ";              //操作名称
                $config[$i]['note'] = "set ";  
                $config[$i]['param']['vsys-name'] = trim($_POST['vsys_name']);
                $config[$i]['param']['quota'] = trim($_POST['vsys_quota']);
                $rspString = sendRequestSingle($config);
                $i++;
            }
              //修改速率
            if($_POST['vsys_rate']){ 
                $config[$i]['modules'] = "vsys";   //模块名
                $config[$i]['action'] = "set ";    //操作名称
                $config[$i]['note'] = "set "; 
                $config[$i]['param']['vsys-name'] = trim($_POST['vsys_name']);
                $config[$i]['param']['rate'] = trim($_POST['vsys_rate']);
                $rspString = sendRequestSingle($config);
                $i++;
            }
                $new_interface = $_POST['interface'];
                $ord_interface = $_POST['ord_interface'];
                $new_interface = explode(" ", $new_interface);
                $ord_interface = explode(" ", $ord_interface);
                $diff = array_diff($new_interface, $ord_interface);
                foreach ($diff as $value) {
                    if ($value) {
                        $config[$i]['modules'] = "vsys";
                        $config[$i]['action'] = "set";
                        $config[$i]['param']['vsys-name'] = trim($_POST['vsys_name']);
                        $config[$i]['param']['interface'] = $value;
                        $config[$i]['note'] = "接口 set";
                       $i++;
                    }
                }
                $difff = array_diff($ord_interface, $new_interface);
                foreach ($difff as $value) {
                    if ($value) {
                        $config[$i]['modules'] = "vsys";
                        $config[$i]['action'] = "set";
                        $config[$i]['param']['vsys-name'] = "root_vsys";
                        $config[$i]['param']['interface'] = $value;
                        $config[$i]['note'] = "接口 set";
                       $i++;
                    }
                }
                $rspString = sendRequestMultiple($config);
                echo $rspString;
     }
//删除数据
/*        function delVsys(){
            
            $config['modules'] = "vsys";   //模块名
            $config['action'] = "del ";              //操作名称
            $config['note'] = "del "; 
            $config['param']['vsys-name'] = trim($_POST['vsys_name']);
            echo sendRequestSingle($config);
        }*/
//清空数据
        function clear(){
            
            $module_name = "vsys";
            $config['modules'] = $module_name;
            $config['action'] = "clean";
            echo sendRequestSingle($config);
        }
	function vsysTurn(){

		echo getVsysTurn();

	}
        

//	function vsysDataAll(){
//		
//		$rspString = getResponse('network vsys', 'show', '', 0);
//                echo parseResponseDatagrid($rspString);
//	}
//	function vrDataAll(){
//		
//		$rspString = getResponse('network vr', 'show', '', 0);
//                echo parseResponseDatagrid($rspString);
//	}

	function responseToJson($rspString) {

		echo handleGetResponse($rspString);
	}
}
?>