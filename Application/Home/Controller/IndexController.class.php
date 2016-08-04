<?php

namespace Home\Controller;

use Think\Controller;

class IndexController extends Controller {

    public function index() {
        //生成js语言包
        _generateJsLanguageFile();
        if ($_REQUEST['msg']) {
            $this->assign('msg', $_REQUEST['msg']);
        }
        $this->display("login");
    }

    public $apacheSSLFile = "/usr/local/apache2/conf/extra/httpd-ssl.conf";
    function login() {
        $flag = $this->getSSLIsEnable();
        if($flag && $_SERVER["SSL_CLIENT_VERIFY"] == "NONE"){
            echo "程序已开启SSL证书登陆模式，没有客户端证书，无法登陆到设备";
            return;
        }

        $param['name'] = formatpost($_POST['name']);
        $param['passwd'] = formatpost($_POST['password']);
        $param['addr'] = $_SERVER['REMOTE_ADDR'];
        $param['type'] = "webui";
        if (LANG_SET == "zh-cn") {
            $param['helpmode'] = 1;
        } else {
            $param['helpmode'] = 0;
        }

        $rspString = sendLogin($param);
        if (strpos($rspString, ":") > 0) {
            $result = explode(":", $rspString);
            $ret['authid'] = $result[1];
            if (!defined('AUTH_ID')) {
                define('AUTH_ID', $ret['authid']);
            }
            //登录校验key存储在cookie，作为已登录标记
            $loginkey = $_SERVER['REMOTE_ADDR'] . time() . $_POST['name'] . $result[1];
            $loginkey = md5($loginkey);
            $currentCookieParams = session_get_cookie_params();
            $dir = dirname($_SERVER['PHP_SELF']);
            if (substr($dir, -1) != '/') {
                $dir = $dir . '/';
            }
            setcookie("loginkey", $loginkey, NULL, $dir . $result[1] . '/', $currentCookieParams['domain'], true, true);
            //将认证id和登录校验key存储在session中，留作校验
            $_SESSION['auth_id'][$result[1]] = $loginkey;
            $_SESSION['username'][$result[1]] = $_POST['name'];
            //记录上次登录用户名
            setcookie("lastusername", $param['name'], NULL, $currentCookieParams['path'], $currentCookieParams['domain'], true, NULL);
            setcookie("username", $param['name'], NULL, $dir . $result[1] . '/', $currentCookieParams['domain'], true, NULL);
            //初始化
            $time = initTimeout();
            setcookie("timeout", $time, NULL, $dir . $result[1] . '/', $currentCookieParams['domain'], true, NULL);

            //初始化cookie
            setcookie("commflag", 0, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
            setcookie("commmsg", '', NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
            setcookie("messager", 0, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
            setcookie("idletime", 0, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
            if ($result[0] == 1000) {
                $ret['url'] = 'password';
            } else {
                $ret['url'] = 'home';
            }
            echo json_encode($ret);
        } else {
            if ($rspString == "-3016" || $rspString == "-3007") {
                echo L('LOGIN_ERR');
            } else {
                if (LANG_SET == "zh-cn") {
                    echo ngtos_ipc_manager_err2str($rspString, 1);
                } else {
                    echo ngtos_ipc_manager_err2str($rspString, 0);
                }
            }
        }
    }

    function getSSLIsEnable(){
        //修改apache SSL配置
        try
        {
            $contents = $this->getFileContent(($this->apacheSSLFile), "httpd-ssl.conf");
        } catch(Exception $ex){
            echo $ex;
        }

        preg_match("/#?\s+SSLCACertificateFile\s+[\"\/a-zA-Z0-9]+ca.cer\s?[\"]{0,1}/",$contents,$tmp);
        if(count($tmp) < 1) {
            return false;
        }
        return true;
    }

    function getFileContent($fileName, $desc){
        $filename = $fileName;
        $result = $this->isFileExsit($fileName);
        if(!$result)
            echo "找不到".$desc."文件";

        $file_size = filesize($filename);
        $handle = fopen($filename, "r");
        $contents = fread($handle, filesize ($filename));
        fclose($handle);
        return $contents;
    }

    function isFileExsit($filename){
        if(file_exists($filename)){
            return true;
        }
        return false;
    }

    function logout() {
        $ret = sendLogout();
        if ($ret == 0) {
            unset($_SESSION['auth_id'][AUTH_ID]);
            echo "success";
        } else {
            echo getErrorInfo($ret, "logout_fail");
        }
    }

    function logoutWindow() {
        $this->display('Window/logout_window');
    }

    function checkOnline() {
        if (!checkLogined()) {
            header('location:' . $_COOKIE['urlorg'] . '?c=Index&a=index&msg=' . 'session失效');
            return false;
        }
        echo ngtos_ipc_online_check(AUTH_ID);
    }

    function home() {
        if (!checkLogined()) {
            header('location:' . $_COOKIE['urlorg']);
        }

        $conn = mysql_connect('127.0.0.1', 'root', 'topsec*talent');
        if ($conn) {
            //如果数据库不存在，创建数据库
            mysql_query("CREATE DATABASE IF NOT EXISTS flow_stat_db", $conn);
            mysql_query("CREATE DATABASE IF NOT EXISTS ngtos", $conn);
            mysql_select_db("ngtos", $conn);
            $sql = "CREATE TABLE IF NOT EXISTS `web_options` ( `username` varchar(100) NOT NULL, `option_name` varchar(256) NOT NULL, `option_value` varchar(256) NOT NULL ) ENGINE=MyISAM DEFAULT CHARSET=utf8;";
            mysql_query($sql, $conn);
            mysql_close($conn);
        }
        require_once APP_PATH . 'Home/Common/menupage.php';
        //$menu = initMenu($menu);

        require_once APP_PATH . 'Home/Conf/modules.php';
        $modules = initHome($modules);

        //从数据库读,如果数据库里没有值，便读取配置文件
        $dbObj = M('web_options', '', 'DB_NGTOS');
        $optionValue = $dbObj->where("username = '" . $_SESSION['username'][AUTH_ID] . "' AND option_name = 'home_modules'")->getField('option_value');

        if ($optionValue != NULL && $optionValue != 'null') {
            $optionArr = json_decode($optionValue);
        } else {
            $optionArr = $default;
        }

        $interval = array();
        $module = array();
        //标记需要显示的模块和获得带定时器模块
        foreach ($modules as $key => $value) {
            if (in_array($key, $optionArr)) {
                $modules[$key]['show'] = 1;
            }
            if ($value['interval'] == 1) {
                array_push($interval, $key);
            }
        }

        //以数据库或者默认模块顺序加载
        foreach ($optionArr as $value) {
            if (array_key_exists($value, $modules)) {
                array_push($module, $value);
            }
        }

        //过滤删除没有权限的默认模块
        for($k = 0; $k < count($default); $k++) {
            if (!array_key_exists($default[$k], $modules)) {
                array_splice($default, $k, 1);
                $k--;
            }
        }

        //需要处理interval定时器的模块
        $this->assign('interval', json_encode($interval));
        //默认模块
        $this->assign('default', json_encode($default));
        //本次需要加载的模块
        $this->assign('module', json_encode($module));
        //用于添加模块面板显示的所有模块和选中信息
        $this->assign('allModule', $modules);
        $this->display();
    }

    function password() {
        if (!checkLogined()) {
            header('location:' . $_COOKIE['urlorg']);
        }
        $rspString = getResponse('system password-complexity', "show", "", 0);
        if (is_numeric($rspString)) {
            $this->assign('error', L('GET_PWD_COMPLEX_FAIL'));
        } else if (substr($rspString, 0, 5) == "error") {
            $this->assign('error', substr($rspString, 0, 5));
        } else {
            $rs = simpleXml2Array($rspString);
            $complexity = $rs['password_complexity'];
            $this->assign('complexity', $complexity);
        }
        $this->display();
    }

    function change_password() {
        $rspString = ngtos_mngt_password_modify(formatpost($_POST['name']), formatpost($_POST['password']));
        if ($rspString == 0) {
            echo $rspString;
        } else {
            if (LANG_SET == "zh-cn") {
                echo ngtos_ipc_manager_err2str($rspString, 1);
            } else {
                echo ngtos_ipc_manager_err2str($rspString, 0);
            }
        }
    }

    function license() {
        $vsid = $_POST['vsid'] ? intval($_POST['vsid']) : 0;
        $module = formatpost($_POST['name']);

        if ($module) {
            echo ngtos_mngt_get_license($vsid, $module);
        }
    }

    function keepAlive() {
        echo checkAuth();
    }

    function getLoginName() {
        echo getAdminName();
    }

    function saveModulesLayout() {
        $model = M('web_options', '', 'DB_NGTOS');
        //删除用户名为 ‘’的记录
        $model->where("username = '" . $_SESSION['username'][AUTH_ID] . "' AND option_name='home_modules' ")->delete();
        $arr = getHomeModules();
        if (count($arr) == 0 || $arr[0]['option_value'] == '[]') {
            $data['username'] = trim($_SESSION['username'][AUTH_ID]);
            $data['option_name'] = 'home_modules';
            if ($_POST['modules'] == "[]") {
                $data['option_value'] = '[]';
            } else {
                $data['option_value'] = str_replace(array(' ',')',';','--','=','|'), "", $_POST['modules']);
            }
            $model->add($data);
        } else {
            $data['option_value'] = str_replace(array(' ',')',';','--','=','|'), "", $_POST['modules']);
            $model->where("username = '" . trim($_SESSION['username'][AUTH_ID]) . "' and option_name = 'home_modules'")->save($data);
        }
    }

}

function getHomeModules() {
    $model = M('web_options', '', 'DB_NGTOS');
    $user_modules = $model->where("username= '" . trim($_SESSION['username'][AUTH_ID]) . "' and option_name='home_modules' ")->select();
    return $user_modules;
}


?>
