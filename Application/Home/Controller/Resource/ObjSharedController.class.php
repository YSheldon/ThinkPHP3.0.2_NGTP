<?php
namespace Home\Controller\Resource;
use Think\Controller;
class ObjSharedController extends Controller {
    //判断当前用户是否是虚系统管理员
    public function isShared() {
        if(isVrAdmin()) {
            echo 'yes';
        }else{
            echo 'no';
        }
    }

}
?>