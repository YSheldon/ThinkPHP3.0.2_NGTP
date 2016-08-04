<?php

namespace Home\Controller\System;
use Home\Controller\CommonController;
class ServiceController extends CommonController {
    //rest风格中显示数据的方式
    public function datagridShow(){
        $rspString = getResponse("system service","status",'',0);
        $rspString = parseResponseDatagrid($rspString,0);
        if (is_array($rspString)) {
            $outcome[$rspString["rows"][0]['name']] = $rspString["rows"][0]['status'];
            $outcome[$rspString["rows"][1]['name']] = $rspString["rows"][1]['status'];
            $outcome[$rspString["rows"][2]['name']] = $rspString["rows"][2]['status'];
        }
        echo json_encode($outcome);
    }
    //rest风格中编辑数据的方式
    public function edit(){
        if($_REQUEST['default']){
            $rspString = getResponse("system service","default",'',0);
            echo parseResponse($rspString);
            exit;
        }
        //本地服务设置中数据的编辑方法
        parse_str(file_get_contents('php://input'),$dataArr);
        $errorText = '';
        if ($dataArr['sshd']) {
            $param['__NA__'] = $dataArr['sshd'];
            $rspString1 = getResponse('system service',"sshd",$param,0);
            $errorText .= parseResponse($rspString1);
        }
        if ($dataArr['telnetd']) {
            $param['__NA__'] = $dataArr['telnetd'];
            $rspString2 = getResponse('system service', "telnetd",$param,0);
            $errorText .= parseResponse($rspString2);
        }
        if ($dataArr['httpd']) {
            $param['__NA__'] = $dataArr['httpd'];
            $rspString3 = getResponse('system service', "httpd",$param,0);
            $errorText .= parseResponse($rspString3);
        }
        echo $errorText;
    }
	public function Set() {
		require_once APP_PATH . 'Home/Common/menupage.php';
		$rspString = getResponse("system service","status",'',0);
		$rspString = parseResponseDatagrid($rspString,0);
	    if (is_array($rspString)) {
	        $outcome[$rspString["rows"][0]['name']] = $rspString["rows"][0]['status'];
	        $outcome[$rspString["rows"][1]['name']] = $rspString["rows"][1]['status'];
	        $outcome[$rspString["rows"][2]['name']] = $rspString["rows"][2]['status'];
    	}
    		$this->assign('outcome',$outcome);
		    $this->display('Default/system_service_set');
	}
/*	public function EditSave() {
		$errorText = '';
	    if ($_POST['sshd']) {
	        $param['__NA__'] = $_POST['sshd'];
	        $rspString1 = getResponse('system service',"sshd",$param,0);
	        $errorText .= parseResponse($rspString1);
	    }
	    if ($_POST['telnetd']) {
	        $param['__NA__'] = $_POST['telnetd'];
	        $rspString2 = getResponse('system service', "telnetd",$param,0);
	        $errorText .= parseResponse($rspString2);
	    }
	    if ($_POST['httpd']) {
	        $param['__NA__'] = $_POST['httpd'];
	        $rspString3 = getResponse('system service', "httpd",$param,0);
	        $errorText .= parseResponse($rspString3);
	    }
	    echo $errorText;
	}*/
/*	public function Defaults(){
		$rspString = getResponse("system service","default",'',0);
		echo parseResponse($rspString);
	}*/
}
?>