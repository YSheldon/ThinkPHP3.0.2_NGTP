<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class FTPController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_ftp_show');
	}

    public function jsonData(){
        $rspString = getResponse('proxy ftp_profile', "show", '', 0);
        echo parseResponseDatagrid($rspString);
    }

/*    public function addFtpProfile(){
        $this->display('Window/policy_ftp_window');
    }*/

    public function addFtpProfileHandle(){
        $flag = $_POST['flag'];
        $config['modules'] = "proxy ftp_profile";
        if($flag ==1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['name'] = $_POST['name'];
            $config['param']['expect_buffer'] = $_POST['expect_buffer'];
            $config['param']['expect_timer'] = $_POST['expect_timer'];
            $config['param']['upstream_data_mode'] = $_POST['upstream_data_mode'];
        }elseif($flag ==2){
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['id'] = $_POST['id'];
            $config['param']['expect_buffer'] = $_POST['expect_buffer'];
            $config['param']['expect_timer'] = $_POST['expect_timer'];
            $config['param']['upstream_data_mode'] = $_POST['upstream_data_mode'];
        }
        echo sendRequestSingle($config);
    }

/*    public function deleteFtpProfile(){
        $config['modules'] = "proxy ftp_profile";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }*/

/*    public function clearFtpProfile(){
        $config['modules'] = "proxy ftp_profile";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
    }*/
}
?>
