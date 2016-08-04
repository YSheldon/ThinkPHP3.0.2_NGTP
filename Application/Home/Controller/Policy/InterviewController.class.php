<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class InterviewController extends CommonController {
	public function control_show(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        //user权限
        if(getLicense(0, "USER_MANAGE") == 0 || getPrivilege("user_manage") == 0)
            $this->assign('user_conf',0);
        else
            $this->assign('user_conf',1);

        $this->display('/Default/policy_interview_control_show');
		
	}

    //添加策略弹出框
    public function policyWindow() {
        //user权限
        if(getLicense(0, "USER_MANAGE") == 0 || getPrivilege("user_manage") == 0)
            $this->assign('user_conf',0);
        else
            $this->assign('user_conf',1);

        $this->display('Window/policy_interview_window');
    }

    //添加和修改策略组
    public function addGroup() {
        if($_POST['oldname']){
            $param['param']['oldname'] = formatpost($_POST['oldname']);
            $param['param']['newname'] = formatpost($_POST['name']);
            $param['action'] = 'rename';
        }elseif($_POST['before']){
            if($_POST['name']!='')  $param['param']['name'] = formatpost($_POST['name']);
            if($_POST['before'])  $param['param']['before'] = formatpost($_POST['before']);
            $param['action'] = 'add';
        }else{
            $param['param']['name'] = formatpost($_POST['name']);
            $param['action'] = 'add';
        }
        $param['modules'] = 'firewall group_policy';
        echo sendRequestSingle($param);
    }

    //显示所有组
    public function showPolicyGroup() {
        $rspString = getResponse( 'firewall group_policy', "show", '', 0);
        $groupArr = parseResponseDatagrid($rspString, 0);
        if(is_array($groupArr)) {
            $arrNone=array('id'=>'0','name'=>'none');
            array_push($groupArr['rows'],$arrNone);
            echo json_encode($groupArr);
        } elseif(is_numeric($groupArr)) {
//            $arrNone['rows'][0]['id'] = '0';
            $arrNone['rows'][0]['name'] = 'none';
            echo json_encode($arrNone);
        }else{
            echo '{"rows":[],"total":"0"}';
        }
    }

    //移动策略组
    public function policyMove() {
        if(formatpost($_POST['isgroup'])=='group') {
            if($_POST['name']!='')  $param['param']['__NA__'] = formatpost($_POST['name']);
            if($_POST['selected']!='')  $param['param'][formatpost($_POST['position'])] = formatpost($_POST['selected']);
            $param['modules'] = 'firewall group_policy';
            $param['action'] = 'move';
            echo sendRequestSingle($param);
        } else {
            if($_POST['name']!='')  $param['param']['__NA__'] = formatpost($_POST['name']);
            if($_POST['selected']!='')  $param['param'][formatpost($_POST['position'])] = formatpost($_POST['selected']);
            $param['modules'] = 'firewall policy';
            $param['action'] = 'move';
            echo sendRequestSingle($param);
        }
    }

    //策略信息
    public function interviewJsondata() {
        $rspString = getResponse( 'firewall group_policy', "show" , '', 0);
        $rspString_policy_count=getResponse( 'firewall policy', "total" , '', 0);
        $policy_count = parseResponseDatagrid($rspString_policy_count, 0);
        if(substr($rspString, 0, 5) == 'error') {
            echo '{"rows":[],"total":"0"}';
        } elseif(is_numeric($rspString) && $rspString == 0) {
            $param['group_name']='default';
            $rspString_one = getResponse( 'firewall policy', "show" , $param, 1);
            if(is_numeric($rspString_one) && $rspString_one == 0) {
                $list_arr['rows'][0]['id']='none';
                $list_arr['rows'][0]['child_value']='0';
                $list_arr['rows'][0]['state']='closed';
                $list_arr['rows'][0]['iconCls']='tree-empty';
                $list_arr['total']='1';
                echo json_encode($list_arr);
                return;
            } elseif(substr($rspString_one, 0, 5) != 'error') {
                $list_arr['rows'][0]['id']='none';
                $list_arr['rows'][0]['child_value']='1';
                $list_assign=parseResponseDatagrid($rspString_one, 0);
                $list_arr_count=count($list_assign['rows']);
                if($list_arr_count==1) {
                    $list_arr['rows'][0]['children']=$list_assign['rows'];
                    $list_arr['rows'][0]['children'][0]['_parentId']='none';
                } else {
                    $list_arr['rows'][0]['children']=$list_assign['rows'];
                    for($k=0;$k<$list_arr_count;$k++) {
                        $list_arr['rows'][0]['children'][$k]['_parentId']='none';
                    }
                }
                if($list_assign['total']) {
                    $list_arr['total']=$list_assign['total'];
                } else {
                    $list_arr['total']='1';
                }
                echo json_encode($list_arr);
            }
        } else {
            $list_arr = array();
            $assign=parseResponseDatagrid($rspString, 0);
            $arrNone=array('id'=>'0','name'=>'none');
            array_push($assign['rows'],$arrNone);

            $con=count($assign['rows']);
            $show_count=0;
            $p=0;
            $new_list_arr = array();
            $postCountLow=($_REQUEST['page']-1)*$_REQUEST['rows'];
            $postCountHigh=$_REQUEST['page']*$_REQUEST['rows'];

            for($i=0;$i<$con;$i++) {
                $list_arr['rows'][$i]['id']=$assign['rows'][$i]['name'];
                $list_arr['rows'][$i]['child_value']='1';

                if($list_arr['rows'][$i]['id']=='none')
                    $param['group_name']='default';
                else
                    $param['group_name']=$list_arr['rows'][$i]['id'];

                $rspString_one = getResponse( 'firewall policy', "show" , $param, 0);
                if(is_numeric($rspString_one) && $rspString_one == 0) {
                    $list_arr['rows'][$i]['state']='closed';
                    $list_arr['rows'][$i]['iconCls']='tree-empty';
                    if($show_count>=$postCountLow && $show_count<=$postCountHigh) {
                        $new_list_arr['rows'][$p]['id']=$assign['rows'][$i]['name'];
                        $new_list_arr['rows'][$p]['state']='closed';
                        $new_list_arr['rows'][$p]['iconCls']='tree-empty';
                        $p++;
                    }

                } elseif(substr($rspString_one, 0, 5) != 'error') {
                    $rspString_assign=parseResponseDatagrid($rspString_one, 0);
                    $count_assign=count($rspString_assign['rows']);
                    $w=0;
                    $new_children = array();
                    for($k=0;$k<$count_assign;$k++) {
                        if($show_count>=$postCountLow && $show_count<$postCountHigh) {
                            $new_list_arr['rows'][$p]['id']=$assign['rows'][$i]['name'];
                            $new_list_arr['rows'][$p]['child_value']='1';
                            $rspString_assign['rows'][$k]['_parentId']=$list_arr['rows'][$i]['id'];
                            $new_children[$w]=$rspString_assign['rows'][$k];
                            $w++;
                            $show_count++;
                        } elseif($show_count<$postCountLow) {
                                $show_count++;
                        } else {
                            if(!empty($new_children))
                                $new_list_arr['rows'][$p]['children']=$new_children;
                            break 2;
                        }
                    }
                    if(!empty($new_children)) {
                        $new_list_arr['rows'][$p]['children']=$new_children;
                        $p++;
                    }
                    $list_arr['rows'][$i]['children']=$rspString_assign['rows'];
                    for($k=0;$k<$count_assign;$k++) {
                        $list_arr['rows'][$i]['children'][$k]['_parentId']=$list_arr['rows'][$i]['id'];
                    }
                } else {
                    $list_arr['rows'][$i]['children']=[];
                    if($show_count>=$postCountLow && $show_count<=$postCountHigh) {
                        $new_list_arr['rows'][$p]['children']=[];
                        $p++;
                    }
                }
            }
            //$list_arr['total']=$policy_count;
            //echo json_encode($list_arr);
            $new_list_arr['total']=$policy_count['rows'][0]['policy_total'];
            //$new_list_arr['total'] = count($new_list_arr['rows']);    //note：按侧略组条目分页,需要调用getFilterResultLocal()
            echo json_encode($new_list_arr);
        }
    }

    //添加策略
    public function interviewAdd() {
        if($_POST['action1']!='')  $param['action'] = formatpost($_POST['action1']);
        if($_POST['enable']!='')  $param['enable'] = formatpost($_POST['enable']);
        if($_POST['log1']!='')  $param['log'] = formatpost($_POST['log1']);
        if($_POST['srcarea']!='')  $param['srcarea'] = '\''.formatpost($_POST['srcarea']).'\'';
        if($_POST['dstarea']!='')  $param['dstarea'] = '\''.formatpost($_POST['dstarea']).'\'';
        if($_POST['src']!='')  $param['src'] = '\''.formatpost($_POST['src']).'\'';
        if($_POST['dst']!='')  $param['dst'] = '\''.formatpost($_POST['dst']).'\'';
        if($_POST['srcport']!='')  $param['srcport'] = '\''.formatpost($_POST['srcport']).'\'';
        if($_POST['service']!='')  $param['service'] = '\''.formatpost($_POST['service']).'\'';
        if($_POST['schedule']!='')  $param['schedule'] = '\''.formatpost($_POST['schedule']).'\'';
        if($_POST['comment']!='')  $param['comment'] = '\''.formatpost($_POST['comment']).'\'';

        if($_POST['user']!='')  $param['user'] = '\''.formatpost($_POST['user']).'\'';
        if($_POST['group_name']!='')  $param['group_name'] = formatpost($_POST['group_name']);
        if($_POST['orig_dst']!='')  $param['orig_dst'] = '\''.formatpost($_POST['orig_dst']).'\'';
        if($_POST['max_active_session']!='')  $param['max_active_session'] = formatpost($_POST['max_active_session']);

        if($_POST['permanent'])  $param['permanent'] = formatpost($_POST['permanent']);
        if($_POST['traffic_statistic'])  $param['traffic-statistic'] = formatpost($_POST['traffic_statistic']);
        if($_POST['ai_protos'])  $param['app'] = '\''.formatpost($_POST['ai_protos']).'\'';

        if($_POST['hopopts']!='')  $param['hopopts'] = formatpost($_POST['hopopts']);
        if($_POST['dstopts']!='')  $param['dstopts'] = formatpost($_POST['dstopts']);
        if($_POST['routing']!='')  $param['routing'] = formatpost($_POST['routing']);
        if($_POST['fragment']!='')  $param['fragment'] = formatpost($_POST['fragment']);
        if($_POST['ah']!='')  $param['ah'] = formatpost($_POST['ah']);
        if($_POST['esp']!='')  $param['esp'] = formatpost($_POST['esp']);
        if($_POST['slog']!='')  $param['slog'] = formatpost($_POST['slog']);

        if($_POST['profile']!='')  $param['profile'] = '\''.formatpost($_POST['profile']).'\'';

        $addParam['param'] = $param;
        $addParam['modules'] = 'firewall policy';
        $addParam['action'] = 'add';
        echo sendRequestSingle($addParam);
    }

    //修改策略
    public function interviewEdit() {
        if($_POST['id']!='')  $param['id'] = formatpost($_POST['id']);
        if($_POST['action1']!='')  $param['action'] = formatpost($_POST['action1']);
        if($_POST['enable']!='')  $param['enable'] = formatpost($_POST['enable']);
        if($_POST['log1']!='')  $param['log'] = formatpost($_POST['log1']);

        if($_POST['srcarea']!='')  $param['srcarea'] = '\''.formatpost($_POST['srcarea']).'\'';
        if($_POST['dstarea']!='')  $param['dstarea'] =  '\''.formatpost($_POST['dstarea']).'\'';
        if($_POST['src']!='')  $param['src'] = '\''.formatpost($_POST['src']).'\'';
        if($_POST['dst']!='')  $param['dst'] = '\''.formatpost($_POST['dst']).'\'';
        if($_POST['srcport']!='')  $param['srcport'] = '\''.formatpost($_POST['srcport']).'\'';
        if($_POST['service']!='')  $param['service'] = '\''.formatpost($_POST['service']).'\'';
        if($_POST['schedule']!='')  $param['schedule'] = '\''.formatpost($_POST['schedule']).'\'';
        if($_POST['comment']!='')  $param['comment'] = '\''.formatpost($_POST['comment']).'\'';
        else $param['comment'] ='none';
        if($_POST['user']!='')  $param['user'] = '\''.formatpost($_POST['user']).'\'';

        if($_POST['group_name']!='')  $param['group_name'] = formatpost($_POST['group_name']);
        if($_POST['orig_dst']!='')  $param['orig_dst'] = '\''.formatpost($_POST['orig_dst']).'\'';
        if($_POST['max_active_session']!='')  $param['max_active_session'] = formatpost($_POST['max_active_session']);
        if($_POST['permanent'])  $param['permanent'] = formatpost($_POST['permanent']);
        if($_POST['traffic_statistic'])  $param['traffic-statistic'] = formatpost($_POST['traffic_statistic']);
        if($_POST['ai_protos']!='')  $param['app'] = '\''.formatpost($_POST['ai_protos']).'\'';
        if($_POST['hopopts']!='')  $param['hopopts'] = formatpost($_POST['hopopts']);
        if($_POST['dstopts']!='')  $param['dstopts'] = formatpost($_POST['dstopts']);
        if($_POST['routing']!='')  $param['routing'] = formatpost($_POST['routing']);
        if($_POST['fragment']!='')  $param['fragment'] = formatpost($_POST['fragment']);
        if($_POST['ah']!='')  $param['ah'] = formatpost($_POST['ah']);
        if($_POST['esp']!='')  $param['esp'] = formatpost($_POST['esp']);
        if($_POST['slog']!='')  $param['slog'] = formatpost($_POST['slog']);

        if($_POST['profile']!='')  $param['profile'] = '\''.formatpost($_POST['profile']).'\'';
        else $param['profile'] ='none';

        $saveParam['param'] = $param;
        $saveParam['modules'] = 'firewall policy';
        $saveParam['action'] = 'modify';
        echo sendRequestSingle($saveParam);
    }

    //查询
    public function interviewSearchGetJson() {
        if($_POST['srcarea']!='')  $param['srcarea'] = formatpost($_POST['srcarea']);
        if($_POST['dstarea']!='')  $param['dstarea'] = formatpost($_POST['dstarea']);
        if($_POST['src']!='')  $param['src'] = formatpost($_POST['src']);
        if($_POST['dst']!='')  $param['dst'] = formatpost($_POST['dst']);
        if($_POST['srcip']!='')  $param['srcip'] = formatpost($_POST['srcip']);
        if($_POST['dstip']!='')  $param['dstip'] = formatpost($_POST['dstip']);

        if($_POST['group_name']!='') {
            if(formatpost($_POST['group_name'])==L('DEFAULT_GROUP') || formatpost($_POST['group_name'])=='default')
                $param['group_name']='default';
            else
                $param['group_name'] = formatpost($_POST['group_name']);
        }

        if($_POST['name']!='')  $param['name'] = formatpost($_POST['name']);
        if($_POST['orig_dst']!='')  $param['orig_dst'] = formatpost($_POST['orig_dst']);

        $rspString = getResponse( 'firewall policy', "show" , $param, 0);
        $listArr = parseResponseDatagrid($rspString, 0);

        if($listArr == 0 || is_string($listArr)) {
            echo '{"rows":[],"total":"0"}';
        } elseif(is_array($listArr)) {
            $searchList=array();
            $groupName=(!$listArr['rows'][0]['group_name'])?'none':$listArr['rows'][0]['group_name'];
            $groupNum=0;
            $policyNum=0;
            $num = count($listArr['rows']);
            for($i=0;$i<$num;$i++) {
                //同一组
                if(!$listArr['rows'][$i]['group_name'])
                    $listArr['rows'][$i]['group_name']='none';
                if($groupName==$listArr['rows'][$i]['group_name']) {
                    $searchList['rows'][$groupNum]['id']=$listArr['rows'][$i]['group_name'];
                } else  {
                    //不同组
                    $groupNum++;
                    $searchList['rows'][$groupNum]['id']=$listArr['rows'][$i]['group_name'];
                    $policyNum=0;
                    $groupName=$listArr['rows'][$i]['group_name'];
                }
                $searchList['rows'][$groupNum]['children'][$policyNum]=$listArr['rows'][$i];
                $searchList['rows'][$groupNum]['children'][$policyNum]['_parentId']=$listArr['rows'][$i]['group_name'];
                $policyNum++;
            }
            $searchList['total'] = $listArr['total'];
//            $searchList['total'] = count($searchList['rows']);    //按组条目
            if($searchList['rows'][0]) {
                echo json_encode($searchList);
            } else {
                echo '{"rows":[],"total":"0"}';
            }
        }
    }

    //对象查询
    function policyObjShow() {
        $module = $_POST['module1'];
        $action = $_POST['action1'];
        $sumArr = array();
        if($module=='host') {
            $hrspString = getResponse('define host', 'show', '', 0);
            $grspString = getResponse('define range', 'show', '', 0);
            $srspString = getResponse('define subnet', 'show', '', 0);

            if(is_numeric($hrspString) && is_numeric($grspString) && is_numeric($srspString)) {
                echo '{"rows":[]}';
            }else {
                if(substr($hrspString, 0, 5) != 'error')
                    $hlistArr = parseResponseDatagrid($hrspString, 0);
                if(substr($grspString, 0, 5) != 'error')
                    $glistArr = parseResponseDatagrid($grspString, 0);
                if(substr($srspString, 0, 5) != 'error')
                    $slistArr = parseResponseDatagrid($srspString, 0);

                if(!empty($hlistArr['rows']))
                    $sumArr = array_merge_recursive($sumArr, $hlistArr);
                if(!empty($glistArr['rows']))
                    $sumArr = array_merge_recursive($sumArr, $glistArr);
                if(!empty($slistArr['rows']))
                    $sumArr = array_merge_recursive($sumArr, $slistArr);

                echo json_encode($sumArr);
            }
        } elseif($module=='service') {
            $param['type']='custom';
            $rspString1 = getResponse('define service', 'show', $param, 0);
            $param['type']='default';
            $rspString2 = getResponse('define service', 'show', $param, 0);
            if(is_numeric($rspString1) && is_numeric($rspString2)) {
                echo '{"rows":[]}';
            } else {
                if(substr($rspString1, 0, 5) != 'error')
                    $arr1=parseResponseDatagrid($rspString1, 0);
                if(substr($rspString2, 0, 5) != 'error')
                    $arr2=parseResponseDatagrid($rspString2, 0);

                if(!empty($arr1['rows']))
                    $sumArr = array_merge_recursive($sumArr, $arr1);
                if(!empty($arr2['rows']))
                    $sumArr = array_merge_recursive($sumArr, $arr2);
                echo json_encode($sumArr);
            }
        } elseif($module=='user') {
            $rspString1 = getResponse('user manage user', 'show all', '', 0);
            $rspString2 = getResponse('user manage group', 'show all', '', 0);

            if(is_numeric($rspString1) && is_numeric($rspString2)) {
                echo '{"rows":[]}';
            } else {
                if(substr($rspString1, 0, 5) != 'error')
                    $userArr = parseResponseDatagrid($rspString1, 0);
                if(substr($rspString2, 0, 5) != 'error')
                    $userGroupArr = parseResponseDatagrid($rspString2, 0);

                if(!empty($userArr['rows']))
                    $sumArr = array_merge_recursive($sumArr, $userArr);
                if(!empty($userGroupArr['rows']))
                    $sumArr = array_merge_recursive($sumArr, $userGroupArr);
                echo json_encode($sumArr);
            }

        } else {
            $rspString = getResponse($module, $action, '', 0);
            if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                echo '{"rows":[]}';
            } else {
                echo parseResponseDatagrid($rspString);
            }
        }
    }

}

?>
