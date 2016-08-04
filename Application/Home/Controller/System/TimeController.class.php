<?php

namespace Home\Controller\System;

use Home\Controller\CommonController;

class TimeController extends CommonController {
    //rest方式显示数据的方式
    public function datagridShow(){
        $rspString=parseResponse(getResponse( 'system time', 'show', '', 1));
        $sys_timezone=$rspString['timezone'];
        $sys_date=$rspString['date'];
        $sys_time=$rspString['clock'];
        $list = $rspString;
        $ntp_license=getLicense(0,"NTP");  //0代表虚系统号，当前版本默认为0
        if($ntp_license==1){
            $rspString=parseResponse(getResponse( 'system ntp', 'show', '', 1));
            $ntp_status=$rspString['rows']['status'];
            $ntp_ip1=$rspString['rows']['ip1'];
            $ntp_ip2=$rspString['rows']['ip2'];
            $list['ntp_status'] = $ntp_status;
            $list['ntp_ip1'] = $ntp_ip1;
            $list['ntp_ip2'] = $ntp_ip2;
        }
        $vsid = getVsid();
        $list['vsid'] = $vsid;
        $list['ntp_license'] = $ntp_license;
        echo json_encode($list);

    }
    public function system_time_edit() {
        $rspString=parseResponse(getResponse( 'system time', 'show', '', 1));
        $sys_timezone=$rspString['timezone'];
        $sys_date=$rspString['date'];
        $sys_time=$rspString['clock'];
        
        $this->assign("sys_timezone",$sys_timezone);
        $this->assign("sys_date",$sys_date);
        $this->assign("sys_time",$sys_time);

        $ntp_license=getLicense(0,"NTP");  //0代表虚系统号，当前版本默认为0
        $this->assign("ntp_license",$ntp_license);
        if($ntp_license==1){
            $rspString=parseResponse(getResponse( 'system ntp', 'show', '', 1));
            $ntp_status=$rspString['rows']['status'];
            $ntp_ip1=$rspString['rows']['ip1'];
            $ntp_ip2=$rspString['rows']['ip2'];
            $this->assign("ntp_status",$ntp_status);
            $this->assign("ntp_ip1",$ntp_ip1);
            $this->assign("ntp_ip2",$ntp_ip2);
    }
            $vsid = getVsid();
            $this->assign("vsid",$vsid);
	require_once APP_PATH . 'Home/Common/menupage.php';

        $this->display('/Default/system_time_edit');
	return;
    }

    public function time_server(){
        if($_POST['addr']) $param['addr'] = formatpost($_POST['addr']);
	    $config['modules']='system ntp';
        $config['action']='update';
        $config['param']=$param;
	$rspString = sendRequestSingle($config);	
	
	echo $rspString;
	exit;
    }
    public function edit(){
        parse_str(file_get_contents('php://input'),$dataArr);
        if($dataArr['bigRadio']=='1'||$dataArr['bigRadio']=='2'){
/*            if($dataArr['timezone']!='') $param['timezone'] = $dataArr['timezone'];
            if($dataArr['date']) $param['date'] = $dataArr['date'];
            if($dataArr['clock']) $param['clock'] = $dataArr['clock'];*/
            foreach($dataArr as $k => $v){
                if(empty($dataArr[$k])){
                    unset($dataArr[$k]);
                }
            }
            unset($dataArr['bigRadio']);
            unset($dataArr['addr']);
            $config['modules']='system time';
            $config['action']='set';
            $config['param']=$dataArr;
            $rspString = sendRequestSingle($config);
            if(is_numeric($rspString) && $rspString == 0){
                if(getLicense(0,"NTP")==1){
                    $config=array();
                    $config['modules']='system ntp';
                    $config['action']='stop';
    //                $config['param']=array();
                    echo sendRequestSingle($config);
                    return;
                }
            }else{
                echo $rspString;
                exit;
            }
        }else if($dataArr['bigRadio']=='3'){
            foreach($dataArr as $k => $v){
                if(empty($dataArr[$k])){
                    unset($dataArr[$k]);
                }
            }
            unset($dataArr['bigRadio']);
/*            $param['ip'] = $_POST['ip']?formatpost($_POST['ip']):'';
            $param['ip2'] = $_POST['ip2']?formatpost($_POST['ip2']):'';*/
            $config['modules']='system ntp';
            $config['action']='start';
            $config['param']=$dataArr;
            $rspString = sendRequestSingle($config);
        }
        echo $rspString;
        exit;
        }
    /*获取时区中下拉列表中的值*/
    public function selShow(){
        //获取下拉框中的内容
        $text = array();
        //获取下拉框中的value
        $val = array();
        //向前台发送的数组
        $list_name = array();
        $text = ['GMT-12:00'.' '.L('ON_THE_WEST'),'GMT-11:00'.' '.L('SAMOA_MIDWAY_ISLANDS'),'GMT-10:00'.' '.L('HAWAII'),'GMT-09:00'.' '.L('ALASKA'),'GMT-08:00'.' '.L('PACIFIC_TIME_TI_JUANA'),
        'GMT-07:00'.' '.L('MOUNTAIN_TIME'),'GMT-06:00'.' '.L('MEXICO_GCM'),'GMT-05:00'.' '.L('BOGOTA_QUITO_LIMA'),'GMT-04:00'.' '.L('SANTIAGO'),'GMT-03:00'.' '.L('BUENOS_AIRES_GEORGETOWN'),
        'GMT-02:00'.' '.L('THE_ATLANTIC'),'GMT-01:00'.' '.L('THE_CAPE_VARDE_ISLANDS'),'GMT'.' '.L('GREENWICH_LONDON_DEL'),'GMT+01:00'.' '.L('AMSTERDAM_BERLIN'),'GMT+02:00'.' '.L('ATHENS_ISTANBUL_MINSK_BEIRUT'),
        'GMT+03:00'.' '.L('MOSCOW_VOLGOGRAD_ST_PETERBURG'),'GMT+04:00'.' '.L('BAKU_TBILISI_YEREVAN'),'GMT+05:00'.' '.L('ISLAMABAD_TASHKENT_KARACHI'),'GMT+06:00'.' '.L('ALA_MUTU_SIBERIA'),
        'GMT+07:00'.' '.L('BANGKOK'),'GMT+08:00'.' '.L('CHONGQING'),'GMT+09:00'.' '.L('SAPPORO_TOKYO_OSAKA'),'GMT+10:00'.' '.L('MELBOURNE_SYDNEY'),'GMT+11:00'.' '.L('SOLOMON_MA_JIADAN'),'GMT+12:00'.' '.L('THE_KAMCHATKA_PENINSULA')];
        $val = ['-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','+00','+01','+02','+03','+04','+05','+06','+07','+08','+09','+10','+11','+12'];
        foreach($text as $i => $items){
            $list_name[$i]['text'] = $text[$i];
            $list_name[$i]['val'] = $val[$i];
            if($list_name[$i]['val'] == '+08'){
                $list_name[$i]['selected'] = true;
            }
        }
        echo json_encode($list_name);

    }
}
