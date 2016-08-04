<?php
namespace Home\Controller\System;
use Think\Controller;
class SystemController extends Controller {
    
    public function file_save(){
		//echo "1111";die;
		//$rspString = getResponse( 'save', "" , $param, 2 );
		if(is_numeric($rspString) && $rspString == 0)
		{
			echo 'ok';
		}else{
		//	echo $rspString;
		echo "no";
		}
		exit;

	}


}

?>
