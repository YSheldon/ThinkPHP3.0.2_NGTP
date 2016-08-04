<?php

namespace Home\Controller\System;

//use Home\Controller\CommonController;
use Think\Controller;
class GuardController extends Controller {

    public function info_show() {
        require_once APP_PATH . 'Home/Common/menupage.php';
        $conf = getResponse('system topguard','show config','',0);
        $conf = parseResponse($conf);
        unset($conf['@attributes']);
        $this->assign('attrVal',json_encode($conf));
        $this->display('/Default/system_guard_set');
    }

    //启用或停用
    public function startOrstop() {
        $param['param']['__NA__'] = $_GET['par'] == 'enable' ? 'enable' : 'disable';
        $param['modules'] = 'system topguard';
        $param['action'] = 'func';
        echo sendRequestSingle($param);
    }

    //立刻连接服务器 上报信息
    public function nowConnServer() {
        $param['modules'] = 'system topguard';
        $param['action'] = 'now';
        echo sendRequestSingle($param);
    }

    //配置修改
    public function applyConf() {
        $i = 0;
        $param[$i]['modules'] = 'system topguard';
        $param[$i]['action'] = 'set username';
        if($_POST['username']) {
            $param[$i]['param']['__NA__'] = formatpost($_POST['username'],true);
        }
        $i++;
        $param[$i]['modules'] = 'system topguard';
        $param[$i]['action'] = 'set email';
        if($_POST['email']) {
            $param[$i]['param']['__NA__'] = filter_var($_POST['email'],FILTER_VALIDATE_EMAIL);
        }
        $i++;
        $param[$i]['modules'] = 'system topguard';
        $param[$i]['action'] = 'set mobile';
        if($_POST['mobile']) {
            $param[$i]['param']['__NA__'] = formatpost($_POST['mobile'],true);
        }
        $i++;
        $param[$i]['modules'] = 'system topguard';
        $param[$i]['action'] = 'set server';
        if($_POST['server']) {
            $param[$i]['param']['__NA__'] = filter_var($_POST['server'],FILTER_VALIDATE_URL);
        }
        $i++;
        $confItems = json_decode($_POST['confitems'],true);
        foreach($confItems as $key => $val) {
            $param[$i]['modules'] = 'system topguard';
            $param[$i]['action'] = 'set option';
            if($val) {
                $param[$i]['param']['__NA__'] = 'enable ' . $key;
            } else {
                $param[$i]['param']['__NA__'] = 'disable ' . $key;
            }
            $i++;
        }
        echo sendRequestMultiple($param);
    }

}
