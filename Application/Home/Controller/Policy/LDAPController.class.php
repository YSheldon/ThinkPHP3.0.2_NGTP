<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class LDAPController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_ldap_show');
	}

    public function jsondata(){
        $rspString = getResponse('proxy ldap_profile', "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }

/*    public function addLdapProfile(){
        $this->display('Window/policy_ldap_window');
    }*/

    public function addLdapProfileHandle(){
        $flag = $_POST['flag'];
        $config['modules'] = "proxy ldap_profile";
        if($flag ==1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['proxy_name'] = $_POST['proxy_name'];
        }elseif($flag ==2){
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['id'] = $_POST['id'];
            $config['param']['proxy_name'] = $_POST['proxy_name'];
        }
        echo sendRequestSingle($config);
    }

/*    public function deleteLdapProfile(){
        $config['modules'] = "proxy ldap_profile";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }

    public function clearLdapProfile(){
        $config['modules'] = "proxy ldap_profile";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
    }*/
}
?>
