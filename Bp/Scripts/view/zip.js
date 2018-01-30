//筛选参数（开始时间，结束时间，台阶水平，岩性，爆破效果，历史记录（序号1，序号2，项目编码，爆破ID））
function queryBy(id) {
    var params = {
        "id": id,
    };
    return params;
}
//查询并预览图片
function queryFilePicture(id) {
    $.ajax({
        url: '/Zip/QueryFile',
        type: 'post',
        data: {
            "id": id,
        },
        success: function (result) {

            var Indicators = [];
            var Wrapper = [];
            var Button = [];

            $.each(result, function (i, v) {
                Indicators.push('<li data-target="#carousel-example-generic" data-slide-to="')
                Indicators.push(i)
                Indicators.push('"')
                Wrapper.push('<div class="item')
                if (i === 0) {
                    Indicators.push(' class="active"')
                    Wrapper.push(' active')
                }
                Indicators.push('></li>');

                Wrapper.push('"><img src="')
                Wrapper.push(v)
                Wrapper.push('"></div>')
            })

            Button.push('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>');

            $('#Indicators').html(Indicators.join(''));
            $('#Wrapper').html(Wrapper.join(''));
            $('#Button').html(Button.join(''));
            $('#image').modal('show');
        }
    });
}
//页面加载
$(function () {

    //下载文件
    function loadFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button  ', disabled,
            ' type= "button" class="btn btn-primary" onclick="window.location.href=',
            "'",
            '/Zip/DownloadFile?id=',
            row.项目编码,
            "'",
            '">',
            '下载',
            '</button>',
        ].join('');
    }

    function lookFormatter(value, row, index) {
        var flag = false;
        for (var i = 0; i < value.length; i++) {
            var index = value[i].lastIndexOf(".");
            var img = value[i].substring(index + 1);
            if (img == "bmp" || img == "png" || img == "gif" || img == "jpg" || img == "jpeg" || img == "JPG" || img == "PNG" || img == "JPEG" || img == "GIF") {
                flag = true;
                break;
            }
        }
        var disabled = flag ? "" : "disabled";
        return [
            '<button  ', disabled,
            ' data-toggle="modal" data-target="#loadModal" class="btn btn-primary" onclick="queryFilePicture(',
            "'" + row.项目编码 + "'",
            ')">',
            '预览',
            '</button>',
        ].join('');
    }

    $('#down').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        showExport: true,//导出按钮
        url: '/Zip/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryBy,
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
                    colspan: 2,
                    rowspan: 1,
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
                    title: '下载',
                    valign: "middle",
                    align: "center",
                    formatter: loadFormatter
                }, {
                    field: '预览',
                    title: '预览',
                    valign: "middle",
                    align: "center",
                    formatter: lookFormatter
                }
            ]
        ]
    });
});

