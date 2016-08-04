<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class HTTPController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_http_show');
	}

    public function showJsonData(){
        $rspString = getResponse('proxy http_profile', "show", '', 0);
        echo parseResponseDatagrid($rspString);
    }

/*    public function addHttpProfile(){
        $this->display('Window/policy_http_window');
    }

    public function editHttpProfile(){
        $this->display('Window/policy_http_window');
    }*/

    public function addHttpProfileHandle(){
        $flag = $_POST['flag'];
        $config['modules'] = "proxy http_profile";
        $config['param']['name'] = $_POST['name'];
        $config['param']['vs_name'] = $_POST['vs_name'];
        $config['param']['max_request_len'] = $_POST['max_request_len'];
        $config['param']['max_body_len'] = $_POST['max_body_len'];
        $config['param']['content_type'] = $_POST['content_type'];
        $config['param']['uri'] = $_POST['uri'];
        $config['param']['keyword'] = $_POST['keyword'];
        $config['param']['rewrite_request_head'] = $_POST['rewrite_request_head'];
        $config['param']['set-cookie'] = $_POST['set-cookie'];
        if($flag ==1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['ignore_invalid_header'] = $_POST['ignore_invalid_header'];
        }elseif($flag ==2){
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['id'] = $_POST['id'];
            $config['param']['ignore_invalid_headers'] = $_POST['ignore_invalid_header'];
        }
        echo sendRequestSingle($config);
    }
}
?>
