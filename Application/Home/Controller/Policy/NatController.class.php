<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class NatController extends CommonController {
	public function nat_show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $retArray = checkResponse();
        if($retArray['type']==1) {
            $this->assign('switch','off');
            $this->display('/Default/policy_nat_show');
            exit;
        }
        $rspString = getResponse( 'network vsys_turn', "show" , "", 0);
        if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
            $this->assign('switch','off');
        } else {
            $resArr = parseResponseDatagrid($rspString, 0);
            $this->assign('switch',$resArr['rows'][0]['turn']);
        }
		$this->display('/Default/policy_nat_show');
	}

    //添加弹出框
    public function natWindow() {
        $rspString = getResponse( 'network vsys_turn', "show" , "", 0);
        if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
            $this->assign('switch','off');
        } else {
            $resArr = parseResponseDatagrid($rspString, 0);
            $this->assign('switch',$resArr['rows'][0]['turn']);
        }
        $this->display('/Window/policy_nat_window');
    }

    //保存
    public function natAddSave() {
        //添加使能开关状态
        if($_POST['energy'] == 1)
            $param['one_to_one'] = 'no';
        else
            $param['one_to_one'] = 'yes';
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
        if($_POST['trans_service'])  $param['trans_service'] = formatpost($_POST['trans_service']);
        else  if($_POST['nat_id'])    $param['trans_service'] = 'none';
        if($_POST['pat'])  $param['pat'] = formatpost($_POST['pat']);
        if($_POST['sticky'])  $param['sticky'] = formatpost($_POST['sticky']);
        if($_POST['enable'])  $param['enable'] = formatpost($_POST['enable']);
        if($_POST['vr_id']!='')  $param['vr_id'] = formatpost($_POST['vr_id']);
        //添加用户数据
        if($_POST['user'] !='') $param['users'] = formatpost($_POST['user']);

        if($_POST['nat_id']) {
            $param['nat_id'] = formatpost($_POST['nat_id']);
            $natParam['action'] = 'modify';
        } else {
            $natParam['action'] = 'add';
        }
        $natParam['modules'] = 'nat policy';
        $natParam['param'] = $param;
        echo sendRequestSingle($natParam);
    }

    //移动
    public function natMove() {
        if($_POST['name']!='')  $param['param']['__NA__'] = formatpost($_POST['name']);
        if($_POST['selected']!='')  $param['param'][formatpost($_POST['position'])] = formatpost($_POST['selected']);
        $param['modules'] = 'nat policy';
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

}

?>
