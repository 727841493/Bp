$(function () {

    //数据保留两位小数
    function numberFormatter(v) {
        if (v != null) {
            return v.toFixed(2);
        }
    }

    //添加年份模态框关闭
    $('#addYear').on('hide.bs.modal', function () {
        $("#year").val("");
        $("#showYear").bootstrapTable('refresh');
    });

    //成本年份
    $('#showYear').bootstrapTable({
        method: "post",//请求方式
        url: '/Table/QueryCostYears',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        showExport: true,//导出按钮
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [5, 10, "All"],//可选的每页显示数据个数
        detailView: true,
        responseHandler: costHandler,
        onExpandRow: function (index, row, $detail) {
            expandTable($detail, 9, 12, row.年份);
        },
        columns: [
            [
                {
                    field: '年份',
                    title: "年份",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "采矿成本",
                    valign: "middle",
                    align: "center",
                    colspan: 9,
                    rowspan: 1
                },
                {
                    title: "操作",
                    valign: "middle",
                    align: "center",
                    colspan: 2,
                    rowspan: 1,
                }
            ], [
                {
                    field: '钻孔',
                    title: '钻孔',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '火工品',
                    title: '火工品',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '冲击炮',
                    title: '冲击炮',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '装载',
                    title: '装载',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '运输',
                    title: '运输',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '辅助',
                    title: '辅助',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '其他',
                    title: '其他',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '合计',
                    title: '总计',
                    valign: "middle",
                    align: "center",
                }, {
                    field: '产量',
                    title: '产量',
                    valign: "middle",
                    align: "center"
                }, {
                    title: '成本',
                    valign: "middle",
                    align: "center",
                    formatter: yearFormatter
                }, {
                    title: '删除',
                    valign: "middle",
                    align: "center",
                    formatter: deleteFormatter
                }
            ]
        ]
    });


    //成本拟态框显示
    $('#editCost').on('show.bs.modal', function () {
        $.ajax({
            url: '/Table/QueryCost',
            type: 'post',
            data: {
                "id": $("#id").text(),
                "bm": $("#bm").text(),
            },
            success: function (result) {
                if (result.length > 0) {
                    $("#zk").val(result[0].钻孔);
                    $("#hgp").val(result[0].火工品);
                    $("#cjp").val(result[0].冲击炮);
                    $("#zz").val(result[0].装载);
                    $("#ys").val(result[0].运输);
                    $("#fz").val(result[0].辅助);
                    $("#qt").val(result[0].其他);
                    $("#ycl").val(result[0].产量);
                }
            }
        });
    });

    $('#lookCost').on('hide.bs.modal', function () {
        $("#tye").text("");
        $("#ye").text("");
        $("#mon").text("");
    });


    //成本拟态框显示
    $('#lookCost').on('show.bs.modal', function () {
        $('#monCost').bootstrapTable('destroy');
        $('#monCost').bootstrapTable({
            method: "post",//请求方式
            url: '/Table/lookCost',//请求地址
            queryParamsType: 'C',// 重写分页传递参数
            queryParams: queryBy,
            pagination: true,//显示分页条
            sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
            pageNumber: 1,//首页页码
            pageSize: 12,//页面数据条数
            pageList: [5, 10, "All"],//可选的每页显示数据个数
            detailView: true,
            detailFormatter: detailFormatter,
            columns: [
                {
                    field: '月份',
                    title: '月份',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '钻孔',
                    title: '钻孔',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '火工品',
                    title: '火工品',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '冲击炮',
                    title: '冲击炮',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '装载',
                    title: '装载',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '运输',
                    title: '运输',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '辅助',
                    title: '辅助',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '其他',
                    title: '其他',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '总计',
                    title: '总计',
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                }
            ]
        });
    });

    var da;
    //Echarts
    function costHandler(data) {
        da = data;
        return data;
    }

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).text();
        if (activeTab.trim() == '月份') {
            buildMonChart(da);
        } else if (activeTab.trim() == '年份') {
            buildChart(da);
        } else if (activeTab.trim() == '年成本') {
            buildChartCost(da);
        } else if (activeTab.trim() == '月成本') {
            buildMonChartCost(da);
        }
    });

    //判断手机端还是PC端
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

    //年份
    function buildChart(res) {
        var list = [];
        var ser = [];
        for (var i = 0; i < res.length; i++) {
            list.push(res[i].年份.toString());
            ser.push({
                name: res[i].年份.toString(),
                type: 'bar',
                data: [res[i].钻孔, res[i].火工品, res[i].冲击炮, res[i].装载, res[i].运输, res[i].辅助, res[i].其他, res[i].合计],
            });
        }
        var mainContainer = document.getElementById('myColumn');
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
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                width: '90%',
                height: 1000,
                x: 'center',
                data: list,
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["钻孔", "火工品", "冲击炮", "装载", "运输", "辅助", "其他", "合计"],
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
                },
            ],
            grid: {
                top: $("#t").val(),
                containLabel: true
            },
            series: ser
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "1995" })
        }
    }

    //年成本
    function buildChartCost(res) {
        var list = [];
        var ser = [];
        for (var i = 0; i < res.length; i++) {
            list.push(res[i].年份.toString());
            ser.push({
                name: res[i].年份.toString(),
                type: 'bar',
                data: [(res[i].钻孔 / res[i].产量).toFixed(2), (res[i].火工品 / res[i].产量).toFixed(2), (res[i].冲击炮 / res[i].产量).toFixed(2),
                (res[i].装载 / res[i].产量).toFixed(2), (res[i].运输 / res[i].产量).toFixed(2),
                (res[i].辅助 / res[i].产量).toFixed(2), (res[i].其他 / res[i].产量).toFixed(2), (res[i].合计 / res[i].产量).toFixed(2)],
            });
        }
        var yco = document.getElementById('yco');
        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        var resizeMainContainer = function () {
            yco.style.width = window.innerWidth + 'px';
            yco.style.height = window.innerHeight * 0.8 + 'px';
        };
        //设置div容器高宽
        resizeMainContainer();
        // 初始化图表
        var myChartCost = echarts.init(yco);
        $(window).on('resize', function () {
            //屏幕大小自适应，重置容器高宽
            resizeMainContainer();
            myChartCost.resize();
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
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                width: '90%',
                height: 1000,
                x: 'center',
                data: list,
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["钻孔", "火工品", "冲击炮", "装载", "运输", "辅助", "其他", "合计"],
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
            series: ser
        };
        if (option && typeof option === "object") {
            myChartCost.setOption(option, true);
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "1995" })
        }
    }


    //月份
    function buildMonChart(res) {
        var list = [];
        var ser = [];
        for (var i = 0; i < res.length; i++) {
            $.ajax({
                url: '/Table/QueryYearCost',
                type: 'post',
                async: false,
                data: {
                    "id": res[i].年份.toString(),
                },
                success: function (result) {
                    for (var j = 0; j < result.length; j++) {
                        var year = "";
                        if (list.indexOf(result[j].月份) == -1) {
                            list.push(result[j].月份.toString());
                        }
                        $.ajax({
                            url: '/Table/lookCost',
                            type: 'post',
                            async: false,
                            data: {
                                "ye": result[j].年份.toString(),
                                "mon": result[j].月份.toString()
                            },
                            success: function (data) {
                                year = data[0].年份;
                            }
                        });
                        ser.push({
                            name: result[j].月份,
                            type: 'bar',
                            tooltip: {
                                formatter: function (params) {
                                    var str = '<style>td{padding:5px;}</style><table>';
                                    str += '<tr><td>' + year + '/' + params.seriesName + '</td></tr>';
                                    str += '<tr><td>' + params.name + '：' + params.data.toFixed(2) + '</td></tr>';
                                    str += '</table>';
                                    return str
                                }
                            },
                            data: [result[j].钻孔, result[j].火工品, result[j].冲击炮, result[j].装载, result[j].运输, result[j].辅助, result[j].其他, result[j].总计],
                        });
                    }
                }
            });
        }
        var container = document.getElementById('column');
        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        var resizeMainContainer = function () {
            container.style.width = container.style.width;
            container.style.height = window.innerHeight * 0.8 + 'px';
        };
        //设置div容器高宽
        resizeMainContainer();
        // 初始化图表
        var chart = echarts.init(container);
        $(window).on('resize', function () {
            //屏幕大小自适应，重置容器高宽
            resizeMainContainer();
            chart.resize();
        });
        var app = {};
        option = null;
        app.title = '数据对比';

        option = {
            tooltip: {
                //trigger: 'axis',
                trigger: 'item',
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
                    saveAsImage: { show: true }
                }
            },
            legend: {
                width: '90%',
                height: 1000,
                x: 'center',
                data: list,
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["钻孔", "火工品", "冲击炮", "装载", "运输", "辅助", "其他", "合计"],
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
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            grid: {
                containLabel: true
            },
            series: ser
        };
        if (option && typeof option === "object") {
            chart.setOption(option, true);
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "1995" })
        }
    }

    //月成本
    function buildMonChartCost(res) {
        var list = [];
        var ser = [];
        for (var i = 0; i < res.length; i++) {
            $.ajax({
                url: '/Table/QueryYearCost',
                type: 'post',
                async: false,
                data: {
                    "id": res[i].年份.toString(),
                },
                success: function (result) {
                    for (var j = 0; j < result.length; j++) {
                        var year = "";
                        if (list.indexOf(result[j].月份) == -1) {
                            list.push(result[j].月份.toString());
                        }
                        $.ajax({
                            url: '/Table/lookCost',
                            type: 'post',
                            async: false,
                            data: {
                                "ye": result[j].年份.toString(),
                                "mon": result[j].月份.toString()
                            },
                            success: function (data) {
                                year = data[0].年份;
                            }
                        });
                        ser.push({
                            name: result[j].月份,
                            type: 'bar',
                            tooltip: {
                                formatter: function (params) {
                                    var str = '<style>td{padding:5px;}</style><table>';
                                    str += '<tr><td>' + year + '/' + params.seriesName + '</td></tr>';
                                    str += '<tr><td>' + params.name + '：' + params.data+ '</td></tr>';
                                    str += '</table>';
                                    return str
                                }
                            },
                            data: [(result[j].钻孔 / result[j].产量).toFixed(2), (result[j].火工品 / result[j].产量).toFixed(2),
                                (result[j].冲击炮 / result[j].产量).toFixed(2), (result[j].装载 / result[j].产量).toFixed(2),
                                (result[j].运输 / result[j].产量).toFixed(2), (result[j].辅助 / result[j].产量).toFixed(2),
                                (result[j].其他 / result[j].产量).toFixed(2), (result[j].总计 / result[j].产量).toFixed(2)],
                        });
                    }
                }
            });
        }

        var mco = document.getElementById('mco');
        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        var resizeMainContainer = function () {
            mco.style.width = window.innerWidth + 'px';
            mco.style.height = window.innerHeight * 0.8 + 'px';
        };
        //设置div容器高宽
        resizeMainContainer();
        // 初始化图表
        var chartCost = echarts.init(mco);
        $(window).on('resize', function () {
            //屏幕大小自适应，重置容器高宽
            resizeMainContainer();
            chartCost.resize();
        });
        var app = {};
        option = null;
        app.title = '数据对比';

        option = {
            tooltip: {
                //trigger: 'axis',
                trigger: 'item',
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
                    saveAsImage: { show: true }
                }
            },
            legend: {
                width: '90%',
                height: 1000,
                x: 'center',
                data: list,
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["钻孔", "火工品", "冲击炮", "装载", "运输", "辅助", "其他", "合计"],
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
                containLabel: true
            },
            series: ser
        };
        if (option && typeof option === "object") {
            chartCost.setOption(option, true);
            //myChart.dispatchAction({ type: 'legendUnSelect', name: "1995" })
        }
    }

});
//方法调用
//添加或修改成本
function saveOrChangeCost(value, row, index) {
    var text = row.总计 == null ? "添加" : "修改";
    return [
        '<button data-toggle="modal" data-target="#editCost" class="btn btn-primary" onclick="cost(',
        "'" + row.月份 + "'",
        ',',
        "'" + row.年份 + "'",
        ')">',
        text,
        '</button>',
    ].join('');
}
//查看成本
function lookCost(value, row, index) {
    var disabled = row.总计 == null ? "disabled" : "";
    return [
        '<button ', disabled, ' data-toggle="modal" data-target="#lookCost" class="btn btn-primary" onclick="see(',
        "'" + row.月份 + "'",
        ',',
        "'" + row.年份 + "'",
        ')">',
        '查看',
        '</button>',
    ].join('');
}

//点击查看详情
function detailFormatter(index, row) {
    var html = [];
    html.push('<div style=" overflow:scroll; width:100%; height:300px;">')
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
    html.push('</div>')
    return html.join('');
}
//一年成本核算
function yearFormatter(value, row, index) {
    var disabled = row.合计 == null ? "disabled" : "";
    return [
        '<button ', disabled, ' data-toggle="modal" data-target="#lookCost" class="btn btn-primary" onclick="seeAll(',
        "'" + row.年份 + "'",
        ')">',
        '查看',
        '</button>',
    ].join('');
}
function seeAll(y) {
    $("#tye").text(y)
}

//删除
function deleteFormatter(value, row, index) {
    return [
        '<button  class="btn btn-primary" onclick="delete_Year(',
        "'" + row.年份 + "'",
        ')">',
        '删除',
        '</button>',
    ].join('');
}

//删除通知
function delete_Year(id) {
    var r = confirm("确定删除吗？");
    if (r == true) {
        $.ajax({
            url: '/Table/deleteYear',
            type: 'post',
            data: {
                "id": id,
            },
            success: function (result) {
                if (!result.success) {
                    alert(result.message);
                } else {
                    $('#showYear').bootstrapTable('refresh');
                }
            }
        });
    }
}

//参数
function queryBy(id) {
    var params = {
        "id": id,
        "ye": $("#ye").text(),
        "mon": $("#mon").text(),
        "tye": $("#tye").text(),
    };
    return params;
}
//父子表
function expandTable($detail, cells, rows, row) {
    buildTable($detail.html('<button id="ed" type="button" class="btn btn-primary" style="float:right">导出</button><table id="' + row + '"></table>').find('table'), cells, rows, row);
}

function buildTable($el, cells, rows, all) {
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
    $("#" + all).bootstrapTable({
        method: "post",//请求方式
        url: '/Table/QueryYearCost',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryBy(all),
        detailView: true,
        detailFormatter: detailFormatter,
        columns: [
            [{
                field: '月份',
                title: "月份",
                valign: "middle",
                align: "center",
                colspan: 1,
                rowspan: 2,
            },
            {
                title: "采矿成本",
                valign: "middle",
                align: "center",
                colspan: 9,
                rowspan: 1
            },
            {
                title: "操作",
                valign: "middle",
                align: "center",
                colspan: 2,
                rowspan: 1
            }
            ], [
                {
                    field: '钻孔',
                    title: '钻孔',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '火工品',
                    title: '火工品',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '冲击炮',
                    title: '冲击炮',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '装载',
                    title: '装载',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '运输',
                    title: '运输',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '辅助',
                    title: '辅助',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '其他',
                    title: '其他',
                    valign: "middle",
                    align: "center"
                },
                {
                    field: '总计',
                    title: '总计',
                    valign: "middle",
                    align: "center",
                    //formatter: colorFormatter
                }, {
                    field: '产量',
                    title: '产量',
                    valign: "middle",
                    align: "center"
                },
                {
                    title: '添加/修改',
                    valign: "middle",
                    align: "center",
                    formatter: saveOrChangeCost
                },
                {
                    title: '成本',
                    valign: "middle",
                    align: "center",
                    formatter: lookCost
                }
            ]
        ]
    });

    $("#ed").click(function () {
        //data 需要导出的数据
        var data = JSON.stringify($("#" + all).bootstrapTable('getData'));
        if (data == '')
            return;
        //excel 表格输出顺序及标题
        var title = [{ 年: '年份' }, { 月份: '月份' }, { 钻孔: '钻孔' }, { 火工品: '火工品' }, { 冲击炮: '冲击炮' }, { 装载: '装载' }, { 运输: '运输' },
        { 辅助: '辅助' }, { 其他: '其他' }, { 总计: '总计' }, { 产量: '产量' }];
        toExcel("Report", data, title);
    });
}

//添加年份
function addOneYear() {
    var val = $("#year").val();
    var regu = /^[1-9]\d*$/;
    if (val == "") {
        alert("请填写数据!");
    } else {
        if (!regu.test(val)) {
            alert("请输入正确格式的年份");
        } else {
            $.ajax({
                url: '/Table/AddOneYear',
                type: 'post',
                data: {
                    "year": $("#year").val()
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                    } else {
                        $('#addYear').modal('hide');
                    }
                }
            });
        }
    }
};
//月份，年份
function cost(id, bm) {
    $("#id").text(id);
    $("#bm").text(bm);
}
//月份，年份
function see(mon, year) {
    $("#mon").text(mon);
    $("#ye").text(year);
}
//验证输入是否符合格式
function save() {
    var patrn = /^(([1-9]\d*)|\d)(\.\d{1,})?$/;
    var result = true;
    $("input[name=v]").each(function () {
        if (!patrn.test(this.value)) {
            result = false;
        }
    })
    if (result == false) {
        alert("请输入正确的数字！");
    } else {
        $.ajax({
            url: '/Table/SaveOrChange',
            type: 'post',
            data: {
                "id": $("#id").text(),
                "bm": $("#bm").text(),
                "zk": $("#zk").val(),
                "hgp": $("#hgp").val(),
                "cjp": $("#cjp").val(),
                "zz": $("#zz").val(),
                "ys": $("#ys").val(),
                "fz": $("#fz").val(),
                "qt": $("#qt").val(),
                "ycl": $("#ycl").val(),
            },
            success: function (result) {
                if (!result.success) {
                    alert(result.message);
                } else {
                    $("#total").val(result.data);
                    $('#editCost').modal('hide');
                    $("#showYear").bootstrapTable('refresh');

                }
            }
        });
    }
}

//字体颜色（ture -- 蓝色，false -- 红色）
function colorFormatter(value, row, index) {
    var a = "";
    var flag = $("#total").val();
    if (value == null) {
        var a = '<span>' + "-" + '</span>';
    } else {
        if (value != null) {
            if (flag == "true") {
                var a = '<span style="color:blue">' + value + '</span>';
            } else {
                var a = '<span style="color:red">' + value + '</span>';
            }
        }
    }
    return a;
}

//FileName 生成的Excel文件名称
function toExcel(FileName, JSONData, ShowLabel) {
    //先转化json  
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = '<table>';

    //设置表头  
    var row = "<tr align='left'>";//设置Excel的左居中
    for (var i = 0, l = ShowLabel.length; i < l; i++) {
        for (var key in ShowLabel[i]) {
            row += "<td>" + ShowLabel[i][key] + '</td>';
        }
    }


    //换行  
    excel += row + "</tr>";

    //设置数据  
    for (var i = 0; i < arrData.length; i++) {
        var rowData = "<tr align='left'>";

        for (var y = 0; y < ShowLabel.length; y++) {
            for (var k in ShowLabel[y]) {
                if (ShowLabel[y].hasOwnProperty(k)) {
                    rowData += "<td style='vnd.ms-excel.numberformat:@'>" + (arrData[i][k] === null ? "" : arrData[i][k]) + "</td>";
                    //vnd.ms-excel.numberformat:@ 输出为文本
                }
            }
        }

        excel += rowData + "</tr>";
    }

    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";

    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}  
