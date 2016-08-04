//基本设置__高级
function changeExpert(obj){
    if (obj.alt == 'open') {
        obj.src = "static/images/icons/twistie_expanded.gif";
        obj.alt = "stop";
        $('#expert').show();
    } else {
        obj.src = "static/images/icons/twistie_collapsed.gif";
        obj.alt = "open";
        $('#expert').hide();
    }
}
//基本设置__客户端版本控制
function versionChange(obj){
    if(obj.value == 'on'){
        $('#standard_version').show();
        $('#limit_version').show();
         
    }else{
        $('#standard_version').hide();
        $('#limit_version').hide();
    }
}
//基本设置__客户端版本控制
function versionController(obj){
    if(obj.value == 'standard'){
        $('#standard_ukey').show();
        $('#standard_secure').show();
        $('#limit_ukey').hide();
         
    }else{
        $('#standard_ukey').hide();
        $('#standard_secure').hide();
        $('#limit_ukey').show();
    }
}

