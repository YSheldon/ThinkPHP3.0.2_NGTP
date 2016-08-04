<?php

namespace Home\Controller;
use Think\Controller\RestController;

class CommonController extends RestController {

    public static $_command = array();

    public function _initialize() {
        //$this->_command = include_once APP_PATH . 'Home/Conf/command.php';
        self::$_command = include_once APP_PATH . 'Home/Conf/command.php';
    }

    Public function index() {
        switch ($this->_method){
            case 'get':
                if($this->_type == 'json' && $_GET['fun']){     // 通过url判断请求函数
                    if($_GET['fun'] == 'combo') {
                        $this->comboBox();  //combobox组件查询数据
                    } else {
                        $this->callFun();   //调用其他查询或设置函数（function.php文件中）
                    }
                }elseif($this->_type == 'json') {   //表格数据查询
                    if($_GET['grid']) {
                        $this->treegridShow();  //url参数grid有值时，执行子类的树形表格函数。
                    } else {
                        $this->datagridShow();  //表格查询数据，如有特殊处理，可在子类中重写此函数（子类覆盖父类方法）
                    }
                }elseif ($this->_type == 'html'){
                    //通过url判断是否向模板分配变量，在子类方法分配变量，否则直接加载模板
                    if($_GET['assign']) {
                        //$this->$_GET['assign']();
                        $this->windowShow();
                    } else {
                        $this->display('/Window/'.$_GET['w']);
                    }
                }
                break;
            case 'post':
                $this->add();
                break;
            case 'put':
                if(method_exists($this, 'edit')) {
                    $this->edit();
                } else {
                    $this->add();
                }
                break;
            case 'delete':
                if($_GET['all']){   //url中有all参数时，执行清除，否则执行删除
                    $this->clean();
                } else {
                    $this->del();
                }
                break;
        }
    }

    //弹出框
    public function windowShow() {
        $this->display('/Window/'.$_GET['w']);
    }

    /*
     * 功能：datagrid查询和搜索
     * datagrid需要增加属性：
     *queryParams: {
     *  mod: encodeURI('user auth portal')，
     *  act : 'show'    //可选项。此项如果是show，可不写。注意省略后，mod项最后去掉 ，号。
     *  skey : 'name'   //用于有搜索功能的列表。可选项。如果搜索值的key是name，则可省略。
     *},
     * */
    public function datagridShow() {

        //判断是否是rest模式（整个项目修改完成后删除判断）
        if(strstr(decodeUrl('mod'),' ') || $_REQUEST['mod'] == 'vsys' || $_REQUEST['mod'] == 'save') {
            $modules = decodeUrl('mod');
            $action = $_REQUEST['act'] ? decodeUrl('act') : 'show';
        } else {
            $modules = self::$_command['mod'][$_REQUEST['mod']];
            $action = $_REQUEST['act'] ? self::$_command['action'][$_REQUEST['act']] : 'show';
        }

        $search = decodeUrl('search');   //搜索值。
        if($_REQUEST['param']) {
            $param[$_REQUEST['parKey']] = decodeUrl('param');
        }
        if(!$search) {
            $data = getResponse($modules, $action, $param, $_REQUEST['npage']? 0 : 1);
            if(is_numeric($data) || substr($data, 0, 5) == 'error') {
                echo '{"rows":[],"total":"0"}';
                exit;
            }
            echo parseResponseDatagrid($data);
            exit;
        } else {
            $serachKey = $_REQUEST['skey'] ? $_REQUEST['skey'] : 'name'; //与搜索值对比的key
            //获取当前页page 每页条目rows
            $page = $_REQUEST['page'] ? intval($_REQUEST['page']) : 1;
            $rows = $_REQUEST['rows'] ? intval($_REQUEST['rows']) : 20;
            if($page == '1' || empty($_SESSION['queryStr'])) {
                $data = getResponse($modules, $action, $param, 0);
                $data =  parseResponseDatagrid($data, 0);
                if($data['total'] > 0) {
                    $page = 1;
                    $queryItems = array();
                    $num = 0;
                    foreach($data['rows'] as $val){
                        if(stripos($val[$serachKey], $search) !== false) {
                            $queryItems['rows'][$num] = $val;
                            $num++;
                        }
                    }
                    if($queryItems['rows'][0]) {
                        $queryItems['total'] = $num;

                        $_SESSION['queryStr'] = $queryItems;
                        $dataArr = getFilterResultLocal($_SESSION['queryStr'], $page, $rows);
                        echo json_encode($dataArr);
                    } else {
                        echo '{"rows":[],"total":"0"}';
                    }
                } else {
                    echo '{"rows":[],"total":"0"}';
                }
            } else {
                $dataArr = getFilterResultLocal($_SESSION['queryStr'], $page, $rows);
                echo json_encode($dataArr);
            }
        }
    }
    //删除
    public function del() {
        //判断是否是rest模式（整个项目修改完成后删除判断）
        if(strstr(decodeUrl('mod'),' ') || $_REQUEST['mod'] == 'vsys' || $_REQUEST['mod'] == 'save') {
            $modules = decodeUrl('mod');
            $action = $_REQUEST['act'] ? decodeUrl('act') : 'delete';
            $delArr = $_POST;
        } else {
            $modules = self::$_command['mod'][$_REQUEST['mod']];    
            $action = $_REQUEST['act'] ? self::$_command['action'][$_REQUEST['act']] : 'delete';
            parse_str(file_get_contents("php://input"),$delArr);
        }

        $delItems = $delArr['delItems'];
        $delKey = $delArr['delKey'] ? formatpost($delArr['delKey']) : 'name';      //指定删除的key
        if(is_string($delItems)) {
            $delItems = explode('#',$delItems);
        }
        if(is_array($delItems) && count($delItems) == 1) {
            $delItems = $delItems[0];
        }
        if(is_array($delItems)) {
            foreach($delItems as $k => $val) {
                $param[$k]['modules'] = $modules;
                $param[$k]['action'] = $action;
                $param[$k]['param'][$delKey] = formatpost($val);
            }
            echo sendRequestMultiple($param);
        } else {
            $param['modules'] = $modules;
            $param['action'] = $action;
            $param['param'][$delKey] = formatpost($delItems);
            echo sendRequestSingle($param);
        }
    }
    //清空
    public function clean() {
        //判断是否是rest模式（整个项目修改完成后删除判断）
        if(strstr(decodeUrl('mod'),' ') || $_REQUEST['mod'] == 'vsys' || $_REQUEST['mod'] == 'save') {
            $param['modules'] = decodeUrl('mod');
            $param['action'] = $_REQUEST['act'] ? decodeUrl('act') : 'clean';
            $cleanArr = $_REQUEST;
        } else {
            $param['modules'] = self::$_command['mod'][$_REQUEST['mod']];
            $param['action'] = $_REQUEST['act'] ? self::$_command['action'][$_REQUEST['act']] : 'clean';
            parse_str(file_get_contents("php://input"),$cleanArr);
        }

        //如果多条命令。例：define host,define range,define subnet,define mac
        if(strpos($param['modules'], ',')) {
            $modules = explode(',',$param['modules']);
            foreach($modules as $k => $mod) {
                $mParam[$k]['modules'] = $mod;
                $mParam[$k]['action'] = $param['action'];
            }
            echo sendRequestMultiple($mParam);
            return;
        }
        //如果有参数，例：define schedule clean type single或cycle
        if($cleanArr['param']) {
            $param['param'][$cleanArr['parKey']] = formatpost($cleanArr['param']);
        }
        echo sendRequestSingle($param);
    }
    //下拉框查询。
    public function comboBox() {
        //判断是否是rest模式（整个项目修改完成后删除判断）
        if(strstr(decodeUrl('mod'),' ') || $_REQUEST['mod'] == 'vsys' || $_REQUEST['mod'] == 'save') {
            $modules= decodeUrl('mod');
            $action = $_REQUEST['act'] ? decodeUrl('act') : 'show';
        } else {
            $modules= self::$_command['mod'][$_REQUEST['mod']];
            $action = $_REQUEST['act'] ? self::$_command['action'][$_REQUEST['act']] : 'show';
        }

        $textKey = $_REQUEST['textKey'] ? decodeUrl('textKey') : 'name';       //文本域key
        $valKey = $_REQUEST['valKey'] ? decodeUrl('valKey') : $textKey;         //value值 key
        $select = !$_REQUEST['edit'] && $_REQUEST['select'] ? true : false;    //combobox是否选中第一条
        //带参数查询：$_REQUEST['parkey'] 参数key，$_REQUEST['param'] 参数
        if($_REQUEST['param']) {
            $param[$_REQUEST['parKey']] = decodeUrl('param');
        }

        if(strpos($modules, ',')) {     //多条命令
            $sumArr = array();
            $modArr = explode(',', $modules);
            foreach($modArr as $j => $modVal) {
                $rspString = getResponse($modVal, $action, $param, 0);
                if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                    continue;   //如果查询失败或无数据，则跳过本次循环
                }
                $rspString = parseResponse($rspString, 0);
                if(is_array($rspString['rows'])) {
                    $rspArr = formatReToArr($rspString['rows']);
                    $listName = array();
                    foreach($rspArr as $i=>$items){
                        if($textKey == $valKey) {
                            $listName[$i][$textKey] = $items[$textKey];
                        } else {
                            $listName[$i][$textKey] = $items[$textKey];
                            $listName[$i][$valKey] = $items[$valKey];
                        }
                    }
                    if(($j == 0) && $select) {
                        $listName[0]['selected'] = true;
                    }
                    $sumArr = array_merge_recursive($sumArr, $listName);
                }
            }
            echo json_encode($sumArr);
        } else {    //单条命令
            $rspString = getResponse($modules, $action, $param, 0);
            $rspString = parseResponse($rspString);
            $listName = array();
            if(is_array($rspString['rows'])) {
                $rspArr = formatReToArr($rspString['rows']);
                foreach($rspArr as $i=>$item){
                    if($textKey == $valKey) {
                        $listName[$i][$textKey] = $item[$textKey];
                    } else {
                        $listName[$i][$textKey] = $item[$textKey];
                        $listName[$i][$valKey] = $item[$valKey];
                    }
                    if(($i == 0) && $select) {
                        $listName[$i]['selected'] = true;
                    }
                }
            }
            echo json_encode($listName);
        }
    }
    //调用非常用函数。
    public function callFun() {
        $fun = $_REQUEST['fun'];
        $funArr = array('dataShow','comboTree','enableEdit','simpleHandle');
        if(in_array($fun,$funArr)) {
            if(strstr(decodeUrl('mod'),' ') || $_REQUEST['mod'] == 'vsys' || $_REQUEST['mod'] == 'save') {
                $old = false;
                $fun($old);
            } else {
                $fun(self::$_command);
            }
        } else {
            echo L('UNKNOW_ERR');
        }
    }

}