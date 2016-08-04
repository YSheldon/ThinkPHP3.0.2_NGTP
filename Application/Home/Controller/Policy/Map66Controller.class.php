<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class Map66Controller extends CommonController {
	public function map66Show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_map66_show');
	}

    //查询源地址转换对象
    public function addrObj() {
        $param['name'] = urldecode($_GET['name']);
        if($param['name'] == '' || $param['name'] == null){
            echo '{"rows":[]}';
            exit;
        }
        $grspString = getResponse("define subnet", "show", $param, 0);
        if(!is_numeric($grspString)){
            $grspString = parseResponseDatagrid($grspString,0);
            if(is_array($grspString['rows'][0])) {
                echo json_encode($grspString);
            }
        }
    }

    //保存
    public function natAddSave() {
        if($_POST['enable']) $natParam['param']['enable'] = $_POST['enable'];
        if($_POST['origSrc']) $natParam['param']['orig_src'] = "'".$_POST['origSrc']."'";
        if($_POST['transSrc']) $natParam['param']['trans_src'] = $_POST['transSrc'];

        if($_POST['nat_id']) {
            $natParam['param']['nat_id'] = formatpost($_POST['nat_id']);
            $natParam['action'] = 'modify';
        } else {
            $natParam['action'] = 'add';
        }

        $natParam['modules'] = 'nat map66policy';
        echo sendRequestSingle($natParam);
    }

    //移动
    public function natMove() {
        if($_POST['name']!='')  $param['param']['__NA__'] = formatpost($_POST['name']);
        if($_POST['selected']!='')  $param['param'][$_POST['position']] = formatpost($_POST['selected']);
        $param['modules'] = 'nat map66policy';
        $param['action'] = 'move';
        echo sendRequestSingle($param);
    }

    //配置地址选项
    public function tranSrcJsondata() {
        $rspString = getResponse("define subnet", "show", "", 0);
        $subArr = parseResponseDatagrid($rspString, 0);
        $listArr = array();
        if($subArr['rows'][0]) {
            $k = 0;
            foreach($subArr['rows'] as $val) {
                if(strpos($val['ip'],':') !== false) {
                    $listArr[$k]['name'] = $val['name'];
                    $k++;
                }
            }
        }
        echo json_encode($listArr);
    }
    //源地址多选对象
    public function subnetShow() {
        $rspString = getResponse("define subnet", "show", "", 0);
        $subnetArr = parseResponseDatagrid($rspString, 0);
        if($subnetArr['total'] > 0) {
            $ipv6Arr = array();
            $k = 0;
            foreach($subnetArr['rows'] as $val) {
                if(strpos($val['ip'],':') !== false) {
                    $ipv6Arr['rows'][$k] = $val;
                    $k++;
                }
            }
            if($ipv6Arr['rows'][0]) {
                echo json_encode($ipv6Arr);
            } else {
                echo '{"rows":[],"total":"0"}';
            }
        } else {
            echo '{"rows":[],"total":"0"}';
        }
    }

}

?>
