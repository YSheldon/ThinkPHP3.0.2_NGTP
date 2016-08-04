/*
 *  Echarts图表自适应浏览器面板大小
 *  obj:dom对象
 * */
//function wind(obj){
//    var winHeight = 0;
//    if(window.innerHeight){
//        winHeight = window.innerHeight;
//    }else if((document.body) && (document.body.clientHeight)){
//        winHeight = document.body.clientHeight;
//    }
//    obj.style.height = winHeight*0.8+'px';
//}

//jsonArray图形数据数组 reportName图形显示标题
function initEchartsBar(json, reportName,obj) {
    require.config({
        paths : {
            echarts: NG_PATH+'Public/plugins/echarts'
        }
    });
    require(
        [
            'echarts',
            'echarts/theme/green',
            'echarts/chart/bar'
        ],
        function(ec,theme) {
            var myChart = ec.init(obj,theme);
            myChart.showLoading({
                text: $LANG.CHRT_DATA_IS_TRYING_TO_LOAD
            });
            myChart.hideLoading();
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    orient: 'horizontal',
                    feature : {
                        mark : {show:true},
                        dataView : {show:true,readOnly:false},
                        restore : {show:true},
                        saveAsImage : {show:true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap : true,
                        data: json.category
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name:reportName,
                        type:'bar',
                        radius : '55%',
                        center: ['50%', '60%'],
                        itemStyle: {
                            normal: {
                                color: '#9BCA63',
                                barBorderColor: '#333',
                                barBorderWidth: 1,
                                barBorderRadius:0,
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: 'blue'
                                    }
                                }
                            }
                        },
                        data:json.series
                    }
                ]
            };
            myChart.setOption(option);
        }
    );
}

//jsonArray图形数据数组 reportName图形显示标题
function DoubleEchartsLine(json,obj) {
    require.config({
        paths : {
            echarts: NG_PATH+'Public/plugins/echarts'
        }
    });
    require(
        [
            'echarts',
            'echarts/theme/green',
            'echarts/chart/line'
        ],
        function(ec,theme) {
            var myChart = ec.init(obj,theme);
                myChart.showLoading({
                    text: $LANG.CHRT_DATA_IS_TRYING_TO_LOAD
            });
            myChart.hideLoading();
            var option = {
                tooltip : {
                    trigger: 'item',
                    backgroundColor:'#fff',
                    position : function(p) {
                        return [p[0], p[1]];
                    },
                    textStyle : {
                        color:'#333',
                        fontFamily: 'Verdana, sans-serif',
                        fontSize: 12
                    },
                    formatter: "{b} : {c} ("+json.unit+")"
                },
                legend: {
                    data:[$LANG.UPSTREAM_TRAFFIC,$LANG.DESCENDING_FLOW]
                },
                toolbox: {
                    show: true,
                    orient: 'horizontal',
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                dataZoom: {
                    show: true,
                    title: {
                        dataZoom: $LANG.AREA_SCALING,
                        dataZoomReset: $LANG.AREA_SCALING_BACK
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        name:$LANG.TIME_AXIS,
                        boundaryGap: false,//item是否显示在纵坐标的中线
                        data: json.category
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:$LANG.RATE_VALUE,
                        splitArea: { show: true },
                        axisLabel: {
                            show: true,
                            formatter: function(v){
                                return v+json.unit;
                            },
                            textStyle: {
                                color: '#666'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: $LANG.UPSTERAM,
                        type: "line",
                        radius: '55%',
                        center: ['50%', '60%'],
                        itemStyle: {
                            normal: {
                                color: '#9BCA63',
                                barBorderColor: '#333',
                                barBorderWidth: 1,
                                barBorderRadius:0,
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: 'blue'
                                    }
                                }
                            }
                        },
                        data:json.series1,
                        markLine: {
                            data: [ {
                                type: 'average',
                                name: $LANG.MEAN_VALUE
                            } ]
                        }
                    },{
                        name: $LANG.DOWN_W,
                        type: "line",
                        radius : '55%',
                        center: ['50%', '60%'],
                        itemStyle: {
                            normal: {
                                color: 'red',
                                barBorderColor: '#333',
                                barBorderWidth: 1,
                                barBorderRadius: 0,
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: 'blue'
                                    }
                                }
                            }
                        },
                        data:json.series2,
                        markLine : {
                            data : [ {
                                type : 'average',
                                name : $LANG.MEAN_VALUE
                            } ]
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    );
}

function renderGaugeChart(obj,reportName,flag) {
    require.config({
        paths: {
            echarts: NG_PATH+'Public/plugins/echarts'   //临时解决因增加多用户在线导的致路径问题
        }
    });
    require(
        [
            'echarts',
            'echarts/theme/green',
            'echarts/chart/gauge'
        ],
        function(ec,theme) {
            var myChart = ec.init(obj,theme);
                myChart.showLoading({
                    text: $LANG.CHRT_DATA_IS_TRYING_TO_LOAD
            });
                myChart.hideLoading();
            var option = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                series: [
                    {
                        type:'gauge',
                        detail : {formatter:'{value}%'},
                        splitLine: {
                            show: true,
                            length :5,
                            lineStyle: {
                                color: '#eee',
                                width: 2,
                                type: 'solid'
                            }
                        },
                        pointer : {
                            length : '50%',
                            width : 5,
                            color : 'auto'
                        },
                        title : {
                            show : true,
                            textStyle: {
                                color: '#333',
                                fontSize : 12
                            }
                        },
                        data:[{value:"",name:reportName}]
                    }
                ]
            };
            myChart.setOption(option);

            $.ajax({
                url: '?c=Home/DeviceState&a=deviceStateData',
                type: 'POST',
                timeout: 30000,
                dataType: 'json',
                success: function(data) {
                    if (flag == 'cpu') {
                        option.series[0].detail.formatter = data.cpu_used+"%";
                        option.series[0].data[0].value = data.cpu_used;
                    } else if (flag == 'mem') {
                        option.series[0].detail.formatter = data.mem_used+"%";
                        option.series[0].data[0].value = data.mem_used;
                    } else {
                        option.series[0].detail.formatter = data.disk_used+"%";
                        option.series[0].data[0].value = data.disk_used;
                    }
                    myChart.setOption(option);
                }
            });
        }
    )
}
function initEchartsLinkFlow(json,obj,reportName) {
    var time_arr = [];
    var flag = true;
    require.config({
        paths: {
            echarts: NG_PATH+'Public/plugins/echarts'
        }
    });
    require(
        [
            'echarts',
            'echarts/theme/green',
            'echarts/chart/line'
        ],
        function(ec,theme) {
            var myChart = ec.init(obj,theme);
            myChart.showLoading({
                text: $LANG.DATA_IS_TRYING_TO_LOAD
            });
            myChart.hideLoading();
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:[$LANG.RECEIVE, $LANG.SEND_OUT]
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: json.category
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: json.unit,
                        boundaryGap: [0, 0],
                        show: true,
                        splitNumber:8
                    }
                ],
                axisLine: [
                    {
                        show: true
                    }
                ],
                series: [
                    {
                        name: $LANG.RECEIVE,
                        type: 'line',
                        data: json.data1,
                         itemStyle: {
                            normal: {
                                color: '#d07e75',
                            },
                        },
                    },{
                        name: $LANG.SEND_OUT,
                        type: 'line',
                        data: json.data2
                    }
                ]
            }
                // var lastData = 11;
//            timeTicket = setInterval(function() {
            LinkFlow_interval = setInterval(function() {
                // lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
                // lastData = lastData.toFixed(1) - 0;
                $.ajax({
                    url: '?c=Home/LinkFlow&a=linkFlowData',
                    type: 'POST',
                    timeout: 30000,
                    dataType: 'json',
                    data: {
                        interface_name: reportName
                    },
                    success: function(data) {
                        time_arr.push(data.data1);
                        if(time_arr.length >20){
                            time_arr.shift();
                            flag = true;
                        }

                        myChart.addData([
                            [
                                0,          // 系列索引
                                data.data1, // 新增数据
                                false,       // 新增数据是否从队列头部插入
                                flag        // 是否增加队列长度，false则自定删除原有数据
                            ],
                            [
                                1,
                                data.data2,
                                false,
                                flag,
                                data.category
                            ]
                        ]);
                    }
                })
            },5000);
            myChart.setOption(option,true);
        }
    );
}