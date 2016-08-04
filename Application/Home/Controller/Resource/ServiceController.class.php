<?php
namespace Home\Controller\Resource;
use Home\Controller\CommonController;
class ServiceController extends CommonController {
    public function service_info(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tag'] == '' || $_GET['tag'] == 'info'){
            $this->display("Default/resource_service_info");
        }elseif($_GET['tag'] == 'self') {
            $this->display("Default/resource_self_service_info");
        }else{
            $this->display("Default/resource_service_group_info");
        }
    }

    public function add() {
        if($_GET['type'] == 'group') {
            $this->addGroup();
        } else {
            $this->addService();
        }
    }

    public function childNode(){
        $grouptree = array();
        $str_name = explode(",", urldecode($_GET['name']));
        $num = count($str_name);
        for($j=0;$j<$num;$j++){
            $param['name'] = $str_name[$j];
            $parent_id = $_GET['id'];
            $rspString = getResponse("define service", "show", $param,0);
            $list_arr = parseResponseDatagrid($rspString,0);
            $subtree_arr = array();
            foreach($list_arr['rows'] as $i=>$items) {
                if($items == '')
                    break;
                $subtree_arr[$i] = $items;
                $subtree_arr[$i]['id'] = $parent_id.$items['id'];
                $subtree_arr[$i]['type'] = '0';
            }
            $grouptree = array_merge_recursive($grouptree,  $subtree_arr);
            //预定义查询
            $drspString = getResponse("define service", "show type default", $param,0);
            $list_arr = parseResponseDatagrid($drspString,0);
            $subtree_arr = array();
            foreach($list_arr['rows'] as $i=>$items) {
                if($items == '')
                    break;
                $subtree_arr[$i] = $items;
                $subtree_arr[$i]['id'] = $parent_id.$items['id'].$i;
                $subtree_arr[$i]['type'] = '1';
            }
            $grouptree = array_merge_recursive($grouptree,  $subtree_arr);
        }
        echo json_encode($grouptree);
    }
    //预定义服务 添加
    public function addService() {
        parse_str(file_get_contents("php://input"),$addArr);
        $config['modules'] = 'define service';
        if( $addArr['tag'] == 1) {
            $config['action'] = 'add';
        } else {
            $config['action'] = 'modify';
        }
        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $config['param'] = $addArr;
        if($config['param']['port2'] == '0' && $config['param']['protocol'] != '1') {
            unset($config['param']['port2']);
            echo sendRequestSingle($config);
            unset($config['param']['port1']);
            $config['param']['port2'] = '0';
            echo sendRequestSingle($config);
        } else
            echo sendRequestSingle($config);
    }

    //服务组查询
    public function treegridShow() {
        if($_GET['name']) {
            $this->childNode();
            exit;
        }
        $rspString = getResponse("define group_service", "show","",1);
        $list_arr = parseResponseDatagrid($rspString,0);
        if(is_array($list_arr)) {
            $servTreeArr = array();
            $totalItems = array();
            foreach($list_arr['rows'] as $i=>$items) {
                $servTreeArr[$i] = $items;
                $servTreeArr[$i]['id'] = ($i+1);
                $servTreeArr[$i]['state'] = 'closed';
                if(trim($items['member']) == "") {
                     $servTreeArr[$i]['iconCls'] = 'tree-empty';
                }
            }
            $totalItems['rows'] = $servTreeArr;
            $totalItems['total'] = $list_arr['total'];

            echo json_encode($totalItems);
        }else{
            echo '{"rows":[],"total":"0"}';
        }
    }
    //查询全部服务
    public function allService() {
        $rspString = getResponse("define service", "show","",0);
        $drspString = getResponse("define service", "show type default", "",0);
        $self_arr = parseResponseDatagrid($rspString,0);
        $default_arr = parseResponseDatagrid($drspString,0);
        $sum_arr = array();
        if(is_array($self_arr))
            $sum_arr = array_merge_recursive($sum_arr,$self_arr);
        if(is_array($default_arr))
            $sum_arr = array_merge_recursive($sum_arr,$default_arr);
        if(empty($sum_arr)){
            echo '{"rows":"false"}';
            return;
        }
        echo json_encode($sum_arr);
    }

    //添加服务组
    public function addGroup() {
        parse_str(file_get_contents("php://input"),$addArr);
        $param['modules'] = 'define group_service';
        if($addArr['tag'] == 1) {
            $param['action'] = 'add';
        } else {
            $param['action'] = 'modify';
        }
        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $param['param'] = $addArr;
        echo sendRequestSingle($param);
    }

    public function getServiceId() {
        $param['name'] = urldecode($_GET['name']);
        if(!$param['name']){
            echo '{"rows":[]}';
            return;
        }
        $param['type'] = 'custom';
        $hrspString = getResponse("define service", "show", $param, 0);
        if(!is_numeric($hrspString) && (substr($hrspString, 0, 5) != 'error')) {
           echo parseResponseDatagrid($hrspString);
            return;
        }
        $param['type'] = 'default';
        $grspString = getResponse("define service", "show", $param, 0);
        if(!is_numeric($grspString) && (substr($grspString, 0, 5) != 'error')) {
            echo parseResponseDatagrid($grspString);
            return;
        }

        //unset($param);
        $rspString = getResponse("define group_service", "show", "", 0);
        $listArr = parseResponseDatagrid($rspString, 0);
        $idArr['rows'] = array();
        if($listArr['total'] > 0) {
            foreach($listArr['rows'] as $items){
                if($items['name'] == $param['name']){
                    $idArr['rows'][0]['id'] = $items['id'];
                    break;
                }
            }
        }
        echo json_encode($idArr);
    }

}