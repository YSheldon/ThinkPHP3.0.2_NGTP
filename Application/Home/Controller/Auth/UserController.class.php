<?php

namespace Home\Controller\Auth;
use Home\Controller\CommonController;

class UserController extends CommonController {

    public function manageInfo() {
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/auth_user_manage');
    }

    function groupJsondata() {
        $rspString = getResponse("user manage group", "show all", "", 0);
        $rspString = parseResponseDatagrid($rspString, 0);
        if (is_array($rspString['rows'][0])) {
            $par_root = "null";
            $tree = group_build_tree($rspString, $par_root);
            $totals = array();
            $totals[0]['text'] = '/';
            $totals[0]['state'] = 'open';
            $totals[0]['children'] = $tree;
            echo json_encode($totals);
        } else {
            $totals = array();
            $totals[0]['text'] = '/';
            $totals[0]['state'] = 'open';
            $totals[0]['iconCls'] = 'tree-empty';
            echo json_encode($totals);
        }
    }

    function userinfoJsondata() {
        //unset($_SESSION['userTag']);
        unset($_SESSION['latestUser']);
        $str_name = $_GET['name'];
        if ($str_name == null) {
            $rspString = getResponse("user manage user", "show all", '', 1);
            $rspString = parseResponseDatagrid($rspString,0);
        } else {
            $param['key-value'] = $str_name;
            $rspString = getResponse("user manage user", "search page key-word group", $param, 1);
            $rspString = parseResponseDatagrid($rspString,0);

        }
        if (is_array($rspString['rows'][0])){
            $resetUser = array();
            $resetUser = self::reset_user_data($rspString);
            $_SESSION["latestUser"] = $resetUser;
            echo json_encode($resetUser);
        } else {
            echo '{"rows":[],"total":"0"}';
        }
    }

    function reset_user_data($list_arr){
        $sum_arr = array();
        $total_arr = array();
        //$database['port'] = '/var/lib/mysql-3307/mysql.sock2';
        $connection = array(
            'db_type'    =>   'mysql',
            'db_host'    =>   '127.0.0.1',
            'db_user'    =>   'root',
            'db_pwd'     =>   'topsec*talent',
            'db_port'    =>    3307,
            'db_charset' =>    'utf8',
        );
        $database = M('new','',$connection);
        $dataNames = $database->query('show databases');
        $dataNamsArr = array();
        foreach($dataNames as $k => $val) {
            $dataNamsArr[$k] = $val['Database'];
        }
        foreach($list_arr['rows'] as $k=>$v){
            if($v['auth_server'] != 'null'){
                if(in_array($v['auth_server'],$dataNamsArr)) {
                    $connection = array();
                    $connection = array(
                        'db_type'    =>   'mysql',
                        'db_host'    =>   '127.0.0.1',
                        'db_user'    =>   'root',
                        'db_pwd'     =>   'topsec*talent',
                        'db_port'    =>    3307,
                        'db_name'    =>    $v['auth_server'],
                        'db_charset' =>    'utf8',
                    );
                    $db = M('new','',$connection);
                    if($db) {
                        $etime = self::getEnd($db,$v['name']);
                        // TODO 减8时区，应该在存入数据库时设置
                        $edate = date("Y-m-d H:i:s", $etime['account_end_time'] - 28800);
                        $sum_arr[$k]['name']= $v['name'];
                        $sum_arr[$k]['account_end_time']= $edate;
                        $db = null;
                    }
                }
            }
        }
        foreach($list_arr['rows'] as $k=>$v){
            foreach($sum_arr as $sv){
                if($v['name'] == $sv['name']){
                    if($sv['account_end_time']){
                        $v['account_end_time'] = $sv['account_end_time'];
                        break;
                    }
                }
            }
            $total_arr['rows'][$k] = $v;
        }
        $total_arr['total'] = $list_arr['total'];
        return $total_arr;
    }
    
    function getEnd($db, $uname){
          //return $db->query("select account_end_time from LOCAL_USER_TMP where username='".trim($uname)."'");
          return $db->table('LOCAL_USER_TMP')->field('account_end_time')->where('username="'.trim($uname).'"')->find();
    }

    function usergroupModify() {
        $config['modules'] = "user manage group";
        $config['action'] = "modify";
        $config['param']['index-key'] = 'name';
        if ($_POST['sname'] != '')
            $config['param']['index-value'] = formatpost($_POST['sname']);
        if ($_POST['pname'] != '')
            $config['param']['group'] = formatpost($_POST['pname']);
        echo sendRequestSingle($config);
    }

    function groupnameJsondata(){
        $grouptree = array();
        $sname= urldecode($_GET['name']);
        $rspString = getResponse("user manage group", "show all", '', 0);
        $list_arr =  parseResponseDatagrid($rspString,0);
        $subtree_arr = array();
        $subtree_arr[0]['name'] = '/';
        foreach($list_arr['rows'] as $i=>$items){
            if(!($items['name'] === $sname))
                $subtree_arr[++$i]['name'] = $items['name'];
        }
        $grouptree = array_merge_recursive($grouptree,  $subtree_arr);
        echo json_encode($grouptree);
    }
    
    function userAndGroup(){
        if($_GET['group']) {
            $gName = urldecode($_GET['group']);
        }
        $urspString = getResponse("user manage user", "show all", '', 0);
        $grspString = getResponse("user manage group", "show all", '', 0);
        $urspString = parseResponseDatagrid($urspString,0);
        $grspString = parseResponseDatagrid($grspString,0);
        
        $totalItems = array();
        $gArr = array();
        foreach($grspString['rows'] as $i=>$items){
            if($gName && $gName == $items['name']) {
                $pName = $items['group'];
            }
            $totalItems[$i] = $items;
            $totalItems[$i]['gTag'] = '1';
        }
        //去除当前组和父组。用于用户组的编辑
        if($gName) {
            $pName = $pName == 'null' ? '' : $pName;
            for($i=0;$i<count($totalItems);$i++) {
                if(($totalItems[$i]['name'] == $gName) || ($totalItems[$i]['name'] == $pName)) {
                    array_splice($totalItems,$i,1);
                    $i--;
                }
            }
        }

        $gArr['rows'] = $totalItems;
        $sum_arr = array();

        if($urspString != null)
            $sum_arr = array_merge_recursive($sum_arr,  $urspString);
        if($totalItems != null)
            $sum_arr = array_merge_recursive($sum_arr,  $gArr);

        echo json_encode($sum_arr);
    }
    
    function usergroupAdd(){
        if($_POST['hid_group_desc']!='') $config['param']['description'] = $_POST['hid_group_desc'];
        if($_POST['hid_group_parent']!='') $config['param']['group'] = formatpost($_POST['hid_group_parent']);
        if($_POST['group_tag']) $grouptag = formatpost($_POST['group_tag']);
        if( $grouptag == 1) {
            $config['modules'] = "user manage group";
            $config['action'] = "add";
            if($_POST['hid_group_name']!='') $config['param']['name'] = formatpost($_POST['hid_group_name']);
            $rspString = sendRequestSingle($config);

            if(!is_numeric($rspString)) {
                echo $rspString;
                exit;
            }
        } else {
            //unset($config);
             $config['modules'] = "user manage group";
             $config['action'] = "modify";
             $config['param']['index-key']= 'name';
            if($_POST['hid_group_name']!='') $config['param']['index-value'] = formatpost($_POST['hid_group_name']);
            $rspString = sendRequestSingle($config);

            if(!is_numeric($rspString)) {
                echo $rspString;
                exit;
            }
        }
        if($_POST['hid_user_member']!='') $usermem = formatpost($_POST['hid_user_member']);
        if($_POST['hid_group_member']!='') $gromem = formatpost($_POST['hid_group_member']);
        if($usermem != '') {
            if( $grouptag == 1) {
                $user_name = explode(",", $usermem);
                for($j=0;$j<count($user_name);$j++) {
                    unset($param);
                    $param['param']['index-key'] = 'name';
                    if($user_name[$j] == '')
                        break;
                    $param['param']['index-value'] = $user_name[$j];
                    $param['modules'] = 'user manage user';
                    $param['action'] = 'modify';
                    $auparam['name'] = $user_name[$j];
                    if($_POST['hid_group_name']!='') $group = formatpost($_POST['hid_group_name']);
                    $ashrspString = getResponse( 'user manage user', "show", $auparam, 0);
                    $uListArr = parseResponseDatagrid($ashrspString, 0);
                    if(is_array($uListArr)) {
                        foreach($uListArr['rows'] as $i=>$items){
                            if($items['group'] == 'null ')
                                $param['param']['group'] = $group;
                            else
                                $param['param']['group'] = $items['group'] . ',' . $group;

                            $rspString = sendRequestSingle($param);

                            if(!is_numeric($rspString)) {
                                echo $rspString;
                                exit;
                            }
                        }
                    }
                }
            } else {
                if($_POST['hid_del_user']!='') $deluser = formatpost($_POST['hid_del_user']);
                if($deluser != '') {
                    if($_POST['hid_del_group']!='') $delgroup = formatpost($_POST['hid_del_group']);
                    $uname = explode(",", $deluser);
                    $gname = explode("*", $delgroup);
                    unset($param);
                    for($j=0;$j<count($uname);$j++) {
                        $param['param']['index-key'] = 'name';
                        $param['modules'] = 'user manage user';
                        $param['action'] = 'modify';
                        if($uname[$j] == '')
                            break;
                        $param['param']['index-value'] = $uname[$j];
                        if($gname[$j] == '')
                            $gname[$j] = 'null';
                        $param['param']['group'] = $gname[$j];
                        $rspString = sendRequestSingle($param);
                    }
                    if(!is_numeric($rspString)) {
                        echo $rspString;
                        exit;
                    }
                }

                if($_POST['hid_add_user']!='') $adduser = formatpost($_POST['hid_add_user']);
                if($adduser != '') {
                    $uname = explode(",", $adduser);
                    for($j=0;$j<count($uname);$j++) {
                        unset($param);
                        $param['param']['index-key'] = 'name';
                        if($uname[$j] == '')
                            break;
                        $param['param']['index-value'] = $uname[$j];
                        $param['modules'] = 'user manage user';
                        $param['action'] = 'modify';
                        $uparam['name'] = $uname[$j];
                        if($_POST['hid_group_name']!='') $group = formatpost($_POST['hid_group_name']);
                        $shrspString = getResponse( 'user manage user', "show", $uparam, 0);
                        $uListArr = parseResponseDatagrid($shrspString, 0);
                        if(is_array($uListArr)) {
                            foreach($uListArr['rows'] as $i=>$items){
                                if($items['group'] == 'null ')
                                    $param['param']['group'] = $group;
                                else
                                    $param['param']['group'] = $items['group'] . ',' . $group;

                                $rspString = sendRequestSingle($param);

                                if(!is_numeric($rspString)) {
                                    echo $rspString;
                                    exit;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if($_POST['hid_del_user']!='') $deluser = formatpost($_POST['hid_del_user']);
            if($deluser != '') {
                if($_POST['hid_del_group']!='') $delgroup = formatpost($_POST['hid_del_group']);
                $uname = explode(",", $deluser);
                $gname = explode("*", $delgroup);
                unset($config);
                for($j=0;$j<count($uname);$j++) {
                    $config['modules'] = "user manage user";
                    $config['action'] = "modify";
                    $config['param']['index-key'] = 'name';
                    if($uname[$j] == '')
                        break;
                    $config['param']['index-value'] = $uname[$j];
                    if($gname[$j] == '')
                        $gname[$j] = 'null';
                    $config['param']['group'] = $gname[$j];
                    $rspString = sendRequestSingle($config);
                }
                if(!is_numeric($rspString)) {
                    echo $rspString;
                    exit;
                }
            }
        }
        if($gromem != '') {
            unset($config);
            $config['modules'] = "user manage group";
            $config['action'] = "modify";

            $gro_name = explode(",", $gromem);
            for($k=0;$k<count($gro_name);$k++) {
                unset($config['param']);
                $config['param']['index-key'] = 'name';
                $config['param']['index-value'] = $gro_name[$k];
                if($_POST['hid_group_name']!='') $config['param']['group'] = formatpost($_POST['hid_group_name']);
                $rspString = sendRequestSingle($config);

                if(is_string($rspString)) {
                    //unset($config);
                    $configDel['modules'] = "user manage group";
                    $configDel['action'] = "delete";
                    $configDel['param']['index-key']= 'name';

                    if($_POST['hid_group_name']!='')
                        $configDel['param']['index-value'] = formatpost($_POST['hid_group_name']);
                    $drspString = sendRequestSingle($configDel);

                    if(!is_numeric($drspString)) {
                        echo $drspString;
                        exit;
                    }
                }
            }
        }

        if($_POST['hid_del_gro']!='') $delgr = formatpost($_POST['hid_del_gro']);
        if($delgr != '') {
            $dgname = explode(",", $delgr);
            unset($param);
            $param['modules'] = 'user manage group';
            $param['action'] = 'modify';
            $param['param']['index-key'] = 'name';
            for($j=0;$j<count($dgname);$j++) {
                if($dgname[$j] == '')
                    break;
                $param['param']['index-value'] = $dgname[$j];
                $param['param']['group'] = 'null';
                $rspString = sendRequestSingle($param);
            }
        }
        echo $rspString;
    }
    
    function alluserJsondata(){
        $page = $_REQUEST['page'] ? $_REQUEST['page'] : 1;
        $count = $_REQUEST['rows'] ? $_REQUEST['rows'] : 20;

        $rspString = getResponse("user manage user", "show all", "", 0);
        $rspString = parseResponseDatagrid($rspString, 0);
        $_SESSION["latestUser"] = self::reset_user_data($rspString);
        $child_arr = array();
        if(empty($_SESSION["latestUser"])) {
            echo '{"rows":[],total":"0"}';
            return;
        } else {
            if($_REQUEST['allGroupNode']!='') $groups = formatpost($_REQUEST['allGroupNode']);
            $child_arr = self::reset_click_user($groups);
        }
        //unset($_SESSION['userTag']);
        if(empty($child_arr))
            echo '{"rows":[],"total":"0"}';
        else {
            $all_str = getFilterResultLocal($child_arr, $page, $count);
            echo json_encode($all_str);
        }
    }
    
    function usergroupJsondata(){
        $param['key-value'] = urldecode($_GET['name']);
        $urspString = getResponse("user manage user", "search page key-word group", $param, 0);
        $grspString = getResponse("user manage group", "search page key-word group", $param, 0);
        $urspString = parseResponseDatagrid($urspString,0);
        $grspString = parseResponseDatagrid($grspString,0);
        
        $sum_arr = array();
        if(!empty($urspString['rows']))
            $sum_arr = array_merge_recursive($sum_arr,  $urspString);
        if(!empty($grspString['rows']))
            $sum_arr = array_merge_recursive($sum_arr,  $grspString);

        echo json_encode($sum_arr);
        return;
     }

    //查询数据
    function searchUserGroup(){
        $_SESSION["searchGroupName"] = urldecode($_GET['name']);
        $_SESSION["searchTag"] = '0';
        $rspString = getResponse("user manage group", "show all", '', 0);
        $rspString = parseResponseDatagrid($rspString,0);
        if(is_array($rspString)) {
            $par_root = "null";
            $tree = group_build_search_tree ( $rspString, $par_root );
            $totals = array ();
            $totals[0]['text'] = '/';
            $totals[0]['state'] = 'open';
            if($_SESSION["searchTag"] == '0')
                $totals[0]['iconCls'] = 'tree-empty';
            else{
                $treeArr = delete_misMatch_tree($tree);
                $totals[0]['children'] = $treeArr;
            }
            echo json_encode($totals);
        } else {
            $totals = array ();
            $totals[0]['text'] = '/';
            $totals[0]['state'] = 'open';
            $totals[0]['iconCls'] = 'tree-empty';
            echo json_encode($totals);
        }
    }

    function authUser(){
        $param['server-name'] = urldecode($_GET['ser_name']);
        $param['user-name'] = urldecode($_GET['usr_name']);
        $rspString = getResponse("user auth local_user", "show name", $param, 0);
        if(substr($rspString, 0, 5) == "error" || is_numeric($rspString)) {
            echo '{"rows":[],"total":"0"}';
        } else {
            echo parseResponseDatagrid($rspString);
        }
    }
     //用户数据添加
     function userAdd(){
        //$_SESSION['userTag'] = 1;
        if($_POST['hid_server_type']) $stype = formatpost($_POST['hid_server_type']);
        if($stype != 2) {
            if($_POST['hid_user_name']!='') $param['name'] = formatpost($_POST['hid_user_name']);

            $arspString = getResponse( 'user manage user', "show", $param, 0);
            $arspString = parseResponseDatagrid($arspString,0);
            if(is_array($arspString)) {
                $serparam['server-name'] = $arspString['rows'][0]['auth_server'];
            }
        }

        if($_POST['user_tag']) $usertag = formatpost($_POST['user_tag']);
        if( $usertag == 1){
            if($_POST['hid_user_name']!='') $name = formatpost($_POST['hid_user_name']);
        } else {
            $config['param']['index-key'] = 'name';
            if($_POST['hid_user_name']!='') $config['param']['index-value'] = formatpost($_POST['hid_user_name']);
        }
        if($_POST['hid_user_desc']!='') $config['param']['description'] = formatpost($_POST['hid_user_desc']);
        if($_POST['hid_user_group']!='') $config['param']['group'] = formatpost($_POST['hid_user_group']);
        if($_POST['hid_user_type']) $config['param']['type'] = formatpost($_POST['hid_user_type']);
        if($_POST['hid_user_addr'] != '') $config['param']['address-name'] = formatpost($_POST['hid_user_addr']);
        if($_POST['hid_user_time'] != '') $config['param']['timer-name'] = formatpost($_POST['hid_user_time']);
        if($_POST['hid_user_area'] != '') $config['param']['area-name'] = formatpost($_POST['hid_user_area']);
        if($_POST['hid_server_name']!='') $config['param']['auth-server'] = formatpost($_POST['hid_server_name']);
        if($stype == 1)
            $config['param']['type'] = 'anonymity';
        else
            $config['param']['type'] = 'actuality';

        $config['modules'] = "user manage user";
        $config['error_prefix'] = 1;            //显示错误号
        if( $usertag == 1) {
            $config['action'] = "add";
            $str_name = explode(",", $name);
            for($j=0;$j<count($str_name);$j++) {
                $config['param']['name'] = $str_name[$j];
                $rspString = sendRequestSingle($config);
            }
        } else {
            $config['action'] = "modify";
            $rspString = sendRequestSingle($config);
        }
        //认证服务器
        unset($config);
        if($stype == 2) {
            if($_POST['hid_user_name']!='') $config['param']['name'] = formatpost($_POST['hid_user_name']);
            if($_POST['hid_server_name']!='') $config['param']['server-name'] = formatpost($_POST['hid_server_name']);
            if($_POST['hid_server_pass']!='') $config['param']['passwd'] = formatpost($_POST['hid_server_pass']);
            if($_POST['hid_server_mail'])
                $config['param']['mail'] = formatpost($_POST['hid_server_mail']);
            else
                $config['param']['mail'] = 'null';
            if($_POST['hid_server_phone'])
                $config['param']['phone'] = formatpost($_POST['hid_server_phone']);
            else
                $config['param']['phone'] = 'null';
            if($_POST['hid_expir_time'] != null) $config['param']['account-end-time'] = formatpost($_POST['hid_expir_time']);

            $k = 0;
            if( $usertag == 1){
                $config['modules'] = "user auth local_user";
                $config['action'] = "add";
                $urspString = sendRequestSingle($config);
            } else {
                if(!empty($_POST['old_server_name']) && ($_POST['old_server_name'] != $config['param']['server-name']) && empty($config['param']['passwd'])){

                    $ser_parma['param']['src-server-name'] = $_POST['old_server_name'];
                    $ser_parma['param']['dest-server-name'] = $config['param']['server-name'];
                    $ser_parma['param']['user-name'] = $config['param']['name'];

                    $ser_parma['modules'] = "user auth local_user";
                    $ser_parma['action'] = "transfer";
                    $urspString = sendRequestSingle($ser_parma);
                    if(is_numeric($urspString) && $urspString == 0){
                        $config['modules'] = "user auth local_user";
                        $config['action'] = "modify";
                        $urspString = sendRequestSingle($config);
                    }

                } elseif(!empty($_POST['old_server_name']) && ($_POST['old_server_name'] != $config['param']['server-name'])) {
                       $config['modules'] = "user auth local_user";
                       $config['action'] = "add";
                       $urspString = sendRequestSingle($config);
                    if(is_numeric($urspString) && $urspString == 0) {
                        $ser_parma['modules'] = "user auth local_user";
                        $ser_parma['action'] = "delete";
                        $ser_parma['param']['server-name'] = $_POST['old_server_name'];
                        $ser_parma['param']['name'] = $config['param']['name'];
                       $urspString = sendRequestSingle($ser_parma);
                    }

                }else{
                    $sparam['server-name'] = $config['param']['server-name'];
                    $srspString = getResponse("user auth local_user", "show all", $sparam, 0);
                    $srspString = parseResponseDatagrid($srspString,0);
                    if($srspString['total'] == 0) {
                       $config['modules'] = "user auth local_user";
                       $config['action'] = "add";
                       $urspString = sendRequestSingle($config);
                    } else if($srspString['total'] > 0) {
                        for($i=0;$i<count($srspString['rows']);$i++){
                            if($config['param']['name']==$srspString['rows'][$i]['name']) {
                                $k = 1;
                                break;
                            }
                        }
                        if($k == 1){
                            $config['modules'] = "user auth local_user";
                            $config['action'] = "modify";
                            $urspString = sendRequestSingle($config);
                        }else{
                            $config['modules'] = "user auth local_user";
                            $config['action'] = "add";
                            $urspString = sendRequestSingle($config);
                        }
                        
                    }
                }
            }
        } else {
            $k = 0;
            if($_POST['hid_user_name']!='') $param['param']['name'] = formatpost($_POST['hid_user_name']);

            if($serparam['server-name'] != '') {
                $arspString = getResponse("user auth local_user", "show all", $serparam, 0);
                $arspString = parseResponseDatagrid($arspString,0);
                if(is_array($arspString)) {
                    for($i=0;$i<count($arspString['rows']);$i++){
                        if($param['param']['name']==$arspString['rows'][$i]['name']) {
                            $k = 1;
                            break;
                        }
                    }
                    if($k == 1) {
                        $param['modules'] = "user auth local_user";
                        $param['action'] = "delete";
                        $param['param']['server-name'] = $serparam['server-name'];
                        $urspString = sendRequestSingle($param);
                    }
                }
            }
        }

        //vrc权限
        $vrcTag = formatpost($_POST['hid_vrc_tag']);
        $vparam['modules'] = "vpn vrc user_access";   //模块名
        if($_POST['hid_user_name']!='') $vparam['param']['name'] = formatpost($_POST['hid_user_name']);
        if($vrcTag == '1'){
            $vparam['action'] = "add";
            if($_POST['hid_vrc_val']!='') $vparam['param']['access'] = formatpost($_POST['hid_vrc_val']);
            $vrcrspString = sendRequestSingle($vparam);
        }else if($vrcTag == '0'){
            $vparam['action'] = "clean";
            $vrcrspString = sendRequestSingle($vparam);
        }

        if(is_numeric($rspString) && $rspString == 0) {
            if(is_numeric($urspString) && $urspString == 0)
                echo '0';
            else
                echo 'userok' . '#' . $urspString;
        } else {
            if(is_numeric($urspString) && $urspString == 0)
                echo 'authuser_ok' . '#' . $rspString;
            else
                echo $rspString;
        }
     }

     //用户删除
     function userinfoDel(){
        //$_SESSION['userTag'] = 1;
        if($_POST['del_user_name']!='')  $delname = $_POST['del_user_name'];
        $str_name = explode(";", $delname);

        if($_POST['del_serv']!='')  $delserv = $_POST['del_serv'];
        $serv_name = explode(";", $delserv);
        $serNum = 0;
        for($i=0;$i<count($str_name);$i++) {
            /*$vparam[$i]['param']['name'] = $str_name[$i];
            $vparam[$i]['modules'] = "vpn vrc user_access";
            $vparam[$i]['action'] = "clean";
            //$vrcrspString = sendRequestSingle($vparam);*/

            $config[$i]['modules'] = "user manage user";
            $config[$i]['action'] = "delete";
            $config[$i]['param']['index-key'] = 'name';
            $config[$i]['param']['index-value'] = $str_name[$i];

            if($serv_name[$i] != '' && $serv_name[$i] != 'null') {
                $sparam[$serNum]['modules'] = "user auth local_user";
                $sparam[$serNum]['action'] = "delete";
                $sparam[$serNum]['param']['server-name'] = $serv_name[$i];
                $sparam[$serNum]['param']['name'] = $str_name[$i];
                $serNum++;
            }
        }

         //$vrcrspString = sendRequestMultiple($vparam);
         $rspString = sendRequestMultiple($config);
         $srspString = sendRequestMultiple($sparam);

         if(is_numeric($rspString) && is_numeric($srspString) /*&& is_numeric($vrcrspString)*/) {
             echo '0';
         } elseif(is_string($rspString)) {
             echo $rspString;
         } elseif(is_string($srspString)) {
             echo $srspString;
         }/* else {
             echo $vrcrspString;
         }*/
     }

     //用户导入模板下载
     function moduleDownload(){
        if($_GET['file_type']) $filetype = formatpost($_GET['file_type']);
        if($filetype == 1)
            $name = 'example.txt';
        else
            $name = 'example.csv';
        $filename='./Public/attachements/'.$name;
        //echo file_exists($filename);die;
        if(file_exists($filename)){
            //下载服务器文件保存到本地目录下
            $ua = $_SERVER ["HTTP_USER_AGENT"];
            header('Content-type: application/octet-stream');
            header('Pragma: public');
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: public");
            header('Expires: 0');
            if (preg_match ( "/MSIE/", $ua )) {
                header ( 'Content-Disposition: attachment; filename="' . $name );
            } else if (preg_match ( "/Firefox/", $ua )) {
                header ( 'Content-Disposition: attachment; filename*="utf8\'\'' . $name );
            } else {
                header ( 'Content-Disposition: attachment; filename="' . $name );
            }
            header ("Content-Length:" . filesize ( $filename ));
            header ("Content-Transfer-Encoding: binary");
            ob_end_clean();
            flush();
            @readfile( $filename );
            return;
        } else {
            echo '<script>alert("file does not exist")</script>';
        }
     }
     
     function moduleImport(){
        $config['modules'] = "user manage user";
        $config['action'] = "import";
        if(!empty($_FILES["file"]["error"])){
            switch($_FILES["file"]['error']){
                case '1':
                    $error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
                    break;
                case '2':
                    $error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
                    break;
                case '3':
                    $error = 'The uploaded file was only partially uploaded';
                    break;
                case '4':
                    $error = 'No file was uploaded.';
                    break;

                case '6':
                    $error = 'Missing a temporary folder';
                    break;
                case '7':
                    $error = 'Failed to write file to disk';
                    break;
                case '8':
                    $error = 'File upload stopped by extension';
                    break;
                case '999':
                default:
                    $error = 'No error code avaiable';
            }
             echo $error;
        } else if(empty($_FILES['file']['tmp_name']) || $_FILES['file']['tmp_name'] == 'none') {
            $error = 'No file was uploaded......';
            echo $error;
        } else {
           $config['param']['filename']=$_FILES["file"]["name"];
            $newfilename="/tmp/".$_FILES["file"]["name"];
            if($_POST['hid_import_file_type']) $config['param']['file-format'] = formatpost($_POST['hid_import_file_type']);
            if($_POST['hid_import_loc']!='') $config['param']['group'] = formatpost($_POST['hid_import_loc']);
            if($_POST['hid_import_more_user']) $config['param']['type'] = formatpost($_POST['hid_import_more_user']);
            if($_POST['hid_import_login_addr']!='')$config['param']['address-name'] = formatpost($_POST['hid_import_login_addr']);
            if($_POST['hid_import_login_time']!='') $config['param']['timer-name'] = formatpost($_POST['hid_import_login_time']);
            if($_POST['hid_import_login_area']!='') $config['param']['area-name'] = formatpost($_POST['hid_import_login_area']);
            if($_POST['hid_import_cognominal']) $config['param']['cognominal'] = formatpost($_POST['hid_import_cognominal']);
            //判断当前文件存储路径中是否含有非法字符
            if(preg_match('/\.\./',$newfilename)){
                exit('上传文件中不能存在".."等字符');
            }
            if(move_uploaded_file($_FILES["file"]["tmp_name"],$newfilename)) {
                echo sendRequestSingle($config);
            } else
                $this->display('Default/auth_user_manage');
        }
     }
    //导出数据
    function moduleExport(){
        $config['modules'] = "user manage user";
        $config['action'] = "export";
        if($_POST['hid_export_name']!='') $config['param']['filename'] = formatpost($_POST['hid_export_name']);
        if($_POST['hid_export_type']) $config['param']['file-format'] = formatpost($_POST['hid_export_type']);
        if($_POST['hid_export_group']!='') $config['param']['group'] = formatpost($_POST['hid_export_group']);
        if($_POST['hid_export_child'] == 1)
            $config['param']['child'] = 'yes';
        else
            $config['param']['child'] = 'no';
        $rspString = sendRequestSingle($config);
        if(is_numeric($rspString) && $rspString == 0) {
            if($config['param']['file-format'] == "txt")
                $name = $config['param']['filename'].'.txt';
            else
                $name = $config['param']['filename'].'.csv';
            $filename='/tmp/'.$name;
            $ua = $_SERVER ["HTTP_USER_AGENT"];
            header('Content-type: application/octet-stream');
            header('Pragma: public');
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: public");
            header('Expires: 0');
            if (preg_match ( "/MSIE/", $ua )) {
                header ( 'Content-Disposition: attachment; filename="' . $name );
            } else if (preg_match ( "/Firefox/", $ua )) {
                header ( 'Content-Disposition: attachment; filename*="utf8\'\'' . $name );
            } else {
                header ( 'Content-Disposition: attachment; filename="' . $name );
            }
            header ( "Content-Length:" . filesize ( $filename ) );
            header ( "Content-Transfer-Encoding: binary" );
            ob_end_clean();
            flush();
            @readfile( $filename );
        }else{
            header("Content-type: text/html; charset=utf-8");
            //echo '<script>alert("'.$rspString.'"); window.history.back();</script>';
            echo '<script>alert("'.$rspString.'"); location.replace("?c=Auth/User&a=manageinfo");</script>';
        }
    }
     //扫描
     function getScanUser(){
        $config['modules'] = "user manage scan-host";
        $config['action'] = "find";
        if($_POST['scan_ip1']) $config['param']['begin-ip'] = formatpost($_POST['scan_ip1']);
        if($_POST['scan_ip2']) $config['param']['end-ip'] = formatpost($_POST['scan_ip2']);
        if($_POST['scan_group']!='') $config['param']['group'] = formatpost($_POST['scan_group']);
        if($_POST['scan_type']) $config['param']['type'] = formatpost($_POST['scan_type']);
        if($_POST['scan_sta']) $config['param']['invalid'] = formatpost($_POST['scan_sta']);

        if($config['param']['group'] == '/')
            $config['param']['group'] = 'null';
        echo sendRequestSingle($config);
     }

     //用户查询
     function searchUserName(){
        //unset($_SESSION['userTag']);
        unset($_SESSION['latestUser']);
        $param['key-value'] = urldecode($_GET['name']);
        $str_type = $_GET['type'];
        if($str_type == '1') {
            $rspString = getResponse("user manage user", "show all", '', 0);
        } else {
            $rspString = getResponse("user manage user", "search page key-word ip", $param, 1);
        }

        $rspString = parseResponseDatagrid($rspString,0);
        if(is_array($rspString['rows'][0])) {
            $searchUser = array();
            if($str_type == '1') {
                foreach($rspString['rows'] as $val) {
                    if(strpos($val['name'],$param['key-value']) !== false) {
                        $searchUser['rows'][] = $val;
                    }
                }
                $page = $_REQUEST['page']?$_REQUEST['page']:1;
                $count = $_REQUEST['rows']?$_REQUEST['rows']:20;
                $searchUser = getFilterResultLocal($searchUser, $page, $count);
            } else {
                $searchUser = $rspString;
            }
            $resetUser = array();
            $resetUser = self::reset_user_data($searchUser);
            $_SESSION["latestUser"] = $resetUser;
            if($resetUser['rows'][0]) {
                echo json_encode($resetUser);
            } else {
                echo '{"rows":[],"total":"0"}';
            }

        } else {
            echo '{"rows":[],"total":"0"}';
        }
     }

    function reset_click_user($groups) {
        $all_arr = array();
        $m = 0;
        if(!(empty($_SESSION["latestUser"]))) {
            $list_arr = $_SESSION["latestUser"];
            if($list_arr != null) {
                $str_name = explode(",", $groups);
                $strNameNum = count($str_name);
                foreach($list_arr['rows'] as $k=>$v){
                    $j = 0;
                    $gr_name = explode(",", $v['group']);
                    for($i=0;$i<count($gr_name);$i++){
                        $pos = 0;
                        for($k=0;$k<$strNameNum;$k++){
                            if($gr_name[$i] == $str_name[$k]){
                                $pos = 1;
                                break;
                            }
                        }
                        if($pos == 1) {
                            $j = 1;
                            break;
                        }
                    }
                    if($j == 1)
                        $all_arr['rows'][$m++] = $v;
                }
                //$all_arr['total'] = count($all_arr['rows']);
            }
        }
        return $all_arr;
    }

    /*function userGroupClear() {
        $param['modules'] = 'user manage group';
        $param['action'] = 'clean';
        echo sendRequestSingle($param);
    }*/
}
?>