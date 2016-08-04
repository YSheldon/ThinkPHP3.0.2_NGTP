<?php

namespace Home\Controller\Home;
use Think\Controller;
class SupportController extends Controller {
    public function privilege() {
         $module = formatpost($_POST['name']);
        if ($module) {
            echo getPrivilege($module);
        } else {
            echo 0;
        }
        return;
    }

    public function status(){
    	$leftdivs = $_POST["leftdiv"]; 
    	if($leftdivs == "200px"){
    		$leftdivs="1";
    	}else{
    		$leftdivs="0";
    	}
    	cookie('leftdiv',$leftdivs,3600); //设置session
    	if($_COOKIE['leftdiv'] == "1" || !isset($_COOKIE['leftdiv'])){
    		echo 1;
    	}else{
    		echo 0;
    	}
    }

}
