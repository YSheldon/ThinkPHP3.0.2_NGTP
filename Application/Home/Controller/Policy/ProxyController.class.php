<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class ProxyController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_proxy_show');
	}

/*    public function addProxyProfile(){
        $this->display('/Window/policy_proxy_window');
    }*/

    public function jsondata(){
        $rspString = getResponse('proxy policy', "show", '', 1);
        echo parseResponseDatagrid($rspString);
    }

    public function addProxyHandle(){
        $config['modules'] = "proxy policy";
        $flag = $_POST['flag'];
        $config['param']['l7_profile'] = $_POST['l7_profile'];
        $config['param']['proxy_ip'] = $_POST['proxy_ip'];
        $config['param']['proxy_port'] = $_POST['proxy_port'];
        $config['param']['mode'] = $_POST['mode'];
        if($_POST['mode'] == "rproxy"){
            $config['param']['server_port'] = $_POST['server_port'];
            $config['param']['server_ip'] = $_POST['server_ip'];
        }
        if($_POST['ssl_profile']){
            $ssl_profile = "'".implode(" ",$_POST['ssl_profile'])."'";
            $config['param']['ssl_profile'] = trim($ssl_profile);
        }
        if($flag == 1){
            $config['action'] = "add";
            $config['note'] = "add";
        }else{
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['id'] = $_POST['id'];
        }
        echo sendRequestSingle($config);
    }

/*    public function deleteProxyProfile(){
        $config['modules'] = "proxy policy";
        $config['action'] = "delete";
        $config['note'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }

    public function clearProxyProfile(){
        $config['modules'] = "proxy policy";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
    }*/

    public function getL7ProfileName(){
        $httpName = getResponse('proxy http_profile', "show", '', 0);
        $ftpName = getResponse('proxy ftp_profile', "show", '', 0);
        $ldapName = getResponse('proxy ldap_profile', "show", '', 0);
        $radiusName = getResponse('proxy radius_profile', "show", '', 0);
        $tacacsName = getResponse('proxy tacacs_plus_profile', "show", '', 0);
        $http = parseResponseDatagrid($httpName,0);
        $ftp = parseResponseDatagrid($ftpName,0);
        $ldapName = parseResponseDatagrid($ldapName,0);
        $radiusName = parseResponseDatagrid($radiusName,0);
        $tacacsName = parseResponseDatagrid($tacacsName,0);
        $tmp = array();

        if($http['rows'][0])
            $tmp = array_merge_recursive($tmp,  $http);
        if($ftp['rows'][0])
            $tmp = array_merge_recursive($tmp,  $ftp);
        if($ldapName['rows'][0])
            $tmp = array_merge_recursive($tmp,  $ldapName);
        if($radiusName['rows'][0])
            $tmp = array_merge_recursive($tmp,  $radiusName);
        if($tacacsName['rows'][0])
            $tmp = array_merge_recursive($tmp,  $tacacsName);

        $profileNames = array();
        foreach($tmp['rows'] as $k => $val) {
            if($val['name'])
                $profileNames[$k]['name'] = $val['name'];
            else
                $profileNames[$k]['name'] = $val['proxy_name'];
        }
        if($_GET['flag']){
            $profileName = $_POST['name'];
            foreach($http['rows'] as $kk=>$v){
                $httpNamearr[]=$v['name'];
            }
            if(in_array($profileName,$httpNamearr)){
                echo 'http';
            }else{
                echo 'ok';
            }
        }else{
            echo json_encode($profileNames);
        }
    }
}
?>
