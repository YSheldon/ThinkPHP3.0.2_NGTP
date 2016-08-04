<?php
namespace Home\Controller\Resource;
use Home\Controller\CommonController;
class AddressController extends CommonController {
    public function address_info(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tabs'] == ''){
            $this->display("Default/resource_address_info");
        }else{
            $this->display("Default/resource_address_group_info");
        }
	}

    //地址信息
    public function datagridShow(){
        if($_GET['search']) {
            $this->addrSearch();
            exit;
        }
        //获取当前页page 每页条目count 总条目total
        $page = $_REQUEST['page']?$_REQUEST['page']:1;
        $count = $_REQUEST['rows'] ? $_REQUEST['rows']:20;

        if($page == '1' || empty($_SESSION["addrStr"])) {
            $hrspString = getResponse("define host", "show", '',0);
            $grspString = getResponse("define range", "show", '',0);
            $srspString = getResponse("define subnet", "show", '',0);
            $mrspString = getResponse("define mac", "show", '',0);
            if(($hrspString === 0) && ($grspString === 0) && ($srspString === 0) && ($mrspString === 0)){
                echo '{"rows":[],"total":"0"}';
                exit;
            }else{
                $host_list = parseResponseDatagrid($hrspString,0);
                $range_list = parseResponseDatagrid($grspString,0);
                $subnet_list = parseResponseDatagrid($srspString,0);
                $mac_list = parseResponseDatagrid($mrspString,0);
                $sumArr = array();
                if($host_list['total'] != 0)
                    $sumArr = array_merge_recursive($sumArr,$host_list);
                if($range_list['total'] != 0)
                    $sumArr = array_merge_recursive($sumArr,$range_list);
                if($subnet_list['total'] != 0)
                    $sumArr = array_merge_recursive($sumArr,$subnet_list);
                if($mac_list['total'] != 0)
                    $sumArr = array_merge_recursive($sumArr,$mac_list);

                $_SESSION["addrStr"] = $sumArr;
                $allArr = getFilterResultLocal($_SESSION["addrStr"], $page, $count);
            }
        }else{
            $allArr = getFilterResultLocal($_SESSION["addrStr"], $page, $count);
        }
        echo json_encode($allArr);
    }

    public function add() {
        switch($_GET['type']) {
            case 'host':
                $this->host_add();
                break;
            case 'range':
                $this->range_add();
                break;
            case 'subnet':
                $this->subnet_add();
                break;
            case 'mac':
                $this->mac_add();
                break;
            case 'group':
                $this->group_add();
                break;
        }
    }
    //添加 主机地址
    public function host_add(){
        unset($_SESSION['addrStr']);
        parse_str(file_get_contents("php://input"),$addArr);
        $hostParam['modules'] = 'define host';
        if($addArr['tag'] == 1)
            $hostParam['action'] = 'add';
        else
            $hostParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin())
            unset($addArr['shared']);

        $hostParam['param'] = $addArr;
        echo sendRequestSingle($hostParam);
    }
    //添加 范围地址
    public function range_add(){
        unset($_SESSION['addrStr']);
        parse_str(file_get_contents("php://input"),$addArr);
        if($addArr['tag'] == 1)
            $rangeParam['action'] = 'add';
        else
            $rangeParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin())
            unset($addArr['shared']);

        $rangeParam['param'] = $addArr;
        $rangeParam['modules'] = 'define range';
        echo sendRequestSingle($rangeParam);
    }
    //添加 子网
    public function subnet_add(){
        unset($_SESSION['addrStr']);
        parse_str(file_get_contents("php://input"),$addArr);

        if(!strpos($addArr['mask'],".")){
            $addArr['ipaddr'] = $addArr['ipaddr'] . "/" . $addArr['mask'];
            unset($addArr['mask']);
        }
        $subnetParam['modules'] = 'define subnet';
        if($addArr['tag'] == 1)
            $subnetParam['action'] = 'add';
        else
            $subnetParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin())
            unset($addArr['shared']);

        $subnetParam['param'] = $addArr;
        echo sendRequestSingle($subnetParam);
    }
    //添加 mac地址
    public function mac_add(){
        unset($_SESSION['addrStr']);
        parse_str(file_get_contents("php://input"),$addArr);

        $macParam['modules'] = 'define mac';
        if($addArr['tag'] == 1)
            $macParam['action'] = 'add';
        else
            $macParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin())
            unset($addArr['shared']);

        $macParam['param'] = $addArr;
        echo sendRequestSingle($macParam);
    }
    //删除
    public function del(){
        unset($_SESSION["addrStr"]);
        parse_str(file_get_contents("php://input"),$delArr);

        $sub_name = explode("#", $delArr['name']);
        //$sub_id = explode("#", $delArr['id']);
        $sub_type = explode("#", $delArr['type']);

        for($i=0;$i<count($sub_name);$i++) {
            $param[$i]['param']['name'] = $sub_name[$i];
            //$param[$i]['param']['id'] = $sub_id[$i];
            switch ($sub_type[$i]){
                case '1':
                    $param[$i]['modules'] = 'define host';
                    break;
                case '2':
                    $param[$i]['modules'] = 'define subnet';;
                    break;
                case '3':
                    $param[$i]['modules'] = 'define range';
                    break;
                case '4':
                    $param[$i]['modules'] = 'define mac';
                    break;
            }
            $param[$i]['action'] = 'delete';
        }
        echo sendRequestMultiple($param);
    }

    //地址搜索
    public function addrSearch(){
        $search = urldecode($_GET['search']);
        $hrspString = getResponse("define host", "show","",0);
        $grspString = getResponse("define range", "show","",0);
        $srspString = getResponse("define subnet", "show","",0);
        $mrspString = getResponse("define mac", "show","",0);
        $host_list = parseResponseDatagrid($hrspString,0);
        $range_list = parseResponseDatagrid($grspString,0);
        $subnet_list = parseResponseDatagrid($srspString,0);
        $mac_list = parseResponseDatagrid($mrspString,0);
        $sumArr = array();
        $k = 0;
        if(!empty($host_list['rows'])){
            foreach($host_list['rows'] as $val){
                if(strpos($val['name'],$search) !== false){
                    $sumArr['rows'][$k] =$val;
                    $k++;
                }
            }
        }
        if(!empty($range_list['rows'])){
            foreach($range_list['rows'] as $val){
                if(strpos($val['name'],$search) !== false){
                    $sumArr['rows'][$k] = $val;
                    $k++;
                }
            }
        }
        if(!empty($subnet_list['rows'])){
            foreach($subnet_list['rows'] as $val){
                if(strpos($val['name'],$search) !== false){
                    $sumArr['rows'][$k] = $val;
                    $k++;
                }
            }
        }
        if(!empty($mac_list['rows'])){
            foreach($mac_list['rows'] as $val){
                if(strpos($val['name'],$search) !== false){
                    $sumArr['rows'][$k] = $val;
                    $k++;
                }
            }
        }
        if(empty($sumArr)){
            echo '{"rows":[],"total":"0"}';
            return;
        }
        $page = $_REQUEST['page']?$_REQUEST['page']:1;
        $count = $_REQUEST['rows']?$_REQUEST['rows']:20;
        $res_arr = getFilterResultLocal($sumArr, $page, $count);
        echo json_encode($res_arr);
    }
    //地址组
    public function treegridShow(){
        if($_GET['name']) {
            $this->childAddr();
            exit;
        }
        $rspString = getResponse("define group_address", "show",'',1);
        $list_arr = parseResponseDatagrid($rspString,0);
        if(is_numeric($list_arr) || is_string($list_arr)){
            echo '{"rows":[],"total":"0"}';
            exit;
        }else{
            if(!empty($list_arr['rows'])){
                $servTreeArr = array();
                $totalItems = array();
                foreach($list_arr['rows'] as $i=>$items){
                    $servTreeArr[$i] = $items;
                    $servTreeArr[$i]['id'] = ($i+1);
                    $servTreeArr[$i]['state'] = 'closed';
                    if(trim($items['member']) == "")
                        $servTreeArr[$i]['iconCls'] = 'tree-empty';
                }
                $totalItems['rows'] = $servTreeArr;
                $totalItems['total'] = $list_arr['total'];
                echo json_encode($totalItems);
            }else{
                echo '{"rows":[],"total":"0"}';
            }
        }
    }
    //添加地址组
    public function group_add(){
        parse_str(file_get_contents("php://input"),$addArr);

        $groupParam['modules'] = 'define group_address';
       if($addArr['tag'] == 1)
            $groupParam['action'] = 'add';
        else
            $groupParam['action'] = 'modify';

        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $groupParam['param'] = $addArr;
        echo sendRequestSingle($groupParam);
    }

    //地址组成员信息 treegrid子节点
    public function childAddr(){
        $grouptree = array();
        $str_name = explode(",", urldecode($_GET['name']));
        for($j=0;$j<count($str_name);$j++)
        {
            $param['name'] = $str_name[$j];
            $parent_id = $_GET['id'];
            $hrspString = getResponse("define host", "show", $param,0);
            $host_arr = parseResponseDatagrid($hrspString,0);
            if(!empty($host_arr['rows'])){
                $subtree_arr = array();
                foreach($host_arr['rows'] as $i=>$items){
                    if($items == '')
                        break;
                    $subtree_arr[$i] = $items;
                    $subtree_arr[$i]['id'] = $parent_id.$items['id'];
                }
                $grouptree = array_merge_recursive($grouptree,$subtree_arr);
                continue;
            }

            $grspString = getResponse("define range", "show", $param,0);
            $range_arr = parseResponseDatagrid($grspString,0);
            if(!empty($range_arr['rows'])){
                $subtree_arr = array();
                foreach($range_arr['rows'] as $i=>$items){
                    if($items == '')
                        break;
                    $subtree_arr[$i] = $items;
                    $subtree_arr[$i]['id'] = $parent_id.$items['id'];
                }
                $grouptree = array_merge_recursive($grouptree,$subtree_arr);
                continue;
            }

            $srspString = getResponse("define subnet", "show", $param,0);
            $subnet_arr = parseResponseDatagrid($srspString,0);
            $subtree_arr = array();
            foreach($subnet_arr['rows'] as $i=>$items){
                if($items == '')
                    break;
                $subtree_arr[$i] = $items;
                $subtree_arr[$i]['id'] = $parent_id.$items['id'];
            }
            $grouptree = array_merge_recursive($grouptree,$subtree_arr);

        }
        echo json_encode($grouptree);
    }

    function getAddressId(){
        $param['name'] = urldecode($_GET['name']);
        if($param['name'] == '' || $param['name'] == null){
            echo '{"rows":[]}';
            exit;
        }

        $rspString = getResponse("define area", "show", $param, 0);
        if(!is_numeric($rspString)){
            $rspString = parseResponseDatagrid($rspString,0);
            if(is_array($rspString['rows'][0])) {
                echo json_encode($rspString);
                return;
            }
        }

        $hrspString = getResponse("define host", "show", $param, 0);
        if(!is_numeric($hrspString)){
            $hrspString = parseResponseDatagrid($hrspString,0);
            if(is_array($hrspString['rows'][0])) {
                echo json_encode($hrspString);
                return;
            }
        }

        $grspString = getResponse("define range", "show", $param, 0);
        if(!is_numeric($grspString)){
            $grspString = parseResponseDatagrid($grspString,0);
            if(is_array($grspString['rows'][0])) {
                echo json_encode($grspString);
                return;
            }
        }

        $srspString = getResponse("define subnet", "show", $param, 0);
        if(!is_numeric($srspString)){
            $srspString = parseResponseDatagrid($srspString,0);
            if(is_array($srspString['rows'][0])) {
                echo json_encode($srspString);
                return;
            }
        }
        //均衡组查询
        $brspString = getResponse("	define virtual_server", "show", $param, 0);
        if(!is_numeric($brspString)){
            $brspString = parseResponseDatagrid($brspString,0);
            if(is_array($brspString['rows'][0])) {
                echo json_encode($brspString);
                return;
            }
        }

        /*$idMac = array();
        $k = 0;
        $mrspString = getResponse("define mac", "show", "", 0);
        if(!is_numeric($mrspString)){
            $macArr = parseResponseDatagrid($mrspString, 0);
            if(is_array($macArr)) {
                foreach($macArr['rows'] as $items){
                    if($items['name'] ==  $param['name']){
                        $idMac['rows'][0]['id'] = $items['id'];
                        $k = 1;
                        break;
                    }
                }
                if($k == 1) {
                    echo json_encode($idMac);
                    return;
                }
            }
        }*/

        $rspString = getResponse("define group_address", "show", '', 0);
        $idArr['rows'] = array();
        if(!is_numeric($rspString)){
            $groupName = parseResponseDatagrid($rspString, 0);
            if($groupName['total'] > 0) {
                foreach($groupName['rows'] as $items){
                    if($items['name'] ==  $param['name']){
                        $idArr['rows'][0]['id'] = $items['id'];
                        break;
                    }
                }
            }
        }
        echo json_encode($idArr);
    }

}

