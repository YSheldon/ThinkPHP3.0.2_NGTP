<?php
namespace Home\Controller\Resource;
use Home\Controller\CommonController;
class BalanceController extends CommonController {
    public function show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/resource_balance");
	}

    public function add(){
        parse_str(file_get_contents("php://input"),$addArr);
        $config['modules'] = 'define virtual_server';

        if ($addArr['tag'] == 1) {
            $config['action'] = "add";
        } else {
            $config['action'] = "modify";
        }
        unset($addArr['tag']);
        if($addArr['server']) {
            $addArr['server'] = "'" . $addArr['server'] . "'";
        } else {
            unset($addArr['server']);
        }
        $config['param'] = $addArr;
        echo sendRequestSingle($config);
    }

}
