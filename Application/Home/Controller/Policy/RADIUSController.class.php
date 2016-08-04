<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class RADIUSController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_radius_show');
	}

    public function jsondata(){
        $rspString = getResponse('proxy radius_profile', "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }

/*    public function addRadiusProfile(){
        $this->display('Window/policy_radius_window');
    }*/

    public function addRadiusProfileHandle(){
        $flag = $_POST['flag'];
        $config['modules'] = "proxy radius_profile";
        if($flag ==1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['proxy_name'] = $_POST['proxy_name'];
            $config['param']['radius-dictpath'] = $_POST['radius_dictpath'];
            $config['param']['radius-key'] = $_POST['radius_key'];
            $config['param']['radius-dictname'] = $_POST['radius_dictname'];
        }elseif($flag ==2){
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['proxy_name'] = $_POST['proxy_name'];
            $config['param']['radius-dictpath'] = $_POST['radius_dictpath'];
            $config['param']['radius-key'] = $_POST['radius_key'];
            $config['param']['radius-dictname'] = $_POST['radius_dictname'];
        }
        echo sendRequestSingle($config);
    }
}
?>
