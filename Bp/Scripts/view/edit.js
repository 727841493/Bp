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
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [5, 10, "All"],//可选的每页显示数据个数
        detailView: true,
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
    buildTable($detail.html('<table></table>').find('table'), cells, rows, row);
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
    $el.bootstrapTable({
        method: "post",//请求方式
        url: '/Table/QueryYearCost',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryBy(all),
        //detailFormatter: detailFormatter,
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