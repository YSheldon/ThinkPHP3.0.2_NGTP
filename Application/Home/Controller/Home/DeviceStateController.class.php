<?php

namespace Home\Controller\Home;
use Think\Controller;
class DeviceStateController extends Controller {
    public function DeviceState() {
        ?>
<div class="module-half-body" id="DeviceState_module">
    <div class="module">
        <div class="module-header">
            <div class="module-title">
                <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                <a href="javascript:void(0)"><?echo L('DEVICE_STATE')?></a>
            </div>
            <div class="module-icon">
                <span class="close-icon" onclick="closeModuleInterval('DeviceState')"></span>
            </div>
            <div class="atuo_load_time"></div>
        </div>
        <div class="module-content">
            <br/>
            <div class="contents" style="margin-left: 5px">
                <div id="device_state_cpu" style="width: 33%; height: 250px; float: left;"></div>
                <div id="device_state_mem" style="width: 33%; height: 250px; float: left;"></div>
                <div id="device_state_disk" style="width: 33%; height: 250px; float: left;"></div>
            </div>
            <div id="device_link_info" class="contents" style="clear:both; display:none;text-align: center">
                <?php echo L('CURRENT_NUMBER_OF_CONNECTIONS')?> <span id="current_link_num"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <?php echo L('NEW_CONNECTION_RATE')?> <span id="new_link_speed"/>
            </div>
            <script>
                var DeviceState_interval;
                $(document).ready(function() {
                    renderGaugeChartData();
                    setLinkInfo();
                    DeviceState_interval = setInterval(function() {
                        renderGaugeChartData();
                        setLinkInfo();
                    }, 5000*4);
                });
                function renderGaugeChartData() {
                    renderGaugeChart(document.getElementById('device_state_cpu'), $LANG.CPU_USE,'cpu');
                    renderGaugeChart(document.getElementById('device_state_mem'),$LANG.MEMORY_USAGE ,'mem');
                    renderGaugeChart(document.getElementById('device_state_disk'),$LANG.DISK_USAGE,'disk');
                }
                function setLinkInfo() {
                    $.ajax({
                        url: '?c=Home/DeviceState&a=deviceLinkInfo',
                        type: 'POST',
                        timeout: 3000,
                        dataType: 'json',
                        success: function(data) {
                            if (data == null || data == '') {
                                return false;
                            } else {
                                $('#current_link_num').html(data.total_sessions);
                                $('#new_link_speed').html(data.rate);
                                $('#device_link_info').show();
                            }
                        }
                    });
                }
            </script>
        </div>
    </div>
</div>
<?php
}
    public function deviceLinkInfo() {
        $param['__NA__'] = 'rate';
        $rspString = getResponse("network session", "show", $param, 0);
        $rspString = parseResponseDatagrid($rspString,0);
        if (is_numeric($rspString) || substr($rspString, 0, 5) == "error") {
            echo '';
        } else {
            $array['total_sessions'] = $rspString['rows'][0]['total_sessions'];
            $array['rate'] = $rspString['rows'][0]['rate'];
            echo json_encode($array);
        }
    }
    public function deviceStateData() {
        $rspString = getResponse("system utilization", "cpu", "", 0);
        $rspString = parseResponse($rspString);
        $cpu_used = $rspString['cpu']?$rspString['cpu']:0;
        $rspString = getResponse("system utilization", "", "", 0);
        $rspString = parseResponse($rspString,0);
        $mem_used = $rspString['mem']?$rspString['mem']:0;
        $disk_used = $rspString['disk']?$rspString['disk']:0;
        $array = array('cpu_used' => round($cpu_used), 'mem_used' => round($mem_used), 'disk_used' => round($disk_used));
        echo json_encode($array);
    }
}
?>