<?php
namespace Home\Controller\System;

use Think\Controller;
class RulesController extends Controller {
    
    Public function rulesUpload(){
        
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/system_rules_upload');
    }
    
    function rulesinfoJsondata(){
        
        if(getLicense(0,"IPS") == 1)
            $ips_conf=1;
        else
            $ips_conf=0;
        if(getLicense(0,"AISE") == 1)
            $aise_conf=1;
        else
            $aise_conf=0;
        if(getLicense(0,"AV") == 1)
            $av_conf=1;
        else
            $av_conf=0;
        if(getLicense(0,"URL_FILTER") == 1)
            $url_conf=1;
        else
            $url_conf=0;

        $vrspString = getResponse("system rules-update", "version", $param, 1);
        $vrspString = parseResponseDatagrid($vrspString,0);
        if(is_array($vrspString)){
//            $vlist_arr = getAssign($vrspString, 0);
            foreach($vrspString['rows'] as $i=>$items){
                if($items['module'] == 'aise'){
                    $aise_ver = str_replace(PHP_EOL,'',$items['version']);
                    $aise_exp = $items['expire'];
                    $aise_tim = $items['time'];
                    $aise_num = $items['rulesnum'];
                }
                else if($items['module'] == 'av'){
                    $av_ver = str_replace(PHP_EOL,'',$items['version']);
                    $av_exp = $items['expire'];
                    $av_tim = $items['time'];
                    $av_num = $items['rulesnum'];
                }
                else if($items['module'] == 'url'){
                    $url_ver = str_replace(PHP_EOL,'',$items['version']);
                    $url_exp = $items['expire'];
                    $url_tim = $items['time'];
                    $url_num = $items['rulesnum'];
                }
                else if($items['module'] == 'ips'){
                    $ips_ver = str_replace(PHP_EOL,'',$items['version']);
                    $ips_exp = $items['expire'];
                    $ips_tim = $items['time'];
                    $ips_num = $items['rulesnum'];
                }
            }
        }
        else{
            $aise_ver = '0000.00.00';
            $aise_exp = 'unkown';
            $aise_tim = '';
            $aise_num = '0';
            $av_ver = '0000.00.00';
            $av_exp = 'unkown';
            $av_tim = '';
            $av_num = '0';
            $url_ver = '0000.00.00';
            $url_exp = 'unkown';
            $url_tim = '';
            $url_num = '0';
            $ips_ver = '0000.00.00';
            $ips_exp = 'unkown';
            $ips_tim = '';
            $ips_num = '0';
        }

        $rspString = getResponse("system rules-update", "show", $param, 1);
        $rspString = parseResponseDatagrid($rspString,0);
        if(is_numeric($rspString) && $rspString == 0){
            echo '{"rows":[{"name":"ips","tag":'."$ips_conf".',"version":"'."$ips_ver".'","utime":"'."$ips_tim".'","expire":"'."$ips_exp".'","rulesnum":"'."$ips_num".'"},{"name":"aise","tag":'."$aise_conf".',"version":"'."$aise_ver".'","utime":"'."$aise_tim".'","expire":"'."$aise_exp".'","rulesnum":"'."$aise_num".'"},{"name":"av","tag":'."$av_conf".',"version":"'."$av_ver".'","utime":"'."$av_tim".'","expire":"'."$av_exp".'","rulesnum":"'."$av_num".'"},{"name":"url","tag":'."$url_conf".',"version":"'."$url_ver".'","utime":"'."$url_tim".'","expire":"'."$url_exp".'","rulesnum":"'."$url_num".'"}],"total":"4"}';
        }
        else if(is_array($rspString))
        {
            $j=0;
            $k=0;
            $m=0;
            $n=0;
//            $list_arr = getAssign($rspString, 0);
            foreach($rspString['rows'] as $i=>$items){
                if($items['name'] == "ips"){
                    $j = 1;
                    $ips = $i;
                }else if($items['name'] == "aise"){
                    $k = 1;
                    $aise = $i;
                }else if($items['name'] == "av"){
                    $m = 1;
                    $av = $i;
                }else if($items['name'] == "url"){
                    $n = 1;
                    $url = $i;
                }
            }

            $ips_arr = array();
            $aise_arr = array();
            $av_arr = array();
            $url_arr = array();
            $sum_arr = $rspString;
            if($j == 0){
                $ips_arr['rows'][0] = array('name'=>'ips','type'=>'','apply'=>'','ip'=>'','ftp'=>'','tmp'=>'','tag'=>$ips_conf,'version'=>$ips_ver,'utime'=>$ips_tim,'expire'=>$ips_exp,'rulesnum'=>$ips_num);
                $sum_arr = array_merge_recursive($sum_arr,  $ips_arr);
                $sum_arr['total'] += 1;
            }
            else{
                $sum_arr['rows'][$ips]['tag'] = $ips_conf;
                $sum_arr['rows'][$ips]['version'] = $ips_ver;
                $sum_arr['rows'][$ips]['utime'] = $ips_tim;
                $sum_arr['rows'][$ips]['expire'] = $ips_exp;
                $sum_arr['rows'][$ips]['rulesnum'] = $ips_num;
            }
            if($k == 0){
                $aise_arr['rows'][0] = array('name'=>'aise','type'=>'','apply'=>'','ip'=>'','ftp'=>'','tmp'=>'','tag'=>$aise_conf,'version'=>$aise_ver,'utime'=>$aise_tim,'expire'=>$aise_exp,'rulesnum'=>$aise_num);
                $sum_arr = array_merge_recursive($sum_arr,  $aise_arr);
                $sum_arr['total'] += 1;
            }
            else{
                $sum_arr['rows'][$aise]['tag']  = $aise_conf;
                $sum_arr['rows'][$aise]['version'] = $aise_ver;
                $sum_arr['rows'][$aise]['utime'] = $aise_tim;
                $sum_arr['rows'][$aise]['expire'] = $aise_exp;
                $sum_arr['rows'][$aise]['rulesnum'] = $aise_num;
            }
            if($m == 0){
                $av_arr['rows'][0] = array('name'=>'av','type'=>'','apply'=>'','ip'=>'','ftp'=>'','tmp'=>'','tag'=>$av_conf,'version'=>$av_ver,'utime'=>$av_tim,'expire'=>$av_exp,'rulesnum'=>$av_num);
                $sum_arr = array_merge_recursive($sum_arr,  $av_arr);
                $sum_arr['total'] += 1;
            }
            else{
                $sum_arr['rows'][$av]['tag']  = $av_conf;
                $sum_arr['rows'][$av]['version'] = $av_ver;
                $sum_arr['rows'][$av]['utime'] = $av_tim;
                $sum_arr['rows'][$av]['expire'] = $av_exp;
                $sum_arr['rows'][$av]['rulesnum'] = $av_num;
            }
            if($n == 0){
                $url_arr['rows'][0] = array('name'=>'url','type'=>'','apply'=>'','ip'=>'','ftp'=>'','tmp'=>'','tag'=>$url_conf,'version'=>$url_ver,'utime'=>$url_tim,'expire'=>$url_exp,'rulesnum'=>$url_num);
                $sum_arr = array_merge_recursive($sum_arr,  $url_arr);
                $sum_arr['total'] += 1;
            }
            else{
                $sum_arr['rows'][$url]['tag']  = $url_conf;
                $sum_arr['rows'][$url]['version'] = $url_ver;
                $sum_arr['rows'][$url]['utime'] = $url_tim;
                $sum_arr['rows'][$url]['expire'] = $url_exp;
                $sum_arr['rows'][$url]['rulesnum'] = $url_num;
            }
            echo json_encode($sum_arr);
        }
        else if(is_string($rspString))
        {
            $retError = showError($rspString);
            echo '{"rows":[],"total":"0"}';
        }
    }
}
?>