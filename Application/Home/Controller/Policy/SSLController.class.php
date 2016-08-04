<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class SSLController extends CommonController {
	public function showData(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET['tabs'] == ''){
            $this->display('/Default/policy_ssl_server');
        }else{
            $this->display('/Default/policy_ssl_client');
        }
	}

/*    public function addSslProfileServer(){
        $this->display('/Window/policy_sslserver_window');
    }

    public function addSslClientProfile(){
        $this->display('/Window/policy_sslclient_window');
    }*/

    public function jsonData(){
        if($_GET['flag'] == ''){
            $rspString = getResponse('proxy ssl_server_profile', "show", '', 0);
        }else{
            $rspString = getResponse('proxy ssl_client_profile', "show", '', 0);
        }
        echo parseResponseDatagrid($rspString);
    }

    //ca
    public function readCa(){
        $path = "/usr/local/nginx/cert/ca/";
        $arr = array();
        $i=0;
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file!="." && $file!="..") {
                    $arr[$i]['name']=$file;
                    $i++;
                }
            }
            closedir($dh);
        }
        echo json_encode($arr);
    }

    //certificate
    public function readCertificate(){
        $path = "/usr/local/nginx/cert/certificate/";
        $arr = array();
        $i=0;
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file!="." && $file!="..") {
                    $arr[$i]['name']=$file;
                    $i++;
                }
            }
            closedir($dh);
        }
        echo json_encode($arr);
    }

    //key
    public function readKey(){
        $path = "/usr/local/nginx/cert/key/";
        $arr = array();
        $i=0;
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file!="." && $file!="..") {
                    $arr[$i]['name']=$file;
                    $i++;
                }
            }
            closedir($dh);
        }
        echo json_encode($arr);
    }

    //crl
    public function readCrl(){
        $path = "/usr/local/nginx/cert/crl/";
        $arr = array();
        $i=0;
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file!="." && $file!="..") {
                    $arr[$i]['name']=$file;
                    $i++;
                }
            }
            closedir($dh);
        }
        echo json_encode($arr);
    }

    public function addSslServerProfile(){
        $flag = $_POST["flag"];
        $config['modules'] = "proxy ssl_server_profile";
        $config['param']['proxy_cert'] = formatpost($_POST['proxy_cert']);
        $config['param']['proxy_cert_key'] = formatpost($_POST['proxy_cert_key']);
        $config['param']['proxy_name'] = formatpost($_POST['proxy_name']);
        $config['param']['proxy_trusted_cert'] = formatpost($_POST['proxy_trusted_cert']);
        $config['param']['proxy_verify'] = formatpost($_POST['proxy_verify']);
        $config['param']['proxy_ssl_cert_trans'] = formatpost($_POST['proxy_ssl_cert_trans']);
        $config['param']['proxy_crl'] = formatpost($_POST['proxy_crl']);
        $config['param']['proxy_verify_depth'] = formatpost($_POST['proxy_verify_depth']);

        if($flag ==1){
            $config['param']['name'] = formatpost($_POST['name']);
            $config['action'] = "add";
            $config['note'] = "add";
        }else{
            $config['param']['id'] = formatpost($_POST['id']);
            $config['action'] = "modify";
            $config['note'] = "modify";
        }
        echo sendRequestSingle($config);
    }

/*    public function deleteSsslProfile(){
        $config['modules'] = "proxy ssl_server_profile";
        $config['action'] = "del";
        $config['note'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }

    public function clearSsslProfile(){
        $config['modules'] = "proxy ssl_server_profile";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
    }*/

    public function addSslProfileHandle(){
        $flag = $_POST["flag"];
        $config['modules'] = "proxy ssl_client_profile";
        $config['param']['ssl'] = formatpost($_POST['ssl']);
        $config['param']['ssl_crl'] = formatpost($_POST['ssl_crl']);
        $config['param']['ssl_cert'] = formatpost($_POST['ssl_cert']);
        $config['param']['ssl_session_ticket_key'] = formatpost($_POST['ssl_session_ticket_key']);
        $config['param']['ssl_cert_key'] = formatpost($_POST['ssl_cert_key']);
        $config['param']['ssl_client_cert'] = formatpost($_POST['ssl_client_cert']);
        $config['param']['ssl_trusted_cert'] = formatpost($_POST['ssl_trusted_cert']);
        $config['param']['ssl'] = formatpost($_POST['ssl']);
        $config['param']['ssl_session_cache'] = formatpost($_POST['ssl_session_cache']);
        $config['param']['ssl_session_tickets'] = formatpost($_POST['ssl_session_tickets']);
        $config['param']['ssl_session_timeout'] = formatpost($_POST['ssl_session_timeout']);
        $config['param']['ssl_verify_client'] = formatpost($_POST['ssl_verify_client']);
        $config['param']['ssl_verify_depth'] = formatpost($_POST['ssl_verify_depth']);
        $config['param']['ssl_ciphers'] = formatpost($_POST['ssl_ciphers']);
        if($flag ==1){
            $config['action'] = "add";
            $config['note'] = "add";
            $config['param']['name'] = formatpost($_POST['name']);
        }else{
            $config['action'] = "modify";
            $config['note'] = "modify";
            $config['param']['id'] = formatpost($_POST['id']);
        }
        echo sendRequestSingle($config);
    }
/*    public function deleteSslProfile(){
        $config['modules'] = "proxy ssl_client_profile";
        $config['action'] = "del";
        $config['note'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);
    }
    public function cleanSslProfile(){
        $config['modules'] = "proxy ssl_client_profile";
        $config['action'] = "clean";
        $config['note'] = "clean";
        echo sendRequestSingle($config);
    }*/
    public function getSslProfileName(){
        $sslServer = getResponse('proxy ssl_server_profile', "show", '', 0);
        $sslClient = getResponse('proxy ssl_client_profile', "show", '', 0);
        $server = parseResponseDatagrid($sslServer,0);
        $client = parseResponseDatagrid($sslClient,0);
        $tmp = array();

        if($server['rows'][0])
            $tmp = array_merge_recursive($tmp,  $server);
        if($client['rows'][0])
            $tmp = array_merge_recursive($tmp,  $client);

        $sslNames = array();
        foreach($tmp['rows'] as $k => $val) {
            $sslNames[$k]['name'] = $val['name'];
        }
        echo json_encode($sslNames);
    }

    public function readSessionTicketKey(){
        $path = "/usr/local/nginx/cert/tickets/";
        $arr = array();
        $i=0;
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file!="." && $file!="..") {
                    $arr[$i]['name']=$file;
                    $i++;
                }
            }
            closedir($dh);
        }
        echo json_encode($arr);
    }
    //读取下拉框列表中的文件的方法
    public function getComBox(){
        $arr = array();
        $arr = ['/usr/local/nginx/cert/certificate/','/usr/local/nginx/cert/key/','/usr/local/nginx/cert/ca/','/usr/local/nginx/cert/crl/','/usr/local/nginx/cert/tickets/'];
        $path = $arr[$_GET['link']];
        $arr = array();
        $i=0;
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file!="." && $file!="..") {
                    $arr[$i]['name']=$file;
                    $i++;
                }
            }
            closedir($dh);
        }
        echo json_encode($arr);
    }
}
?>
