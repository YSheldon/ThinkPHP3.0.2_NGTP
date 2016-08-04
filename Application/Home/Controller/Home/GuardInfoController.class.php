<?php

namespace Home\Controller\Home;
use Think\Controller;
class GuardInfoController extends Controller {
    public function GuardInfo() {
        ?>
        <div class="module-half-body" id="GuardInfo_module">
            <div  class="module">
                <div class="module-header">
                    <div class="module-title">
                        <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                        <a href="javascript:void(0)" onclick="pageToMain('?c=System/Guard&a=info_show', 'guard')"><?php echo L('CLOUD_DETECTION_STATE');?></a>
                    </div>
                    <div class="module-icon">
                        <span class="close-icon"  onclick="closeModule('GuardInfo')"></span>
                    </div>
                    <div class="atuo_load_time">
                        <img onclick="refreshGuard();" src="/Public/plugins/easyui/themes/icons/reload.png" title="<?php echo L('REFRESH')?>">
                    </div>
                </div>
                <div class="module-content">
                    <div class="loading">
                        <img src="/Public/images/image/loading2.gif">
                    </div>
                    <table id="guard_info_module_content" width="100%" class="ngtos_form_table" style="display: none">
                        <tbody>
                            <tr>
                                <td align="right" style="width:220px;">&nbsp;</td>
                                <td align="left">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="right" style="width:220px;"><?php echo L('CURRENT_RUNNING_STATE')?></td>
                                <td align="left">
                                    <span id="isStatus"></span>&nbsp;&nbsp;
                                    <a href="javascript:void(0)" onclick="pageToMain('?c=System/Guard&a=info_show', 'guard')">[<?php echo L('CONFIG');?>]</a>&nbsp;&nbsp;
                                    <a id="startDev" href="javascript:void(0)" onclick="startDev()">[<?php echo L('LAUNCH');?>]</a>
                                </td>
                            </tr>
                            <tr>
                                <td align="right" style="width:220px;"><?php echo L('DEVICE_STATE')?></td>
                                <td align="left">
                                    <span id="guard_update"></span>&nbsp;&nbsp;
                                    <a id="download_new" href="javascript:void(0)" onclick="downloadNew(this)" style="color:#00EE00;">[下载]</a>&nbsp;&nbsp;
                                    <a id="detall_show" href="javascript:void(0)" onclick="detallShow(this)">[<?php echo L('DETAIL');?>]</a>
                                </td>
                            </tr>
                            <tr>
                                <td align="right" style="width:220px;"><?php echo L('SERVER_STATUS')?></td>
                                <td align="left">
                                    <span id="guard_comm"></span>&nbsp;&nbsp;
                                    <a href="javascript:void(0)" onclick="nowConn()">[<?php echo L('TEST');?>]</a>
                                </td>
                            </tr>
                            <tr>
                                <td  align="right" style="width:220px;">&nbsp;</td>
                                <td align="left" id="guard_loading">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        <script type="text/javascript">
            $(document).ready(function() {
                $.ajax({
                    url: '?c=Home/GuardInfo&a=guardData',
                    type: 'POST',
                    timeout: 30000,
                    dataType: 'json',
                    success: function(data) {
                        $('#GuardInfo_module').find('.loading').remove();
                        if (data.length == 0) {
                            $('#GuardInfo_module').find('.module-content').html($LANG.NO_DATA);
                            return false;
                        }
                        $('#guard_info_module_content').show();
                        //当前运行状态
                        $('#isStatus').text(data.func == 'enable' ? $LANG.OPEN : $LANG.CLOSED);
                        if(data.func == 'enable') {
                            $('#startDev').hide();
                        } else {
                            $('#startDev').show();
                        }
                        //设备状态
                        if(data.url.length == 0) {
                            $('#guard_update').text($LANG.NO_UPDATE);
                            $('#guard_update').css('color','#4f6b72');
                            $('#download_new').hide();
                            $('#detall_show').hide();
                        } else {
                            $('#guard_update').text($LANG.NEW_UPDATE);
                            $('#guard_update').css('color', '#cc0000');
                            $('#download_new').show();
                            $('#download_new').attr('name',data.url);
                            $('#detall_show').show();
                        }
                        //服务器状态
                        var status = data.status;
                        if(status.indexOf('OK') == -1) {
                            $('#guard_comm').text($LANG.COMM_ABNORMAL);
                        } else {
                            $('#guard_comm').text('通讯正常');
                        }
                    }
                })
            });
            //状态刷新
            function refreshGuard() {
                $.ajax({
                    url: '?c=Home/GuardInfo&a=guardData',
                    type: 'POST',
                    timeout: 30000,
                    dataType: 'json',
                    success: function(data) {
                        $('#GuardInfo_module').find('.loading').remove();
                        if (data.length == 0) {
                            ngtosPopMessager("success", $LANG.GET_INFO_FAIL);
                            return false;
                        }
                        //当前运行状态
                        $('#isStatus').text(data.func == 'enable' ? $LANG.OPEN : $LANG.CLOSED);
                        if(data.func == 'enable') {
                            $('#startDev').hide();
                        } else {
                            $('#startDev').show();
                        }
                        //设备状态
                        if(data.url.length == 0) {
                            $('#guard_update').text($LANG.NO_UPDATE);
                            $('#guard_update').css('color','#4f6b72');
                            $('#download_new').hide();
                            $('#detall_show').hide();
                        } else {
                            $('#guard_update').text($LANG.NEW_UPDATE);
                            $('#guard_update').css('color', '#cc0000');
                            $('#download_new').show();
                            $('#download_new').attr('name',data.url);
                            $('#detall_show').show();
                        }
                        //服务器状态
                        var status = data.status;
                        if(status.indexOf('OK') == -1) {
                            $('#guard_comm').text($LANG.COMM_ABNORMAL);
                        } else {
                            $('#guard_comm').text('通讯正常');
                        }
                        ngtosPopMessager("success", $LANG.OPERATION_SUCCESS);
                    }
                })
            }

            function startDev() {
                $.ajax({
                    url: '?c=System/Guard&a=startOrstop&par=enable',
                    type: 'get',
                    dataType: 'text',
                    success: function(data) {
                        if (data == '0') {
                            $('#startDev').hide();
                            $('#isStatus').text($LANG.OPEN);
                            ngtosPopMessager("success", $LANG.ENABLE_SUCCESS);
                        } else {
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
            //检测
            function nowConn() {
                $.ajax({
                    url: '?c=System/Guard&a=nowConnServer',
                    type: 'get',
                    dataType: 'text',
                    success: function(data) {
                        if (data == '0') {
                            refreshGuard();
                            //$('#guard_comm').text('通讯正常');
                            //ngtosPopMessager("success", $LANG.OPERATION_SUCCESS);
                        } else {
                            $('#guard_comm').text($LANG.COMM_ABNORMAL);
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
            //下载
            function downloadNew(obj) {
                var url = obj.name;
                //url = url.replace(/\\/g, "");
                window.open(url,'','height=400,width=700');
                /*$('#guard_loading').append('<div id="load_waiting" style="height:25px;">下载中，请稍等...&nbsp;&nbsp;<img src="../Public/images/image/loading2.gif" /></div>');
                $.ajax({
                    url: '?c=Home/GuardInfo&a=downloadNew',
                    type: 'post',
                    dataType: 'text',
                    data: {url:obj.name},
                    success: function(data) {
                        $('#load_waiting').remove();
                        if (data == 0) {
                            ngtosPopMessager("success", $LANG.OPERATION_SUCCESS);
                        } else {
                            ngtosPopMessager("error", data);
                        }
                    },
                    complete: function(XMLHttpRequest, textStatus) {
                        if(XMLHttpRequest.status != 200) {
                            $('#load_waiting').remove();
                            ngtosPopMessager("error", XMLHttpRequest.statusText);
                        }
                    }
                });*/
            }
            //查看详情
            function detallShow(obj) {
                $.ajax({
                    url: '?c=Home/GuardInfo&a=detallShow',
                    type: 'get',
                    dataType: 'text',
                    success: function(data) {
                        if (data == '0') {
                            ngtosPopMessager("info", '详情文件不存在！');
                        } else if(data == 'null') {
                            ngtosPopMessager("info", '内容为空或读取详情失败！');
                        } else {
                            //以tooltip方式显示详情
                            /*$(obj).tooltip({
                                position: 'bottom',
                                content: data,
                                showEvent: ''
                            });
                            $(obj).tooltip('show');*/
                            //以弹出框形式显示详情
                            if ($('#guard_detall').length <= 0) {
                                $(document.body).append("<div id='guard_detall' style='width:600px;height:400px;padding:10px;display:none;word-break:break-all'></div>");
                            }
                            $('#guard_detall').css("display", "block");
                            $('#guard_detall').window({
                                zIndex: 9001, //定义是否显示可折叠按钮。
                                collapsible: false, //定义是否显示可折叠按钮。
                                minimizable: false, //定义是否显示最小化按钮。
                                maximizable: false, //定义是否显示最大化按钮。
                                noheader: false, //如果设置为true，控制面板头部将不被创建。
                                border: false, //定义是否显示控制面板边框。
                                content: data,
                                resizable: false, //定义窗口是否可以被缩放。
                                shadow: false, //如果设置为true，显示窗口的时候将显示阴影。
                                modal: true, //定义窗口是否带有遮罩效果。
                                cache: false,
                                title: '&nbsp;&nbsp;' + $LANG.DETAIL,
                                style: {
                                    borderWidth: 0,
                                    padding: 5
                                }
                            });
                            //$('#guard_detall').window('center');
                        }
                    }
                });
            }

        </script>
        </div>
        <?php
    }

    public function guardData() {
        $status = getResponse('system topguard','show config','',0);
        $url = getResponse('system topguard','show url','',0);
        $fileType = mb_detect_encoding($url , array('ASCII','GB2312','UTF-8','GBK','BIG5'));
        $fileType = strtoupper($fileType);
        if( $fileType != 'UTF-8'){
            $url = mb_convert_encoding($url ,'utf-8' , $fileType);
        }
        $commu = getResponse('system topguard','show commu','',0);
        $status = parseResponse($status);
        $url = parseResponse($url);
        $commu = parseResponse($commu);
        unset($status['@attributes'],$url['@attributes'],$commu['@attributes']);

        $dataArr = array_merge($status,$url,$commu);
        /*if(!empty($url['url'])) {
            $dataArr['url'] = base64_encode($dataArr['url']);
        }*/
        echo json_encode($dataArr);

    }

    public function detallShow() {
        $filename = '/tmp/updateinfo';
        if(file_exists($filename)) {
            $content = file_get_contents($filename);
            if($content) {
                $fileType = mb_detect_encoding($content , array('ASCII','GB2312','UTF-8','GBK','BIG5'));
                $fileType = strtoupper($fileType);
                if( $fileType != 'UTF-8'){
                    $content = mb_convert_encoding($content ,'utf-8' , $fileType);
                }
                echo str_replace(PHP_EOL,'<br>',$content);
                //echo str_replace(array('\r\n', '\r', '\n'),'<br>',$content);
                //echo preg_replace('/\s/','<br>',$content);
                //echo nl2br($content);
            } else {
                echo 'null';
            }
        } else {
            echo 0;
        }
    }

    /*public function downloadNew($type = true) {
        $url = base64_decode($_POST['url']);
        if(!filter_var(substr($url,0,strrpos($url,'/')),FILTER_VALIDATE_URL)){
            echo 'URL格式错误！';
            exit;
        }
        $filename = basename($url);
        $saveDir = '/tmp/';
        //获取远程文件所采用的方法
        if($type){
            $ch=curl_init();
            //dump($ch);
            //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
            //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch,CURLOPT_URL,$url);
            //curl_setopt($ch,CURLOPT_USERPWD ,"root:root");
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
            curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,0);
            $content=curl_exec($ch);
            //var_dump(curl_errno($ch),curl_error($ch));
            curl_close($ch);
        }else{
            ob_start();
            readfile($url);
            $content=ob_get_contents();
            ob_end_clean();
        }
        if(!$content) {
            echo L('GET_INFO_FAIL');exit;
        }
        $pathName = $saveDir . $filename;
        @file_put_contents($pathName,$content); //比下面的方式效率高
        //$fp2=@fopen($pathName,'w');
        //fwrite($fp2,$content);
        //fclose($fp2);
        unset($content,$url);
        if(file_exists($pathName) && filesize($pathName)) {
            echo 0;
        } else {
            echo L('UNKNOW_ERR');
        }
        //clearstatcache();
    }*/

}
?>