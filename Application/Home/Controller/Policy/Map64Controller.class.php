<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class Map64Controller extends CommonController {
    public function map64_show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $retArray = checkResponse();
        if($retArray['type']==1) {
            $this->assign('switch','off');
            $this->display('/Default/policy_map64_show');
            exit;
        }
        $rspString = getResponse( 'network vsys_turn', "show" , "", 0);
        if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
            $this->assign('switch','off');
        } else {
            $resArr = parseResponseDatagrid($rspString, 0);
            $this->assign('switch',$resArr['rows'][0]['turn']);
        }
        $this->display('/Default/policy_map64_show');
    }

    //添加弹出框
    public function map64Window() {
        $rspString = getResponse( 'network vsys_turn', "show" , "", 0);
        if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
            $this->assign('switch','off');
        } else {
            $resArr = parseResponseDatagrid($rspString, 0);
            $this->assign('switch',$resArr['rows'][0]['turn']);
        }
        $this->display('/Window/policy_map64_window');
    }

    //保存
    public function map64AddSave() {
        if($_POST['srcarea'])
            $param['srcarea'] = formatpost($_POST['srcarea']);
        else  if($_POST['nat_id'])
            $param['srcarea'] = 'none';
        if($_POST['dstarea'])  $param['dstarea'] = formatpost($_POST['dstarea']);
        else  if($_POST['nat_id'])    $param['dstarea'] = 'none';
        if($_POST['srcvlan'])  $param['srcvlan'] = formatpost($_POST['srcvlan']);
        else  if($_POST['nat_id'])    $param['srcvlan'] = 'none';
        if($_POST['dstvlan'])  $param['dstvlan'] = formatpost($_POST['dstvlan']);
        else  if($_POST['nat_id'])    $param['dstvlan'] = 'none';
        if($_POST['orig_src'])  $param['orig_src'] = formatpost($_POST['orig_src']);
        else  if($_POST['nat_id'])    $param['orig_src'] = 'none';
        if($_POST['orig_dst'])  $param['orig_dst'] = formatpost($_POST['orig_dst']);
        else  if($_POST['nat_id'])    $param['orig_dst'] = 'none';
        if($_POST['orig_sport'])  $param['orig_sport'] = formatpost($_POST['orig_sport']);
        else  if($_POST['nat_id'])    $param['orig_sport'] = 'none';
        if($_POST['orig_service'])  $param['orig_service'] = formatpost($_POST['orig_service']);
        else  if($_POST['nat_id'])    $param['orig_service'] = 'none';

        if($_POST['trans_src'])  $param['trans_src'] = formatpost($_POST['trans_src']);
        else  if($_POST['nat_id'])    $param['trans_src'] = 'none';
        if($_POST['trans_dst'])  $param['trans_dst'] = formatpost($_POST['trans_dst']);
        else  if($_POST['nat_id'])    $param['trans_dst'] = 'none';
        if($_POST['pat'])  $param['pat'] = formatpost($_POST['pat']);
        if($_POST['sticky'])  $param['sticky'] = formatpost($_POST['sticky']);
        if($_POST['enable'])  $param['enable'] = formatpost($_POST['enable']);
        if($_POST['vr_id']!='')  $param['vr_id'] = formatpost($_POST['vr_id']);

        if($_POST['nat_id']) {
            $param['nat_id'] = formatpost($_POST['nat_id']);
            $natParam['action'] = 'modify';
        } else {
            $natParam['action'] = 'add';
        }

        $natParam['modules'] = 'nat nat64policy';
        $natParam['param'] = $param;
        echo sendRequestSingle($natParam);
    }

    //移动
    public function map64Move() {
        if($_POST['name']!='')  $param['param']['__NA__'] = formatpost($_POST['name']);
        if($_POST['selected']!='')  $param['param'][formatpost($_POST['position'])] = formatpost($_POST['selected']);
        $param['modules'] = 'nat nat64policy';
        $param['action'] = 'move';
        echo sendRequestSingle($param);
    }

    //目的端口包括：类型为UDP、TCP且只有一个端口的服务对象
    public function transServiceJsondata() {
        $proot = array();
        $proot[0]['text'] = 'default-service';
        $proot[1]['text'] = 'self-service';
        $service_default = array();
        $service_self = array();
        $arr2 = array();

        $param['type']='default';
        $rspString = getResponse("define service", "show", $param, 0);
        $list_arr =  parseResponseDatagrid($rspString, 0);
        foreach($list_arr['rows'] as $i=>$items){

            if($items['protocol']==6 || $items['protocol']==7) {
                if(strpos($items['port'],'~')>0) {
                    $port_arr=explode('~',$items['port']);
                    if(trim($port_arr[0])==trim($port_arr[1])) {
                        $arr2[0]['id'] = $items['id'];
                        $arr2[0]['text'] = $items['name'];
                        $service_default = array_merge_recursive($service_default,  $arr2);
                    }

                } else {
                    $arr2[0]['id'] = $items['id'];
                    $arr2[0]['text'] = $items['name'];
                    $service_default = array_merge_recursive($service_default,  $arr2);
                }
            }
        }
        if($service_default != null)
            $proot[0]['children'] = formatReToArr($service_default);
        //else
        //$proot[0]['iconCls'] = 'tree-empty';

        $arr2 = array();
        $param['type']='custom';
        $rspString = getResponse("define service", "show", $param, 0);
        $list_arr =  parseResponseDatagrid($rspString, 0);

        foreach($list_arr['rows'] as $i=>$items){
            if($items['protocol']==6 || $items['protocol']==17) {
                if(strpos($items['port'],'~')>0) {
                    $port_arr=explode('~',$items['port']);
                    if(trim($port_arr[0])==trim($port_arr[1]))  {
                        $arr2[0]['id'] = $items['id'];
                        $arr2[0]['text'] = $items['name'];
                        $service_self = array_merge_recursive($service_self,  $arr2);
                    }
                } else {
                    $arr2[0]['id'] = $items['id'];
                    $arr2[0]['text'] = $items['name'];
                    $service_self = array_merge_recursive($service_self,  $arr2);
                }
            }
        }

        if($service_self != null)
            $proot[1]['children'] = formatReToArr($service_self);
        //else
        //$proot[1]['iconCls'] = 'tree-empty';

        echo json_encode($proot);
    }
    //目的地址转换下拉框列表中数据的查询方法
    function comboTreeMap64Host() {
        $parentNode = $_REQUEST['parentNode'];
        $pNodeArr = explode(',',$parentNode);   //以逗号分隔父节点。
        $action = $_REQUEST['act'] ? $_REQUEST['act'] : 'show';
        $tree = array();
        foreach($pNodeArr as $k => $v) {
            $temp = array();
            $sumArr = array();
            $tree[$k]['text'] = $v;         //父节点
            $modules = $_REQUEST[$v];       //模块命令，以父节点为key传送过来。多条以逗号分隔。
            //如果父节点有多条命令,则循环执行。如地址对象：'define host,define range,define subnet'
                $rspString = getResponse($modules, $action, '', 0);
                if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                    continue;
                }
                $rspString = parseResponse($rspString);
                $rspArr = formatReToArr($rspString['rows']);
                foreach($rspArr as $item){
                    //2代表当前筛选的是ipv4的地址，10表示当前筛选的是ipv6的地址
                    if($item['family'] == 2){
                        $temp[0]['id'] = $item['id'];
                        $temp[0]['text'] = $item['name'];
                        $sumArr = array_merge_recursive($sumArr,  $temp);
                    }
                }
            if(empty($sumArr)) {
                $tree[$k]['iconCls'] = 'tree-empty';
            } else {
                $tree[$k]['children'] = formatReToArr($sumArr);
            }
        }
        //因上面continue跳出无数据的循环，所以将无赋值的父节点删除(或添加空节点属性)。
        for($j = 0;$j<count($tree);$j++){
            if(!isset($tree[$j]['children'])){
                //$tree[$j]['iconCls'] = 'tree-empty';
                array_splice($tree,$j,1);
                $j--;
            }
        }
        echo json_encode($tree);

    }
    //源地址转换下拉框列表中获取数据的方法
    function comboTreeMap64() {
        //创建一个存储ipv4地址的数组
        $ipFour = array();
        $parentNode = $_REQUEST['parentNode'];
        $pNodeArr = explode(',',$parentNode);   //以逗号分隔父节点。
        $action = $_REQUEST['act'] ? $_REQUEST['act'] : 'show';
        $tree = array();
        foreach($pNodeArr as $k => $v) {
            $temp = array();
            $sumArr = array();
            $tree[$k]['text'] = $v;         //父节点
            $modules = $_REQUEST[$v];       //模块命令，以父节点为key传送过来。多条以逗号分隔。
            //如果父节点有多条命令,则循环执行。如地址对象：'define host,define range,define subnet'
            if(strpos($modules, ',')) {
                $modArr = explode(',', $modules);
                foreach($modArr as $modVal) {
                    $rspString = getResponse($modVal, $action, '', 0);
                    if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                        continue;   //如果查询失败或无数据，则跳过本次循环
                    }
                    $rspString = parseResponse($rspString);
                    $rspArr = formatReToArr($rspString['rows']);
                    foreach($rspArr as $item){
                        if($item['family'] == '2'){
                            $temp[0]['id'] = $item['id'];
                            $temp[0]['text'] = $item['name'];
                            $ipFour[] = $item['name'];
                        } else {
                            continue;
                        }
                        $sumArr = array_merge_recursive($sumArr,  $temp);
                    }
                }
            } else {
                if($modules == 'define group_address'){
                    $rspString = getResponse($modules, $action, '', 0);
                    if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                        continue;
                    }
                    $rspString = parseResponse($rspString);
                    $rspArr = formatReToArr($rspString['rows']);
                    foreach($rspArr as $item){
                        $val = 1;
                        if(strpos($item['member'],',')){
                            $member = explode(',',$item['member']);
                        }else{
                            $member[] = $item['member'];
                        }
                        foreach($member as $mv){
                            if(!in_array($mv,$ipFour)){
                                $val = 0;
                                break;
                            }
                        }
                        if($val == 1){
                            $temp[0]['id'] = $item['id'];
                            $temp[0]['text'] = $item['name'];
                            $sumArr = array_merge_recursive($sumArr,  $temp);
                        }
                    }
                }else{
                    $rspString = getResponse($modules, $action, '', 0);
                    if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                        continue;
                    }
                    $rspString = parseResponse($rspString);
                    $rspArr = formatReToArr($rspString['rows']);
                    foreach($rspArr as $item){
                        $temp[0]['id'] = $item['id'];
                        $temp[0]['text'] = $item['name'];
                        $sumArr = array_merge_recursive($sumArr,  $temp);
                    }
                }
            }
            if(empty($sumArr)) {
                $tree[$k]['iconCls'] = 'tree-empty';
            } else {
                $tree[$k]['children'] = formatReToArr($sumArr);
            }
        }
        //因上面continue跳出无数据的循环，所以将无赋值的父节点删除(或添加空节点属性)。
        for($j = 0;$j<count($tree);$j++){
            if(!isset($tree[$j]['children'])){
                //$tree[$j]['iconCls'] = 'tree-empty';
                array_splice($tree,$j,1);
                $j--;
            }
        }
        echo json_encode($tree);

    }

}

?>
