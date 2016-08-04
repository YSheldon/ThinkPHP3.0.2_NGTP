<?php

namespace Home\Controller\System;
use Home\Controller\CommonController;
class ParametersController extends CommonController {
    public $apacheSSLFile = "/usr/local/apache2/conf/extra/httpd-ssl.conf";
    public $apacheSSLCertificate = "/usr/local/apache2/bin/client.p12";
    public $apacheSSLTmpCertificate = "/usr/local/apache2/bin/tmp/client.p12";
    public $apacheSSLClientTmpCertificate = "/usr/local/apache2/bin/tmp/client.cer";
    public $apacheSSLClientCertificate = "/usr/local/apache2/bin/client.cer";
    public $certRoot = "/usr/local/apache2/bin/";
    public $originCertRoot = "/usr/local/apache2/conf/";
    public $certSH = "/usr/local/apache2/htdocs/Application/Home/Conf/";

    //rest方式的显示数据的方式
    public function datagridShow(){
        $allshow=array(
            'module'=>array(
                'system devname',
                'system webui',
                'network session',
                'stat switch'
            ),
            'action'=>'show'
        ,
            'backcome'=>array(
                'devname',
                'timout_webui',
                '',
                ''
            )
        );
        //获取权限
        $conf_global=getPrivilege("global");
        $conf_network_show=getPrivilege("network");
        for ($i=0;$i<count($allshow['module']);$i++) {
            $backcome = $allshow['backcome'][$i];
            $module = $allshow['module'][$i];
            $action = $allshow['action'];
            if ($module == 'network session' && $conf_network_show==1) {
                $param['__NA__'] = 'configuration';
                $rspString = getResponse( $module, $action, $param, 1);
                $rspString = parseResponse($rspString);
            } else if ($module == 'system webui' && $conf_global==1) {
                $rspString = getResponse( $module, $action, '', 1);
                $rspString = parseResponse($rspString);
            }else {
                $rspString = getResponse( $module, $action, '', 1);
                $rspString = parseResponse($rspString);
            }
            $param = array();
            if (is_array($rspString)) {
                if ($module=='network session'&& $conf_network_show == 1) {
                    $outcome['tcp_handshake_timeout'] = $rspString['rows']['tcp_handshake_timeout'];
                    $outcome['tcp_close_timeout'] = $rspString['rows']['tcp_close_timeout'];
                    $outcome['tcp_reset'] = $rspString['rows']['tcp_reset'];
                    $outcome['packet_checksum'] = $rspString['rows']['packet_checksum'];
                    $outcome['defrag_is_on'] = $rspString['rows']['defrag_is_on'];
                    $outcome['nerver_expire_timeout'] = $rspString['rows']['nerver_expire_timeout'];
                    $outcome['udp_timeout'] = $rspString['rows']['udp_timeout'];
                    $outcome['never_expire_percent'] = $rspString['rows']['never_expire_percent'];
                    $outcome['session_integrity'] = $rspString['rows']['session_integrity'];
                    $outcome['other_timeout'] = $rspString['rows']['other_timeout'];
                    $outcome['tcp_estab_timeout'] = $rspString['rows']['tcp_estab_timeout'];
                    $outcome['syn_reset'] = $rspString['rows']['syn_reset'];
                    $outcome['only_syn_create'] = $rspString['rows']['only_syn_create'];
                }else {
                    $outcome[$backcome]=$rspString[$backcome];
                }
            } else if (is_string($rspString)) {
                $retError = showError($rspString);
            }
        }
        $conf = getPrivilege("device-maintenance");
        //根系统管理员（vsid == 0）
        $vid = getVsid();
        $res = isVrAdmin();
        $val = getVsysTurn();
        /*            $this->assign("vpn_licnce",$vpn_licnce);
                    $this->assign("conf_stat",$conf_stat);*/
        $list = $outcome;
        $list['conf'] = $conf;
        $list['vid'] = $vid;
        $list['res'] = $res;
        $list['val'] = $val;
        $list['conf_global'] = $conf_global;
        $list['conf_network_show'] = $conf_network_show;
        echo json_encode($list);
    }
    public function parameters_edit() {
        $allshow=array(
            'module'=>array(
                'system devname',
                'system webui',
                'network session',
                'stat switch',
            ),
            'action'=>'show'
            ,
            'backcome'=>array(
                'devname',
                'timout_webui',
                '',
                ''
            )
        );
    //获取权限
        $conf_global=getPrivilege("global");
        $conf_network_show=getPrivilege("network");
        for ($i=0;$i<count($allshow['module']);$i++) {
            $backcome = $allshow['backcome'][$i];
            $module = $allshow['module'][$i];
            $action = $allshow['action'];
            if ($module == 'network session' && $conf_network_show==1) {
                $param['__NA__'] = 'configuration';
                $rspString = getResponse( $module, $action, $param, 1);
                $rspString = parseResponse($rspString);
            } else if ($module == 'system webui' && $conf_global==1) {
                $rspString = getResponse( $module, $action, '', 1);
                $rspString = parseResponse($rspString);
            }else {
                $rspString = getResponse( $module, $action, '', 1);
                $rspString = parseResponse($rspString);
            }
            $param = array();
            if (is_array($rspString)) {
                if ($module=='network session'&& $conf_network_show == 1) {
                    $outcome['tcp_handshake_timeout'] = $rspString['rows']['tcp_handshake_timeout'];
                    $outcome['tcp_close_timeout'] = $rspString['rows']['tcp_close_timeout'];
                    $outcome['tcp_reset'] = $rspString['rows']['tcp_reset'];
                    $outcome['packet_checksum'] = $rspString['rows']['packet_checksum'];
                    $outcome['defrag_is_on'] = $rspString['rows']['defrag_is_on'];
                    $outcome['nerver_expire_timeout'] = $rspString['rows']['nerver_expire_timeout'];
                    $outcome['udp_timeout'] = $rspString['rows']['udp_timeout'];
                    $outcome['never_expire_percent'] = $rspString['rows']['never_expire_percent'];
                    $outcome['session_integrity'] = $rspString['rows']['session_integrity'];
                    $outcome['other_timeout'] = $rspString['rows']['other_timeout'];
                    $outcome['tcp_estab_timeout'] = $rspString['rows']['tcp_estab_timeout'];
                    $outcome['syn_reset'] = $rspString['rows']['syn_reset'];
                    $outcome['only_syn_create'] = $rspString['rows']['only_syn_create'];
                }else {
                    $outcome[$backcome]=$rspString[$backcome];
                }
            } else if (is_string($rspString)) {
                $retError = showError($rspString);
            }
        }
            $conf = getPrivilege("device-maintenance");
        //获取路由回源
        $param['back'] = 'show';
        $rspString = getResponse('network route','set',$param,0);
        $back_to_source = parseResponse($rspString);

        $port = $this->getApacheSSLPort();
        $outcome["apache_ssl_port"]= (string)$port;
        if(is_numeric($port)){
            $outcome["apache_ssl_port"]= (string)$port;
        } else{
            $retError = showError($port);
        }

         //根系统管理员（vsid == 0）
         $vid = getVsid();
         $res = isVrAdmin();
         $val = getVsysTurn();
         $this->assign("conf",$conf);
         $this->assign("vid",$vid);
         $this->assign('res',$res);
         $this->assign('val',$val);
         $this->assign("outcome",$outcome);
         $this->assign("conf_global",$conf_global);
         $this->assign("conf_network_show",$conf_network_show);
         $this -> assign('back_to_source',$back_to_source['status']);
/*       $this->assign("vpn_licnce",$vpn_licnce);
         $this->assign("conf_stat",$conf_stat);*/

         //获取ssl是否开启
         $isSSLEnable =$this->getSSLIsEnable();//getResponse( "system webui", $action, $param, 1); parseResponse($rspString);
         if($isSSLEnable){
            $certificate_verify = "yes";
         } else{
            $certificate_verify = "no";
         }
         $this->assign("certificate_verify", $certificate_verify);

         //证书是否存在
         $flag = $this->isClientCertificateExist();
         if($flag == false){
            $this->assign("certificate_exist", "false");
         } else {
            $this->assign("certificate_exist", "true");
         }

         require_once APP_PATH . 'Home/Common/menupage.php';
         $this->display('/Default/system_parameters_edit');
    }

    //rest方式的编辑的方法
    public function edit() {
//    	echo "edit";
        parse_str(file_get_contents('php://input'),$dataArr);
        $num=0;
        $config=array();
        $allSubmit=array(
            'submitHtml'=>array(
                'name',
                'timeout',
                'con_timeout',
                'discon_timeout',
                'TCP',
                'packet_checksum',
                'defrag_is_on',
                'never_expire',
                'udp_timeout',
                'never_expire_percent',
                'session_integrity',
                'other',
                'tcp_timeout',
                'syn_reset',
                'only_syn_create',
                'session_flow',
                'server_flow',
                'user_app_flow',
                'vpn_tunnel_flow',
                'threat_flow',
                'back_to_source',
                'pf',
                'apache_ssl_port'
            ),
            'modules'=>array(
                'system devname',
                'system webui',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'network session',
                'stat switch',
                'stat switch',
                'stat switch',
                'stat switch',
                'stat switch',
                'network route',
                'pf service',
                'system webui-port'
            ),
            'action'=>array(
                'set',
                'idle-timeout',
                'timeout',
                'timeout',
                'tcp-reset',
                'packet-checksum',
                'defrag',
                'timeout',
                'timeout',
                'never-expire-percent',
                'session-integrity',
                'timeout',
                'timeout',
                'syn-reset',
                'only-syn-create',
                'session',
                'server',
                'user_app',
                'vpn_tunnel',
                'threat',
                'set',
                'webui-port',
                ''
            )

        );
        for ($i=0;$i<count($allSubmit['submitHtml']);$i++) {
            $con = $allSubmit['submitHtml'][$i];
            if ($dataArr[$con] != '') {
                $config[$num]['modules'] = $allSubmit['modules'][$i];
                $config[$num]['action'] = $allSubmit['action'][$i];
                if($con == 'TCP' || $con == 'packet_checksum' || $con == 'defrag_is_on' || $con == 'syn_reset' || $con == 'session_integrity') {
                    if ($dataArr[$con]!='0')   $config[$num]['param']['__NA__'] = 'on';

                    else 
                        $config[$num]['param']['__NA__'] = 'off';
                } else if ($con=='timeout') {
                    $config[$num]['param']['__NA__'] = formatpost($dataArr[$con]);
                } else if ($con=='con_timeout') {
                    $config[$num]['param']['__NA__1'] ='handshake';
                    $config[$num]['param']['__NA__2'] =formatpost($dataArr[$con]);

                } else if ($con=='discon_timeout') {
                    $config[$num]['param']['__NA__1'] ='close';
                    $config[$num]['param']['__NA__2'] =formatpost($dataArr[$con]);
                } else if ($con=='never_expire') {
                    $config[$num]['param']['__NA__1'] ='never-expire';
                    $config[$num]['param']['__NA__2'] =formatpost($dataArr[$con]);
                } else if ($con=='udp_timeout') {
                    $config[$num]['param']['__NA__1'] ='udp';
                    $config[$num]['param']['__NA__2'] =formatpost($dataArr[$con]);
                } else if ($con=='other') {
                    $config[$num]['param']['__NA__1'] ='other';
                    $config[$num]['param']['__NA__2'] =formatpost($dataArr[$con]);
                } else if ($con=='tcp_timeout') {
                    $config[$num]['param']['__NA__1'] ='established';
                    $config[$num]['param']['__NA__2'] =formatpost($dataArr[$con]);
                } else if ($con=='only_syn_create') {
                    if ($dataArr[$con]!='0')   $config[$num]['param']['__NA__'] = 'off';

                    else    
                        $config[$num]['param']['__NA__'] = 'on';
                } else if ($con=='never_expire_percent') {
                    $config[$num]['param']['__NA__'] =formatpost($dataArr[$con]);
                } else if($con=='back_to_source'){
                            if($dataArr[$con] == 1){
                                $config[$num]['param']['back-to-source'] = 'on';
                            }else{
                                $config[$num]['param']['back-to-source'] = 'off';
                            }
                } else if($con=='apache_ssl_port'){
                    #apache ssl 端口修改
                    $port = $dataArr[$con];
                    if($port != "" && $port != "443") {
                        $config[$num]['param']['turn-to'] = (int)($port);
                    } else if($port == "443"){
                        $config[$num]['action'] = "reset";
                    } else{
                        continue;
                    }
                    #var_dump($config[$num]);
                }  else if($con == "pf"){
                    #apache ssl pf端口修改
                    $config[$num]['modules'] = $allSubmit['modules'][$i];
                    $config[$num]['action'] = $allSubmit['action'][$i];
                    $port = $dataArr["apache_ssl_port"];
                    echo $port;die;
                    if($port != "" && $port != "443") {
                        $config[$num]['param']['turn-to'] = (int)($port);
                    } else if($port == "443"){
                        $config[$num]['param']['__NA__1'] = "reset";
                    } else{
                        continue;
                    }
                    $num++;
                }else {
                    $config[$num]['param']['__NA__'] = formatpost($dataArr[$con]);
                }
                $num++;
            }
//            else if($con == "pf"){
//                #apache ssl pf端口修改
//                $config[$num]['modules'] = $allSubmit['modules'][$i];
//                $config[$num]['action'] = $allSubmit['action'][$i];
//                $port = $dataArr["apache_ssl_port"];
//                echo $port;die;
//                if($port != "" && $port != "443") {
//                    $config[$num]['param']['turn-to'] = (int)($port);
//                } else if($port == "443"){
//                    $config[$num]['param']['__NA__1'] = "reset";
//                } else{
//                    continue;
//                }
//                $num++;
//            }
        }
        echo sendRequestMultiple($config);
//        exit;
    }


    public function downfile()
    {
        $filename=$this->apacheSSLTmpCertificate; //文件名
        if($this->isFileExsit($this->apacheSSLTmpCertificate)) {
            $filename = $this->apacheSSLTmpCertificate;
        } else {
            if($this->isFileExsit($this->apacheSSLCertificate)) {
                $filename = $this->apacheSSLCertificate;
            }
            else {
                require_once APP_PATH . 'Home/Common/menupage.php';
                $retError = "没有找到证书文件，请重新生成证书";
                $this->display('/Default/system_parameters_edit');
                endSystem();
            }
        }

        $name = "client.p12";
        $ua = $_SERVER ["HTTP_USER_AGENT"];
        header('Content-type: application/octet-stream');
        header('Pragma: public');
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header('Expires: 0');
        if (preg_match("/MSIE/", $ua)) {
            header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
        } else if (preg_match("/Firefox/", $ua)) {
            header('Content-Disposition: attachment; filename*="utf8\'\'' . $name . '"');
        } else {
            header('Content-Disposition: attachment; filename="' . $name . '"');
        }
        header("Content-Length:" . filesize($filename));
        header("Content-Transfer-Encoding: binary");
        ob_end_clean();
        flush();
        @readfile($filename);
        //unlink($filename);
        return;
    }

    public function isFileExsit($filename){
        if(file_exists($filename)){
            return true;
        }
        return false;
    }

    #获取apache中ssl端口
    public function getApacheSSLPort(){
        $rspString = getResponse( "system webui-port", "show", '', 1);
        $rspString = parseResponse($rspString);
        $port = $rspString["webui-port"];
        //echo var_dump($rspString);
        return $port;
    }

    function getFileContent($fileName, $desc){
        $filename = $fileName;
        //var_dump($fileName);
        $result = $this->isFileExsit($fileName);
        //var_dump($result);
        if(!$result)
            echo "找不到".$desc."文件";
        //throw new InfoException("找不到".$desc."文件");

        $file_size = filesize($filename);
        $handle = fopen($filename, "r");
        $contents = fread($handle, filesize ($filename));
        fclose($handle);
        return $contents;
    }

    function replaceContentByRule($content, $ruleArray ,$replaceArray, $isIgnoreNotFound){
        if(count($ruleArray) != count($replaceArray))
            echo '参数传递错误';

        for($x = 0; $x < count($ruleArray); $x++){
            preg_match($ruleArray[$x],$content,$tmp);
            //var_dump($tmp);
            if(count($tmp) < 1 & $isIgnoreNotFound == false) {
                echo "没有找到".$ruleArray[$x];
                //throw new InfoException("没有找到" . $ruleArray[$x] . "的节点");
            }
            //替换
            $content =  str_replace($tmp[0], $replaceArray[$x], $content);
        }
        return $content;/**/
    }

    function restartApache(){
        $command = "/usr/local/apache2/bin/apachectl restart";
        system($command, $out);
        echo "0";
        exit;
    }

    function createCert(){
        $command = "dos2unix ".$this->certSH."createCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "脚本转换为UNIX格式错误";
            return;
        }

        $command = "chmod 777 ".$this->certSH."createCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "脚本权限赋值错误";
            return;
        }

        $command = $this->certSH."createCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "生成证书失败";
            exit;
        }
        echo "0";
        exit;
    }

    function enableCert(){
        //证书是否存在
        $flag = $this->isClientCertificateExist();
        if($flag == false){
            echo "请先生成证书";
            return;
        }

        $command = "dos2unix ".$this->certSH."enableCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "脚本转换为UNIX格式错误";
            return;
        }

        $command = "chmod 777 ".$this->certSH."enableCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "脚本权限赋值错误";
            return;
        }

        $command = $this->certSH."enableCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "证书缺失，请重新生成证书之后再启动证书";
            return;
        }

        //修改apache SSL配置
        /*try
        {
            $contents = $this->getFileContent(($this->apacheSSLFile), "httpd-ssl.conf");
        } catch(Exception $ex){
            echo $ex;
        }

        $ruleArray = ["/SSLCertificateKeyFile\s+[\"\/a-zA-Z0-9]+server.key\s?[\"]{0,1}/","/SSLCertificateFile\s+[\"\/a-zA-Z0-9]+server.crt\s?[\"]{0,1}/",
            "/SSLCACertificateFile\s+[\"\/a-zA-Z0-9-.]+bundle.crt\s?[\"]{0,1}/","/SSLVerifyClient\s+[a-zA-Z]{1,}/","/SSLVerifyDepth\s+\d{1,}/"];
        $replaceArray = ["SSLCertificateKeyFile \"".$this->certRoot."server.key.pem\"","SSLCertificateFile \"".$this->certRoot."server.cer\"",
            "SSLCACertificateFile \"".$this->certRoot."ca.cer\"", "SSLVerifyClient optional", "SSLVerifyDepth 1"];
        try{
            $contents = $this->replaceContentByRule($contents, $ruleArray ,$replaceArray, false);
        } catch(Exception $ex){
            echo $ex;
        }
        //文件写入
        file_put_contents($this->apacheSSLFile, $contents);

        $ruleArray = ["/#\s?SSLCertificateKeyFile\s+[\"\/a-zA-Z0-9]+server.key.pem\s?[\"]{0,1}/","/#\s?SSLCertificateFile\s+[\"\/a-zA-Z0-9]+server.cer\s?[\"]{0,1}/",
            "/#+\s?SSLCACertificateFile\s+[\"\/a-zA-Z0-9]+ca.cer\s?[\"]{0,1}/","/#+\s?SSLVerifyClient\s+[a-zA-Z]{1,}/","/#+\s?SSLVerifyDepth\s+\d{1,}/"];
        try{
            $contents = $this->replaceContentByRule($contents, $ruleArray ,$replaceArray, true);
        } catch(Exception $ex){
            echo $ex;
        }
        //文件写入
        file_put_contents($this->apacheSSLFile, $contents);*/

        /*$rspString = getResponse( "system verify-client-cert", "", '', 1);
        $rspString = parseResponse($rspString);
        var_dump($rspString);
        echo "0";
        return $rspString;*/


        $config['modules'] = "system verify-client-cert";
        $config['action'] = "";
        $config['param']['__NA__'] = "on";
        $rspString = sendRequestSingle($config);
        unset($config);
        echo "0";
        return $rspString;
        //echo "0";
    }

    function disableCert(){
        $flag = $this->getSSLIsEnable();
        if(!$flag) {
            echo "证书没有被启用，不可以禁用";
            return;
        }

        $command = "dos2unix ".$this->certSH."disableCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "脚本转换为UNIX格式错误";
            return;
        }

        $command = "chmod 777 ".$this->certSH."disableCert.sh";
        $str = system($command, $out);
        if($out != 0){
            echo "脚本权限赋值错误";
            return;
        }

        $command = $this->certSH."disableCert.sh";
        $str = system($command, $out);
        echo $out;
        if($out != 0){
            echo "禁用证书失败";
            return;
        }

        //修改apache SSL配置
        /*try
        {
            $contents = $this->getFileContent(($this->apacheSSLFile), "httpd-ssl.conf");
        } catch(Exception $ex){
            echo $ex;
        }

        $ruleArray = ["/SSLCertificateKeyFile\s+[\"\/a-zA-Z0-9]+server.key.pem\s?[\"]{0,1}/","/SSLCertificateFile\s+[\"\/a-zA-Z0-9]+server.cer\s?[\"]{0,1}/",
            "/SSLCACertificateFile\s+[\"\/a-zA-Z0-9]+ca.cer\s?[\"]{0,1}/","/SSLVerifyClient\s+[a-zA-Z]{1,}/","/SSLVerifyDepth\s+\d{1,}/"];
        $replaceArray = ["SSLCertificateKeyFile \"".$this->originCertRoot."server.key\"","SSLCertificateFile \"".$this->originCertRoot."server.crt\"",
            "#SSLCACertificateFile \"/usr/local/apache2/conf/ssl.crt/ca-bundle.crt\"", "#SSLVerifyClient optional", "#SSLVerifyDepth 1"];
        try{
            $contents = $this->replaceContentByRule($contents, $ruleArray ,$replaceArray, false);
        } catch(Exception $ex){
            echo $ex;
        }
        //文件写入
        file_put_contents($this->apacheSSLFile, $contents);
        echo "0";*/

        /*$rspString = getResponse( "system verify-client-cert", "", '', 1);
        $rspString = parseResponse($rspString);
        var_dump($rspString);
        echo "0";
        return $rspString;*/


        $config['modules'] = "system verify-client-cert";
        $config['action'] = "";
        $config['param']['__NA__'] = "off";
        $rspString = sendRequestSingle($config);
        unset($config);
        return $rspString;
    }

    function getSSLIsEnable(){
        //修改apache SSL配置
        try
        {
            $contents = $this->getFileContent(($this->apacheSSLFile), "httpd-ssl.conf");
        } catch(Exception $ex){
            echo $ex;
        }

        preg_match("/#?\s+SSLCACertificateFile\s+[\"\/a-zA-Z0-9]+ca.cer\s?[\"]{0,1}/",$contents,$tmp);
        if(count($tmp) < 1) {
            return false;
        }
        return true;
    }

    //弹出框
    public function saveClientPassword() {
        //mkdir /usr/local/ssl
        //cp /usr/lib64/ssl/openssl.cnf /usr/local/ssl
        system("mkdir /usr/local/ssl", $out);
        system("cp /usr/lib64/ssl/openssl.cnf /usr/local/ssl", $out);
        $password = $_POST["passwordClient"];
        // echo $password;
        $command = "openssl pkcs12 -export -clcerts -inkey /usr/local/apache2/bin/tmp/client.key.pem -in /usr/local/apache2/bin/tmp/client.cer -out /usr/local/apache2/bin/tmp/client.p12 -password pass:".$password;
        system($command, $out);
        echo $out;
        if($out != 0){
            $command = "openssl pkcs12 -export -clcerts -inkey /usr/local/apache2/bin/client.key.pem -in /usr/local/apache2/bin/client.cer -out /usr/local/apache2/bin/client.p12 -password pass:".$password;
            system($command, $out);
            echo $out;
            if($out != 0){
                echo "生成客户端证书错误";
                return;
            }
        }
        $this->downfile();
    }

    function isClientCertificateExist(){
        $filename = $this->apacheSSLClientTmpCertificate;
        $flag = $this->isFileExsit($filename);
        if($flag == false){
            $filename = $this->apacheSSLClientCertificate;
            $flag = $this->isFileExsit($filename);
            if($flag == false){
                return false;
            }
        }
        return true;
    }
}
