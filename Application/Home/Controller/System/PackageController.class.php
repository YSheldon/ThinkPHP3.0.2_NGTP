<?php
namespace Home\Controller\System;
use Home\Controller\CommonController;
class PackageController extends CommonController {
    Public function packageUpload(){
        $conf = getPrivilege("device-maintenance");
        $vsid = getVsid();
        $rspString = getResponse('system patch-strategy', 'show', '', 1);
        $rspString = parseResponseDatagrid($rspString,0);
        foreach($rspString['rows'] as $key=>$value){
            $list_array = $value;
        }
        $this->assign("conf",$conf);
        $this->assign("vsid",$vsid);
        $this->assign("list_array",$list_array);
        require_once APP_PATH . 'Home/Common/menupage.php';
	    $this->display('Default/system_package_show');
    }
    function packageShow(){
         $rspString = getResponse('system patch', 'show', '', 1);
         echo parseResponseDatagrid($rspString);
    }
    function packageInfoJsondata(){
        $rspString = getResponse('system patch', 'show', '', 1);
        echo parseResponseDatagrid($rspString);
    }
    //编辑弹出窗
    function packageWindow(){
        $conf = getPrivilege("device-maintenance");
        $vsid = getVsid();
        $this->assign("conf",$conf);
        $this->assign("vsid",$vsid);
        $rspString = getResponse('system patch-strategy', 'show', '', 1);
        $rspString = parseResponseDatagrid($rspString,0);
        foreach($rspString['rows'] as $key=>$value){
            $list_array = $value;
        }

        //方式 服务器地址获取
        $check_ftp = $list_array ['server'];
        $check_ftpp = explode("://",$check_ftp);
        $check_ftp = $check_ftpp[0];
        $check_ip = $check_ftpp[1];

        //账号与密码获取
        $auth = $list_array['auth'];
        $auth = explode(":",$auth);
        $name = $auth[0];
        $password = $auth[1];
        $this->assign("check_ftp",$check_ftp);
        $this->assign("name",$name);
        $this->assign("check_ip",$check_ip);
        $this->assign("password",$password);
        $this->assign("list_array",$list_array);
        $this->display('Window/system_package_edit');
    }
    //数据提交
    function addPackge(){
        $config['modules'] = "system patch-strategy";
        $config['action'] = "modify-server";
        $config['note'] = "添加ip";
        if($_POST['role_type'])  $config['param']['type'] = formatpost($_POST['role_type']);
        if($_POST['server_ip']) $config['param']['serverip'] = formatpost($_POST['server_ip']);
        if($_POST['ftp_user']) $config['param']['user'] = formatpost($_POST['ftp_user']);
        if($_POST['ftp_pass']) $config['param']['passwd'] = formatpost($_POST['ftp_pass']);
        $rspString = sendRequestSingle($config);
        //时间获取
        unset($config);
        $config['modules'] = "system patch-strategy";
        $config['action'] = "modify-time";
        $config['note'] = "添加时间";
        if($_POST['pri_time'])  $config['param']['period-time'] = formatpost($_POST['pri_time']);
        if($_POST['time_type']) $ttype = formatpost($_POST['time_type']);
        if($_POST['pri_date'] != NULL ) $pdate = formatpost($_POST['pri_date']);
        
        if($ttype == 'date'){
             $config['param']['period-date'] = $pdate;
        }else if($ttype == 'week'){
             $config['param']['period-week'] = $pdate;
        }
        $rspString = sendRequestSingle($config);
        echo $rspString;
    }
    //启用自动升级
    function enablePacksge(){
        $config['modules'] = "system patch-strategy";
        $config['action'] = "enable";
        $config['note'] = "enable";
        echo sendRequestSingle($config);
    }
    //禁止自动升级
    function disablePackage(){
        $config['modules'] = "system patch-strategy";
        $config['action'] = "disable";
        $config['note'] = "disable";
        echo sendRequestSingle($config);
    }
    //立即更新
    function updatePackage(){
        $config['modules'] = "system patch";
        $config['action'] = "update";
        $config['note'] = "update";
        if($_POST['update_app']) $name = formatpost($_POST['update_app']);
        $config['param']['name']= strtolower($name);
        echo sendRequestSingle($config);
    }
    //恢复默认配置
    function resetPackage(){
        $config['modules'] = "system patch-strategy";
        $config['action'] = "reset";
        $config['note'] = "reset";    
        echo sendRequestSingle($config);
    }
    
    function update_more_package(){
        $config['modules'] = "system patch";
        $config['action'] = "update";
        $config['note'] = "update";
        echo sendRequestSingle($config);
    }
    //导入页面
    function packageImportWindow(){
        $this->display('Window/system_package_inport');
    }
    //导入数据
    function packageImport(){
        
        $config['modules'] = "system patch";
        $config['action'] = "webui-import";
        $config['note'] = "webui-import";
        if(!empty($_FILES["file"]["error"])) {
            switch($_FILES["file"]['error']) {
                case '1':
                    $error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
                    break;
                case '2':
                    $error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
                    break;
                case '3':
                    $error = 'The uploaded file was only partially uploaded';
                    break;
                case '4':
                    $error = 'No file was uploaded.';
                    break;

                case '6':
                    $error = 'Missing a temporary folder';
                    break;
                case '7':
                    $error = 'Failed to write file to disk';
                    break;
                case '8':
                    $error = 'File upload stopped by extension';
                    break;
                case '999':
                default:
                    $error = 'No error code avaiable';
            }
            echo $error;
        } else if(empty($_FILES['file']['tmp_name']) || $_FILES['file']['tmp_name'] == 'none') {
            $error = 'No file was uploaded......';
            echo $error;
        } else {
            $config['param']['name']=$_FILES["file"]["name"];
            $newfilename="/tmp/".$_FILES["file"]["name"];
            $config['param']['descrip'] = formatpost($_POST['dest']);
            //判断当前文件名中是否含有特殊字符
            if(preg_match('/\.\./',$newfilename)){
                exit('上传文件中不能存在".."等特殊字符');
            }
            if(move_uploaded_file($_FILES["file"]["tmp_name"],$newfilename)) {
                echo sendRequestSingle($config);
            }
        }
    }
}
?>