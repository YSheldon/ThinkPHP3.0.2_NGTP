<?php

namespace Home\Controller\Home;
use Think\Controller;
class InterviewControlController extends Controller {
    public function InterviewControl() {
        ?>
    <div class="module-half-body" id="InterviewControl_module">
        <div class="module">
            <div class="module-header">
                <div class="module-title">
                    <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                    <a href="javascript:void(0)" onclick="pageToMain('?c=Policy/Interview&a=control_show', 'Policy')"><?php echo L('ACCESS_CONTROL')?></a>
                </div>
                <div class="module-icon">
                    <span class="close-icon" onclick="closeModule('InterviewControl')"></span>
                </div>
                <div class="atuo_load_time">
                    <select id="interview_control_chat_data_type">
                        <option value="id"><?php echo L('STRATEGY_ID')?></option>
                        <option value="userid"><?php echo L('USER')?></option>
                        <option value="dst"><?php echo L('DST_ADDR')?></option>
                    </select>
                </div>
            </div>
            <div class="module-content">
                <div class='loading'>
                    <img src="/Public/images/image/loading2.gif" />
                </div>
                <div id="interview_control_chart_id" style="height:358px;display: block"></div>
                <div id="interview_control_chart_userid" style="height:358px;display: none"></div>
                <div id="interview_control_chart_dst" style="height:358px;display: none"></div>
            </div>
        </div>
        <script type="text/javascript">
            $(document).ready(function() {
                if ($.cookie('interview_control_chat_data_type'))
                    $('#interview_control_chat_data_type').val($.cookie('interview_control_chat_data_type'));
                createInterviewControlChart();
                $('#interview_control_chat_data_type').change(function() {
                    $.cookie('interview_control_chat_data_type', $('#interview_control_chat_data_type').val());
                    createInterviewControlChart();
                });
            });
            function createInterviewControlChart() {
                var data_type = $('#interview_control_chat_data_type').val();
                var str = "";
                if (data_type == 'id') {
                    $('#interview_control_chart_id').css({display:'block'});
                    $('#interview_control_chart_userid').css({display:'none'});
                    $('#interview_control_chart_dst').css({display:'none'});
                    str+='interview_control_chart_id';
                }
                if (data_type == 'userid') {
                    $('#interview_control_chart_id').css({display:'none'});
                    $('#interview_control_chart_userid').css({display:'block'});
                    $('#interview_control_chart_dst').css({display:'none'});
                    str+='interview_control_chart_userid';
                }
                if (data_type == 'dst') {
                    $('#interview_control_chart_id').css({display:'none'});
                    $('#interview_control_chart_userid').css({display:'none'});
                    $('#interview_control_chart_dst').css({display:'block'});
                    str+='interview_control_chart_dst';
                }
                var obj = document.getElementById(str);
                $("#interview_control_chart").html(" ");
                if ($.cookie('interview_control_chat_data_type')) {
                    $.ajax({
                        url: '?c=Home/InterviewControl&a=interviewControlData&data_type=' + $.cookie('interview_control_chat_data_type'),
                        timeout: 30000,
                        dataType: 'json',
                        success: function(data) {
                            removeLoading('InterviewControl');
                            if (data == "no") {
                                $('#'+str).html($LANG.NO_DATA);
                                return false;
                            } else {
                                initEchartsBar(data, data_type,obj,"","");
                            }
                        }
                    });
                } else {
                    $.ajax({
                        url: '?c=Home/InterviewControl&a=interviewControlData&data_type=' + data_type,
                        timeout: 30000,
                        dataType: 'json',
                        success: function(data) {
                            removeLoading('InterviewControl');
                            if (data == "no") {
                                $('#'+str).html($LANG.NO_DATA);
                                return false;
                            } else {
                                initEchartsBar(data, data_type,obj,"","");
                            }
                        }
                    });
                }
            }
        </script>
    </div>
    <?php
    }
    public function interviewControlData() {
        $data_type = $_REQUEST['data_type']?trim($_REQUEST['data_type']):"id";
        $rspString = getResponse("firewall policy", "show", '', 0);
        $rspString =  parseResponseDatagrid($rspString,0);
        $tmparr = array();
        $x = array();
        $series = array();
        if ($rspString['rows']['id']) {
            $tmparr[$rspString['rows'][$data_type]] = $rspString['rows']['deny_session_num'];
        } else {
            foreach ($rspString['rows'] as $val) {
                if ($val[$data_type]) {
                    if (array_key_exists($val[$data_type], $tmparr)) {
                        $tmparr[$val[$data_type]] += $val['deny_session_num'];
                    } else {
                        $tmparr[$val[$data_type]] = $val['deny_session_num'];
                    }
                }
            }
        };
        arsort($tmparr);
        if (is_array($tmparr) && $tmparr) {
            $num = 0;
            foreach ($tmparr as $k => $v) {
                $x[] = $k;
                $series[] = $v?$v:0;
                $num++;
                if ($num == 10) {
                    break;
                }
            }
            $data['category'] = $x;
            $data['series'] = $series;
            echo json_encode($data);
        } else {
            echo json_encode("no");
        }
    }
}
?>