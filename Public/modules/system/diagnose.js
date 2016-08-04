/*system diagnose begin*/
function diagnose() {
    var isValid = $("#addr").textbox('isValid');
    if(!isValid) {
        return;
    }
    var val = $("#addr").textbox('getValue');
    var addr_type;
    type1 = $('input[name="type"]:checked').val();
    if (type1 == 1 || type1 == 2) {
        if (val.indexOf(':') >= 0) {
            addr_type = 6;
        } else {
            addr_type = 4;
        }

        $.ajax({
            url: "?c=System/Diagnose&a=diagnose_begin",
            type: 'POST',
            dataType: 'json',
            data: {
                type: type1,
                operation: addr_type,
                addr: val
            },
            success: function(data) {
                if (data.success == true) {
                    changAble(true, false);
                    $('.clear').hide();
                    $('#showimage').append('<div id="waiting" style="vertical-align: middle">'+$LANG.BEING_DIAGNOSED_PLEASE_LATER+'<img src="../Public/images/image/loading2.gif"></div>');
                    tick1 = setInterval("tick()", 200);
                } else {
                    ngtosPopMessager("error", data.msg);
                }
            }
        });
    } else {
        $('#result').val('');
        if (type1 == 3 || type1 == 4 || type1 == 5) {
            var isValid = $('#addr').textbox('isValid');
            if(!isValid){
                return;
            }
            /*if(val.indexOf(':')>=0)
             if( $( "#addr" ).checkInput( { cl : ['must','singleIpvsix']} ) == false )  return false;
             else
             if( $( "#addr" ).checkInput( { cl : ['must','ip']} ) == false )  return false;
             if( $( "#port" ).checkInput( { cl : ['must','allownumber','range:1-65535']} ) == false )  return false;*/
        }
        /*else if (type1 == 4) {
            *//*if($('#addr').checkInput( { cl : ['must','domain']} ) == false )  return false;
             if( $( "#port" ).checkInput( { cl : ['null','allownumber','range:1-65535']} ) == false )  return false;*//*
        } else if (type1 == 5) {
            *//*if(val.indexOf(':')>=0)
             if( $( "#addr" ).checkInput( { cl : ['must','singleIpvsix']} ) == false )  return false;
             else
             if( $( "#addr" ).checkInput( { cl : ['must','ip']} ) == false )  return false;
             if( $( "#port" ).checkInput( { cl : ['must','domain']} ) == false )  return false;*//*
        }*/
        changAble(true, false);

        $('.clear').hide();
        $('#showimage').append('<div id="waiting" style="vertical-align: middle">'+$LANG.BEING_DIAGNOSED_PLEASE_LATER+'<img src="../Public/images/image/loading2.gif"></div>');

        request = $.ajax({
            url: "?c=System/Diagnose&a=other_diagnose_begin",
            type: 'POST',
            dataType: 'text',
            async: false,
            timeout: 15000,
            data: {
                type: type1,
                serverip: val,
                port: $.trim($("#port").textbox('getValue'))
            },
            success: function(data) {
                $('#waiting').remove();
                $('.clear').show();
                if (data.indexOf("wrongStr:") >= 0) {
                    var showMsg = data.substr(9, data.length - 9);
                    ngtosPopMessager("error", showMsg);
                } else {
                    $('#result').val(data);
                }
                changAble(false, true);
            }
        });
    }
}

function tick() {
    $.ajax({
        url: "?c=System/Diagnose&a=diagnose_result",
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            type: type1
        },
        success: function(data) {
            if (data) {
                $('#result').val(data.str);
                if (!data.pid) {
                    clearInterval(tick1);
                    $('#waiting').remove();
                    $('.clear').show();
                    changAble(false, true);
                }
            }
        }
    });
}

function diagnoseStop() {
    if (tick1) {
        clearInterval(tick1);
        $("#diagnoseStart").attr("disabled", false);
    }
    if (request != null) {
        request.abort();
    }
    $('#waiting').remove();
    $('.clear').show();
    changAble(false, true);

}

function changDiagnose(type) {
    $('#addr').val('');
    $('#port').val('');
    if (type == 1 || type == 2 || type == 4) {
        if (type == 4){
            $('#addr_td').html($LANG.AVAILABLE_DOMAIN_NAME);
            $('#addr').textbox({
                required:true,
                validType:['domain','domainHttps']
            });
        }else{
            $('#addr_td').html($LANG.DIAGNOSE_ADDR);

            $('#addr').textbox({
                required:true,
                validType:'ipFourOripSix'
            })
        }
        $('#port_tr').hide();
        $('.addr_diagnose').show();

    } else {
//        if(type==4)
//        {
//            $('#addr_td').html('可用域名');
//            $('#port_td').html('端口');
//        }
        if (type == 3) {
            $('#addr').textbox({
                required: true,
                validType: 'ipFourOripSix'
            });
            $('#port').textbox({
                required:true,
                validType:'range[0,65535]'
            })
            $('#addr_td').html($LANG.DIAGNOSE_ADDR);
            $('#port_td').html($LANG.DIAGNOSE_PORT);
        } else if (type == 5) {
            $('#addr_td').html($LANG.DIAGNOSE_ADDR);
            $('#port_td').html($LANG.AVAILABLE_DOMAIN_NAME);
            $('#addr').textbox({
                required: true,
                validType: 'ipFourOripSix'
            });
            $('#port').textbox({
                required:true,
                validType:'domain'
            })
        }

        $('#port_tr').show();
        $('.addr_diagnose').hide();
    }
}

function clearResult() {
    $('#result').val('');
}

function changAble(stat1, stat2) {
    $("#diagnoseStart1").attr("disabled", stat1);
    $("#diagnoseStart2").attr("disabled", stat1);
    $("#diagnoseStop1").attr("disabled", stat2);
    $("#diagnoseStop2").attr("disabled", stat2);
}
/*system diagnose end*/