﻿//页面加载
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

    function falseHandler(data) {
        //查询真实数据
        var tada = new Array();
        for (var i = 0; i < data.length; i++) {
            $.ajax({
                url: '/Table/QueryTureData',
                type: 'post',
                async: false,
                data: {
                    "id": data[i].项目编码,
                    "name": data[i].日期,
                },
                success: function (result) {
                    if (result.length > 0) {
                        for (var res of result) {
                            tada.push({
                                "孔距": res.孔距,
                                "排距": res.排距,
                                "孔数": res.孔数,
                                "孔总深": res.孔总深,
                                "平均孔深": res.平均孔深,
                                "炸药量": res.炸药量,
                                "抵抗线": res.抵抗线,
                                "超深": res.超深,
                                "填充": res.填充,
                                "爆破量": res.爆破量,
                                "炸药单耗": res.炸药单耗,
                            });
                        }
                    }
                }
            });
        }
        buildChart(data, tada);
        return data;
    }

    var ua = navigator.userAgent;

    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

        isAndroid = ua.match(/(Android)\s+([\d.]+)/),

        isMobile = isIphone || isAndroid;

    if (isMobile) {
        $("#t").val('40%')
    } else {
        $("#t").val(60)
    }

    function buildChart(data, tada) {
        var mainContainer = document.getElementById('manyColumn');
        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        var resizeMainContainer = function () {
            mainContainer.style.width = mainContainer.style.width;
            mainContainer.style.height = window.innerHeight * 0.8 + 'px';
        };
        //设置div容器高宽
        resizeMainContainer();
        // 初始化图表
        var myChart = echarts.init(mainContainer);
        $(window).on('resize', function () {
            //屏幕大小自适应，重置容器高宽
            resizeMainContainer();
            myChart.resize();
        });
        var app = {};
        option = null;
        app.title = '数据对比';

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                orient: 'vertical',
                feature: {
                    //dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    //restore: { show: true },
                    //saveAsImage: { show: true }
                }
            },
            legend: {
                width: '90%',
                height: 1000,
                x: 'center',
                data: ["设-孔距", "真-孔距", "设-排距", "真-排距", "设-孔数", "真-孔数",
                    "设-孔总深", "真-孔总深", "设-平均孔深", "真-平均孔深",
                    "设-炸药量", "真-炸药量", "设-抵抗线", "真-抵抗线", "设-超深", "真-超深",
                    "设-填充", "真-填充", "设-爆破量", "真-爆破量", "设-炸药单耗", "真-炸药单耗"]
            },
            xAxis: [
                {
                    type: 'category',
                    data: data.map(function (v, i) {
                        return v.日期
                    }),
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            grid: {
                top: $("#t").val(),
                containLabel: true
            },
            series: [
                {
                    name: '设-孔距',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.孔距 != null) {
                            return v.孔距.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-孔距',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.孔距 != null) {
                            return v.孔距.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-排距',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.排距 != null) {
                            return v.排距.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-排距',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.排距 != null) {
                            return v.排距.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-孔数',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.孔数 != null) {
                            return v.孔数.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-孔数',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.孔数 != null) {
                            return v.孔数.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-孔总深',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.孔总深 != null) {
                            return v.孔总深.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-孔总深',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.孔总深 != null) {
                            return v.孔总深.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-平均孔深',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.平均孔深 != null) {
                            return v.平均孔深.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-平均孔深',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.平均孔深 != null) {
                            return v.平均孔深.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-炸药量',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.炸药量 != null) {
                            return v.炸药量.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-炸药量',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.炸药量 != null) {
                            return v.炸药量.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-抵抗线',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.抵抗线 != null) {
                            return v.抵抗线.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '真-抵抗线',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.抵抗线 != null) {
                            return v.抵抗线.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-超深',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.超深 != null) {
                            return v.超深.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-超深',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.超深 != null) {
                            return v.超深.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-填充',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.填充 != null) {
                            return v.填充.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-填充',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.填充 != null) {
                            return v.填充.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-爆破量',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.爆破量 != null) {
                            return v.爆破量.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }, {
                    name: '真-爆破量',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.爆破量 != null) {
                            return v.爆破量.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '设-炸药单耗',
                    type: 'bar',
                    data: data.map(function (v, i) {
                        if (v.炸药单耗 != null) {
                            return v.炸药单耗.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                },
                {
                    name: '真-炸药单耗',
                    type: 'bar',
                    data: tada.map(function (v, i) {
                        if (v.炸药单耗 != null) {
                            return v.炸药单耗.toFixed(2)
                        } else {
                            return 0;
                        }
                    })
                }
            ],
            dataZoom: [//给x轴设置滚动条  
                {
                    start: 0,//默认为0  
                    end: 100 - 1500 / 31,//默认为100  
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    handleSize: 0,//滑动条的 左右2个滑动条的大小  
                    height: 8,//组件高度  
                    left: 50, //左边的距离  
                    right: 40,//右边的距离  
                    bottom: 26,//右边的距离  
                    handleColor: '#ddd',//h滑动图标的颜色  
                    handleStyle: {
                        borderColor: "#cacaca",
                        borderWidth: "1",
                        shadowBlur: 2,
                        background: "#ddd",
                        shadowColor: "#ddd",
                    },
                    fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                        //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变  
                        //给第一个设置0，第四个设置1，就是垂直渐变  
                        offset: 0,
                        color: '#1eb5e5'
                    }, {
                        offset: 1,
                        color: '#5ccbb1'
                    }]),
                    backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色  
                    showDataShadow: false,//是否显示数据阴影 默认auto  
                    showDetail: false,//即拖拽时候是否显示详细数值信息 默认true  
                    handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                    filterMode: 'filter',
                },
                //下面这个属性是里面拖到  
                {
                    type: 'inside',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,//默认为1  
                    end: 100 - 1500 / 31,//默认为100  
                },
            ],
        };
        ;
        if (option && typeof option === "object") {
            myChart.setOption(option, true);

            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-孔距" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-孔距" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-排距" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-排距" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-孔数" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-孔数" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-孔总深" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-孔总深" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-平均孔深" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-平均孔深" })
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "设-炸药量" })
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "真-炸药量" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-抵抗线" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-抵抗线" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-超深" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-超深" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-填充" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-填充" })
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "设-爆破量" })
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "真-爆破量" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "设-炸药单耗" })
            myChart.dispatchAction({ type: 'legendUnSelect', name: "真-炸药单耗" })
        }
    }





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
        detailView: true,
        detailFormatter: detailFormatter,
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
