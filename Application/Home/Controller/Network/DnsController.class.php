<?php
namespace Home\Controller\Network;
use Think\Controller;
class DnsController extends Controller{
    
    Public function dns_server_show(){
        
        require_once APP_PATH . 'Home/Common/menupage.php';
        if($_GET["tag"]==1){
            
            $this->display('Default/network_dns_domain_show');
        }else if($_GET["tag"]==2){
            
            $this->display('Default/network_dns_doctor_show');
        }else{
            
            $this->display('Default/network_dns_server_show');
        }
    }

    function serverStatus(){
        
        self::show_server_jsondata();
    }
    
    function show_server_jsondata(){
        
        $err = '';
        $ret = array();
        $rspString = getResponse("dns show", "status", '', 0);
//        echo $rspString;die;
        $rspString = parseResponseDatagrid($rspString,0);
//        var_dump($rspString);die;
        if(is_array($rspString)){
            if(stripos($rspString['response-list']['group']['switch'], 'running'))
                $ret['status'] = 'on';

            else
                $ret['status'] = 'off';
        }else{
            $err = $rspString;
        }

        $rspString = getResponse("dns local", "show", '', 4);
        if(is_array($rspString)){
            $list_arr = getAssign($rspString, 0);
            if(count($list_arr['group'])>0)
                $ret['local'] = $list_arr['group'];
            else
                $ret['local'] = array();
        }else{
            $ret['local'] = array();
            $err += $rspString;
        }

        $rspString = getResponse("dns upstream-svr", "show", '', 4);
        if(is_array($rspString)){
            $list_arr = getAssign($rspString, 0);
            if(count($list_arr['group'])>0)
                $ret['upstream'] = $list_arr['group'];
            else
                $ret['upstream'] = array();
        }else{
            $ret['upstream'] = array();
            $err += $rspString;
        }
        if(empty($err))
            echo json_encode($ret);
        else
            echo $err;
    }
}
?>