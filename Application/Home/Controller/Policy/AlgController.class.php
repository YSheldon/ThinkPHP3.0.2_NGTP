<?php
namespace Home\Controller\Policy;
use Think\Controller;
class AlgController extends Controller {
	public function show(){
		require_once APP_PATH . 'Home/Common/menupage.php';
        $rspString = getResponse("alg config", "show", "", 0);
        $arr = parseResponse($rspString,0);
        foreach ($arr['rows'] as $value) {
            $this->assign($value['protocol'],$value['enable']);
        }
		$this->display('Default/policy_alg');
	}

    //设置
    /*public function set() {
        $arr = array("ftp", "tftp", "sqlnet", "pptp");
        $msg = "";
        foreach ($arr as $k=>$value) {
            $parameter = $_POST[$value];
            $parameter_old = $_POST[$value . "_old"];
            $configParam[$k]['param']['protocol'] = $value;

            if (($parameter == "checked" && $parameter_old == "yes") || (($parameter == null || $parameter == "") && $parameter_old == "no")) {
                continue;
            } else if ($parameter == "checked" && $parameter_old == "no") {
                $configParam[$k]['param']['enable'] = "yes";
            } else if (($parameter == null || $parameter == "") && $parameter_old == "yes") {
                $configParam[$k]['param']['enable'] = "no";
            }
            $configParam[$k]['modules'] = 'alg config';
            $configParam[$k]['action'] = 'set';
        }
        echo sendRequestMultiple($configParam);
    }*/

    public function set() {
        $arr = array("ftp", "tftp", "sqlnet", "pptp");
        $msg = "";
        foreach ($arr as $k=>$value) {
            $parameter = $_POST[$value];
            $parameter_old = $_POST[$value . "_old"];
            $configParam['param']['protocol'] = $value;

            if (($parameter == "checked" && $parameter_old == "yes") || (($parameter == null || $parameter == "") && $parameter_old == "no")) {
                continue;
            } else if ($parameter == "checked" && $parameter_old == "no") {
                $configParam['param']['enable'] = "yes";
            } else if (($parameter == null || $parameter == "") && $parameter_old == "yes") {
                $configParam['param']['enable'] = "no";
            }
            $configParam['modules'] = 'alg config';
            $configParam['action'] = 'set';
           $rst = sendRequestSingle($configParam);
            if(strlen($rst) > 2) {
                break;
            }
        }
        if(is_numeric($rst) || $rst == '' || $rst == NULL) {
            echo '0';
        } else {
            echo $rst;
        }
    }

    //重置
    public function reset() {
        $param['modules'] = 'alg config';
        $param['action'] = 'reset';
        echo sendRequestSingle($param);
    }

}
?>