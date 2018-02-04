//参数
function queryBy(id) {
    var params = {
        "id": id,
    };
    return params;
}
//格式化时间
function changeDateFormat(cellval) {
    if (cellval !== null) {
        var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    }
}
function detailFormatter(index, row) {
    var html = [];
    $.each(row, function (key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}
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

    //查看信息
    function readFormatter(value, row, index) {
        return [
            '<a data-toggle="modal" data-target="#ReadMessages" onclick = "read(',
            "'" + row.ID + "'",
            ')">',
            value,
            '</a>',
        ].join('');
    }
    //下载共享文件
    function shareFormatter(value, row, index) {
        return [
            '<a  href="',
            "/Home/DownloadShare?id=",
            row.ID,
            '">',
            value,
            '</a>',
        ].join('');
    }


    $('#showMsg').bootstrapTable({
        //toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        url: '/Home/QueryMessages',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 4,//页面数据条数
        striped: true, // 是否显示行间隔色
        smartDisplay: true,
        showHeader: false,
        classes: "table table-no-bordered",
        columns: [
            {
                field: 'ID',
                title: "ID",
                valign: "middle",
                align: "center",
                visible: false,
            },
            {
                field: '状态',
                title: "状态",
                valign: "middle",
                align: "center",
                formatter: statusFormatter,
                cellStyle: function (value, row, index) {
                    if (value === -1) {
                        return { css: { "color": "red" } }
                    } else {
                        return { css: { "color": "green" } }
                    }
                }
            }, {
                field: '标题',
                title: "标题",
                valign: "middle",
                align: "center",
                formatter: readFormatter,
            }, {
                field: '发布时间',
                title: "发布时间",
                valign: "middle",
                align: "center",
                //formatter: function (value, row, index) {
                //    return changeDateFormat(value)
                //}
            }, {
                field: '发布人',
                title: "发布人",
                valign: "middle",
                align: "center",
            }
        ],
        formatNoMatches: function () {
            return "暂无通知";
        },
        formatLoadingMessage: function () {
            return "请稍等，正在加载中。。。";
        }
    });

    $('#showFlie').bootstrapTable({
        //toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        url: '/Home/QueryAllShare',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 4,//页面数据条数
        striped: true, // 是否显示行间隔色
        smartDisplay: true,
        showHeader: false,
        classes: "table table-no-bordered",
        columns: [
            {
                field: 'ID',
                title: "ID",
                valign: "middle",
                align: "center",
                visible: false,
            }, {
                field: '资料名称',
                title: "资料名称",
                valign: "middle",
                align: "center",
                formatter: shareFormatter,
            }, {
                field: '上传时间',
                title: "上传时间",
                valign: "middle",
                align: "center",
                formatter: function (value, row, index) {
                    return changeDateFormat(value)
                }
            }, {
                field: '上传人',
                title: "上传人",
                valign: "middle",
                align: "center",
            }, {
                title: "操作",
                valign: "middle",
                align: "center",
                formatter:deleteFormatter
            }
        ],
    });
    //删除
    function deleteFormatter(value, row, index) {
        return [
            '<a href="#"',
            'onclick="deleteFile(',
            "'",
            row.ID,
            "'",
            ')">',
            '删除',
            '</a>',
        ].join('');
    }

    //状态
    function statusFormatter(value) {
        var flag = "[已读]";
        if (value === -1) {
            flag = "[未读]";
        }
        return flag;
    }

    //一分钟刷新
    setInterval("refresh();", 1 * 60 * 1000);

    //添加留言
    $("#addMsg").click(function () {
        var title = $("#Title").val();
        var context = $("#Content").val();
        if (title === "") {
            alert("标题不能为空！")
            $("#Title").focus();
        } else {
            $.ajax({
                url: '/Home/AddMessages',
                type: 'post',
                data: {
                    "title": title,
                    "context": context,
                },
                success: function (result) {
                    alert(result.message);
                    $('#AddMessages').modal('hide')
                    $("#showMsg").bootstrapTable('refresh');
                }
            });
        }
    });

    //添加留言模态框关闭
    $('#AddMessages').on('hide.bs.modal', function () {
        $("#Title").val("");
        $("#Content").val("");
    });
    //查看留言模态框关闭
    $('#ReadMessages').on('hide.bs.modal', function () {
        $("#showMsg").bootstrapTable('refresh');
    });
    //上传共享文件模态框关闭
    $('#upShare').on('hide.bs.modal', function () {
        $("#showFlie").bootstrapTable('refresh');
    });
});

function refresh() {
    $("#showMsg").bootstrapTable('refresh');
    $("#showFlie").bootstrapTable('refresh');
}

//删除共享文件
function deleteFile(id) {
    $.ajax({
        url: '/Home/DeleteShareFile',
        type: 'post',
        data: {
            "id": id,
        },
        success: function (result) {
            if (!result.success) {
                alert(result.message);
            } else {
                window.location.reload();
            }
        }
    });
}

//通知信息
function read(id) {
    $('#readMsg').bootstrapTable('destroy');
    $('#readMsg').bootstrapTable({
        method: 'post',//请求方式
        url: '/Home/QueryMessages',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryBy(id),
        cardView: true,//是否显示详细视图
        columns: [
            {
                field: '标题',
                title: "标题",
                valign: "middle",
                align: "center",
            }, {
                field: '发布时间',
                title: "发布时间",
                valign: "middle",
                align: "center",
                //formatter: function (value, row, index) {
                //    return changeDateFormat(value)
                //}
            }, {
                field: '发布人',
                title: "发布人",
                valign: "middle",
                align: "center",
            }, {
                field: '内容',
                title: "内容",
                valign: "middle",
                align: "center",
            }, {
                field: '查看人',
                title: "已查看",
                valign: "middle",
                align: "center",
            }
        ]
    });
}