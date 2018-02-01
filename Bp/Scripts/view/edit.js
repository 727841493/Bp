$(function () {

    //数据保留两位小数
    function numberFormatter(v) {
        return v.toFixed(2);
    }

    //添加成本
    function addCostFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button ', disabled,
            ' data-toggle="modal" data-target="#editCost" class="btn btn-primary" onclick="cost(',
            "'" + row.项目ID + "'",
            ',',
            "'" + row.项目编码 + "'",
            ')">',
            '添加',
            '</button>',
        ].join('');
    }

    //修改成本
    function changeCostFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button ', disabled,
            ' data-toggle="modal" data-target="#editCost" class="btn btn-primary" onclick="cost(',
            "'" + row.项目ID + "'",
            ',',
            "'" + row.项目编码 + "'",
            ')">',
            '修改',
            '</button>',
        ].join('');
    }

    $('#showCost').bootstrapTable({
        method: "post",//请求方式
        url: '/Table/QueryCost',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [2, 5, 10],//可选的每页显示数据个数
        columns: [
            [
                {
                    field: '项目ID',
                    title: "项目ID",
                    valign: "middle",
                    align: "center",
                    visible: false,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '项目编码',
                    title: "项目编码",
                    valign: "middle",
                    align: "center",
                    visible: false,
                    colspan: 1,
                    rowspan: 2,
                }, {
                    field: '日期',
                    title: "项目名称",
                    valign: "middle",
                    align: "center",
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "项目成本",
                    valign: "middle",
                    align: "center",
                    colspan: 8,
                    rowspan: 1
                }, {
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
                    field: '总计',
                    title: '总计',
                    valign: "middle",
                    align: "center",
                    formatter: colorFormatter
                }, {
                    field: '添加',
                    title: "添加",
                    valign: "middle",
                    align: "center",
                    formatter: addCostFormatter
                }, {
                    field: '修改',
                    title: "修改",
                    valign: "middle",
                    align: "center",
                    formatter: changeCostFormatter
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
                if (result[0].总计 != null) {
                    $("#zk").val(result[0].钻孔);
                    $("#hgp").val(result[0].火工品);
                    $("#cjp").val(result[0].冲击炮);
                    $("#zz").val(result[0].装载);
                    $("#ys").val(result[0].运输);
                    $("#fz").val(result[0].辅助);
                    $("#qt").val(result[0].其他);
                }
            }
        });
    });

});
//项目ID,项目编码
function cost(id, bm) {
    $("#id").text(id);
    $("#bm").text(bm);
}

var flag;
//验证输入是否符合格式
function save() {
    var patrn = /^(([1-9]\d*)|\d)(\.\d{1,})?$/;
    var result = true;
    $("input[name=text]").each(function () {
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
            },
            success: function (result) {
                flag = result.data;
                if (!result.success) {
                    alert(result.message);
                } else {
                    window.location.reload();
                }
            }
        });
    }
}

//字体颜色（ture -- 蓝色，false -- 红色）
function colorFormatter(value, flag) {
    var a = "";
    if (flag.修改 == true) {
        var a = '<span style="color:blue">' + value + '</span>';
    } else if (flag.修改 == false) {
        var a = '<span style="color:red">' + value + '</span>';
    } else if (value == null) {
        var a = '<span>' + value + '</span>';
    }
    return a;
}