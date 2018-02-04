//筛选参数（开始时间，结束时间，台阶水平，岩性，爆破效果，历史记录（序号1，序号2，项目编码，爆破ID））
function queryParams(id) {
    var params = {
        "startTime": $("#startTime").val(),
        "endTime": $("#endTime").val(),
        "steps": $("#steps").val(),
        "lithology": $("#lithology").val(),
        "avg": $("#avg").val(),
        "id": id,
    };
    return params;
}
//点击评分显示信息（项目编码）
function editInfo(id) {
    $("#id").text(id);
}
//提交评分
function sumbit() {
    $.ajax({
        url: '/Table/AddComment',
        type: 'post',
        data: {
            "id": $("#id").text(),
            "kd": $("#kd").val(),
            "pz": $("#pz").val(),
            "gd": $("#gd").val(),
            "sy": $("#sy").val(),
            "text": $("#message-text").val()
        },
        success: function (result) {
            if (!result.success) {
                alert(result.message);
                window.location.reload();
            } else {
                window.location.reload();
            }
        }
    });
}

//点击查看详情
function detailFormatter(index, row) {
    var html = [];
    $.each(row, function (key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}

//历史记录表格
function records(id) {
    //评分的历史记录表格
    $('#history').bootstrapTable('destroy');
    $('#history').bootstrapTable({
        method: 'post',//请求方式
        url: '/Table/QueryHistory',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams(id),
        cardView: true,//是否显示详细视图
        columns: [
            {
                field: '块度评分',
                title: '块度评分',
                align: 'center',
                valign: 'middle',
            }, {
                field: '抛掷评分',
                title: '抛掷评分',
                align: 'center',
                valign: 'middle',
            }, {
                field: '根底评分',
                title: '根底评分',
                align: 'center',
                valign: 'middle',
            }, {
                field: '伞岩评分',
                title: '伞岩评分',
                align: 'center',
                valign: 'middle',
            }, {
                field: '总分',
                title: '总分',
                align: 'center',
                valign: 'middle',
            }, {
                field: '评论人',
                title: '评论人',
                align: 'center',
                valign: 'middle',
            }, {
                field: '评论',
                title: '评论',
                align: 'center',
                valign: 'middle',
            }
        ]
    });
}


$(function () {

    //日期控件
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-d",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        showMeridian: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startView: 2,//月视图
        minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
    });

    //筛选查询
    $("#btn_query").click(function () {

        var arr = $("#startTime").val().split("-");
        var starttime = new Date(arr[0], arr[1], arr[2]);
        var starttimes = starttime.getTime();

        var arrs = $("#endTime").val().split("-");
        var lktime = new Date(arrs[0], arrs[1], arrs[2]);
        var lktimes = lktime.getTime();

        if (starttimes > lktimes) {
            alert('开始时间大于结束时间，请重新选择');
            return;
        }
        $('#table').bootstrapTable("refresh");
        getEchartsDate();
    });


    //查询
    selections = [];
    $('#table').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        showExport: true,//导出按钮
        showColumns: "true",//选择显示的列
        showToggle: "table",//切换视图
        showRefresh: "true",//刷新
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [2, 5, 10],//可选的每页显示数据个数
        maintainSelected: true, //checkbox的选择项
        responseHandler: myHandler,
        columns: [
            [
                {
                    field: 'state',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle',
                    colspan: 1,
                    rowspan: 2,
                    formatter: stateFormatter
                }, {
                    field: '项目编码',
                    title: "项目编码",
                    valign: "middle",
                    align: "center",
                    visible: false,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '台阶水平',
                    title: "台阶水平",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '日期',
                    title: "日期",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '岩性',
                    title: "岩性",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '孔距',
                    title: "孔距 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '排距',
                    title: "排距 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '孔数',
                    title: "孔数",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '孔总深',
                    title: "孔总深 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '平均孔深',
                    title: "平均孔深 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '炸药量',
                    title: "炸药量 /kg",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '抵抗线',
                    title: "抵抗线 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '超深',
                    title: "超深 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '填充',
                    title: "填充 /m",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '爆破量',
                    title: "爆破量 /吨",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '炸药单耗',
                    title: "炸药单耗 kg/m³",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    title: "爆破效果",
                    valign: "middle",
                    align: "center",
                    colspan: 4,
                    rowspan: 1
                },
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    valign: "middle",
                    align: "center"
                },
            ]
        ]
    });
    //复选框监听事件
    $('#table').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        var data = $('#table').bootstrapTable('getAllSelections')
        getEchartsDate(data)
    });

    //checkbox全选
    function stateFormatter(value, row, index) {
        return {
            disabled: false,//设置是否可用
            checked: true//设置选中
        };
    }

    //数据保留两位小数
    function numberFormatter(v) {
        return v.toFixed(2);
    }

    //打分评论
    function commentFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button ', disabled,
            ' data-toggle="modal" data-target="#myModal" class="btn btn-primary" onclick="editInfo(',
            "'" + row.项目编码 + "'",
            ')">',
            '评分',
            '</button>',
        ].join('');
    }

    //查看评分记录
    function loadFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button  ', disabled,
            ' data-toggle="modal" data-target="#loadModal" class="btn btn-primary" onclick="records(',
            "'" + row.项目编码 + "'",
            ')">',
            '历史记录',
            '</button>',
        ].join('');
    }

    //打分
    $('#mark').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        showExport: true,//导出按钮
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [2, 5, 10],//可选的每页显示数据个数
        columns: [
            [
                {
                    field: '项目编码',
                    title: "项目编码",
                    valign: "middle",
                    align: "center",
                    visible: false,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '日期',
                    title: "日期",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "爆破效果",
                    valign: "middle",
                    align: "center",
                    colspan: 4,
                    rowspan: 1
                }, {
                    title: "评论",
                    valign: "middle",
                    align: "center",
                    colspan: 2,
                    rowspan: 1,
                    formatter: commentFormatter
                }
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    valign: "middle",
                    align: "center"
                }, {
                    field: '可打分',
                    title: "评分",
                    valign: "middle",
                    align: "center",
                    formatter: commentFormatter
                }, {
                    field: '查看历史',
                    title: "查看",
                    valign: "middle",
                    align: "center",
                    formatter: loadFormatter
                }
            ]
        ]
    });


    //Echarts

    //初始化切换
    $(".animsition").animsition({

        inClass: 'fade-in-right',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
        loading: true,
        loadingParentElement: 'body', //animsition wrapper element
        loadingClass: 'animsition-loading',
        unSupportCss: ['animation-duration',
            '-webkit-animation-duration',
            '-o-animation-duration'
        ],
        //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
        //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".

        overlay: false,

        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body'
    });

    // 基于准备好的dom，初始化echarts实例

    var myChart3 = echarts.init(document.getElementById('main3'), 'macarons');

    // 指定图表的配置项和数据

    var date = ['2016/11/1', '2016/11/2', '2016/11/3', '2016/11/4', '2016/11/5', '2016/11/6', '2016/11/7', '2016/11/8', '2016/11/9', '2016/11/10',
        '2016/11/11', '2016/11/12', '2016/11/13', '2016/11/14', '2016/11/15', '2016/11/16', '2016/11/17', '2016/11/18'
        , '2016/11/19', '2016/11/20', '2016/11/21', '2016/11/22', '2016/11/23', '2016/11/24', '2016/11/25', '2016/11/26', '2016/11/27'
        , '2016/11/28', '2016/11/29', '2016/11/30'];

    function myHandler(data) {
        getEchartsDate(data)
        return data;
    }

    function getEchartsDate(res) {
        var data = res
        myChart3.setOption({
            xAxis: {
                data: data.map(function (v, i) {
                    return v.日期
                })
            },
            series: [
                {
                    // 根据名字对应到相应的系列
                    name: '孔距',
                    data: data.map(function (v, i) {
                        return v.孔距
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '排距',
                    data: data.map(function (v, i) {
                        return v.排距
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '孔数',
                    data: data.map(function (v, i) {
                        return v.孔数
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '孔总深',
                    data: data.map(function (v, i) {
                        return v.孔总深
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '平均孔深',
                    data: data.map(function (v, i) {
                        return v.平均孔深
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '炸药量',
                    data: data.map(function (v, i) {
                        return v.炸药量
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '抵抗线',
                    data: data.map(function (v, i) {
                        return v.抵抗线
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '超深',
                    data: data.map(function (v, i) {
                        return v.超深
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '填充',
                    data: data.map(function (v, i) {
                        return v.填充
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '爆破量',
                    data: data.map(function (v, i) {
                        return v.爆破量.toFixed(2)
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '炸药单耗',
                    data: data.map(function (v, i) {
                        return v.炸药单耗.toFixed(2)
                    })
                }
            ]
        });
    }

    function my_data() {
        var data = [];
        for (var i = 0; i < 30; i++) {
            data.push(Math.round(Math.random() * (1000 - 100) + 100));
        };
        return data;
    }

    var option3 = {
        title: {
            text: '项目报表柱状图'
        },
        tooltip: {
            trigger: 'axis',
            /* axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }*/
        },
        legend: {
            x: 'center',
            top: '8%',
            data: ['孔距', '排距', '孔数', '孔总深', '平均孔深', '炸药量', '抵抗线', '超深', '填充', '爆破量', '炸药单耗']
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                //数据视图
                dataView: {
                    show: true, readOnly: true, optionToContent: function (opt) {
                        var axisData = opt.xAxis[0].data;
                        var series = opt.series;
                        var table = '<table style="width:100%;text-align:center"><tbody><tr>'
                            + '<td>日期</td>';
                        for (var n = 0; n < series.length; n++) {
                            table += '<td>' + series[n].name + '</td>';
                        }
                        table += '</tr>';
                        for (var i = 0, l = axisData.length; i < l; i++) {
                            table += '<tr>'
                                + '<td>' + axisData[i] + '</td>';
                            for (var j = 0; j < series.length; j++) {
                                table += '<td>' + series[j].data[i] + '</td>';
                            }
                            table += '</tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                //刷新
                //restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            top: '37%',
            containLabel: true
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
        }, {
            start: 74,
            end: 100,
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                // 根据名字对应到相应的系列
                name: '孔距',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '排距',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '孔数',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '孔总深',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '平均孔深',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '炸药量',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '抵抗线',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '超深',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '填充',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '爆破量',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '炸药单耗',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。

    myChart3.setOption(option3);
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "孔距" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "排距" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "孔数" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "孔总深" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "平均孔深" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "抵抗线" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "超深" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "填充" })

    window.onresize = myChart3.resize;

});