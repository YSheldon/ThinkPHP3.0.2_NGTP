<?php
namespace Home\Controller\Resource;
use Home\Controller\CommonController;
class TimeController extends CommonController {
    public function time_info(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tabs'] == '' || $_GET['tabs'] == 'loop'){
            $this->display("Default/resource_time_info");
        }elseif($_GET['tabs'] == 'sig'){
            $this->display("Default/resource_time_sig_info");
        }else{
            $this->display("Default/resource_time_group_info");
        }
	}

    public function add() {
        switch($_GET['cyctype']) {
            case 'day':
                $this->add_circle_time_date();
                break;
            case 'weekcyc':
                $this->add_circle_time_week();
                break;
            case 'monthcyc':
                $this->add_circle_time_month();
                break;
            case 'year':
                $this->add_sigle_time();
                break;
            case 'group':
                $this->group_add();
                break;
        }
    }

    //添加循环时间 - 每日
    public function add_circle_time_date(){
        parse_str(file_get_contents("php://input"),$addArr);
        $addArr['cyctype'] = 'monthcyc';

        $dayParam['modules'] = 'define schedule';
        if($addArr['tag'] == 1)
            $dayParam['action'] = 'add';
        else
            $dayParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $dayParam['param'] = $addArr;
        echo sendRequestSingle($dayParam);
    }
    //添加循环时间 - 每星期
    public function add_circle_time_week(){
        parse_str(file_get_contents("php://input"),$addArr);
        $weekParam['modules'] = 'define schedule';
        if($addArr['tag'] == 1)
            $weekParam['action'] = 'add';
        else
            $weekParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $addArr['cyctype'] = 'weekcyc';
        $weekParam['param'] = $addArr;
        echo sendRequestSingle($weekParam);
    }
    //添加循环时间 - 每月
    public function add_circle_time_month(){
        parse_str(file_get_contents("php://input"),$addArr);
        $monthParam['modules'] = 'define schedule';
        if($addArr['tag'] == 1)
            $monthParam['action'] = 'add';
        else
            $monthParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $addArr['cyctype'] = 'monthcyc';
        $monthParam['param'] = $addArr;
        echo sendRequestSingle($monthParam);
    }

    //单次时间 添加
    public function add_sigle_time(){
        parse_str(file_get_contents("php://input"),$addArr);
        $param['modules'] = 'define schedule';
        if($addArr['tag'] == 1)
            $param['action'] = 'add';
        else
            $param['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $addArr['cyctype'] = 'year';
        $param['param'] = $addArr;
        echo sendRequestSingle($param);
    }

    //时间组
    public function treegridShow(){
        if($_GET['name']) {
            $this->childTime();
            exit;
        }
        $rspString = getResponse("define group_schedule", "show","", 1);
        $list_arr= parseResponseDatagrid($rspString,0);
        if(is_array($list_arr)){
            $timeTreeArr = array();
            $totalItems = array();
            foreach($list_arr['rows'] as $i=>$items){
                $timeTreeArr[$i] = $items;
                $timeTreeArr[$i]['id'] = ($i+1);
                $timeTreeArr[$i]['state'] = 'closed';
                if(trim($items['member']) == "")
                    $timeTreeArr[$i]['iconCls'] = 'tree-empty';
            }
            $totalItems['rows'] = $timeTreeArr;
            $totalItems['total'] = $list_arr['total'];
            echo json_encode($totalItems);
        }else{
            echo '{"rows":[],"total":"0"}';
        }
    }
    //时间组 添加
    public function group_add(){
        parse_str(file_get_contents("php://input"),$addArr);
        $param['modules'] = 'define group_schedule';
        if($addArr['tag'] == 1)
            $param['action'] = 'add';
        else
            $param['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $param['param'] = $addArr;
        echo sendRequestSingle($param);
    }

    //时间组子成员
    public function childTime(){
        $grouptree = array();
        $str_name = explode(",", urldecode($_GET['name']));
        for($j=0;$j<count($str_name);$j++) {
            $param['name'] = $str_name[$j];
            $parent_id = $_GET['id'];
            $rspString = getResponse("define schedule", "show", $param,0);
            $list_arr = parseResponseDatagrid($rspString,0);
            $subtree_arr = array();
            foreach($list_arr['rows'] as $i=>$items){
                if($items == '')
                    break;
                $subtree_arr[$i] = $items;
                $subtree_arr[$i]['id'] = $parent_id.$items['id'];
            }
            $grouptree = array_merge_recursive($grouptree,$subtree_arr);
        }
        echo json_encode($grouptree);
    }

    function getTimeId(){
        $param['name'] = urldecode($_GET['name']);
        $hrspString = getResponse("define schedule", "show", $param, 1);
        $hrspString = parseResponseDatagrid($hrspString,0);
        if($hrspString['total'] > 0) {
            echo json_encode($hrspString);
            return;
        }

        $idArr['rows'] = array();
        $mrspString = getResponse("define group_schedule", "show", '', 0);
        $mrspString = parseResponseDatagrid($mrspString,0);
        if($mrspString['total'] > 0) {
            foreach($mrspString['rows'] as $i=>$items){
                if($items['name'] == $param['name']){
                    $idArr['rows'][0]['id'] = $items['id'];
                    break;
                }
            }
        }
        echo json_encode($idArr);
    }

}