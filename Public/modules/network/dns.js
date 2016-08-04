var ip_reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
var dns_bad_char=/[`~!@#$%^&*()+<>?:"{},\/;'[\]]/im;
var dns_isp = {
    ctc:'电信',
    cmc:'移动',
    cuc:'联通',
    edu:'教育',
    oth:'其他',
    otc:'国外'};
//switch button
function changswitch(obj) {
    if (obj.title=='开启') {
        obj.src="static/images/image/stop.png";
        obj.title='关闭';
    } else {
        obj.src="static/images/image/start.png";
        obj.title='开启';
    }
}
function setswitch(id, close) {
    var obj = document.getElementById(id);
    if (!close) {
        obj.src="static/images/image/stop.png";
        obj.title='关闭';
    }  else {
        obj.src="static/images/image/start.png";
        obj.title='开启';
    }
}
