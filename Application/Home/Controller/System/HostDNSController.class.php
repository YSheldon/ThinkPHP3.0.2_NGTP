<?
// $DEMO_DATA = 0;
// $DEBUG_SWITCH = debugMode($_GET['debug']);
// $page['link'] = $_SESSION['link'];

namespace Home\Controller\System;
use Think\Controller;
class HostDNSController extends Controller{
	public function hostDNS_show(){
		$retArray = checkResponse();
		require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display("Default/system_hostdns_show");
	}

	public function Show(){
		$rspString = getResponse("network dns","show",'', 0);
    	echo parseResponseDatagrid($rspString);
	}

	public function HostDNSset(){
	    $config['modules'] = "network dns";
        $config['action'] = "set";
        $config['note'] = "set";
        $config['param']['firstDNS'] = $_POST['firstDNS'];
		$config['param']['secondDNS1'] = $_POST['secondDNS1'];
		$config['param']['secondDNS2'] = $_POST['secondDNS2'];
        echo sendRequestSingle($config);
	}

	public function HostDNSReset(){
		$config['modules'] = "network dns";
        $config['action'] = "reset";
        $config['note'] = "reset";
        echo sendRequestSingle($config);
	}
}
?>