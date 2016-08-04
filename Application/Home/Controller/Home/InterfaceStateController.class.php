<?php

namespace Home\Controller\Home;
use Think\Controller;
class InterfaceStateController extends Controller {
    public function InterfaceState() {
        ?>
    <div class="module-half-body" id="InterfaceState_module">
        <div class="module">
            <div class="module-header">
                <div class="module-title">
                    <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                    <a href="javascript:void(0)" onclick="pageToMain('?c=Network/Physics&a=show', 'network')"><?php echo L('INTERFACE_INFORMATION')?></a>
                </div>
                <div class="module-icon">
                    <span class="close-icon" onclick="closeModuleInterval('InterfaceState')"></span>
                </div>
                <div class="atuo_load_time">
                    <select id="interface_state_type">
                        <option value="chart"><?php echo L('VIEW')?></option>
                        <option value="table"><?php echo L('TABLE')?></option>
                    </select>
                </div>
            </div>
            <div class="module-content">
                <div id="interface_list" class="chartdiv" style="text-align: left;padding: 20px;"></div>
                <div class="tablediv" style="width:648px;"><table id="interface_state_table" class="ngtos_form_table"></table></div>
            </div>
        </div>
        <script type="text/javascript">
            var InterfaceState_interval;
            $(function() {
                if ($.cookie('interstat_type')) {
                    $('#interface_state_type').val($.cookie('interstat_type'));
                }
                var interfaceVal = $('#interface_state_type').val();
                handleInterfaceDataByCookie(interfaceVal);
                InterfaceState_interval = setInterval(function() {
                    if ($.cookie('interstat_type')) {
                        handleInterfaceDataByCookie($.cookie('interstat_type'));
                    } else {
                        handleInterfaceDataByCookie(interfaceVal);
                    }
                }, 5000*2);
                $('#interface_state_type').change(function() {
                    if (this.value == 'table') {
                        $('#InterfaceState_module').find('.tablediv').show();
                        $('#InterfaceState_module').find('.chartdiv').hide();
                        createInterfaceTable();
                        $.cookie('interstat_type', 'table', {secure:true});
                    } else {
                        $('#InterfaceState_module').find('.tablediv').hide();
                        $('#InterfaceState_module').find('.chartdiv').show();
                        refurbishInterfaceData();
                        $.cookie('interstat_type', 'chart', {secure:true});
                    }
                });
            });
            function handleInterfaceDataByCookie(interfaceName) {
                if (interfaceName == 'table') {
                    $('#InterfaceState_module').find('.tablediv').show();
                    $('#InterfaceState_module').find('.chartdiv').hide();
                    createInterfaceTable();
                } else {
                    $('#InterfaceState_module').find('.tablediv').hide();
                    $('#InterfaceState_module').find('.chartdiv').show();
                    refurbishInterfaceData();
                }
            }
        </script>
    </div>
    <?php
    }
}
?>