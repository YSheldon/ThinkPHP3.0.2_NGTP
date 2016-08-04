<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class RadvdController extends CommonController {
	public function Show(){
		require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/network_radvd_show');
	}
	//显示数据
/*	public function radvdShow() {
		$rspString = getResponse("network radvd", "show", '', 1);
        echo parseResponseDatagrid($rspString);
	}*/
	//添加弹出框
/*	public function radvdAdd() {
		$this->display('/Window/network_radvd_window');
	}*/
        //查询状态
        public function status() {
            $rspString = parseResponse(getResponse("network radvd", "show-status", "", 1));
            echo $rspString['rows']['status'];
        }
    //rest风格的添加数据的方法
    public function add(){
        parse_str(file_get_contents('php://input'),$dataArr);
        $config['modules'] = "network radvd";
        $config['param']['interface'] = $dataArr['interface'];
        $config['param']['valid_life_day'] = $dataArr['valid_life_day'];
        $config['param']['valid_life_hour'] = $dataArr['valid_life_hour'];
        $config['param']['valid_life_min'] = $dataArr['valid_life_min'];
        $config['param']['max_ra_interval'] = $dataArr['max_ra_interval'];
        if($dataArr['min_ra_interval'] == 'default') {
            $config['param']['min_ra_interval'] = '';
        } else {
            $config['param']['min_ra_interval'] = $dataArr['min_ra_interval'];
        }
        $config['param']['reachable_t'] = $dataArr['reachable_t'];
        $config['param']['retrans_t'] = $dataArr['retrans_t'];
        $config['param']['cur_hop_limit'] = $dataArr['cur_hop_limit'];
        $config['param']['prefix'] = $dataArr['prefix'];
        $tag = $dataArr['tag'];
        if ($tag == 1) {
            $config['action'] = "add";
            $config['note'] = "添加";
        } else {
            $config['action'] = "modify";
            $config['note'] = "修改";
        }
        echo sendRequestSingle($config);
    }
	//radvd添加/修改数据
	public function doAddrRadvd() {
		$config['modules'] = "network radvd";
		$config['param']['interface'] = $_POST['interface'];
		$config['param']['valid_life_day'] = $_POST['valid_life_day'];
		$config['param']['valid_life_hour'] = $_POST['valid_life_hour'];
		$config['param']['valid_life_min'] = $_POST['valid_life_min'];
		$config['param']['max_ra_interval'] = $_POST['max_ra_interval'];
		if($_POST['min_ra_interval'] == 'default') {
			$config['param']['min_ra_interval'] = '';
		} else {
			$config['param']['min_ra_interval'] = $_POST['min_ra_interval'];
		}
		$config['param']['reachable_t'] = $_POST['reachable_t'];
		$config['param']['retrans_t'] = $_POST['retrans_t'];
		$config['param']['cur_hop_limit'] = $_POST['cur_hop_limit'];
		$config['param']['prefix'] = $_POST['prefix'];
		$tag = $_POST['tag'];
		if ($tag == 1) {
			$config['action'] = "add";
            $config['note'] = "添加";
		} else {
			$config['action'] = "modify";
            $config['note'] = "修改";
		}
		echo sendRequestSingle($config);
	}
	//删除radvd
/*	public function doDelRadvd() {
		$config['modules'] = "network radvd";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['interface'] =$_POST['interface'];
        echo sendRequestSingle($config);
	}*/
	//清空radvd
/*	public function doDelAllRadvd() {
		$config['modules'] = "network radvd";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
	}*/
	//开启
/*	public function enableRoles() {
		$config['modules'] = "network radvd";
		$config['action'] = "start";
		$config['note'] = L('ON');
		echo sendRequestSingle($config);
	}*/
	//关闭
/*	public function disableRoles() {
		$config['modules'] = "network radvd";
		$config['action'] = "stop";
		$config['note'] = L('STOP');
	echo sendRequestSingle($config);
	}*/

/*    public function bondVlan() {
        $rspString = getResponse("network radvd_server_wait", "show",'', 0);
        $arr =  parseResponseDatagrid($rspString,0);
        $i = 0;
        foreach ($arr['rows'] as $k => $v) {
            $ret[$k]['text'] = $v['interface'];
            if ($_GET['clear'] != 'clear' && $i == 0) {
                $ret[$k]['selected'] = true;
                $i++;
            }
        }
        if($ret == null && $ret == "")
            $ret =="";
        echo json_encode($ret);
    }*/
}