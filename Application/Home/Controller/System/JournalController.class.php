<?php
namespace Home\Controller\System;
use Home\Controller\CommonController;
class JournalController extends CommonController {
//审计日志
    public function audti_log_show(){
        $data = self::fileShow();
        $base = $_GET['base'];
        $table = $_GET['table'];
        $id = $_GET['id'];
		//获取中文还是英文
		$rspString = getResponse('log config', 'serv-show', '', 0);
        $rspString = parseResponse($rspString);
		if (is_array($rspString)) {
			
			$outcome['log-language'] = $rspString['log-language'];
		}
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->assign("data",$data);
        $this->assign("base",$base);
        $this->assign("table",$table);
        $this->assign("id",$id);
		$this->assign("outcome", $outcome);
        $this->display("Default/system_audti_log_show");
    }
//系统日志
    function system_log_show(){
        $data = self::fileShow();
        $base = $_GET['base'];
        $table = $_GET['table'];
        $id = $_GET['id'];
		//获取中文还是英文
		$rspString = getResponse('log config', 'serv-show', '', 0);
        $rspString = parseResponse($rspString);
		if (is_array($rspString)) {
			
			$outcome['log-language'] = $rspString['log-language'];
		}
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->assign("data",$data);
        $this->assign("base",$base);
        $this->assign("table",$table);
        $this->assign("id",$id);
		$this->assign("outcome", $outcome);
        $this->display("Default/system_system_log_show");
    }
//策略日志    
    function policy_log_show(){
        $data = self::fileShow();
        $base = $_GET['base'];
        $table = $_GET['table'];
        $id = $_GET['id'];
		//获取中文还是英文
		$rspString = getResponse('log config', 'serv-show', '', 0);
        $rspString = parseResponse($rspString);
		if (is_array($rspString)) {
			
			$outcome['log-language'] = $rspString['log-language'];
		}
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->assign("data",$data);
        $this->assign("base",$base);
        $this->assign("table",$table);
        $this->assign("id",$id);
		$this->assign("outcome", $outcome);
        $this->display("Default/system_policy_log_show");
    }
    
	//数据显示
    function JournalJsondata(){
		$start_date = date('Y-m-d H:i:s',strtotime($_GET['start_date']));
		$end_date = date('Y-m-d H:i:s',strtotime($_GET['end_date']));
		$keyword = formatpost($_GET['keyword']);
		$level = formatpost($_GET['level']);
		$language = $_GET['language'];
		$vsid = intval(getVsid());
		$where = "vsid =".$vsid;
		$base = $_GET['base'];
        $table = $_GET['table'];
		$level_array = ['紧急','告警','严重','错误','警示','通知','信息','调试'];
		$levelen_array = ['emergent','alarm','critical','error','warning','notice','information','debug'];
		if($keyword!=""){
			$where.= " and format_msg like '%".$keyword."%'";
		}
		if($base=="tos_log_db"){
			$model = M($table,'','DB_TOS_LOG');
			if($language=="english"){
				if($level!=""){
					$where.=" and pri = '".$levelen_array[$level]."'";
				}
				$where.=" and log_language = 'english'";
			}else{
				if($level!=""){
					$where.=" and pri = '".$level_array[$level]."'";
				}
				$where.=" and log_language = 'chinese'";
			}
		}else{
			$model = M($table,'','DB_NGTOS_LOG');
			if($level!=""){
				$where.=" and pri = ".$level;
			}
		}
		if($_GET['start_date'] !="" && $_GET['end_date'] !=""){
			
			$where.=" and time >='".$start_date."' and time <='".$end_date."'";
		}
        $start = (I('page',1,'intval')-1)*I('rows',20,'intval');
        $count = $model->where($where)->count();
        $arr =  $model->where($where)->order('time desc')->limit($start,I('rows',20,'intval'))->select();
        if(empty($arr)) {
            $arr = array();
        }
        $data['rows'] = $arr;
        $data['total'] = $count;
        echo json_encode($data);
    }
    //读取文件内容
    function fileShow(){
        $file_cfg = file_get_contents("/tos/etc/log_rule_cfg/log_tbl.cfg");
        $file_array = str_replace("\n","&",str_replace("\r","",$file_cfg));
        $file_array = explode("&",$file_array);
        array_pop($file_array);
        foreach($file_array as $k=>$v){
             $data_array[]= explode(":",$v);
             foreach($data_array as $k1=>$v1){
                 $title_array[$k] =explode("|",$v1[2]);
//                 $conf_array[$k] =explode("|",$v1[6]);
                 foreach($title_array as $k2=>$v2){
                    $data[$k]['data'] = $v1[0];
                    $data[$k]['table'] = $v1[1];
                    $data[$k]['title'] = $title_array[$k2];
                    $data[$k]['en'] = $v1[3];
                    $data[$k]['cn'] = $v1[4];
//                    $data[$k]['license'] = $v1[5];
//                    if($conf_array[$k2])
//                        $data[$k]['conf'] = $conf_array[$k2];
                    $data[$k]['menu'] = $v1[7];
                 }
             }
        }
         return $data;
    }
//动态获取列表
    function Column(){
        $base = $_POST['base'];
        $table = $_POST['table'];
        $file_cfg = file_get_contents("/tos/etc/log_rule_cfg/log_tbl.cfg");
        $file_array = str_replace("\n","&",str_replace("\r","",$file_cfg));
        $file_array = explode("&",$file_array);
        array_pop($file_array);
        foreach($file_array as $k=>$v){
             $data_array[]= explode(":",$v);
        }        
        foreach($data_array as $k=>$v){
            if($v[0]==$base && $v[1] ==$table){
                $title_array[] =explode("|",$v[2]);
            }
        }        
        foreach($title_array as $k=>$v){
            foreach($v as $k1=>$v1){
               if(strpos($v1,'[')){
                   $chunk_array[] = explode("[",rtrim($v1,"]"));
               }
            }
        }
        foreach($chunk_array as $k=>$v){
            $data[$k]['key'] = $v[0];
            $data[$k]['value'] = $v[1];
        }
       echo json_encode($data);
    }
	
	//清空数据
	function logClean(){
		$config['param']['db-name'] = $_POST['base'];
        $config['param']['table-name'] = $_POST['table'];
        $config['modules'] = 'log message';
        $config['action'] = 'clean';
        echo sendRequestSingle($config);
	}
	
	//查询弹窗框
	function Search(){
        $base = $_GET['base'];
		$table = $_GET['table'];
        $this->assign("table",$table);
		$this->assign("base",$base);
        $this->display('Window/system_log_search');
    }
	
	function logExport(){
        $log_file = formatpost($_POST['log_file']);
        $log_base = formatpost($_POST['base']);
		$log_table = formatpost($_POST['table']);
        $time = time();
        //$name = $log_table.'-'.$time;
        if($log_file == "text_file"){
            $name = $log_table.'-'.$time.".txt";
            $file_path = '/tmp/' . $name;
        }else{
            $name = $log_table.'-'.$time.".sql";
            $file_path = '/tmp/' . $name;
        }
		$config['param']['db-name'] = $log_base;
		$config['param']['table-name'] = $log_table;
        $config['param']['file-path'] = $file_path;
        $config['param']['mode'] = $log_file;
        $config['modules'] = "log export";   //模块名
        $config['action'] = "";              //操作名称   
        $config['note'] = "导出";
		//var_dump($config);die;
        $rspString = sendRequestSingle($config);
        if (is_numeric($rspString) && $rspString == 0) {
            $filename = $file_path;
            if (file_exists($filename)) {
                //下载服务器文件保存到本地目录下
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
                unlink($file_path);
                return;
            }
        } else {
            //require_once APP_PATH . 'Home/Common/menupage.php';
            //$this->display("Default/system_audti_log_show");

            header("Content-type: text/html; charset=utf-8");
            echo '<script>alert("'.$rspString.'"); window.history.back();</script>';
        }
    }
}
?>