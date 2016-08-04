<?php
namespace Home\Controller\Monitor;
use Think\Controller;
class InterfaceController extends Controller {
    public function interface_flow(){
        require_once APP_PATH . 'Home/Common/menupage.php';
        $this->display('/Default/monitor_interface_flow');
    }

    public function monitor_interface_flow(){
        $page = $_REQUEST['page'] ? intval($_REQUEST['page']) : 1;
        $pagesize = $_REQUEST['rows'] ? intval($_REQUEST['rows']) : 20;
        $page = ($page - 1) < 0 ? 0 : ($page - 1) * $pagesize;
        $time = $_REQUEST['time'] ? trim($_REQUEST['time']) : '5minute';
        $where = get_date_extent($time);
        $objtable = M(tablename('link',$time));
        $filed = 'name,visittime, sum(upbytes) as upbytes,sum(downbytes) as downbytes,sum(upbytes+downbytes) as totalbytes';
        $link_flow = array();
        if($time == '5minute' ||  $time == "hour" || $time == "dayBefore" || $time == "weekBefore" || $time == "monthBefore" || $time == "user_defined"){
            $link_flow = $objtable->field($filed)->where($where)->group('name')->order('totalbytes desc')->limit($page,$pagesize)->select();
            $count = $objtable->field($filed)->where($where)->group('name')->select();
        }elseif($time == 'day'){
            $sql1 = "select $filed from " . tablename('link','hour') . " where ". get_date_extent('hour') ." group by name ";
            $sql2 = "select $filed from " . tablename('link',$time) . " where ". get_date_extent($time) ." group by name ";
            $sql = "select $filed from (($sql1) union ($sql2))t group by name order by totalbytes desc limit $page, $pagesize";
            $link_flow = $objtable->query($sql);
            $count = $objtable->query("select $filed from (($sql1) union ($sql2))t group by name");
        }elseif($time == 'week' || $time == "month"){
            $sql1 = "select $filed from " . tablename('link','hour') . " where ". get_date_extent('hour') ." group by name ";
            $sql2 = "select $filed from " . tablename('link','day') . " where ". get_date_extent('day') ." group by name ";
            $sql3 = "select $filed from " . tablename('link',$time) . " where ". get_date_extent($time) ." group by name ";
            $sql = "select $filed from (($sql1) union ($sql2) union ($sql3))t group by name order by totalbytes desc limit $page, $pagesize";
            $link_flow = $objtable->query($sql);
            $count = $objtable->query("select $filed from (($sql1) union ($sql2) union ($sql3))t group by name");
        }else{
            exit('非法操作数据');
        }
        foreach ($link_flow as $key => $val) {
            if (strpos($val['name'], 'mv') >= 0) {
                $rspString = getResponse("network macvif", "show", array('single' => $val['name']), 0);
                $interface_info = parseResponseDatagrid($rspString,0);
                $link_flow[$key]['link_statu'] = $interface_info['rows'][0]['shutdown'] == 'enable' ? 'up' : 'down';
            } else if (strpos($val['name'], 'vlan') >= 0) {
                $vlanid = intval(substr($val['name'], strrpos($val['name'], '.') + 1));
                $rspString = getResponse("network vlan", "show", array('id' => $vlanid), 0);
                $interface_info = parseResponseDatagrid($rspString,0);
                $link_flow[$key]['link_statu'] = $interface_info['rows'][0]['state'] == 'active' ? 'up' : 'down';
            } else {
                $rspString = getResponse("network physicalinterface", "show", array('single' => $val['name']), 0);
                $interface_info = parseResponseDatagrid($rspString,0);
                $link_flow[$key]['link_statu'] = $interface_info['rows'][0]['link_status'];
            }
        }
        $tmp_arr['rows'] = $link_flow?$link_flow:array();
        $tmp_arr['total'] = count($count)>=100?100:count($count);
        echo json_encode($tmp_arr);
    }

    public function monitor_interface_chart(){
        $x = array();$series_upbytes = array();$series_downbytes = array();
        $interface_name =  $_REQUEST['interface_name'];
        //获取所有的接口
        $interfaceName = parseResponseDatagrid(getResponse("network physicalinterface", "show", '', 0), 0);
        $array = $interfaceName['rows'];
        $array_tmp = array();
        for ($i = 0; $i < count($array); $i++) {
            $array_tmp[] = "'" . $array[$i]['interface_name'] . "'";
        }
        if($interface_name){
            //判断得到的接口是否在数组中，如果不在数组中则退出
            if(!in_array("'" . $interface_name . "'", $array_tmp)){
                exit('参数不合法！');
            }
        }
        $time = $_REQUEST['time'] ? trim($_REQUEST['time']) : '5minute';
        $filed = "name,visittime,upbytes,downbytes";
        $objtable = M(tablename('link',$time));
        if($time == 'day'){
            $sql1 = "select $filed,sum(upbytes) as upbytes,sum(downbytes) as downbytes from " . tablename('link','hour') . " where ". get_date_extent('hour') ."and name = '".$interface_name."' order by visittime asc";
            $arr1_tmp = $objtable->query($sql1);
            $rspString_time = getResponse("system time", "show", "", 0);
            $rspString_time = parseResponseDatagrid($rspString_time,0);
            $visittime = $rspString_time['rows'][0]["clock"];
            $arr1[] = array('name'=>$arr1_tmp[0]['name'],'visittime'=>$visittime ,'upbytes'=>$arr1_tmp[0]['upbytes'],'downbytes'=>$arr1_tmp[0]['downbytes']);
            $sql2 = "select $filed from " . tablename('link',$time) . " where ". get_date_extent($time) ."and name = '".$interface_name."' order by visittime asc";
            $arr2 = $objtable->query($sql2);
            $arr = array_merge($arr2,$arr1);
            $end_arr = end($arr);
            if(!$end_arr['upbytes'] && !$end_arr['downbytes']){
                array_pop($arr);
            }
        }else if($time == 'week' || $time == 'month'){
            $sql1 = "select $filed,sum(upbytes) as upbytes,sum(downbytes) as downbytes from " . tablename('link','hour') . " where ". get_date_extent('hour') ."and name = '".$interface_name."'";
            $arr1 = $objtable->query($sql1);
            $sql2 = "select $filed,sum(upbytes) as upbytes,sum(downbytes) as downbytes from " . tablename('link','day') . " where ". get_date_extent('day') ."and name = '".$interface_name."'";
            $arr2 = $objtable->query($sql2);
            $name = $arr2[0]['name'];
            $visittime = $arr1[0]['visittime'];
            $upbytes = $arr1[0]['upbytes']+$arr2[0]['upbytes'];
            $downbytes = $arr1[0]['downbytes']+$arr2[0]['downbytes'];
            $arr_tmp1[] = array('name'=>$name,'visittime'=>$visittime,'upbytes'=>$upbytes,'downbytes'=>$downbytes);
            $sql3 = "select $filed from " . tablename('link',$time) . " where ". get_date_extent($time) ."and name = '".$interface_name."' order by visittime asc";
            $arr3 = $objtable->query($sql3);
            $arr = array_merge($arr3,$arr_tmp1);
            $end_arr = end($arr);
            if(!$end_arr['upbytes'] && !$end_arr['downbytes']){
                array_pop($arr);
            }
        }else{
            $arr = $objtable->field($filed)->where(get_date_extent($time) ." and name = '" . $interface_name . "'")->order('visittime asc')->select();
        }
        $sql_data = $objtable->field("max(upbytes) as upbytes,max(downbytes) as downbytes")->where(get_date_extent($time) . " and name = '" . $interface_name . "'")->order('visittime asc')->select();
        $upbytes_tmp = $sql_data[0]['upbytes'];
        $downbytes_tmp = $sql_data[0]['downbytes'];

        $str = $upbytes_tmp > $downbytes_tmp ? $upbytes_tmp : $downbytes_tmp;
        $unit = get_unit_interface_name($str, $time);
        if ($arr) {
            if ($time == 'user_defined') {
                $start_time = $_REQUEST['start_time'] ? trim($_REQUEST['start_time']) : '';
                $end_time = $_REQUEST['end_time'] ? trim($_REQUEST['end_time']) : '';
                $time_tmp = get_user_defined($start_time, $end_time);
                $time_tmp = $time_tmp == '' ? 'minute' : $time_tmp;
            }
            for ($i = 0; $i <= count($arr) - 1; $i++) {
                if ($time == "week" || $time == "month" || $time == "weekBefore" || $time == "monthBefore") {
                    $x[] = date("Y-m-d", strtotime($arr[$i]['visittime']));
                } else {
                    $x[] = date("H:i:s", strtotime($arr[$i]['visittime']));
                }
                if ($time == "user_defined" && $arr[$i]['upbytes'] != null) {
                    $series_upbytes[] = format_flow_data_sl($arr[$i]['upbytes'], $unit, $time_tmp);
                } elseif ($time !== "user_defined" && $arr[$i]['upbytes'] != null) {
                    $series_upbytes[] = format_flow_data_sl($arr[$i]['upbytes'], $unit, $time);
                }
                if ($time == "user_defined" && $arr[$i]['downbytes'] != null) {
                    $series_downbytes[] = format_flow_data_sl($arr[$i]['downbytes'], $unit, $time_tmp);
                } elseif ($time !== "user_defined" && $arr[$i]['downbytes'] != null) {
                    $series_downbytes[] = format_flow_data_sl($arr[$i]['downbytes'], $unit, $time);
                }
            }

            $data['category'] = $x;
            $data['series1'] = $series_upbytes;
            $data['series2'] = $series_downbytes;
            $data['unit'] = $unit;
            echo json_encode($data);
        } else {
            $interface_data["data"] = "no";
        }
    }

    public function interfaceExportData(){
        vendor("PHPExcel180.PHPExcel");
        $time = $_POST['time'] ? trim($_POST['time']) : '5minute';
        $where = get_date_extent($time);
        $objtable = M(tablename('link',$time));
        $filed = 'name,visittime, sum(upbytes) as upbytes,sum(downbytes) as downbytes,sum(upbytes+downbytes) as totalbytes';
        $link_flow = array();
        if($time == '5minute' ||  $time == "hour" || $time == "dayBefore" || $time == "weekBefore" || $time == "monthBefore" || $time == "user_defined"){
            $link_flow = $objtable->field($filed)->where($where)->group('name')->order('totalbytes desc')->select();
            $count = $objtable->field($filed)->where($where)->group('name')->select();
        }elseif($time == 'day'){
            $sql1 = "select $filed from " . tablename('link','hour') . " where ". get_date_extent('hour') ." group by name ";
            $sql2 = "select $filed from " . tablename('link',$time) . " where ". get_date_extent($time) ." group by name ";
            $sql = "select $filed from (($sql1) union ($sql2))t group by name order by totalbytes desc";
            $link_flow = $objtable->query($sql);
            $count = $objtable->query("select $filed from (($sql1) union ($sql2))t group by name");
        }elseif($time == 'week' || $time == "month"){
            $sql1 = "select $filed from " . tablename('link','hour') . " where ". get_date_extent('hour') ." group by name ";
            $sql2 = "select $filed from " . tablename('link','day') . " where ". get_date_extent('day') ." group by name ";
            $sql3 = "select $filed from " . tablename('link',$time) . " where ". get_date_extent($time) ." group by name ";
            $sql = "select $filed from (($sql1) union ($sql2) union ($sql3))t group by name order by totalbytes desc";
            $link_flow = $objtable->query($sql);
            $count = $objtable->query("select $filed from (($sql1) union ($sql2) union ($sql3))t group by name");
        }
        foreach ($link_flow as $key => $val) {
            if (strpos($val['name'], 'mv') >= 0) {
                $rspString = getResponse("network macvif", "show", array('single' => $val['name']), 0);
                $interface_info = parseResponseDatagrid($rspString,0);
                $link_flow[$key]['link_statu'] = $interface_info['rows'][0]['shutdown'] == 'enable' ? 'up' : 'down';
            } else if (strpos($val['name'], 'vlan') >= 0) {
                $vlanid = intval(substr($val['name'], strrpos($val['name'], '.') + 1));
                $rspString = getResponse("network vlan", "show", array('id' => $vlanid), 0);
                $interface_info = parseResponseDatagrid($rspString,0);
                $link_flow[$key]['link_statu'] = $interface_info['rows'][0]['state'] == 'active' ? 'up' : 'down';
            } else {
                $rspString = getResponse("network physicalinterface", "show", array('single' => $val['name']), 3);
                $interface_info = parseResponseDatagrid($rspString,0);
                $link_flow[$key]['link_statu'] = $interface_info['rows'][0]['link_status'];
            }
        }

        $headArr=array("name","visittime","upbytes","downbytes","totalbytes","link_statu");
        $date = date("Y_m_d-H:i:s",time());
        $fileName .= "{$date}.xls";
        getExcel($fileName,$headArr,$link_flow,'�ӿ�����������Ϣ');
    }
}
?>