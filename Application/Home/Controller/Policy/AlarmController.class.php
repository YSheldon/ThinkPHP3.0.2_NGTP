<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class AlarmController extends CommonController {
	public function alarm_show(){
		require_once APP_PATH . 'Home/Common/menupage.php';
                if(isset($_GET['url'])){
                    $this->display('Default/system_notealarm_show');
                }else{
                    $this->display('Default/policy_alarm_show');
                }
	}

	function alarmJsondata(){
		$rspString = getResponse("alarm notice", "show", $param, 1);
		$rspString = parseResponseDatagrid($rspString,0);
		if(is_numeric($rspString) && $rspString == 0){
			echo '{"rows":[],"total":"0"}';

		}else if(is_array($rspString)){
			$sum_arr = array();
			$all_arr = array();
			if($rspString != null){
				$espString = getResponse("alarm event", "show", $param, 1);
				$espString = parseResponseDatagrid($espString,0);
				if(is_array($espString)){

					if($espString != null){
						$i = 0;
						foreach ($rspString['rows'] as $k => $v ){
							$tmp_arr = '';
							$sum_arr[$i]['type'] = $v['type'];
							$sum_arr[$i]['noticename'] = $v['noticename'];
							$sum_arr[$i]['noticeid'] = $v['noticeid'];
							$sum_arr[$i]['detail'] = $v['detail'];
							foreach ( $espString['rows'] as $ke => $ve ){
								if(strstr($ve['noticeid'], $v['noticeid'])){
									$tmp_arr = $tmp_arr . $ve['evt_type'] . ' ';
								}	   							
							}
							$sum_arr[$i]['evt_type'] = $tmp_arr;
							$all_arr['rows'] = $sum_arr;
							$all_arr['total'] = $rspString['total'];
							$i++;
						}
					}else
						$all_arr = $rspString;
				}else
					$all_arr = $rspString;

				echo json_encode($all_arr);
			}
		}
	}
//添加弹出窗口
/*	function alarmWindow(){

		$this->display('Window/policy_alarm_window');
	} */
//添加数据[邮件]
	function mailAdd(){
		if($_POST['name']!='') $config['param']['name'] = formatpost($_POST['name']);
		if($_POST['srvaddr']) $config['param']['srvaddr'] = formatpost($_POST['srvaddr']);
		if($_POST['srvport']) $config['param']['srvport'] = formatpost($_POST['srvport']);
		if($_POST['mailaddr']) $config['param']['mailaddr'] = formatpost($_POST['mailaddr']);
		if($_POST['auth']) $config['param']['auth'] = formatpost($_POST['auth']);
        if($_POST['phonenum'])$config['param']['telephone'] = formatpost($_POST['phonenum']);
		if($config['param']['auth'] == 'on'){
			if($_POST['username']!='') $config['param']['username'] = formatpost($_POST['username']);
			if($_POST['password']!='') $config['param']['password'] = formatpost($_POST['password']);
		}
		if($_POST['subject']!='') $config['param']['subject'] = formatpost($_POST['subject']);
		if($_POST['alarm_tag']) $altag = formatpost($_POST['alarm_tag']);
		
		if($altag == 1){
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "add mail";              //操作名称 
			$config['note'] = "add";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "add mail", $param, 2 );
		}else{
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "modify mail";              //操作名称 
			$config['note'] = "modify";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "modify mail", $param, 2 );
		}
	}
//添加数据[声音]
	function beepAdd(){
	
		if($_POST['name']!='') $config['param']['name'] = formatpost($_POST['name']);
		if($_POST['freq']) $config['param']['freq'] = formatpost($_POST['freq']);
		if($_POST['length']) $config['param']['length'] = formatpost($_POST['length']);
		if($_POST['reps']) $config['param']['reps'] = formatpost($_POST['reps']);
		if($_POST['delay']) $config['param']['delay'] = formatpost($_POST['delay']);
		if($_POST['alarm_tag']) $altag = formatpost($_POST['alarm_tag']);
		
		if($altag == 1){
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "add beep";              //操作名称 
			$config['note'] = "beep";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "add beep", $param, 2 );
		}else{
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "modify beep";              //操作名称 
			$config['note'] = "modify";
			echo sendRequestSingle($config);
		}
			//$rspString = getResponse( 'alarm notice', "modify beep", $param, 2 );
	}
//添加数据[NETBIOS]
	function biosAdd(){

		if($_POST['name']!='') $config['param']['name'] = formatpost($_POST['name']);
		if($_POST['hostname']!='') $config['param']['hostname'] = formatpost($_POST['hostname']);
		if($_POST['ipaddr']) $config['param']['ipaddr'] = formatpost($_POST['ipaddr']);
		if($_POST['alarm_tag']) $altag = formatpost($_POST['alarm_tag']);
		
		if($altag == 1){
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "add netbios";              //操作名称 
			$config['note'] = "netbios";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "add netbios", $param, 2 );
		}else{
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "modify netbios";              //操作名称 
			$config['note'] = "modify";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "modify netbios", $param, 2 );
		}
	}
//添加数据[控制台]
	function consoleAdd(){
	
		if($_POST['name']!='') $config['param']['name'] = formatpost($_POST['name']);
		if($_POST['alarm_tag']) $altag = formatpost($_POST['alarm_tag']);
		
		if($altag == 1){
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "add console";              //操作名称 
			$config['note'] = "console";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "add console", $param, 2 );
		}else{
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "modify console";              //操作名称 
			$config['note'] = "modify";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "modify console", $param, 2 );
		}
	}	
//添加数据[SNMP]
	function snmpAdd(){
			
		if($_POST['name']!='') $config['param']['name'] = formatpost($_POST['name']);
		if($_POST['alarm_tag']) $altag = formatpost($_POST['alarm_tag']);

		if($altag == 1){
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "add snmp";              //操作名称 
			$config['note'] = "snmp";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "add snmp", $param, 2 );
		}else{
			$config['modules'] = "alarm notice";   //模块名
			$config['action'] = "modify snmp";              //操作名称 
			$config['note'] = "modify";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm notice', "modify snmp", $param, 2 );
		}
	}
    function smsAdd(){

        if($_POST['name']!='') $config['param']['name'] = formatpost($_POST['name']);
        if($_POST['alarm_tag']) $altag = formatpost($_POST['alarm_tag']);
        if($_POST['phonenum'])$config['param']['telephone'] = formatpost($_POST['phonenum']);

        if($altag == 1){
            $config['modules'] = "alarm notice";   //模块名
            $config['action'] = "add sms";              //操作名称
            $config['note'] = "snmp";
            echo sendRequestSingle($config);
            //$rspString = getResponse( 'alarm notice', "add snmp", $param, 2 );
        }else{
            $config['modules'] = "alarm notice";   //模块名
            $config['action'] = "modify sms";              //操作名称
            $config['note'] = "modify";
            echo sendRequestSingle($config);
            //$rspString = getResponse( 'alarm notice', "modify snmp", $param, 2 );
        }
    }
//删除
/*	function alarmDel(){
		$config['modules'] = "alarm notice";   //模块名
		$config['action'] = "delete";              //操作名称 
		$config['note'] = "delete";
		$j = 0;
		$k = 0;
		if($_POST['name']!='') $delname = formatpost($_POST['name']);
		$str_name = explode("#", $delname);
		$error = '';
		$ename = '';
		for($i=0;$i<count($str_name);$i++)
		{
			$config['param']['name'] = $str_name[$i];
			$rspString[$i] = sendRequestSingle($config);
			//$rspString[$i] = getResponse( 'alarm notice', "delete", $param, 2 );
			if(is_string($rspString[$i])){
				$ename = $ename . "'" . $config['param']['name'] . "'" . ' ';
				$error = $rspString[$i];
			}
		}

		$err = explode(":",$error);
		$msg = $ename . ':' . $err[1];
		if($msg == ':')
			echo '0';
		else
			echo $msg;
	}*/
//清空
/*	function alarmClear(){
		
		$config['modules'] = "alarm notice";   //模块名
		$config['action'] = "clean";              //操作名称 
		$config['note'] = "clean";
		echo sendRequestSingle($config);
		//$rspString = getResponse( 'alarm notice', "clean", $param, 2 );
	}*/
//报警测试
	function alarmTest(){
		
		$config['modules'] = "alarm notice";   //模块名
		$config['action'] = "test";              //操作名称 
		$config['note'] = "test";
		echo sendRequestSingle($config);
		//$rspString = getResponse( 'alarm notice', "test", $param, 2 );
		return;
	}
//点击管理（复选框）
	function manageAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){

					$sum_id = '';
					if($v['evt_type'] == 'manage'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set manage empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set manage empty", $param, 2 );
		}else{
			unset($config);
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set manage";              //操作名称 
			$config['note'] = "manage";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set manage", $param, 2 );
		}
	}
//点击系统（复选框）
	function systemAdd(){
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		//var_dump($espString);die;
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'system'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set system empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set system empty", $param, 2 );
		}else{
			unset($config);
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set system";              //操作名称 
			$config['note'] = "system";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set system", $param, 2 );
		}
	}
//点击安全（复选框）
	function securityAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'security'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set security empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set security empty", $param, 2 );
		}else{
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set security";              //操作名称 
			$config['note'] = "security";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set security", $param, 2 );
		}
	}
////点击策略（复选框）
	function policyAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'policy'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set policy empty";              //操作名称 
			$config['note'] = "policy";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set policy empty", $param, 2 );
		}else{
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set policy";              //操作名称 
			$config['note'] = "policy";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set policy", $param, 2 );
		}
	}
//点击通讯（复选框）
	function callAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'communication'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set communication empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set communication empty", $param, 2 );
		}else{
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set communication";              //操作名称 
			$config['note'] = "communication";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set communication", $param, 2 );
		}
	}
//点击硬件（复选框）
	function hardwareAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'hardware'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set hardware empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set hardware empty", $param, 2 );
		}else{
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set hardware";              //操作名称 
			$config['note'] = "hardware";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set hardware", $param, 2 );
		}
	}
//点击容错（复选框）
	function recoverAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){
			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'recover'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set recover empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set recover empty", $param, 2 );
		}else{
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set recover";              //操作名称 
			$config['note'] = "recover";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set recover", $param, 2 );
		}
	}
////点击测试（复选框）
	function testAdd(){
	
		$sum_id;
		if($_POST['noticeid']) $eid = formatpost($_POST['noticeid']);
		if($_POST['tag']) $etag = formatpost($_POST['tag']);
		$espString = getResponse("alarm event", "show", $param, 1);
		$espString = parseResponseDatagrid($espString,0);
		if(is_array($espString)){

			 if($espString != null){
				foreach ( $espString['rows'] as $k => $v ){
					$sum_id = '';
					if($v['evt_type'] == 'noticetest'){
						if($etag == 'off'){
							if(strstr($v['noticeid'], $eid))
								$sum_id = "'". $v['noticeid'] . "'";
							else
								$sum_id = "'". $v['noticeid'] . ' ' . $eid . "'";
						}else{
							$str = str_replace($eid,'',$v['noticeid']);
							$sum_id = "'". $str . "'";
						}
						break;
					}
				}
			 }
		}
		if($sum_id == '')
			$sum_id = $eid;
		
		if($sum_id == "''" && $etag == 'on'){
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set noticetest empty";              //操作名称 
			$config['note'] = "empty";
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set noticetest empty", $param, 2 );
		}else{
			$config['modules'] = "alarm event";   //模块名
			$config['action'] = "set noticetest";              //操作名称 
			$config['note'] = "noticetest";
			$config['param']['noticeid'] = $sum_id;
			echo sendRequestSingle($config);
			//$rspString = getResponse( 'alarm event', "set noticetest", $param, 2 );
		}
	}
        
        function addNote(){
            $config['modules'] = "sms supersms";
            $config['action'] = "modify"; 
            if($_POST['mess']){
                $myfile = fopen("/tmp/module", "w");
                fwrite($myfile, $_POST['mess']);
                fclose($myfile);
            }
            unset($_POST['mess']);
            $config['param'] = $_POST;
            if($_POST['type']=="ismg"){
                $config['note'] = "短信网关发送方式";
            }else if($_POST['type']=="db"){
                $config['note'] = "数据库发送的方式";
            }else if($_POST['type']=="webservice"){
                $config['note'] = "WebService发送的方式";
            }else if($_POST['type']=="http"){
                $config['note'] = "http发送的方式";
            }
             echo sendRequestSingle($config);
        }
        
        function shownode(){
            $rspString = getResponse('sms supersms', 'webui_show', '', 0);
            echo parseResponseDatagrid($rspString,1);
        }
        
        function cleanNote(){
            $config['modules'] = "sms supersms";  
            $config['action'] = "clean";              
            $config['note'] = "clean";
            echo sendRequestSingle($config);
        }
        
        function sendIphone(){
            $config['param'] = $_POST;
            $config['modules'] = "sms supersms";  
            $config['action'] = "test";              
            $config['note'] = "test";
            echo sendRequestSingle($config);
        }
        
        function flieImport(){        
           $file_path = '/tmp/' .$_FILES["file"]["name"];
           if(move_uploaded_file($_FILES["file"]["tmp_name"], $file_path)){
               echo 0;
           }
       }
       
       function showViews(){
            $config['param'] = $_POST;
            $config['modules'] = "sms supersms";  
            $config['action'] = "auto-module";              
            $config['note'] = "auto-module";
            $rspString = getResponse('sms supersms', 'auto-module', $config['param'], 0);
            $rspStrings = substr($rspString,88);
            $rspArray =  explode('</module>',$rspStrings);
            echo $rspArray[0];
            
       }
       
       function showModule(){
           $rspString = getResponse('sms supersms', 'show-module', '', 0);
           $rspStrings = substr($rspString,88);
           $rspArray =  explode('</module>',$rspStrings);
           echo $rspArray[0];
       }

}
?>