//setInterval(function() {
var options="";
                $.getJSON(
                    "?c=System/Package&a=packageShow",
                    function(data) {
                    if (data) {
                        $(data.rows).each(function(key, value) {
                            if (value.name != "" && value.name != null && value.status != "valid") {
                               if(key==1){
                                    $.messager.show({
                                        height: '300px',
                                        width: '200px',
                                        title: '补丁包升级提示',
                                        msg: "<table id='sum'></table><br><input type='button' onClick='update_package()' class='ngtos_button_middle confirmenable' style='margin-left:50px;' value='确认'>",
                                        timeout:0,
                                        //showSpeed: 3600000,
                                        showType: 'show'

                                    })
                                }
                                var msg_name = value.name;
                                var msg_arr = new Array();
                                msg_arr = msg_name.split(" ");
                                for (i = 0; i < msg_arr.length; i++) {
                                    if (msg_name.length != 0) {
                                        options += "<tr><td>" + msg_name + "</td></tr>";
                                    }
                                }
                                $("#sum").html(options);
                            }
                        })
                    }
                });
//},300000);