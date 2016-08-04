<?php
namespace Home\Controller\Network;
use Home\Controller\CommonController;
class VirtuallineController extends CommonController{
	public function show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display("Default/network_virtual_line_show");
	}

	function showJsondata(){
        $rspString = getResponse("network virtualline", "show", '', 1);
        echo parseResponseDatagrid($rspString);
	}
//添加弹出框
/*	function addWindow(){
		$this->display("/Window/network_virtual_line_add_window");
	}*/
    //rest风格的添加方法
    public function add(){
        parse_str(file_get_contents('php://input'),$dataArr);
        $config['modules'] = 'network virtual-line';
        $config['action'] = "add";
        $config['param'] = $dataArr;
        echo sendRequestSingle($config);
    }
//添加弹出框提交
	function addSave(){
        $module_name = "network virtual-line";
        $config['modules'] = $module_name;
        $config['action'] = "add";
        $config['param']['dev1'] = $_POST['dev1'];
        $config['param']['dev2'] = $_POST['dev2'];
        $config['note'] = "虚拟线";
        echo sendRequestSingle($config);
	}
//删除数据
/*	function deletee(){
		$module_name = "network virtual-line";
        $config['modules'] = $module_name;
        $config['action'] = "delete";
        $config['param']['id'] = $_POST['id'];
        echo sendRequestSingle($config);

	}*/
//清空数据
/*	function clear(){
        $module_name = "network virtual-line";
        $config['modules'] = $module_name;
        $config['action'] = "clean";
        echo sendRequestSingle($config);
	}*/

	function allVlineJsondata(){
        $rspString = getResponse("network virtualline", "show", "", 0);
        echo parseResponseDatagrid($rspString);
	}
        
/*    function allPhysicsJsondataTwo(){
        $param['__NA__'] = 'eth-no-mnp';
        $rspString = getResponse("network interfaces", "show", $param, 0);
        $arr = parseResponseDatagrid($rspString, 0);
        $i = 0;
        foreach ($arr['rows'] as $k => $v) {
            $ret[$k]['text'] = $v['dev'];
            if ($i == 0) {
                $ret[$k]['selected'] = true;
                $i++;
            }
        }
        if($ret ==null && $ret=="")
            $ret =="";
        echo json_encode($ret);
    }*/

}
?>