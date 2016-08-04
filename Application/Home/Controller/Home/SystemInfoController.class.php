<?php

namespace Home\Controller\Home;
use Think\Controller;
class SystemInfoController extends Controller {
    public function SystemInfo() {
        ?>
        <div class="module-half-body" id="SystemInfo_module">
            <div  class="module">
                <div class="module-header">
                    <div class="module-title">
                        <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                        <a href="javascript:void(0)" onclick="pageToMain('?c=System/Info&a=infoShow', 'system')"><?php echo L('SYS_INFO');?></a>
                    </div>
                    <div class="module-icon">
                        <span class="close-icon"  onclick="closeModule('SystemInfo')"></span>
                    </div>
                    <div class="atuo_load_time"></div>
                </div>
                <div class="module-content">
                    <div class="loading">
                        <img src="/Public/images/image/loading2.gif">
                    </div>
                    <table id="system_info_module_content" width="100%" class="ngtos_form_table" style="display: none">
                        <tbody>
                           <if condition=" $vsys_route eq '1'">
                            <tr class="no">
                                <td align="right"><?php echo L('PRODUCT_TYPE')?></td>
                                <td align="left"><div id="system_info_model"></div></td>
                            </tr>
                            <tr class="no">
                                <td align="right"><?php echo L('PRODUCT_SERIAL_NUMBER')?></td>
                                <td align="left"><div id="system_info_series"></div></td>
                            </tr>
                           </if>
                            <tr>
                                <td align="right"><?php echo L('OPERATING_SYSTEM')?></td>
                                <td align="left"><div>NGTOS</div></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo L('SOFTWARE_VERSION')?></td>
                                <td align="left"><div id="system_info_version"></div></td>
                            </tr>
                            <tr class="no_conf">
                                <td align="right"><?php echo L('LICENSE_VERSION_NUMBER')?></td>
                                <td align="left"><div id="system_info_licence"></div></td>
                            </tr>
                            <tr class="no">
                                <td align="right"><?php echo L('SYSTEM_NAME')?></td>
                                <td  align="left"><div id="system_info_systemname"></div></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo L('TERMINAL_TIMEOUT')?></td>
                                <td align="left"><div id="system_info_outtime"></div></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo L('SYS_TIME')?></td>
                                <td align="left"><div id="system_info_time"></div></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo L('SYS_RUN_TIME')?></td>
                                <td align="left"><div id="system_info_runtime"></div></td>
                            </tr>
                            <tr id="tryout" style="display:none">
                                <td align="right"><?php echo L('LEASE_TIME')?></td>
                                <td align="left"><div id="system_info_tryout"></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        <script type="text/javascript">
            $(document).ready(function() {
                $.ajax({
                    url: '?c=Home/SystemInfo&a=systemData',
                    type: 'POST',
                    timeout: 30000,
                    dataType: 'json',
                    success: function(data) {
                        $('#SystemInfo_module').find('.loading').remove();
                        if (data == null || data == '') {
                            $('#SystemInfo_module').find('.module-content').html('没有数据！');
                            return false;
                        }
                        if (data.vsys_route !='1') {
                            $('.no').hide();
                        }
                        if (data.vsys_route !='1' && data.conf =="0") {
                            $('.no_conf').hide();
                        }
                        $('#system_info_module_content').show();
                        $('#system_info_model').html(data.product_model);
                        $('#system_info_series').html(data.product_sn);
                        if (data.superman == "no") {
                            $('#system_info_version').html(data.tos_version);
                        } else
                            $('#system_info_version').html(data.tos_version+'<span style="padding-left: 10px">[<a href="?c=System/Upload&a=upload_file">'+$LANG.UPGRADE+'</a>]</span>');
                        $('#system_info_licence').html(data.license_version);
                        $('#system_info_systemname').html(data.devname);
                        if (data.superman == "no") {
                            $('#system_info_outtime').html(data.timout_webui);
                        } else
                            $('#system_info_outtime').html(data.timout_webui+'<span style="padding-left: 10px">[<a href="?c=System/Parameters&a=parameters_edit">'+$LANG.CONFIG+'</a>]</span>');
                        var rst_strto_time = jsStrtoTime(data.date + ' ' + data.clock);
                        var rst_date_time = jsDateTime(rst_strto_time);
                        if (data.superman == "no") {
                            $('#system_info_time').html(data.timezone + ' ' + rst_date_time);
                        } else
                        $('#system_info_time').html(data.timezone + ' ' + rst_date_time+'<span style="padding-left: 10px">[<a href="?c=System/Time&a=system_time_edit">'+$LANG.CONFIG+'</a>]</span>');
                            if (data.uptime) {
                            var str = data.uptime;
                            var time_arr = str.split("-");
                            var tmp = "";
                            var tmp_day = time_arr[0] ? time_arr[0] : "0";
                            var tmp_hour = time_arr[1] ? time_arr[1] : "0";
                            var tmp_minute = time_arr[2] ? time_arr[2] : "0";
                            var tmp_second = time_arr[3] ? time_arr[3] : "0";
                            if (tmp_day !== "0") {
                                if (tmp_day == 1) {
                                    tmp += tmp_day + ' day, ';
                                } else {
                                    tmp += tmp_day + ' days, ';
                                }
                            }
                            if (tmp_second < 10 || tmp_second == "0") {
                                tmp_second = "0" + tmp_second;
                            }
                            tmp += tmp_hour + ":" + tmp_minute + ":" + tmp_second;
                            $('#system_info_runtime').html(tmp);
                        }
                        setInterval(function() {
                            rst_strto_time += 1;
                            var rst_date_time = jsDateTime(rst_strto_time);
                            if (data.superman == "no") {
                                $('#system_info_time').html(data.timezone + ' ' + rst_date_time);
                            } else
                                $('#system_info_time').html(data.timezone + ' ' + rst_date_time+'<span style="padding-left: 10px">[<a href="?c=System/Time&a=system_time_edit">'+$LANG.CONFIG+'</a>]</span>');
                            tmp_second++;
                            if (tmp_second == 60) {
                                tmp_minute++;
                                tmp_second = "0";
                            }
                            if (tmp_minute == 60) {
                                tmp_hour++;
                                tmp_minute = "0";
                            }
                            if (tmp_hour == 24) {
                                tmp_day++;
                                tmp_hour = "0";
                            }
                            if (tmp_second < 10) {
                                tmp_second = "0" + tmp_second;
                            }
                            var tmp_str = tmp_day + '-' + tmp_hour + '-' + tmp_minute + '-' + tmp_second;
                            var runtime = handleRuntime(tmp_str);
                            $('#system_info_runtime').html(runtime);
                        }, 1000);
                        if (data.tryout != "none") {
                            $('#tryout').show();
                            var len = data.tryout.length;
                            if(len > 12){
                                var show = "<div class='red'>"+data.tryout+"</div>";
                                $('#system_info_tryout').html(show);
                            }else{
                                $('#system_info_tryout').html(data.tryout);
                            }
                        }
                    }
                })
            })
        </script>
        </div>
        <?php
    }
    public function systemData() {
        //权限判断
        $vsys_route = rootVsys();
        $conf = getPrivilege("device-maintenance");
        $allshow = array(
            'modules' => array(
                'system product',
                'system product',
                'system version',
                'system license',
                'system devname',
                'system webui',
                'system time',
                'system uptime'
            ),
            'action' => array(
                'model',
                'sn',
                '',
                'version',
                'show',
                'show',
                'show',
                ''
            ),
            'backcome' => array(
                'product_model',
                'product_sn',
                'tos_version',
                'license_version',
                'devname',
                'timout_webui',
                'time',
                'uptime'
            )
        );
        $qq = count($allshow['modules']);
        for ($i = 0; $i < count($allshow['modules']); $i++) {
             if ($i == 0 || $i == 1 || $i == 4) {
                if ($vsys_route =="1") {
                    $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], $param, 1));
                    $backcome = $allshow['backcome'][$i];
                    $outcome[$backcome] = $rspString[$i][$backcome];
                }
            }
            else if($i==3) {
                if ($vsys_route=="1" && $conf=="1") {
                    $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], $param, 1));
                    $backcome = $allshow['backcome'][$i];
                    $outcome[$backcome] = $rspString[$i][$backcome];
                }
            } else if($i == 2 || $i == 6 || $i == 7) {
                $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], $param, 1));
                $backcome = $allshow['backcome'][$i];
                if ($backcome == 'time') {
                    $outcome['timezone'] = $rspString[$i]['timezone'];
                    $outcome['date'] = $rspString[$i]['date'];
                    $outcome['clock'] = $rspString[$i]['clock'];
                }         
                $outcome[$backcome] = $rspString[$i][$backcome];
            } else {
                $rspString[$i] = parseResponse(getResponse($allshow['modules'][$i], $allshow['action'][$i], $param, 1));
                $backcome = $allshow['backcome'][$i];
                $outcome[$backcome] = $rspString[$i][$backcome];
            }
        }
        $tryout = getLicenseValue("DEVICE_TRY_EXPIRE", 0);
        if ($tryout != '' && $tryout != null && $tryout != '(null)' && $tryout != 0) {
            $rsp = getResponse("system trytime", "", "", 0);
            $ret = parseResponse($rsp);
            $outcome['tryout'] = $ret['days'];
        } else {
            $outcome['tryout'] = "none";
        }
        if (getPrivilege("global") == 1) {
            $outcome['conf_global'] = 'ok';
        } else {
            $outcome['conf_global'] = 'none';
        }
        $outcome['vsys_route'] = $vsys_route;
        $outcome['conf'] = $conf;
        $vsys_name = isVrAdmin();
        $outcome['superman'] = $vsys_name == 1?'no':'ok';
        echo json_encode($outcome);
    }
}
?>