function render_line_chart(chartData, windowTitle, windowNote){
    jqueryWindow(windowTitle, windowNote, function(){
        chart = DoubleEchartsLine(chartData,document.getElementById('windowIDfirst_window'));
    });
}

function render_column_chart(chartData, windowTitle, windowNote,xname,yname){
    jqueryWindow(windowTitle, windowNote, function(){
        chart = initEchartsBar(chartData, windowNote,document.getElementById('windowIDfirst_window'),xname,yname);
    });
}

function jqueryWindow(title, id, fn){
	var windowDiv = document.createElement('div');
	windowDiv.id = 'windowID'+id;
	windowDiv.style.width = '750px';
	windowDiv.style.height = '550px';

	var div = document.createElement('div');
	div.id = id;
	div.style.width = '750px';
	div.style.height = '550px';
	windowDiv.appendChild(div);
	document.body.appendChild(windowDiv);

	$('#windowID'+id).window({
		collapsible:false,      //定义是否显示可折叠按钮。
        minimizable:false,      //定义是否显示最小化按钮。
        maximizable:false,      //定义是否显示最大化按钮。
        noheader:false,     //如果设置为true，控制面板头部将不被创建。
        border:false,       //定义是否显示控制面板边框。
        top:50,                //设置面版的顶边距。
        resizable:false,    //定义窗口是否可以被缩放。
        shadow:false,    //如果设置为true，显示窗口的时候将显示阴影。
        modal:true,     //定义窗口是否带有遮罩效果。
        cache:false,    //如果设置为true，从超链接载入的数据将被缓存。
        firstWindow: true,    //如果设置为true，则窗口为第一个弹出框
        newWinOpts:'',
        title:'<span id="title" style="font-size: 14px">&nbsp;'+title+'</span>',
        style:{
            borderWidth:0,
            padding:0
        },
        onOpen: function(){
        	fn();
        },
        onClose: function(){
	    	$('#windowID'+id).remove();
	    }
	});
}

function dataGridWindow(windowTitle, windowWidth, windowHeight, fn) {
    var div = document.createElement('div');
    div.id = 'windowDivId';
    div.style.width = 'auto';
    div.style.height = 'auto';
    document.body.appendChild(div);
    $('#windowDivId').window({
        top: 25,
        width: windowWidth,
        height: windowHeight,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        noheader:false,
        border:false,
        resizable:false,
        shadow:false,
        modal:true,
        cache:false,
        firstWindow: true,
        style:{borderWidth:0, padding:0},
        onOpen: function(){
            if (fn) fn();
        },
        onClose: function(){
            $('#windowDivId').remove();
        }
    });
}

function window_data_grid(gridUrl, orderType){
    $("#windowDivId").datagrid({
        url : gridUrl,
        fitColumns: true,
        singleSelect: true,
        collapsible: true,
        nowrap: true,
        striped: true,
        remoteSort: false,
        rownumbers: true,
        columns : [[{
            field : 'attack_ip',
            title : '攻击源IP',
            width : 150,
            align:'center',
            sortable : true
        },{
            field : 'victim_ip',
            title : '被攻击者IP',
            width : 150,
            align:'center',
            sortable : true
        },{
            field : 'attacker',
            title : '攻击者用户名',
            width : 50,
            align:'center',
            sortable : true
        },{
            field : 'victim',
            title : '被攻击者用户名',
            width : 50,
            align:'center',
            sortable : true
        },{
            field : 'threat_name',
            title : '威胁名称',
            width : 50,
            align:'center',
            sortable : true
        },{
            field : 'threat_level',
            title : '威胁级别',
            width : 30,
            align:'center',
            sortable : true,
            formatter:function(value){
                if (value == 0) {
                    return '高';
                }else if(value == 1){
                    return '中';
                }else if (value == 2) {
                    return '低';
                }
            }
        },{
            field : 'visittime',
            title : '攻击时间',
            width : 80,
            align:'center',
            sortable : true
        }]],
        pagination : true,
        pageSize: 20,
        pageList: [20,50,100]
    });

    if (orderType == 'attack_ip') {
        $("#windowDivId").datagrid('hideColumn', 'attack_ip');
        $("#windowDivId").datagrid('hideColumn', 'attacker');
        $("#windowDivId").datagrid('showColumn', 'victim_ip');
        $("#windowDivId").datagrid('showColumn', 'victim');
        $("#windowDivId").datagrid('showColumn', 'threat_name');
        $("#windowDivId").datagrid('showColumn', 'threat_level');
    }else if (orderType == 'victim_ip') {
        $("#windowDivId").datagrid('hideColumn', 'victim_ip');
        $("#windowDivId").datagrid('hideColumn', 'victim');
        $("#windowDivId").datagrid('showColumn', 'attack_ip');
        $("#windowDivId").datagrid('showColumn', 'attacker');
        $("#windowDivId").datagrid('showColumn', 'threat_name');
        $("#windowDivId").datagrid('showColumn', 'threat_level');
    }else if (orderType == 'threat_name') {
        $("#windowDivId").datagrid('hideColumn', 'threat_name');
        $("#windowDivId").datagrid('hideColumn', 'threat_level');
        $("#windowDivId").datagrid('showColumn', 'attack_ip');
        $("#windowDivId").datagrid('showColumn', 'victim_ip');
        $("#windowDivId").datagrid('showColumn', 'attacker');
        $("#windowDivId").datagrid('showColumn', 'victim');
    };
}

function change_grid_column(orderType, tableDiv){
    if (orderType == 'attack_ip') {
        tableDiv.datagrid('showColumn', 'attack_ip');
        tableDiv.datagrid('showColumn', 'attacker');
        tableDiv.datagrid('hideColumn', 'victim_ip');
        tableDiv.datagrid('hideColumn', 'victim');
        tableDiv.datagrid('hideColumn', 'threat_name');
        tableDiv.datagrid('hideColumn', 'threat_level');
    }else if (orderType == 'victim_ip') {
        tableDiv.datagrid('showColumn', 'victim_ip');
        tableDiv.datagrid('showColumn', 'victim');
        tableDiv.datagrid('hideColumn', 'attack_ip');
        tableDiv.datagrid('hideColumn', 'attacker');
        tableDiv.datagrid('hideColumn', 'threat_name');
        tableDiv.datagrid('hideColumn', 'threat_level');
    }else {
        tableDiv.datagrid('showColumn', 'threat_name');
        tableDiv.datagrid('showColumn', 'threat_level');
        tableDiv.datagrid('hideColumn', 'attack_ip');
        tableDiv.datagrid('hideColumn', 'victim_ip');
        tableDiv.datagrid('hideColumn', 'attacker');
        tableDiv.datagrid('hideColumn', 'victim');
    };
}