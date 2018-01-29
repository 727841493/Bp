//筛选参数（开始时间，结束时间，台阶水平，岩性，爆破效果，历史记录（序号1，序号2，项目编码，爆破ID））
function queryParams(id) {
    var params = {
        "id": id,
    };
    return params;
}

function down(id) {
    $.ajax({
        url: '/Zip/DownloadFile',
        type: 'post',
        data: {
            "id": id,
        },
    });
}

//页面加载
$(function () {

    //下载
    function loadFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button  ', disabled,
            ' data-toggle="modal" data-target="#loadModal" class="btn btn-primary" onclick="down(',
            "'" + row.项目编码 + "'",
            ')">',
            '下载',
            '</button>',
        ].join('');
    }



    $('#down').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        showExport: true,//导出按钮
        url: '/Zip/QueryStatistics',//请求地址
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
                },
                {
                    title: "下载",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 1,
                    formatter: loadFormatter
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
                    field: '下载',
                    valign: "middle",
                    align: "center",
                    formatter: loadFormatter
                }
            ]
        ]
    });
});

