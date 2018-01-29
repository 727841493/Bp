
//页面加载
$(function () {
    $('#table').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        showExport: true,//导出按钮
        url: '/Home/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [2, 5, 10],//可选的每页显示数据个数
        columns: [
            {
                field: '项目编码',
                title: "项目编码",
                valign: "middle",
                align: "center",
                visible: false,
            }, {
                field: '台阶水平',
                title: "台阶水平",
                valign: "middle",
                align: "center",
            }, {
                field: '日期',
                title: "日期",
                valign: "middle",
                align: "center",
            }, {
                field: '岩性',
                title: "岩性",
                valign: "middle",
                align: "center",
            }, {
                field: '孔距',
                title: "孔距",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            }, {
                field: '排距',
                title: "排距",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            },
            {
                field: '孔数',
                title: "孔数",
                valign: "middle",
                align: "center",
            },
            {
                field: '孔总深',
                title: "孔总深 /m",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            },
            {
                field: '平均孔深',
                title: "平均孔深 /m",
                valign: "middle",
                align: "center",
            },
            {
                field: '炸药量',
                title: "炸药量 /kg",
                valign: "middle",
                align: "center",
            },
            {
                field: '抵抗线',
                title: "抵抗线 /m",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            },
            {
                field: '超深',
                title: "超深 /m",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            },
            {
                field: '填充',
                title: "填充 /m",
                valign: "middle",
                align: "center",
            },
            {
                field: '爆破量',
                title: "爆破量 /吨",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            },
            {
                field: '炸药单耗',
                title: "炸药单耗 kg/m³",
                valign: "middle",
                align: "center",
                formatter: numberFormatter
            }
        ]
    });

    //数据保留两位小数
    function numberFormatter(v) {
        return v.toFixed(2);
    }

});

