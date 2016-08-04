function form_submit(){
    $("#button").css('background-color','#A1BBD7');
    $("#button").attr('disabled',true);
    if (getPrivilege("device-maintenance") !=false && vsid=="0"){
/*        if(ntp_php==1 && $('#ntpSet')[0].checked){
            if($( "#ip").val()==''&&$( "#ip2").val()==''){
                ngtosPopMessager("error", $LANG.PLEASE_FILL_IN_THE_SERVER_IP_ADDRESS);
                return;
            }
        }else*/
        if($('#timeSet')[0].checked){
            if($.trim($('#date_cid').datebox('getValue'))=='' && $.trim($('#clock_cid')[0].value)=='')
            {}else if($.trim($('#date_cid').datebox('getValue'))==''||$.trim($('#clock_cid')[0].value)==''){
                $("#button").css('background-color','#1f637b');
                $("#button").attr('disabled',false);
                ngtosPopMessager("error", $LANG.PLEASE_FILL_IN_THE_FULL_DATE_AND_TIME);
                return;
            }

        }
        type=$('input:radio[name="bigRadio"]:checked').val();
        var date='';
        var clock='';

        if(type=='1'){
            date=$('#date_cid').datebox('getValue');
            clock=$('#clock_cid')[0].value;
        }else if(type=='2'){
            date=$('#localtime')[0].innerHTML.split(' ')[0];
            clock=$('#localtime')[0].innerHTML.split(' ')[1];
        }
        $.ajax({
            url: "?c=System/Time",
            type: 'put',
            dataType:'text',
            data:{
                bigRadio:type,
                timezone:type!='3'?$('#sel')[0].value:'',
                date:date,
                clock:clock,
                addr:ntp_php==1?$('#ip').val():'',
                addr2:ntp_php==1?$('#ip2').val():''
            },
            success: function(data){
                if(data == '0'){
                    ngtosPopMessager("success", $LANG.SYNCHRONOUS_SUCCESS);
                    parent.location.reload();
                }else{
                    $("#button").css('background-color','#1f637b');
                    $("#button").attr('disabled',false);
                    ngtosPopMessager("error", data);
                }
            }
        });
    }else{
        $("#button").css('background-color','#1f637b');
        $("#button").attr('disabled',false);
        ngtosPopMessager("error", $LANG.ONLY_OPEN_THE_PERMISSIONS);
    }
}

function  check_use(){
    var val=$('input[name="bigRadio"]:checked').val();
    if(val==1) {
        $("#date_cid").datebox('enable');
        $("#clock_cid").timespinner('enable');

        $("#date_cid")[0].disabled=false;
        $(".noUse1").attr("disabled",false);
        $(".noUse2").attr("disabled",true);
        $(".noUse3").attr("disabled",true);
        $("#equalToSerAddr").attr("disabled",true);

    }else if(val==2){
        $("#date_cid").datebox('disable');
        $("#clock_cid").timespinner('disable');
        $(".noUse1").attr("disabled",true);
        $(".noUse2").attr("disabled",false);
        $(".noUse3").attr("disabled",true);
        $("#equalToSerAddr").attr("disabled",true);
    }else if(val==3){
        $("#date_cid").datebox('disable');
        $("#clock_cid").timespinner('disable');
        $(".noUse1").attr("disabled",true);
        $(".noUse2").attr("disabled",true);
        $(".noUse3").attr("disabled",false);
        $("#equalToSerAddr").attr("disabled",false);
    }
}

function tick(){
    var localtime=$('#localtime')[0].innerHTML;
    date1=localtime.split(' ')[0];
    time1=localtime.split(' ')[1];
    strs=date1.split("-");
    f0=!strs[0] && typeof(strs[0])!="undefined" && strs[0]!=0;
    f1=!strs[1] && typeof(strs[1])!="undefined" && strs[1]!=0;
    f2=!strs[2] && typeof(strs[2])!="undefined" && strs[2]!=0;

    if(!f0||!f1||f2){
        date2=strs[1]+'-'+strs[2]+'-'+strs[0]+' '+time1;
        if(isFirefox=navigator.userAgent.indexOf("Firefox")>0)
        {
            date2=strs[0]+'/'+strs[1]+'/'+strs[2]+' '+time1;
        }
        sec=Date.parse(date2);
        sec=sec+1000;
        dd=new  Date(sec);
        $('#localtime')[0].innerHTML=formatDate(dd);
    }
}

function sysTick(){
    alltime=$('#systime')[0].innerHTML;
    str1=alltime.split(' ');
    str2=str1[0].split('-');

    date3=str2[1]+'-'+str2[2]+'-'+str2[0]+' '+str1[1];
    if(isFirefox=navigator.userAgent.indexOf("Firefox")>0)
    {
        date3=str2[0]+'/'+str2[1]+'/'+str2[2]+' '+str1[1];
    }
    sec1=Date.parse(date3);
    sec1=sec1+1000;
    dd1=new Date(sec1);
    alltime=formatDate(dd1);
    $('#systime')[0].innerHTML=alltime;
}

function calcTime(newVal,oldVal) {
    if(!newVal) {
       newVal = $("#sel").combobox('getValue');
    }
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000*newVal));
    kk=formatDate(nd);
    $('#localtime')[0].innerHTML=kk;
}

function   formatDate(now)   {
    var   year=now.getFullYear();
    var   month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    var   date=now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var   hour=now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    var   minute=now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    var   second=now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    return   year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
}
