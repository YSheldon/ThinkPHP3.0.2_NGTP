<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class IspRouteController extends CommonController{
	public function show(){
                $vsys_user = isVrAdmin();
		require_once APP_PATH . 'Home/Common/menupage.php';
                $this->assign("vsys_user",$vsys_user);
		$this->display("Default/network_isp_route_show");
    }

/*	function ispRouteWindow(){
		$this->display('Window/network_isp_route_window');
	}*/

/*    function ispAddrWindow(){
        $this->display('Window/network_isp_addr_window');
    }*/

/*    function ispRouteClear(){
        $this->display('Window/network_isp_route_clear');
    }*/

/*    function ispImport(){
        $this->display('Window/network_isp_import');
    }*/

/*    function interfaceJsondata() {
        $rspString = getResponse("network interfaces", "show", '', 0);
        $interfaceArr = parseResponseDatagrid($rspString, 0);
        echo json_encode($interfaceArr['rows']);
    }*/

    function ispRouteList(){
        $i = 0;
        $rspString = getResponse('network isp_name', "show", '', 1);
        $ispArr = parseResponse($rspString, 0);
        //新建一个数组，用于存放匹配到的数据
        $newArr = array();
        //新建一个数组，用于存放在前台遍历的键和值
        $newArrSend = array();
        //创建一个匹配的数组
        $arrName = array(
            'CHINANET' => L('CHINANET'),
            'UNICOM' => L('UNICOM'),
            'CMNET' => L('CMNET'),
            'CERNET' => L('CERNET'),
            'CRTC' => L('CRTC'),
            'CNCGROUP' => L('CNCGROUP'),
            'GWBN' => L('GWBN'),
            'CSTN' => L('CSTN'),
            'BCN' => L('BCN'),
            'GeHua' => L('GeHua'),
            'Topway' => L('Topway'),
            'ZHONG-BANG-YA-TONG' => L('ZHONG_BANG_YA_TONG'),
            'FOUNDERBN' => L('FOUNDERBN'),
            'WASU' => L('WASU'),
            'GZPRBNET' => L('GZPRBNET'),
            'HTXX' => L('HTXX'),
            'eTrunk' => L('eTrunk'),
            'WSN' => L('WSN'),
            'CHINAGBN' => L('CHINAGBN'),
            'EASTERNFIBERNET' => L('EASTERNFIBERNET'),
            'LiaoHe-HuaYu' => L('LiaoHe_HuaYu'),
            'CTN' => L('CTN')
        );
        foreach($ispArr['rows'] as $iv){
            foreach($iv as $cv){
                foreach($arrName as $ak => $av){
                    if($cv == $ak){
                        $newArr[$ak] = $av;
                    }
                }
            }
        }
        foreach($newArr as $k => $v){
            $newArrSend[$i]['ispName'] = $v;
            $newArrSend[$i]['ispKey'] = $k;
            $i++;
        }
        echo json_encode($newArrSend);
    }

/*    function ispRouteJsondata(){
        $rspString = getResponse('network isp_route_all', "show", '', 1);
        $arrList = parseResponseDatagrid($rspString, 0);
        if(is_array($arrList)) {
            echo json_encode($arrList);
        } else {
            echo '{"rows":[],"total":"0"}';
        }
    }*/

    /*function ispRouteSingle(){
        $param['isp'] = $_GET['isp'];
        $rspString = getResponse('network isp_route_single', "show", $param, 0);
        echo parseResponseDatagrid($rspString);
    }*/

    function ispRouteSingleDetails(){
        $param['isp'] = $_GET['isp'];
        if($_GET['gw'] != 'NULL') $param['gw'] =  $_GET['gw'];
        if($_GET['dev'] != 'NULL') $param['dev'] = $_GET['dev'];
        //$param['__NA__det'] = 'verbose';
        $rspString = getResponse('network isp_route_verbose', "show", $param, 1);
        echo parseResponseDatagrid($rspString);
    }

    function del(){
        //获取前台传过来的数据
        parse_str(file_get_contents('php://input'),$delArr);
        $ispStr = $delArr['ispName'];
        $gwStr = $delArr['gw'];
        $devStr = $delArr['dev'];
        $ispArr = explode('#', $ispStr);
        $gwArr = explode('#', $gwStr);
        $devArr = explode('#', $devStr);
        $param = array();
        foreach($ispArr as $k => $val) {
            $param[$k]['modules'] = 'network route-isp';
            $param[$k]['action'] = 'delete';
            $param[$k]['param']['isp'] = $val;
            if($gwStr && ($gwArr[$k] != 'NULL')) $param[$k]['param']['gw'] = $gwArr[$k];
            if($devStr && ($devArr[$k] != 'NULL')) $param[$k]['param']['dev'] = $devArr[$k];
        }
        echo sendRequestMultiple($param);
    }

    function ispName() {
        $rspString = getResponse('network isp_route_all', "show", '', 0);
        $ispArr = parseResponseDatagrid($rspString, 0);
        //去除重复名称
        foreach($ispArr['rows'] as $k => $val) {
            $ispName[$k] = $val['isp_name'];
        }
        //创建一个匹配的数组
        $arrName = array(
            'CHINANET' => L('CHINANET'),
            'UNICOM' => L('UNICOM'),
            'CMNET' => L('CMNET'),
            'CERNET' => L('CERNET'),
            'CRTC' => L('CRTC'),
            'CNCGROUP' => L('CNCGROUP'),
            'GWBN' => L('GWBN'),
            'CSTN' => L('CSTN'),
            'BCN' => L('BCN'),
            'GeHua' => L('GeHua'),
            'Topway' => L('Topway'),
            'ZHONG-BANG-YA-TONG' => L('ZHONG_BANG_YA_TONG'),
            'FOUNDERBN' => L('FOUNDERBN'),
            'WASU' => L('WASU'),
            'GZPRBNET' => L('GZPRBNET'),
            'HTXX' => L('HTXX'),
            'eTrunk' => L('eTrunk'),
            'WSN' => L('WSN'),
            'CHINAGBN' => L('CHINAGBN'),
            'EASTERNFIBERNET' => L('EASTERNFIBERNET'),
            'LiaoHe-HuaYu' => L('LiaoHe_HuaYu'),
            'CTN' => L('CTN')
        );
        $ispName = array_unique($ispName);
        $ispList[0]['isp_name'] = L('ALL');
        $i= 1;
        foreach($ispName as $value) {
            foreach($arrName as $ak => $av){
                if($ak == $value){
                    $ispList[$i]['isp_key'] =  $value;
                    $ispList[$i]['isp_name'] = $av;
                }
            }

            $i++;
        }
        echo json_encode($ispList);
    }
//rest风格的清空功能
    public function clean(){
        //获取前提传来的需要清空的数据的条件
        parse_str(file_get_contents('php://input'),$delArr);
        $param['modules'] = 'network route-isp';
        $param['action'] = 'clean';
        if($delArr['ispname'] != L('ALL'))
            $param['param']['isp'] = $delArr['ispname'];
        echo sendRequestSingle($param);
    }
    function clear(){
        $param['modules'] = 'network route-isp';
        $param['action'] = 'clean';
        if($_POST['ispname'] != L('ALL'))
            $param['param']['isp'] = $_POST['ispname'];
        echo sendRequestSingle($param);
    }
    //rest风格的添加数据的方法
    public function add(){
        if($_REQUEST['addr']){
            $this -> addSaveAddr();
        }elseif($_REQUEST['import']){
            $this -> ispImportSave();
        }else{
            $this -> addSave();
        }
    }
    function addSave(){
         $config['modules'] = "network route-isp";
         $config['action'] = "add";
         $config['param']['isp'] = $_POST['isp'];
         $config['param']['gw'] = $_POST['gw'];
         $config['param']['dev'] = $_POST['dev'];
         echo sendRequestSingle($config);
	}

    function addSaveAddr(){
        $config['modules'] = "network route-isp";
        $config['action'] = "renew";
        $config['param']['isp'] = $_POST['isp'];
        $config['param']['dst'] = $_POST['dst'];
        echo sendRequestSingle($config);
    }

    function ispImportSave() {
        if(!empty($_FILES["isp_file"]["error"])){
            switch($_FILES["isp_file"]['error']){
                case '1':
                    $error = L('UPDATE_ERROR1');
                    break;
                case '2':
                    $error = L('UPDATE_ERROR2');
                    break;
                case '3':
                    $error = L('UPDATE_ERROR3');
                    break;
                case '4':
                    $error = L('UPDATE_ERROR4');
                    break;

                case '6':
                    $error = L('UPDATE_ERROR6');
                    break;
                case '7':
                    $error = L('UPDATE_ERROR7');
                    break;
                case '8':
                    $error = L('UPDATE_ERROR8');
                    break;
                case '999':
                default:
                    $error = L('UNKNOW_ERR');
            }
            echo $error;
            exit;
        } else if(empty($_FILES['isp_file']['tmp_name']) || $_FILES['isp_file']['tmp_name'] == 'none') {
            $error = L('UPDATE_FAIL');
            echo $error;
            exit;
        } else {
            $newfilename="/tmp/".$_FILES["isp_file"]["name"];
            if(move_uploaded_file($_FILES["isp_file"]["tmp_name"],$newfilename)) {
                $param['modules'] = 'network route-isp';
                $param['action'] = '';
                $param['param']['__NA__updata'] = 'isp-update';
                $rspString = sendRequestSingle($param);
                if(is_numeric($rspString) && $rspString == 0) {
                    echo 'ok';
                } else {
                    echo $rspString;
                }
            } else {
                echo L('UNKNOW_ERR');
            }
        }
    }

}
?>