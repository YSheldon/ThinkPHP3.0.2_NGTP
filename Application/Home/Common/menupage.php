<?php

/**
 * User: topsec
 * Date time: 14-11-10
 * Function: To delete iframe.
 */
require_once APP_PATH . 'Home/Conf/menu.php';
$menu = initMenu($menu);
//当前URL
$url = "?c=" . CONTROLLER_NAME . "&a=" . ACTION_NAME;
foreach ($menu as $key => $value) {
    //在每个一级菜单数组中查询当前url
    $topKey = $key;
    $menu_show = $value;
    if (in_array($url, $value) == 1) {
        break;
    } else if (array_key_exists('childs', $value)) {
        foreach ($value['childs'] as $sk => $sv) {
            $left_two_menu = $sk;
            if (in_array($url, $sv)) {
                break 2;
            } else if (array_key_exists('childs', $sv)) {
                foreach ($sv['childs'] as $tk => $tv) {
                    if (in_array($url, $tv)) {
                        $left_three_menu = $tk;
                        break 3;
                    }
                }
            }
        }
    }
}

foreach ($menu as $key => $value) {
    //获取每个一级标题中的第一个url
    if (array_key_exists('url', $value)) {  //针对home
        $arr_url = $value['url'];
    } else if (reset($value['childs'])['url'] && chop(reset($value['childs'])['url']) != '') {
        //获取第一个二级标题$value['children']，判断其有没有三级标题
        $arr_url = reset($value['childs'])['url'];
    } else {
        //取三级标题
        $arr_url = reset(reset($value['childs'])['childs'])['url'];
    }
    $toptitle[$key]['url'] = $arr_url;
    $toptitle[$key]['text'] = $value['text'];
}
$this->assign('toptitle', $toptitle);
$this->assign('toptitleNow', $topKey);
$this->assign('url', $url);
if (isset($left_two_menu)) {
    $this->assign('left_two_menu', $left_two_menu);
}
if (isset($left_three_menu)) {
    $this->assign('left_three_menu', $left_three_menu);
}
$this->assign('sercordMenu', $menu_show['childs']);

