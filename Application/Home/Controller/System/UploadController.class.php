<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class UploadController extends CommonController {

    public function upload_file() {

        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/system_upload_file');
    }

    function uploadJsondata() {

        $DEBUG_SWITCH = 0;
        $rspString = getResponse("system firmware", "show", $param, 1);
        echo parseResponseDatagrid($rspString);
    }

//导入弹出框
    function uploadWindow() {
        $conf = getPrivilege("device-maintenance");
        $vsid = getVsid();
        $this->assign("conf",$conf);
        $this->assign("vsid",$vsid);
        $this->display('Window/system_upload_window');
    }

//固件维护->导入->升级方式为本地->选中替换版本->提交 
    function localUpdate() {

        $config['modules'] = "save";   //模块名
        $config['action'] = "";              //操作名称  
        $config['note'] = "save";
        if ($_POST['reboot_tag'])
            $rtag = formatpost($_POST['reboot_tag']);
        if ($rtag == 1)
            $rspString = sendRequestSingle($config);
        
        if (!empty($_FILES["file"]["error"])) {
            switch ($_FILES["file"]['error']) {
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
        } else if (empty($_FILES['file']['tmp_name']) || $_FILES['file']['tmp_name'] == 'none') {
            $error = 'No file was uploaded......';
            echo $error;
        } else {
            $param['filename'] = $_FILES["file"]["name"];
            $newfilename = "/tmp/" . $_FILES["file"]["name"];
            if ($_POST['des'])
                $param['comments'] = formatpost($_POST['des']);
            $_SESSION["updateName"] = $param['filename'];
            $_SESSION["updateDes"] = $param['comments'];
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $newfilename)) {
                $rspString = getResponse('system firmware', "webupdate", $param, 1);
                $rspString = parseResponseDatagrid($rspString, 0);
                if (is_array($rspString)) {
                    if ($rspString['total'] == 0) {

                        $config['modules'] = "system reboot";   //模块名
                        $config['action'] = "";              //操作名称  
                        $config['note'] = "system reboot";
                        $rerspString = sendRequestSingle($config);

                        if (is_numeric($rerspString) && $rerspString == 0) {
                            echo 'rebootok';
                        } else {
                            echo $rerspString;
                        }
                    } else {
                        echo json_encode($rspString);
                    }
                } else {
                    echo $rspString;
                }
            } else {
                require_once APP_PATH . 'Home/Common/menupage.php';
                $this->display('Default/system_upload_file');
            }
        }
    }

//固件维护->导入->升级方式为本地->不选中替换框->提交
    function localImport() {

        $config['modules'] = "system firmware";   //模块名
        $config['action'] = "webimport";              //操作名称  
        $config['note'] = "导入";
        if (!empty($_FILES["file"]["error"])) {
            switch ($_FILES["file"]['error']) {
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
        } else if (empty($_FILES['file']['tmp_name']) || $_FILES['file']['tmp_name'] == 'none') {
            $error = 'No file was uploaded......';
            echo $error;
        } else {
            $config['param']['filename'] = $_FILES["file"]["name"];
            $newfilename = "/tmp/" . $_FILES["file"]["name"];
            if(preg_match('/\.\./',$newfilename)){
                exit('上传文件中不能存在".."等特殊字符');
            }
            if ($_POST['des'])
                $config['param']['comments'] = formatpost($_POST['des']);
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $newfilename)) {
                echo sendRequestSingle($config);
            } else {
                require_once APP_PATH . 'Home/Common/menupage.php';
                $this->display('Default/system_upload_file');
            }
        }
    }

////固件维护->导入->升级方式为ftp与tftp->不选中替换框->提交 
    function serviceUpload() {

        if ($_POST['upload_method'])
            $param['get-method'] = formatpost($_POST['upload_method']);
        if ($_POST['ip'])
            $param['serverip'] = formatpost($_POST['ip']);
        if ($_POST['name'])
            $param['filename'] = formatpost($_POST['name']);

        if ($_POST['des'])
            $param['comments'] = formatpost($_POST['des']);

        if ($param['get-method'] == 'ftp') {
            if ($_POST['user'])
                $param['ftp-user'] = formatpost($_POST['user']);
            if ($_POST['pass'])
                $param['ftp-password'] = formatpost($_POST['pass']);
        }
        $rspString = getResponse('system firmware', "import", $param, 1);
        $rspString = parseResponse($rspString, 0);
        if (is_numeric($rspString) && $rspString == 0) {
            echo '0';
        } else if (is_string($rspString)) {
            echo $rspString;
        } else {
            echo $rspString['rows']['retinfo'];
        }
    }

//删除
    function serviceDel() {
        $config['modules'] = "system firmware";   //模块名
        $config['action'] = "delete";              //操作名称  
        $config['note'] = "删除";
        $j = 0;
        $k = 0;
        if ($_POST['del_filename'])
            $delname = formatpost($_POST['del_filename']);
            $str_name = explode(";", $delname);
        for ($i = 0; $i < count($str_name); $i++) {
            $config['param']['filename'] = $str_name[$i];
            $rspString = sendRequestSingle($config);
            //$rspString = getResponse( 'system firmware', "delete", $param, 2 );
            if (is_numeric($rspString) && $rspString == 0)
                $j++;
            else
                $k++;
        }
        if ($k == 0) {
            echo '0';
        } else {
            echo $rspString;
        }
    }

    function serviceLoad() {
        if ($_POST['replace_tag'])
            $tag = formatpost($_POST['replace_tag']);
        if ($tag == 1) {
            $config['modules'] = "save";   //模块名
            $config['action'] = "";              //操作名称  
            $config['note'] = "save";
            $rspString = sendRequestSingle($config);
        }
        if ($_POST['load_filename'])
            $config['param']['filename'] = formatpost($_POST['load_filename']);
            $config['modules'] = "system firmware";   //模块名
            $config['action'] = "load";              //操作名称
            $config['note'] = "load";
            $rspString = sendRequestSingle($config);
        if (is_numeric($rspString) && $rspString == 0) {
            unset($config['param']);
            $config['modules'] = "system reboot";   //模块名
            $config['action'] = "";              //操作名称  
            $config['note'] = "reboot";
            echo sendRequestSingle($config);
        } else {
            echo $rspString;
        }
    }

//健康记录
    function health_export() {

//	$_SESSION["auth_id"] = $_SESSION["auth_id"];
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->assign("SESSIONID", AUTH_ID);
        $this->assign("REMOTE_ADDR", $_SERVER['REMOTE_ADDR']);
        $this->display('Default/system_health_export');
        endSystem($get_url_param);
    }

    function healthInfo() {

        $config['modules'] = "system health";   //模块名
        $config['action'] = "export";              //操作名称  
        $config['note'] = "export";
        $config['param']['__NA__'] = 'tos_health_record' . AUTH_ID;
        echo sendRequestSingle($config);
        //$rspString = getResponse( 'system health', "export" , $param, 2 );
    }

    function healthDelete() {

        $name = 'tos_health_record' . AUTH_ID;
        $file_del = '/tmp/' . $name;
        if (file_exists($file_del)) {
            $result = unlink($file_del);
        }
    }

    function healthDownload() {

        $name = 'tos_health_record' . AUTH_ID;
        $filename = '/tmp/' . $name;
        if (file_exists($filename)) {
            //下载服务器文件保存到本地目录下
            $ua = $_SERVER ["HTTP_USER_AGENT"];
            header('Content-type: application/octet-stream');
            header('Pragma: public');
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: public");
            header('Expires: 0');
            if (preg_match("/MSIE/", $ua)) {
                header('Content-Disposition: attachment; filename="' . $name);
            } else if (preg_match("/Firefox/", $ua)) {
                header('Content-Disposition: attachment; filename*="utf8\'\'' . $name);
            } else {
                header('Content-Disposition: attachment; filename="' . $name);
            }
            header("Content-Length:" . filesize($filename));
            header("Content-Transfer-Encoding: binary");
            ob_end_clean();
            flush();
            @readfile($filename);
            return;
        } else {
            //echo '<script>alert("file does not exist")</script>';
            //require_once APP_PATH . 'Home/Common/menupage.php';
            header("Content-type: text/html; charset=utf-8");
            echo '<script>alert("file does not exist"); location.replace("?c=System/Upload&a=health_export");</script>';
            //$this->display('Default/system_health_export');
        }
    }

//系统重启
    function upload_reboot() {

        require_once APP_PATH . 'Home/Common/menupage.php';
        $DEBUG_SWITCH = 0;
        //$param = getPageAttr();
        $this->display('Default/system_upload_reboot');
        endSystem($get_url_param);
    }

//重启系统按钮
/*    function devSave() {

        $config['modules'] = "save";   //模块名
        $config['action'] = "";              //操作名称  
        $config['note'] = "保存";
        //$rspString = getResponse( 'save', "" , $param, 2 );
        echo sendRequestSingle($config);
    }*/

//license升级重启
    function devReboot() {

        $config['modules'] = "system reboot";   //模块名
        $config['action'] = "";              //操作名称  
        $config['note'] = "reboot";
        echo sendRequestSingle($config);
        //$rspString = getResponse("system reboot", "", $param, 2);
    }

//license升级页面
    function license_upload() {

        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/system_license_file');
    }

//license->tftp提交  
    function licenseTftp() {

        if ($_POST['name'])
        $config['param']['filename'] = formatpost($_POST['name']);
        if ($_POST['ip'])
        $config['param']['serip'] = formatpost($_POST['ip']);
        $config['param']['sysdisk'] = 'normal';
        $config['modules'] = "system license";   //模块名
        $config['action'] = "update";              //操作名称  
        $config['note'] = "update";
        echo sendRequestSingle($config);
//            $rspString = getResponse( 'system license', "update", $param, 2 );
    }

//license->ftp提交         
    function licenseFtp() {

        if ($_POST['name'])
            $config['param']['filename'] = formatpost($_POST['name']);
        if ($_POST['ip'])
            $config['param']['serip'] = formatpost($_POST['ip']);
        if ($_POST['user'])
            $config['param']['ftp-user'] = formatpost($_POST['user']);
        if ($_POST['pass'])
            $config['param']['ftp-password'] = formatpost($_POST['pass']);
        $config['param']['sysdisk'] = 'normal';
        $config['param']['ftp'] = 'yes';
        $config['modules'] = "system license";   //模块名
        $config['action'] = "update";              //操作名称  
        $config['note'] = "update";
        echo sendRequestSingle($config);
//            $rspString = getResponse( 'system license', "update", $param, 2 );
    }

//license->本地提交          
    function licenseLocal() {

        if (!empty($_FILES["file"]["error"])) {

            switch ($_FILES["file"]['error']) {
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
        } else if (empty($_FILES['file']['tmp_name']) || $_FILES['file']['tmp_name'] == 'none') {
            $error = 'No file was uploaded......';
            echo $error;
        } else {
            $newfilename = "/tmp/" . $_FILES["file"]["name"];

            $config['param']['filename'] = $_FILES["file"]["name"];
            $config['param']['sysdisk'] = 'normal';
            if(preg_match('/\.\./',$newfilename)){
                exit('上传文件中不能存在".."等特殊字符');
            }
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $newfilename)) {
                $config['modules'] = "system license";   //模块名
                $config['action'] = "webui_update";              //操作名称  
                $config['note'] = "webui_update";
                echo sendRequestSingle($config);
//                    $rspString = getResponse( 'system license', "webui_update", $param, 2 );
            } else {
                $this->dispaly('Default/system_license_file');
            }
        }
        return;
    }

    function packagePpdate() {

        $config['modules'] = "system firmware";   //模块名
        $config['action'] = "webupdateload";              //操作名称  
        $config['note'] = "webupdateload";
        $config['param']['filename'] = $_SESSION["updateName"];
        $config['param']['comments'] = $_SESSION["updateDes"];
        if ($_POST['dtag'])
        $config['param']['confirm'] = formatpost($_POST['dtag']);
        $rspString = sendRequestSingle($config);
//            $rspString = getResponse( 'system firmware', "webupdateload", $param, 2 );
        if (is_numeric($rspString) && $rspString == 0) {
            unset($config['param']);
            $config['modules'] = "system reboot";   //模块名
            $config['action'] = "";              //操作名称  
            $config['note'] = "";
            $rerspString = sendRequestSingle($config);
//                $rerspString = getResponse("system reboot", "", $reparam, 2);
        } else {
            echo $rspString;
        }
        if (is_numeric($rerspString) && $rerspString == 0) {
            echo 'rebootok';
        } else {
            echo $rerspString;
        }
    }

    function updateCancel() {

        $config['modules'] = "system firmware";   //模块名
        $config['action'] = "webupdateload";              //操作名称  
        $config['note'] = "webupdateload";
        $config['param']['filename'] = $_SESSION["updateName"];
        $config['param']['comments'] = $_SESSION["updateDes"];
        if ($_POST['dtag'])
            $config['param']['confirm'] = formatpost($_POST['dtag']);
        echo sendRequestSingle($config);
//            $rspString = getResponse( 'system firmware', "webupdateload", $param, 2 );
    }

//固件维护->导入->升级方式为ftp与tftp->选中替换框->提交        
    function serviceReboot() {

        if ($_POST['upload_method'])
            $param['get-method'] = formatpost($_POST['upload_method']);
        if ($_POST['ip'])
            $param['serverip'] = formatpost($_POST['ip']);
        if ($_POST['name'])
            $param['filename'] = formatpost($_POST['name']);

        if ($_POST['des'])
            $param['comments'] = formatpost($_POST['des']);
        if ($_POST['tag'])
            $stag = formatpost($_POST['tag']);
        if ($stag == 1){
            $config['modules'] = "save";   //模块名
            $config['action'] = "";              //操作名称
            $config['note'] = "";
            $srspString = sendRequestSingle($config);
        }
        if ($param['get-method'] == 'ftp') {
            if ($_POST['user'])
                $param['ftp-user'] = formatpost($_POST['user']);
            if ($_POST['pass'])
                $param['ftp-password'] = formatpost($_POST['pass']);
        }
        $rspString = getResponse('system firmware', "update", $param, 1);
        $rspString = parseResponse($rspString);
        if (is_numeric($rspString) && $rspString == 0) {

            $config['modules'] = "system reboot";   //模块名
            $config['action'] = "";              //操作名称
            $config['note'] = "";
            $rerspString = sendRequestSingle($config);
//                                    $rerspString = getResponse("system reboot", "", $reparam, 2);
            if (is_numeric($rerspString) && $rerspString == 0)
                echo 'rebootok';
            else {
                echo $rerspString;
            }
        } else if (is_string($rspString)) {
            echo $rspString;
        } else {
            echo $rspString['rows']['retinfo'];
        }
        return;
    }

}

?>