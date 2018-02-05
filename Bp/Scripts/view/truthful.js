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
