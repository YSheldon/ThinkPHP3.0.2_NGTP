<?php
namespace Home\Controller\System;
use Think\Controller;
class SitemapController extends Controller {
	public function show()
        {
            $menu = A('Menu','Event')->getarray();
            $menu = initMenu($menu);
            unset($menu['home']);
//            foreach ($menu as $key => $value) {
//                if (reset($value['childs'])['url'] && chop(reset($value['childs'])['url']) != '') {
//                    //获取第一个二级标题$value['children']，判断其有没有三级标题
//                    $arr_url = reset($value['childs'])['url'];
//                } else {
//                    //取三级标题
//                    $arr_url = reset(reset($value['childs'])['childs'])['url'];
//                }
//                $value['url'] = $arr_url;
////                print_r($value);die();
//            }

            $this->assign('menu', $menu);
            $this->display('/Window/sitemap');
            return;
        }
}

?>
