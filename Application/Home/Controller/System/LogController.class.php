<?php

namespace Home\Controller\System;

use Think\Controller;

class LogController extends Controller {

    //日志配置
    function log_set() {
        $vs_switch = isVrAdmin();
        $rspString = getResponse('log config', 'serv-show', '', 0);
        $rspString = parseResponse($rspString,0);
        if (is_array($rspString)) {
            $outcome['ipaddr'] = $rspString['ipaddr'];
        }
        $rspStringg = getResponse('log config', 'type-show', '', 0);
        $rspStringg = parseResponseDatagrid($rspStringg,0);
 //var_dump($rspStringg);
//        if(getlicense(0,"THREEMAN")) {
 //           $type = $this->threeAllowSet($rspStringg['rows']);
//        } elseif(getlicense(0,"TWOMAN")) {
//            $type = $this->twoAllowSet($rspStringg['rows']);
//        } else {
            foreach($rspStringg['rows'] as $k => $val) {
              //  if($vs_switch && $val['type'] == 'ha') {
              //      continue;
             //   }
              //  if(($val['logtype_lic'] == 'null') || (($val['logtype_lic'] != 'unknow') && getLicense(0,$val['logtype_lic']))) {
                    $type[$k]['text'] = $val['type-ch-name'];
                    $type[$k]['key'] = $val['type'];
                    $type[$k]['table-capacity'] = $val['table-capacity'];
					$type[$k]['on_state'] = $val['on-state'];
					$type[$k]['level'] = $val['level'];
               // }
            }
 //       }
		$jsontype = json_encode($type);
		$this->assign("jsontype", $jsontype);
        $this->assign("logtype", $type);
        $this->assign("outcome", $outcome);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/system_log_set');
    }

    function logtypeShow() {
        $rspString = getResponse('log config', 'type-show', '', 0);
        $rspString = parseResponseDatagrid($rspString, 0);
        $logtype = array();
		//var_dump($rspString);
        //if(getlicense(0,"THREEMAN")) {
        //    $logtype = $this->threeAllowSet($rspString['rows'],false);
        //} elseif(getlicense(0,"TWOMAN")) {
        //    $logtype = $this->twoAllowSet($rspString['rows'],false);
       // } else {
            foreach($rspString['rows'] as $k => $val) {
				$logtype[$k]['logtype'] = $val['type'];
				$logtype[$k]['level'] = $val['level'];
				$logtype[$k]['on_state'] = $val['on-state'];
            }
       // }
	  // var_dump($logtype);die;
        echo json_encode($logtype);
        
    }

    function logSetsave() {
        if($_POST['type'] == '' && $_POST['level'] == '' & $$_POST['max'] == ''){
			echo 0;
		}else{
			$type = explode("#",$_POST['type']);
			$level = explode("#",$_POST['level']);
			$max = explode("#",$_POST['max']);
			$on_state = explode("#",$_POST['on_state']);
			$j=0;
			for ($i = 0; $i < count($type); $i++) {
				if($on_state[$i]==1){
						$config[$j]['modules'] = "log config";   //模块名
						$config[$j]['action'] = "";
						$config[$j]['param']['type'] = $type[$i];
						$config[$j]['param']['level'] = $level[$i];
						$j++;
				}
				$config[$j]['modules'] = "log config";   //模块名
				$config[$j]['action'] = "";
				$config[$j]['param']['type'] = $type[$i];
				$config[$j]['param']['table-capacity'] = $max[$i];
				$j++;
				
			}
			$rspString =  sendRequestMultiple($config);
			echo $rspString;
		}
    }

// 日志服务器配置
    function logserver_set() {
        $vsys_id = isVrAdmin();
        $rspString = getResponse('log config', 'serv-show', '', 0);
        $rspString = parseResponse($rspString);
        if (is_array($rspString)) {
            $outcome['ipaddr'] = $rspString['ipaddr'];
            $outcome['port'] = $rspString['port'];
            $outcome['protocol'] = $rspString['protocol'];

            $outcome['logtype'] = $rspString['logtype'];
            $outcome['trans'] = $rspString['trans'];
            $outcome['trans_gather'] = $rspString['trans_gather'];

            $outcome['crypt'] = $rspString['crypt'];
            $outcome['key'] = $rspString['key'];
			$outcome['console'] = $rspString['console'];
			$outcome['local-database'] = $rspString['local-database'];
		//	$outcome['log-language'] = $rspString['log-language'];
           // $outcome['to_console'] = $rspString['to_console'];
           // $outcome['to_file'] = $rspString['to_file'];
           // $outcome['to_mysql'] = $rspString['local_database'];
            //$outcome['log_switch'] = $rspString['log_switch'];
//            $outcome['showlog_from'] = $rspString['showlog_from'];
        }
        $this->assign("outcome", $outcome);
        $this->assign("vsys_id", $vsys_id);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/system_logserver_set');
        //endSystem($get_url_param);
    }

    function logserverAddsave() {
        $i=0;
        $vsys = isVrAdmin();
        if(!$vsys){
            $config[$i]['modules'] = "log config";   //模块名
            $config[$i]['action'] = "set";
            if ($_POST['ipaddr']) {
                if (strpos($_POST['ipaddr'], ',') > 0) {
                    $config[$i]['param']['ipaddr'] = str_replace(',', ' ', trim(formatpost($_POST['ipaddr'])));
                } else
                    $config[$i]['param']['ipaddr'] = trim(formatpost($_POST['ipaddr']));
            }
             $config[$i]['param']['ipaddr'] = '\'' .  $config[$i]['param']['ipaddr'] . '\'';
            if ($_POST['port'])
                $config[$i]['param']['port'] = formatpost($_POST['port']);
            if ($_POST['logtype'])
                $config[$i]['param']['logtype'] = formatpost($_POST['logtype']);
            if ($_POST['trans'])
                $config[$i]['param']['trans'] = formatpost($_POST['trans']);
            if($_POST['trans_gather'])
                $config[$i]['param']['trans_gather'] = formatpost($_POST['trans_gather']);
            
            $i++;
            $config[$i]['modules'] = "log config";   //模块名
            $config[$i]['action'] = "set";
            if ($_POST['to_console'])
                $config[$i]['param']['console'] = formatpost($_POST['to_console']);
            if ($_POST['to_mysql'])
                $config[$i]['param']['local-database'] = formatpost($_POST['to_mysql']);
//            if($_POST['language'])
//                $config[$i]['param']['log-language'] = formatpost($_POST['language']);
            $config[$i]['modules'] = "log config";   //模块名
            $config[$i]['action'] = "set";
            $i++;
             $rspString = sendRequestMultiple($config);
             if (is_numeric($rspString) && $rspString == 0) {
                unset($config);
                $config['modules'] = "log config";   //模块名
                $config['action'] = "key";
                if ($_POST['key_set']) {
                    $config['param'] = array();
                    $config['param']['__NA__'] = formatpost($_POST['key_set']);
                    $rspString = sendRequestSingle($config);
                    if (is_numeric($rspString) && $rspString == 0) {
                        unset($config);
                        $config['modules'] = "log config";   //模块名
                        $config['action'] = "crypt";
                        $config['param'] = array();
                        $config['param']['__NA__'] = 'enable';
                        echo sendRequestSingle($config);
                    } else {
                        echo $rspString;
                    }
                } else {
                    unset($config);
                    $config['modules'] = "log config";   //模块名
                    $config['action'] = "crypt";
                    $config['param'] = array();
                    $config['param']['__NA__'] = 'disable';
                    echo sendRequestSingle($config);
                }
            } else {
                echo $rspString;
            }
        }else{
            $config['modules'] = "log config";   //模块名
            $config['action'] = "set";
            if ($_POST['to_console'])
                $config['param']['console'] = formatpost($_POST['to_console']);
            if ($_POST['to_file'])
                $config['param']['to_file'] = formatpost($_POST['to_file']);
            if ($_POST['to_mysql'])
                $config['param']['local-database'] = formatpost($_POST['to_mysql']);
             $rspString = sendRequestSingle($config);
             echo $rspString;
        }
    }

    // 三元返回当前用户可操作的配置项
    public function threeAllowSet($data,$show = true) {
        $resArr = array();
        $i = 0;
        $vs_switch = isVrAdmin();

        if(onlyGetPrivilege("log-admin")) {
            $adminUser = '[log-admin]';
        } elseif(onlyGetPrivilege("log-grantor")) {
            $adminUser = '[log-grantor]';
        } else {
            $adminUser = '[log-auditor]';
        }

        foreach($data as $val) {
            if($vs_switch && $val['type'] == 'ha') {
                continue;
            }
            if(($val['logtype_lic'] == 'null') || (($val['logtype_lic'] != 'unknow') && getLicense(0,$val['logtype_lic']))) {
                $arrConf = explode('|',$val['conf']);
                if(in_array($adminUser, $arrConf)) {
                    if($show) {
                        $resArr[$i]['text'] = $val['logtype_name_ch'];
                        $resArr[$i]['key'] = $val['type'];
                        $resArr[$i]['max_table_capacity'] = $val['max_table_capacity'];
                        $i++;
                    } else {
                        $resArr[$i]['logtype'] = $val['type'];
                        $resArr[$i]['level'] = $val['level'];
                        $i++;
                    }
                }
            }
        }
        return $resArr;
    }

    // 二元返回当前用户可操作的配置项
    public function twoAllowSet($data,$show = true) {
        $resArr = array();
        $i = 0;
        $vs_switch = isVrAdmin();
        if(onlyGetPrivilege("log_auditor")) {
            $auditor = true;
        } else {
            $auditor = false;
        }

        foreach($data as $val) {
            if($vs_switch && $val['type'] == 'ha') {
                continue;
            }
            if(($val['logtype_lic'] == 'null') || (($val['logtype_lic'] != 'unknow') && getLicense(0,$val['logtype_lic']))) {
                $arrConf = explode('|',$val['conf']);
                if($auditor) {
                    if(in_array('[log_auditor]',$arrConf)) {
                        if($show) {
                            $resArr[$i]['text'] = $val['logtype_name_ch'];
                            $resArr[$i]['key'] = $val['type'];
                            $resArr[$i]['max_table_capacity'] = $val['max_table_capacity'];
                            $i++;
                        } else {
                            $resArr[$i]['logtype'] = $val['type'];
                            $resArr[$i]['level'] = $val['level'];
                            $i++;
                        }
                    }
                } else {
                    if(!in_array('[log_auditor]',$arrConf)) {
                        if($show) {
                            $resArr[$i]['text'] = $val['logtype_name_ch'];
                            $resArr[$i]['key'] = $val['type'];
                            $resArr[$i]['max_table_capacity'] = $val['max_table_capacity'];
                            $i++;
                        } else {
                            $resArr[$i]['logtype'] = $val['type'];
                            $resArr[$i]['level'] = $val['level'];
                            $i++;
                        }
                    }
                }
            }
        }
        return $resArr;
    }

}

?>