<?php

namespace Home\Controller\Home;
use Think\Controller;
class WebTerminalController extends Controller {
    public function WebTerminal() {
?>
    <div class="module-half-body" id="WebTerminal_module">
        <div class="module">
            <div class="module-header">
                <div class="module-title">
                    <span class="slide-up-icon" onclick="moduleSlide(this)"></span>
                    <a href="javascript:void(0)"><?php echo L('CONSOLE')?></a>
                </div>
                <div class="module-icon">
                    <span class="close-icon"  onclick="closeModule('WebTerminal')"></span>
                </div>
                <div class="atuo_load_time"></div>
            </div>
            <div class="module-content">
                <iframe id="content" frameborder="0" scrolling="auto" style="width:100%;height:310px"></iframe>
            </div>
        </div>
    <script>
        var hostport = document.location.host;
        $("#content").attr("src", "https://" + hostport + "/console/");
		$('html,body,#center').animate({scrollTop: '0px'}, 2000);
    </script>
    </div>
<?php
    }
}
?>