<?php
namespace Home\Controller\System;

use Think\Controller;

class NoteAlarmController extends Controller {
    
    function alarm_show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('Default/system_notealarm_show');
    }
}
?>