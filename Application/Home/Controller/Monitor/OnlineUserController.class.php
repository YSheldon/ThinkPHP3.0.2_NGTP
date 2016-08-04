<?php
namespace Home\Controller\Monitor;
use Home\Controller\CommonController;
class  OnlineUserController extends CommonController {
      public function online_user(){
            require_once APP_PATH . 'Home/Common/menupage.php';
            $this->display('/Default/monitor_online_user_flow');
      }

/*      public function online_userData(){
            $rspString = getResponse('user manage online-user', "show", '', 1);
            echo parseResponseDatagrid($rspString);
      }*/

      public function del_user_data(){
            $config['modules'] = "user manage online-user";
            $config['action'] = "delete-by-name";
            $config['note'] = "delete";
            $config['param']['name'] = $_POST['username'];
            echo sendRequestSingle($config);
      }
}
?>
