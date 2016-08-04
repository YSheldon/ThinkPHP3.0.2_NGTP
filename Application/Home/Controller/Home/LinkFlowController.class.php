<?php

namespace Home\Controller\Home;
use Think\Controller;
class LinkFlowController extends Controller {
    public function LinkFlow() {
        $rspString = getResponse("network interfaces", "show", '', 0);
        $interfaces = parseResponseDatagrid($rspString, 0);
        /*$interfaces = $interfaces['rows'];
        $vsysid = intval(getVsid());
        if ($vsysid != 0 && $_SESSION['username'][AUTH_ID] != 'superman') {
            foreach ($interfaces as $key => $value) {
                if ($value['vsy_id'] != $vsysid) {
                    unset($interfaces[$key]);
                }
            }
        }*/
        ?>
        <div class="module-full-body" id="LinkFlow_module">
            <div class="module">
                <div class="module-header">
                    <div class="module-title">
                        <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                        <a href="javascript:void(0)"><?php echo L('LINK_TRAFFIC')?></a>
                    </div>
                    <div class="module-icon">
                        <span class="close-icon" onclick="closeModuleInterval('LinkFlow')"></span>
                    </div>
                    <div class="atuo_load_time">
                        <select id="link_flow_interface">
                            <option value="0"><?php echo L('SELECT_A_INTERFACE')?></option>
                            <?php
                            foreach ($interfaces['rows'] as $value) {
                                echo '<option value="' . $value['dev'] . '">' . $value['dev'] . '</option>';
                            }
                            ?>
                        </select>
                    </div>
                </div>
                <div class="module-content">
                    <div style="height:330px;padding-left:10px;padding-top:10px" id="link_flow"></div>
                </div>
            </div>
            <script type="text/javascript">
                $(document).ready(function() {
                    var interface_name = $("#link_flow_interface").val();
                    $.ajax({
                        url: '?c=Home/LinkFlow&a=linkFlowData&interface_name=' + interface_name,
                        type: 'POST',
                        timeout: 30000,
                        dataType: 'json',
                        success: function(data) {
                            initEchartsLinkFlow(data, document.getElementById('link_flow'), interface_name);
                        }
                    })
                    $('#link_flow_interface').change(function() {
                        var interface_name = $("#link_flow_interface").val();
                        window.clearInterval(LinkFlow_interval);
                        $.ajax({
                            url: '?c=Home/LinkFlow&a=linkFlowData&interface_name=' + interface_name,
                            type: 'POST',
                            timeout: 30000,
                            dataType: 'json',
                            success: function(data) {
                                initEchartsLinkFlow(data, document.getElementById('link_flow'), interface_name);
                            }
                        })
                    })
                })
            </script>
        </div>        
    <?php
    }
    public function linkFlowData() {
        //获取系统时间
        $rspString_time = parseResponseDatagrid(getResponse("system time", "show", '', 0), 0);
        $system_time = strtotime($rspString_time['rows']["date"] . ' ' . $rspString_time['rows']["clock"]) - (8*60*60);
        //物理接口名称‘以,链接的字符串’
        $interface_name = $_REQUEST['interface_name'] ? $_REQUEST['interface_name'] : '';
        $interfaceName = parseResponseDatagrid(getResponse("network physicalinterface", "show", '', 0), 0);
        $array = $interfaceName['rows'];
        $array_tmp = array();
        for ($i = 0; $i < count($array); $i++) {
            $array_tmp[] = "'" . $array[$i]['interface_name'] . "'";
        }
        $interface_name_tmp = implode(',', $array_tmp);
        $objtable = M(tablename('link'));
        $filed = "sum(upbytes+downbytes) as sum,visittime";
        $fileds = 'name,visittime,upbytes,downbytes';
        //查询接口信息，并且放到一个数组中
        $interfaceNameSelect = parseResponseDatagrid(getResponse("network interfaces", "show", '', 0), 0);
        $array_select = $interfaceNameSelect['rows'];
        $array_tmp_select = array();
        for ($i = 0; $i < count($array_select); $i++) {
            $array_tmp_select[] = "'" . $array_select[$i]['dev'] . "'";
        }
        if ($interface_name) {
//            判断得到的接口是否在数组中，如果不在数组中则退出
                if(!in_array("'" . $interface_name . "'", $array_tmp_select)){
                exit('参数不合法！');
            }
            //unit
            $unit_tmp = $objtable->field($filed)->where(" name = '" . $interface_name . "'")->group('visittime')->order('visittime desc')->limit(50)->select();
            $unit_arr = array();
            foreach ($unit_tmp as $k => $v) {
                $unit_arr[] = $unit_tmp[$k]['sum'];
            }
            asort($unit_arr);
            $unit = get_flow_unit_sl(end($unit_arr));
            //获取最新时间
            $first_time = $unit_tmp[0]['visittime'];
            //最新一条记录
            $arr = $objtable->field($fileds)->where(" name = '" . $interface_name . "'")->order('visittime desc')->limit(1)->select();
        } else {
            //unit
            $unit_tmp = $objtable->field($filed)->where(" name in (" . $interface_name_tmp . ")")->group('visittime')->order('visittime desc')->limit(50)->select();
            $unit_arr = array();
            foreach ($unit_tmp as $k => $v) {
                $unit_arr[] = $unit_tmp[$k]['sum'];
            }
            asort($unit_arr);
            $unit = get_flow_unit_sl(end($unit_arr));
            //获取最新时间
            $first_time = $unit_tmp[0]['visittime'];
            //最新一条记录
            $arr = $objtable->field('visittime,sum(upbytes) as upbytes,sum(downbytes) as downbytes')->where("name in(" . $interface_name_tmp . ") and visittime = (select visittime from link_flow_detail_vsys0_tb order by visittime desc limit 1)")->group('visittime')->select();
        }
        $data1 = array();
        $data2 = array();
        $category = array();
        $diff = $system_time - strtotime($first_time);
        if ($diff > 60 || $diff < -60 || !$interface_name) {
            $data1[] = 0;
            $data2[] = 0;
            $category[] = date('H:i:s', $system_time);
        } else {
            $t = $objtable->field('visittime')->group('visittime')->order('visittime desc')->limit(2)->select();
            $t1 = $t[0]['visittime'];
            $t2 = $t[1]['visittime'];
            $tt_tmp = strtotime($t1) - strtotime($t2);
            if (($system_time - strtotime($t1)) >= 5) {
                $category[0] = date("H:i:s", $system_time);
            } else {
                $category[0] = date("H:i:s", strtotime($t1));
            }
            if ($tt_tmp > 5) {
                $category[0] = date("H:i:s", $system_time);
                $data1[] = format_flow_data_sl(($arr[0]['upbytes'] / $tt_tmp * 5), $unit);
                $data2[] = format_flow_data_sl(($arr[0]['downbytes'] / $tt_tmp * 5), $unit);
            } else {
                $category[0] = date("H:i:s", strtotime($t1));
                $data1[] = format_flow_data_sl($arr[0]['upbytes'], $unit);
                $data2[] = format_flow_data_sl($arr[0]['downbytes'], $unit);
            }
        }
        $data['unit'] = $unit;
        $data['category'] = $category;
        $data['data1'] = $data1;
        $data['data2'] = $data2;
        echo json_encode($data);
    }
}
?>