function fetchColumns(base,table){
    $.ajax({
        url: "?c=System/Journal&a=Column",
        type: 'POST',
        dataType: 'json',
        async:false,
        data:{
            base:base,
            table:table
        },
        success: function(data) {
            var  s = "[["; 
            if(data.length > 0){
                if(base =="tos_log_db"){
                    for(var i = 0; i < data.length; i++){
                      s += "{field:'"+data[i].key+"',title:'"+data[i].value+"',width:10},";
                    }
                }else{
                    for(var i = 0; i < data.length; i++){
                       if(data[i].key=="time"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"',width:2},";
                        }else if(data[i].key=="dev"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"',width:1},";
                        }else if(data[i].key=="pri"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"'},";
                        }else if(data[i].key=="type"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"'},";
                        }else if(data[i].key=="recorder"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"'},";
                        }else if(data[i].key=="vsid"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"'},";
                        }else if(data[i].key=="format_msg"){
                            s += "{field:'"+data[i].key+"',title:'"+data[i].value+"',width:10}";
                        }
                    }
                }
            }
            s = s + "]]"; 
            var options={}; 
            options.columns = eval(s);
            $('#tt').datagrid(options); 
			$('#tt').datagrid('options').pageNumber = 1;
			$('#tt').datagrid('getPager').pagination({pageNumber: 1});
            $('#tt').datagrid('reload');
        }
    });
}

//清空数据
function deleteall(){
	var base = $("#did").val();
	var table = $("#tid").val();
	ngtosPopMessager('confirm', $LANG.DELETE_IT, function(r) {
        if (r){
            $.ajax({
                url: "?c=System/Journal&a=logClean",
                type: 'POST',
                dataType: 'text',
				data:{"base":base,table:table},
                success: function(data) {
                    if (data == 0) {
                        $('#tt').datagrid('reload');
                    }
                    else {
                        ngtosPopMessager("error", data);
                    }


                }
            });
        }
    });
	
}

//数据查询弹出界面
function superQuery(){
    var base = $("#did").val();
	var table = $("#tid").val();
    open_window('log_search', 'System/Journal', 'Search&table='+table+'&base='+base, $LANG.SEARCH);
}

//查询功能
function searchlog(){
	if ($('#date_begin').datetimebox('getValue')){
        if ($('#date_stop').datetimebox('getValue')) {
            if ($('#date_begin').datetimebox('getValue') > $('#date_stop').datetimebox('getValue')){
                ngtosPopMessager("error", $LANG.THE_START_DATE_CEED);
                return;
            }
        }else{
            ngtosPopMessager("error", $LANG.PLEASE_ENTER_THE_CLOSING_DATE);
            return;
        }

    }
    if ($('#date_stop').datetimebox('getValue')){
        if (!$('#date_begin').datetimebox('getValue')) {
            ngtosPopMessager("error", $LANG.PLEASE_ENTER_A_START_DATE);
            return;
        }
    }
	
//    if ($('#date_begin').datetimebox('getValue')){
//        var date_range = $('#date_begin').datetimebox('getValue').replace(/-/g, '') + '-' + $('#date_stop').datetimebox('getValue').replace(/-/g, '');
//    }
//    alert(date_range);
	var start_date = $('#date_begin').datetimebox('getValue').replace(/-/g, '');
    var end_date = $('#date_stop').datetimebox('getValue').replace(/-/g, '');
    var keyword = $("#keyword").val();//关键字
    var level = $("#level").combobox('getValue');;//级别
    var base = $("#did").val(); //数据库类型---隐藏域   
	var table = $("#tid").val(); //表类型---隐藏域   
	var url = "&keyword="+keyword;
	url = url+"&start_date="+start_date;
	url = url+"&end_date="+end_date;
    url = url+"&level="+level;
    url = url +"&base="+base;
	url = url +"&table="+table;
	url = url +"&language="+log_language;
    $("#tt").datagrid('options').url = '?c=System/Journal&a=JournalJsondata'+url;
    fetchColumns(base,table);
    closeWindow('log_search');
}

//导出界面
function logExport(){
    
    if ($('#log_export_window').length <= 0) {
        $(document.body).append("<div id='log_export_window' class='ngtos_window_400'></div>");
    }
    open_window('log_export_window','System/Journal','windowShow&w=system_log_Exprot',$LANG.EXPORT);
}

//导出数据
function log_export(){
    
    closeWindow('log_export_window');
    var log_file = "";
    if($("#log_text")[0].checked){
        
       log_file = "text_file";
    }else{

       log_file = "localdb_file";
    }
	
    var form=$('<form>');//定义一个form表单
    form.attr('style','display:none');
    form.attr('target','');
    form.attr('method','post');
    form.attr('action','?c=System/Journal&a=logExport');

    var input_file=$('<input>');
    input_file.attr('type','hidden');
    input_file.attr('name','log_file');
    input_file.attr('value',log_file);

    var input_base=$('<input>');
    input_base.attr('type','hidden');
    input_base.attr('name','base');
    input_base.attr('value',base);
	
	var input_table=$('<input>');
    input_table.attr('type','hidden');
    input_table.attr('name','table');
    input_table.attr('value',table);
	
    $('body').append(form);//将表单放置在web中
    form.append(input_file);
    form.append(input_base);
	form.append(input_table);
    //form.append(input_hidden);
    form.submit();//表单提交
    form.remove();
}
