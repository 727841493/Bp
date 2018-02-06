//页面加载
$(function () {
    //项目设计数据
    $('#showTrue').bootstrapTable({
        method: "post",//请求方式
        toolbar: "#toolbar",//工具按钮用哪个容器
        showExport: true,//导出按钮
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [5, 10, "All"],//可选的每页显示数据个数
        detailView: true,
        onExpandRow: function (index, row, $detail) {
            expandTable($detail, 1, 1, row.项目编码, row.日期);
        },
        responseHandler: falseHandler,
        columns: [
            [
                {
                    field: '项目编码',
                    title: "项目编码",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    visible: false,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '台阶水平',
                    title: "台阶水平",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '日期',
                    title: "日期",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '岩性',
                    title: "岩性",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    title: "设计数据",
                    valign: "middle",
                    align: "center",
                    colspan: 11,
                    rowspan: 1,
                }
            ],
            [
                {
                    field: '孔距',
                    title: "孔距",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                }, {
                    field: '排距',
                    title: "排距",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '孔数',
                    title: "孔数",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '孔总深',
                    title: "孔总深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '平均孔深',
                    title: "平均孔深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '炸药量',
                    title: "炸药量 /kg",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '抵抗线',
                    title: "抵抗线 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '超深',
                    title: "超深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '填充',
                    title: "填充 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '爆破量',
                    title: "爆破量 /吨",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '炸药单耗',
                    title: "炸药单耗 kg/m³",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                }
            ]
        ]
    });
    //Echarts 对比
    //初始化切换

    //var dom = document.getElementById("container");
    //var myChart = echarts.init(dom);

    var mainContainer = document.getElementById('container');
    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
    var resizeMainContainer = function () {
        mainContainer.style.width = window.innerWidth + 'px';
        mainContainer.style.height = window.innerHeight * 0.8 + 'px';
    };
    //设置div容器高宽
    resizeMainContainer();
    // 初始化图表
    var myChart = echarts.init(mainContainer);
    $(window).on('resize', function () {//
        //屏幕大小自适应，重置容器高宽
        resizeMainContainer();
        mainChart.resize();
    });

    var app = {};
    option = null;
    // Generate data
    var category = [];
    var dottedBase = +new Date();
    var lineData = [];
    var barData = [];

    for (var i = 0; i < 20; i++) {
        var date = new Date(dottedBase += 3600 * 24 * 1000);
        category.push([
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        ].join('-'));
        var b = Math.random() * 200;
        var d = Math.random() * 200;
        barData.push(b)
        lineData.push(d + b);
    }


    // option
    option = {
        backgroundColor: '#0f375f',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['line', 'bar'],
            textStyle: {
                color: '#ccc'
            }
        },
        xAxis: {
            data: category,
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        },
        yAxis: {
            splitLine: { show: false },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        },
        series: [{
            name: 'line',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: lineData
        }, {
            name: 'bar',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#14c8d4' },
                            { offset: 1, color: '#43eec6' }
                        ]
                    )
                }
            },
            data: barData
        }, {
            name: 'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: 'rgba(20,200,212,0.5)' },
                            { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                            { offset: 1, color: 'rgba(20,200,212,0)' }
                        ]
                    )
                }
            },
            z: -12,
            data: lineData
        }, {
            name: 'dotted',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
                normal: {
                    color: '#0f375f'
                }
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            symbolMargin: 1,
            z: -10,
            data: lineData
        }]
    };;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }



    $(".animsitiontf").animsition({

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

    function falseHandler(data) {
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
                                if (typeof series[j].data[i] == "number") {
                                    table += '<td>' + series[j].data[i].toFixed(2) + '</td>';
                                } else {
                                    table += '<td>' + series[j].data[i] + '</td>';
                                }
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
            end: 20,
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

    //真实数据拟态框显示
    $('#myTure').on('show.bs.modal', function () {
        $.ajax({
            url: '/Table/QueryTureData',
            type: 'post',
            data: {
                "id": $("#id").text(),
                "name": $("#name").text(),
            },
            success: function (result) {
                if (result.length > 0 && result[0].炸药量 != null && result[0].排距 != null) {
                    //孔距
                    $("#tkj").val(result[0].孔距);
                    //排距
                    $("#tpj").val(result[0].排距);
                    //孔数
                    $("#tks").val(result[0].孔数);
                    //平均孔深
                    $("#tpjks").val(result[0].平均孔深);
                    //炸药量
                    $("#tzyl").val(result[0].炸药量);
                    //抵抗线
                    $("#tdkx").val(result[0].抵抗线);
                    //超深
                    $("#tcs").val(result[0].超深);
                    //填充
                    $("#ttc").val(result[0].填充);
                }
            }
        });
    });

});

//方法调用

//数据保留两位小数
function numberFormatter(v) {
    if (v != null) {
        return v.toFixed(2);
    }
}

//数据百分比显示
function numberFormatter1(v) {
    var str = Number(v * 100).toFixed(2);
    str += "%";
    return str;
}

//点击查看详情
function detailFormatter(index, row) {
    var html = [];
    $.each(row, function (key, value) {
        if (key == "项目编码" || key == "预览" || value == true || value == false) {
            return true;
        }
        if (typeof value == "number") {
            html.push('<p><b>' + key + ':</b> ' + value.toFixed(2) + '</p>');
        } else {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        }
    });
    return html.join('');
}
//参数
function queryBy(id, name) {
    var params = {
        "id": id,
        "name": name,
    };
    return params;
}
function sc(id, name) {
    $("#id").text(id);
    $("#name").text(name);
}

//添加/修改
function saveOrChange(value, row, index) {
    if (row.炸药单耗 == null && row.爆破量 == null && row.孔总深 == null) {
        return [
            '<button data-toggle="modal" data-target="#myTure" class="btn btn-primary" onclick="sc(',
            "'" + row.项目编码 + "'",
            ',',
            "'" + row.日期 + "'",
            ')">',
            '添加',
            '</button>',
        ].join('');
    } else {
        return [
            '<button data-toggle="modal" data-target="#myTure" class="btn btn-primary" onclick="sc(',
            "'" + row.项目编码 + "'",
            ',',
            "'" + row.日期 + "'",
            ')">',
            '修改',
            '</button>',
        ].join('');
    }
}
//设计数据和真实数据对比
function contrast(value, row, index) {
    var disabled = row.炸药单耗 == null ? "disabled" : ""
    return [
        '<button', disabled,
        ' data-toggle="modal" data-target="#myContrast" class="btn btn-primary" onclick="cost(',
        "'" + row.项目编码 + "'",
        ',',
        "'" + row.日期 + "'",
        ')">',
        '对比',
        '</button>',
    ].join('');
}

function cost(id, name) {
    $('#wc').bootstrapTable('destroy');
    $('#wc').bootstrapTable({
        method: 'post',//请求方式
        url: '/Table/TdContrastFd',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryBy(id, name),
        cardView: true,//是否显示详细视图
        columns: [
            {
                field: '孔距',
                title: "孔距",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '排距',
                title: "排距",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '孔数',
                title: "孔数",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '平均孔深',
                title: "平均孔深",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '炸药量',
                title: "炸药量",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '抵抗线',
                title: "抵抗线",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '超深',
                title: "超深",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '填充',
                title: "填充",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '孔总深',
                title: "孔总深",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '爆破量',
                title: "爆破量",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            }, {
                field: '炸药单耗',
                title: "炸药单耗",
                valign: "middle",
                align: "center",
                formatter: numberFormatter1
            },
        ],
    })
}
//父子表
function expandTable($detail, cells, rows, id, name) {
    buildTable($detail.html('<table></table>').find('table'), cells, rows, id, name);
}

function buildTable($el, cells, rows, id, name) {
    var i, j, row,
        columns = [],
        data = [];

    for (i = 0; i < cells; i++) {
        columns.push({
            field: 'field' + i,
            title: 'Cell' + i,
            sortable: true
        });
    }
    for (i = 0; i < rows; i++) {
        row = {};
        for (j = 0; j < cells; j++) {
            row['field' + j] = 'Row-' + i + '-' + j;
        }
        data.push(row);
    }
    $el.bootstrapTable({
        method: "post",//请求方式
        //toolbar: "#toolbar",//工具按钮用哪个容器
        //showExport: true,//导出按钮
        url: '/Table/QueryTureData',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryBy(id, name),
        //detailFormatter: detailFormatter,
        columns: [
            [
                {
                    field: '项目编码',
                    title: "项目编码",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    visible: false,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '日期',
                    title: "日期",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    title: "真实数据",
                    valign: "middle",
                    align: "center",
                    colspan: 11,
                    rowspan: 1,
                }, {
                    title: "操作",
                    valign: "middle",
                    align: "center",
                    colspan: 2,
                    rowspan: 1,
                }
            ], [
                {
                    field: '孔距',
                    title: "孔距",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                }, {
                    field: '排距',
                    title: "排距",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '孔数',
                    title: "孔数",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '孔总深',
                    title: "孔总深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '平均孔深',
                    title: "平均孔深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '炸药量',
                    title: "炸药量 /kg",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '抵抗线',
                    title: "抵抗线 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '超深',
                    title: "超深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '填充',
                    title: "填充 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '爆破量',
                    title: "爆破量 /吨",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '炸药单耗',
                    title: "炸药单耗 kg/m³",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    title: "添加/修改",
                    valign: "middle",
                    align: "center",
                    formatter: saveOrChange
                }, {
                    title: "对比",
                    valign: "middle",
                    align: "center",
                    formatter: contrast
                }
            ]
        ]
    });
}

function SaveChange() {
    var patrn = /^(([1-9]\d*)|\d)(\.\d{1,})?$/;
    var result = true;
    $("input[name=sc]").each(function () {
        if (!patrn.test(this.value)) {
            result = false;
        }
    })
    if (result == false) {
        alert("请输入正确格式的数字！");
    } else {
        //项目名称
        var id = $("#id").text();
        //日期
        var name = $("#name").text();
        //孔距
        var tkj = $("#tkj").val();
        //排距
        var tpj = $("#tpj").val();
        //孔数
        var tks = $("#tks").val();
        //平均孔深
        var tpjks = $("#tpjks").val();
        //炸药量
        var tzyl = $("#tzyl").val();
        //抵抗线
        var tdkx = $("#tdkx").val();
        //超深
        var tcs = $("#tcs").val();
        //填充
        var ttc = $("#ttc").val();
        $.ajax({
            url: '/Table/SaveOrChangeData',
            type: 'post',
            data: {
                "id": id,
                "name": name,
                "tkj": tkj,
                "tpj": tpj,
                "tks": tks,
                "tpjks": tpjks,
                "tzyl": tzyl,
                "tdkx": tdkx,
                "tcs": tcs,
                "ttc": ttc,
            },
            success: function (result) {
                if (!result.success) {
                    alert(result.message);
                } else {
                    $('#myTure').modal('hide');
                    $("#showTrue").bootstrapTable('refresh');
                }
            }
        });
    }
}
