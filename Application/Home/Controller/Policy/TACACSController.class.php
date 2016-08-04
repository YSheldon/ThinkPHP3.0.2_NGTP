<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class TACACSController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_tacacs_show');
	}

    public function jsondata(){
        $rspString = getResponse('proxy tacacs_plus_profile', "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }

/*    public function addTacacsProfile(){
        $this->display('Window/policy_tacacs_window');
    }*/

    public function addTacacsProfileHandle(){
        $flag = $_POST['flag'];
        $config['modules'] = "proxy tacacs_plus_profile";
        if($flag ==1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['proxy_name'] = $_POST['proxy_name'];
            $config['param']['tacacs-key'] = $_POST['tacacs_key'];
        }elseif($flag ==2){
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['proxy_name'] = $_POST['proxy_name'];
            $config['param']['tacacs-key'] = $_POST['tacacs_key'];
        }
        echo sendRequestSingle($config);
    }
}
?>
