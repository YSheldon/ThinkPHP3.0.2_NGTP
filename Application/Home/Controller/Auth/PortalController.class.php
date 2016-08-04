<?php
namespace Home\Controller\Auth;
use Home\Controller\CommonController;
class PortalController extends CommonController {
    
    Public function portalInfo(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/auth_portal_info');
    }
    //添加数据
    function portalAdd(){
        if($_POST['hid_portal_name']!='') $config['param']['name'] = formatpost($_POST['hid_portal_name']);
        if($_POST['hid_portal_address']) $config['param']['address'] = formatpost($_POST['hid_portal_address']);
        if($_POST['hid_portal_port']) $config['param']['port'] = formatpost($_POST['hid_portal_port']);
        if($_POST['hid_portal_server']) $config['param']['server-name'] = formatpost($_POST['hid_portal_server']);

        if($_POST['portal_tag']) $tag = formatpost($_POST['portal_tag']);

        $config['modules'] = "user auth portal";
        if($tag == 1){
            $config['action'] = "add";
        }else{
            $config['action'] = "modify";
        }
       echo sendRequestSingle($config);
    }
}
?>