<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class InfoController extends CommonController {
    //rest方式的显示数据的方法
    public function datagridShow(){
        //判断是否是需系统路由
        $vsys_route = rootVsys();
        $conf = getPrivilege("device-maintenance");
        $allshow = array(
            'modules' => array(
                'system product',
                'system product',
                'system version',
                'system license',
                'system devname',
                'system webui',
                'system time',
                'system uptime'
            ),
            'action' => array(
                'model',
                'sn',
                '',
                'version',
                'show',
                'show',
                'show',
                ''
            ),
            'backcome' => array(
                'product_model',
                'product_sn',
                'tos_version',
                'license_version',
                'devname',
                'timout_webui',
                'time',
                'uptime'
            )
        );
        for ($i = 0; $i < count($allshow['modules']); $i++) {
            if($i == 0 || $i == 1 || $i == 4){
                if($vsys_route =="1"){
                    $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                    $backcome = $allshow['backcome'][$i];
                    $outcome[$backcome] = $rspString[$i][$backcome];
                }
            }else if($i==3){
                if($vsys_route=="1" && $conf=="1"){
                    $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                    $backcome = $allshow['backcome'][$i];
                    $outcome[$backcome] = $rspString[$i][$backcome];
                }
            }else if($i == 2 || $i == 6 || $i == 7){
                $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                $backcome = $allshow['backcome'][$i];
                if ($backcome == 'time') {
                    $outcome['timezone'] = $rspString[$i]['timezone'];
                    $outcome['date'] = $rspString[$i]['date'];
                    $outcome['clock'] = $rspString[$i]['clock'];
                }
                $outcome[$backcome] = $rspString[$i][$backcome];
            }else{
                $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                $backcome = $allshow['backcome'][$i];
                $outcome[$backcome] = $rspString[$i][$backcome];
            }
        }
        $tryout = getLicenseValue("DEVICE_TRY_EXPIRE", 0);
        if ($tryout != '' && $tryout != null && $tryout != '(null)' && $tryout != 0) {
            $rsp = getResponse("system trytime", "", "", 0);
            $ret = parseResponse($rsp);
            $outcome['tryout'] = $ret['days'];
        } else {
            $outcome['tryout'] = "none";
        }
        $list = $outcome;
        $list['vsys_route'] = $vsys_route;
        $list['tryout'] = $tryout;
        $list['conf'] = $conf;
        echo json_encode($list);
    }
    public function infoShow() {
        //判断是否是需系统路由
        $vsys_route = rootVsys();
        $conf = getPrivilege("device-maintenance");
        $allshow = array(
            'modules' => array(
                'system product',
                'system product',
                'system version',
                'system license',
                'system devname',
                'system webui',
                'system time',
                'system uptime'
            ),
            'action' => array(
                'model',
                'sn',
                '',
                'version',
                'show',
                'show',
                'show',
                ''
            ),
            'backcome' => array(
                'product_model',
                'product_sn',
                'tos_version',
                'license_version',
                'devname',
                'timout_webui',
                'time',
                'uptime'
            )
        );
        for ($i = 0; $i < count($allshow['modules']); $i++) {
           if($i == 0 || $i == 1 || $i == 4){
                if($vsys_route =="1"){
                     $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                     $backcome = $allshow['backcome'][$i];
                     $outcome[$backcome] = $rspString[$i][$backcome];
                }
            }else if($i==3){
                if($vsys_route=="1" && $conf=="1"){
                    $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                    $backcome = $allshow['backcome'][$i];
                     $outcome[$backcome] = $rspString[$i][$backcome];
                }
            }else if($i == 2 || $i == 6 || $i == 7){
                $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                $backcome = $allshow['backcome'][$i];
                if ($backcome == 'time') {
                    $outcome['timezone'] = $rspString[$i]['timezone'];
                    $outcome['date'] = $rspString[$i]['date'];
                    $outcome['clock'] = $rspString[$i]['clock'];
                }         
                $outcome[$backcome] = $rspString[$i][$backcome];
            }else{
                $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], '', 1));
                $backcome = $allshow['backcome'][$i];
                $outcome[$backcome] = $rspString[$i][$backcome];
            }
        }
        $tryout = getLicenseValue("DEVICE_TRY_EXPIRE", 0);
        if ($tryout != '' && $tryout != null && $tryout != '(null)' && $tryout != 0) {
            $rsp = getResponse("system trytime", "", "", 0);
            $ret = parseResponse($rsp);
            $outcome['tryout'] = $ret['days'];
        } else {
            $outcome['tryout'] = "none";
        }
        $this->assign("tryout", $tryout);
        $this->assign("outcome", $outcome);
        $this->assign("vsys_route", $vsys_route);
        $this->assign("conf", $conf);
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/system_info_show');
        return;
    }

}
