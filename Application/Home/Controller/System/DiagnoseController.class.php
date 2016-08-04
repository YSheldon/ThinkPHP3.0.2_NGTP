<?php

namespace Home\Controller\System;

use Think\Controller;

class DiagnoseController extends Controller {

    public function diagnose_show() {
        require_once APP_PATH . 'Home/Common/menupage.php';

        $this->display('/Default/system_diagnose_show');
        return;
    }

    public function diagnose_begin() {
        $to_ping = formatpost($_POST['addr']);
        $operation = formatpost($_POST['operation']);

        //检查IP是否合法
        $result = filter_var($to_ping, FILTER_VALIDATE_IP);
        if ($result == false) {
            if ($operation == 4) {
                echo json_encode(array('success' => false, 'msg' => 'IPv4不合法！'));
            } else if ($operation == 6) {
                echo json_encode(array('success' => false, 'msg' => 'IPv6不合法！'));
            }
            exit;
        }

        if(!is_numeric($operation) || !is_numeric($_POST['type'])){
            echo json_encode(array('success' => false, 'msg' => '参数错误！'));
            exit;
        }
        
        if ($_POST['type'] == 1) {
            $ping_count = 4;
            unlink("/tmp/ping_" . AUTH_ID . ".txt");
            if ($operation == 4) {
                $command = "ping -W 1 -c " . $ping_count . " " . $to_ping . " &>/tmp/ping_" . AUTH_ID . ".txt &";
            } else if ($operation == 6) {
                $command = "ping6 -W 1 -c " . $ping_count . " " . $to_ping . " &>/tmp/ping_" . AUTH_ID . ".txt &";
            }
        } else {
            unlink("/tmp/traceroute_" . AUTH_ID . ".txt");
            if ($operation == 4) {
                $command = "traceroute " . $to_ping . " &>/tmp/traceroute_" . AUTH_ID . ".txt &";
            } else if ($operation == 6) {
                $command = "traceroute6 " . $to_ping . " &>/tmp/traceroute_" . AUTH_ID . ".txt &";
            }
        }
        exec($command);
        echo json_encode(array('success' => true));
        exit;
    }

    public function diagnose_result() {

        if ($_POST['type'] == 1) {
            $filename = "/tmp/ping_" . AUTH_ID . ".txt";
        } else {
            $filename = "/tmp/traceroute_" . AUTH_ID . ".txt";
        }
        $pid = exec("fuser " . $filename, $array, $state);
        if (is_readable($filename) == false) {
            echo '';
        } else {

            $result = file_get_contents($filename);
            echo json_encode(array(
                'success' => true,
                'str' => $result,
                'pid' => $pid
                    //'state'=>$state,
                    //'ww'=>$modtime
            ));
        }

        exit;
    }

    public function other_diagnose_begin() {
        if ($_POST['type'])
            $type = formatpost($_POST['type']);

        //检查IP是否合法
        if($type != 4) {
            $result = filter_var($_POST['serverip'], FILTER_VALIDATE_IP);
            if ($result == false) {
                echo 'wrongStr:IP地址不合法！';
                exit;
            }
        } else {
            $result = filter_var($_POST['serverip'], FILTER_VALIDATE_URL);
            if ($result == false) {
                echo 'wrongStr:输入不合法！';
                exit;
            }
        }

        if($type == 3) {
            if(!is_numeric($_POST['port']) || $_POST['port'] < 0 || $_POST['port'] > 65535) {
                echo 'wrongStr:端口输入错误！';
                exit;
            }
        }

        if ($type == 3) {    //tcp
            if ($_POST['serverip'] != '')
                $param['serverip'] = formatpost($_POST['serverip']);
            if ($_POST['port'] != '')
                $param['port'] = intval($_POST['port']);
            $rspString = parseResponse(getResponse('system probe', 'tcp', $param, 1));
        }
        else if ($type == 4) {
            if ($_POST['serverip'] != '')
                $param['domain'] = formatpost($_POST['serverip']);
            //        if($_POST['port']!='')     $param['domain']=$param['domain'].':'.formatpost($_POST['port']);
                parseResponse(getResponse('system probe', 'http', $param, 1));
                //命令行读取之后生成文件
                $result = '/tmp/tools_httpsprobe';
                if($result == 0){
                    //读取文件的信息
                    $res = file_get_contents($result);
                    if(substr($res,0,5) == 'error'){
                        $n = strripos($res,'.');
                        $res = substr($res,0,$n);
                    }else{
                        $n = strripos($res,'ms');
                        $res = substr($res,0,$n);
                    }
                    echo $res;
                }

            exit;
        }
        else if ($type == 5) {
            if(strpos($_POST['port'],' ') !== false || strpos($_POST['port'],';')) {
                echo '域名不合法！';
                exit;
            }
            if ($_POST['serverip'] != '')
                $param['serverip'] = formatpost($_POST['serverip']);
            if ($_POST['port'] != '')
                $param['domain'] = formatpost($_POST['port']);
            $rspString = parseResponse(getResponse('system probe', 'dns', $param, 1));
        }
        if (is_numeric($rspString) && $rspString == 0) {
            $outcome = 'wrong';
        } else if (is_array($rspString)) {
            $outcome = $rspString['rows']['content'];
        } else if (is_string($rspString)) {
            $outcome = 'wrongStr:' . $rspString;
        }
        echo $outcome;
        exit;
    }

}
