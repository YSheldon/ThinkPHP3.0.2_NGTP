<?php

namespace Home\Controller\Home;
use Think\Controller;
class ConfigLogController extends Controller {
    public function ConfigLog() {
?>
    <div class="module-full-body" id="ConfigLog_module">
        <div class="module">
            <div class="module-header">
                <div class="module-title">
                    <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                    <a href="javascript:void(0)" onclick="pageToMain('?c=System/Journal&a=audti_log_show', 'system')"><?php echo L('CONFIGURATION_LOG')?></a>
                </div>
                <div class="module-icon">
                    <span class="close-icon" onclick="closeModule('ConfigLog')"></span>
                </div>
                <div class="atuo_load_time"></div>
            </div>
            <div class="module-content">
                <table id="config_log_table"></table>
            </div>
        </div>
    <script type="text/javascript">
        $('#config_log_table').datagrid({
            striped: true,
            border:true,
            rownumbers: true,
            height: 310,
            nowrap: false,
            pagination: true,
            pageSize: 20,
            pageList: [20, 50, 100],
            url: '?c=Home/ConfigLog&a=configLogData',
            columns: [[
                {field: 'version', title: $LANG.VERSION_NUM,width:50,fixed:true},
                {field: 'dev', title: $LANG.DEVICE,width:80,fixed:true},
                {field: 'time', title: $LANG.TIME,width:150,fixed:true},
                {field: 'format_msg', title: $LANG.INFORMATION,fixed:true}
            ]],
            onLoadSuccess:function() {
                $('#config_log_table').datagrid('fixRownumber');
            }
        });
    </script>
    </div>
<?php
    }
    public function configLogData() {
        $vsysid = intval(getVsid());
        $page = $_REQUEST['page'] ? intval($_REQUEST['page']) : 1;
        $pagesize = $_REQUEST['rows'] ? intval($_REQUEST['rows']) : 20;
        $page = ($page - 1) < 0 ? 0 : ($page - 1) * $pagesize;
        $objtable = M('mgmt_table','','DB_NGTOS_LOG');
        if($objtable){
            $sql = "select version,time,dev,format_msg from " . tablename('log') . " where vsid = " . $vsysid . " and recorder = 'config' order by time desc limit " . "$page,$pagesize";
            $sql_count = "select version,time,dev,format_msg from " . tablename('log') . " where vsid = " . $vsysid . " and recorder = 'config'";
            $arr = $objtable->query($sql);
            $logs = array();
            foreach ($arr as $key => $val) {
                $logs[$key]['version'] = $val['version'];
                $logs[$key]['time'] = $val['time'];
                $logs[$key]['dev'] = $val['dev'];
                $logs[$key]['format_msg'] = $val['format_msg'];
            }
            $tmparr['rows'] = $logs;
            $count = $objtable->query($sql_count);
            $tmparr['total'] = count($count);
            echo json_encode($tmparr);
        }
    }
}
?>