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

//历史记录表格
function records(id) {
    //评分的历史记录表格
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
    $(".form_datetime").datepicker({
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
    });


    //查询
    $('#table').bootstrapTable({
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
});