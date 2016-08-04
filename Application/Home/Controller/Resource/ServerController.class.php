<?php
namespace Home\Controller\Resource;
use Home\Controller\CommonController;
class ServerController extends CommonController {
    public function show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/resource_server");
	}

    public function add(){
        parse_str(file_get_contents("php://input"),$addArr);
        $config['modules'] = 'define server';
        if ($addArr['tag'] == 1) {
            $config['action'] = "add";
        } else {
            $config['action'] = "modify";
        }
        unset($addArr['tag']);
        if(isVrAdmin()) {
            unset($addArr['shared']);
        }
        $config['param'] = $addArr;
        echo sendRequestSingle($config);
    }

}

