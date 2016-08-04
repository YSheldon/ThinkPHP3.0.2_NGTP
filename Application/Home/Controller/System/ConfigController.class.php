<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class ConfigController extends CommonController {

    public function config_show() {
        $vsid = getVsid();
        $this->assign('vsid',$vsid);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/system_parameters_config');
    }

//保存
    function fileSave() {
        $config['modules'] = "save";   //模块名
        $config['action'] = "";              //操作名称   
        $config['note'] = "保存";
        echo sendRequestSingle($config);
        //$rspString = getResponse( 'save', "" , $param, 2 );
    }

//另存为下发数据
    function fileSaveas() {
        $config['modules'] = "system config_file";   //模块名
        $config['action'] = "save_as";              //操作名称   
        $config['note'] = "另存为";
        $config['param']['__NA__'] = formatpost($_GET['filename']);
        $config['param']['comment'] = formatpost($_GET['comment']);
        echo sendRequestSingle($config);
        //$rspString = getResponse('system config_file', 'save_as', $param, 2);
    }

//导入弹出框
    function importPage() {
        $this->display('Window/system_config_import_window');
    }
//部分倒入配置
   function smallimportPage(){
       
       $this->display('Window/system_config_smallimport_window');
       
   }
    function importHandle() {
        $error = "";
        $des1 = trim($_POST["des"]);
        $tag1 = intval($_POST["tag"]);
        $fileElementName = 'file'; //文件ID
        $name = getAdminName(); //用户名称
        $filename = $_FILES[$fileElementName]["name"]; //文件的名称
        if (!empty($_FILES[$fileElementName]['error'])) {
            switch ($_FILES[$fileElementName]['error']) {
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
            mb_internal_encoding('UTF-8');
            if($_POST['importId']==1){
                self::create_folders('/tmp/allconf/import/');
                $newfilename = '/tmp/allconf/import/' . $filename;
                if(preg_match('/\.\./',$newfilename)){
                    exit('文件中不能存在".."等字符');
                }
            }else{
                //新建目录：/import/用户名/
                self::create_folders('/tmp/import/' . $name);

                //将上传的文件存放于/tmp/目录下
                $newfilename = '/tmp/import/' . $name . '/' . $filename;
                if(preg_match('/\.\./',$newfilename)){
                    exit('文件中不能存在".."等字符');
                }
            }
            if (move_uploaded_file($_FILES[$fileElementName]["tmp_name"], $newfilename)) {
                if($_POST['importId']==1){
                    $config['modules'] = "system config-allfile";   //模块名
                    $config['action'] = "import";              //操作名称   
                    $config['param']['tar_name'] = $filename;
                    $rspString = sendRequestSingle($config);
                }else{
                    $config['modules'] = "system config_file";   //模块名
                    $config['action'] = "import";              //操作名称   
                    $config['note'] = "导入";
                    $config['param']['__NA__'] = $name . '/' . $filename;
                    $config['param']['comment'] = $des1;
                    $rspString = sendRequestSingle($config);
                }
                //$rspString = getResponse( 'system config_file', "import" , $param, 2 );

                if (is_numeric($rspString) && $rspString == 0) {
                    unset($config);
                    //替换当前配置
                    if ($_POST['tag'] == 1) {
                        $config['modules'] = "system config_file";   //模块名
                        $config['action'] = "load";              //操作名称   
                        $config['note'] = "导入";
                        $config['param'] = array();
                        $config['param']['__NA__'] = $filename;
                        echo sendRequestSingle($config);
                        //$rspString1 = getResponse('system config_file', 'load', $param, 2);
                    } else {
                        echo "0"; //上传用户名和文件名成功
                    }
                } else {
                    unlink($newfilename);
                    echo $rspString;
                }
            }
        }
    }
//导入
    function create_folders($dir){

           return is_dir($dir) or (self::create_folders(dirname($dir)) and mkdir($dir, 0777));

    }
//导出（1）
    function windowExport(){
        
        $this->display('Window/system_config_export');
        
    }
//导出
    function fileExport() {
        if ($_POST['filename'])
            $name = formatpost($_POST['filename']);
        if ($_POST['username'])
            $username = formatpost($_POST['username']);
        if ($_POST['config_type'])
            $config_type = formatpost($_POST['config_type']);
        if($config_type == "on"){
            
            $config['param']['encrypt'] = "yes";
        }
        
        if($_POST['exportId']==1){
            $config['param']['tar_name'] = "ALL-Config_".time();
            $name = $config['param']['tar_name'] . '.tar.bz2';
            $config['modules'] = "system config-allfile";   //模块名
            $config['action'] = "export";              //操作名称   
            $config['note'] = "全部导出";
        }else{
            if (strpos($name, '&lt;')) {
                $config['param']['file'] = $username . '/' . str_replace('&lt;', '|', $name);
                $config['param']['tar_name'] = time();
                $name = $config['param']['tar_name'] . '.tar.bz2';
            } else {
                $config['param']['file'] = $username . '/' . $name;
            }
            $config['modules'] = "system config_file";   //模块名
            $config['action'] = "export";              //操作名称   
            $config['note'] = "部分导出";
        }
        $rspString = sendRequestSingle($config);
        if (is_numeric($rspString) && $rspString == 0) {
            if($_POST['exportId']==1)
                $filename = '/tmp/allconf/export/' . $name;
            else
                $filename = '/tmp/export/' . $username . '/' . $name;
            if (file_exists($filename)) {
                //下载服务器文件保存到本地目录下
                $ua = $_SERVER ["HTTP_USER_AGENT"];
                header('Content-type: application/octet-stream');
                header('Pragma: public');
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                header("Cache-Control: public");
                header('Expires: 0');
                if (preg_match("/MSIE/", $ua)) {
                    header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
                } else if (preg_match("/Firefox/", $ua)) {
                    header('Content-Disposition: attachment; filename*="utf8\'\'' . $name . '"');
                } else {
                    header('Content-Disposition: attachment; filename="' . $name . '"');
                }
                header("Content-Length:" . filesize($filename));
                header("Content-Transfer-Encoding: binary");
                ob_end_clean();
                flush();
                @readfile($filename);
                unlink($filename);
                return;
            }
        } else {
            header("Content-type: text/html; charset=utf-8");
            echo '<script>alert("'.$rspString.'"); window.history.back();</script>';
        }
    }

//删除
    function fileDelete() {
        $config['modules'] = "system config_file";   //模块名
        $config['action'] = "delete";              //操作名称   
        $config['note'] = "删除";
        if ($_POST['filename'])
            $names = formatpost($_POST['filename']);
            $names_arr = explode('&lt;', $names);
            
            $wrong = '';
            for ($i = 0; $i < (count($names_arr) - 1); $i++) {

            $config['param']['__NA__'] = $names_arr[$i];
            $rspString = sendRequestSingle($config);
            //$rspString = getResponse('system config_file', 'delete', $param, 2);	
        }
        echo $rspString;
    }

//恢复默认
    function resete() {
        $config['modules'] = "system config";   //模块名
        $config['action'] = "reset";              //操作名称   
        $config['note'] = "恢复";
        echo sendRequestSingle($config);
        //$rspString = getResponse('system config', 'reset', $param, 2);
    }

//状态
    function fileLoad() {
        $config['modules'] = "system config_file";   //模块名
        $config['action'] = "load";              //操作名称   
        $config['note'] = "状态";
        if ($_GET['filename'])
            $config['param']['__NA__'] = formatpost($_GET['filename']);
        echo sendRequestSingle($config);
        //$rspString = getResponse('system config_file', 'load', $param, 2);	
    }
//部分导入    
    function smallimportHandle(){
        $error = "";
        $fileElementName = 'file'; //文件ID
        $name = getAdminName(); //用户名称
        $filename = $_FILES[$fileElementName]["name"]; //文件的名称
        if (!empty($_FILES[$fileElementName]['error'])) {
            switch ($_FILES[$fileElementName]['error']) {
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
            mb_internal_encoding('UTF-8');
            //新建目录：/import/用户名/
            self::create_folders('/tmp/import/' . $name);

            //将上传的文件存放于/tmp/目录下
            $newfilename = '/tmp/import/' . $name . '/' . $filename;
            if(preg_match('/\.\./',$newfilename)){
                exit('上传文件中不能存在".."等字符');
            }
            
            if (move_uploaded_file($_FILES[$fileElementName]["tmp_name"], $newfilename)) {
                $config['modules'] = "system batch-file";   //模块名
                $config['action'] = "import";              //操作名称   
                $config['note'] = "导入";
                $config['param']['file'] = $newfilename;
//                var_dump($config);die;
                echo sendRequestSingle($config);
            }
        }
    }
//部分导出界面  
    function smallwindowExport(){
        
         $rspString = getResponse('system batch-file', "show", $param, 1);
         $rspString = parseResponse($rspString,1);
         foreach ($rspString['rows'] as $k=>$v){
            $name[$k]['cn'] =$rspString['rows'][$k]['cn_name'];
            $name[$k]['class'] =$rspString['rows'][$k]['class'];
         }
         $this->assign("name",$name);
         $this->display('Window/system_smallwindowExport_config');
    }
//部分导出配置    
    function smallFileExport(){

        if ($_POST['type'])
            $config_type = formatpost($_POST['type']);
        if ($_POST['name'])
            $name = formatpost($_POST['name']);
        $config['param']['class'] = $config_type;
        $time = date("YdmHi",time());
        $name = $name.'-'.$time;
        
        $config['param']['file'] = '/tmp/'.$name;
        $config['modules'] = "system batch-file";   //模块名
        $config['action'] = "export";              //操作名称   
        $config['note'] = "导出";
        $rspString = sendRequestSingle($config);
        if (is_numeric($rspString) && $rspString == 0) {
            $filename = '/tmp/'.$name;
            if (file_exists($filename)) {
                //下载服务器文件保存到本地目录下
                $ua = $_SERVER ["HTTP_USER_AGENT"];
                header('Content-type: application/octet-stream');
                header('Pragma: public');
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                header("Cache-Control: public");
                header('Expires: 0');
                if (preg_match("/MSIE/", $ua)) {
                    header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
                } else if (preg_match("/Firefox/", $ua)) {
                    header('Content-Disposition: attachment; filename*="utf8\'\'' . $name . '"');
                } else {
                    header('Content-Disposition: attachment; filename="' . $name . '"');
                }
                header("Content-Length:" . filesize($filename));
                header("Content-Transfer-Encoding: binary");
                ob_end_clean();
                flush();
                @readfile($filename);
                unlink($filename);
                return;
            }
        } else {
            require_once APP_PATH . 'Home/Common/menupage.php';
            $retError = $rspString;
            $this->display('/Default/system_parameters_config');
            endSystem();
        }
    }

}
