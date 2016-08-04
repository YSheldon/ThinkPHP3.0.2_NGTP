<?php
namespace Home\Controller\Resource;
use Home\Controller\CommonController;
class RegionController extends CommonController {
    public function region_info(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/resource_region_info");
	}

    public function add(){
        parse_str(file_get_contents("php://input"),$dataArr);
        if($dataArr['tag'] == 1)
            $param['action'] = 'add';
        else
            $param['action'] = 'modify';

        //删除添加或修改标示符，并且判断是否是虚系统，虚系统不需要shared字段
        unset($dataArr['tag']);
        if(isVrAdmin())
            unset($dataArr['shared']);

        $param['modules'] = 'define area';
        $param['param'] = $dataArr;
        echo sendRequestSingle($param);
    }

}

