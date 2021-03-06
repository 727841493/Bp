﻿//筛选参数（开始时间，结束时间，台阶水平，岩性，爆破效果，历史记录（序号1，序号2，项目编码，爆破ID））
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

//数据保留两位小数
function numberFormatter(v) {
    if (v != null) {
        return v.toFixed(2);
    }
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
            } else {
                $('#myModal').modal('hide');
            }
        }
    });
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

//最优选择筛选
function MaxFormatter(data, index) {
    var best = [];
    //块度
    if (index == 1) {
        for (var i = 0; i < data.length - 1; i++) {
            for (var j = 0; j < data.length - i - 1; j++) {
                if (data[j].块度平均分 < data[j + 1].块度平均分) {
                    var swap = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = swap;
                }
            }
        }
    } else if (index == 2) {
        //抛掷
        for (var i = 0; i < data.length - 1; i++) {
            for (var j = 0; j < data.length - i - 1; j++) {
                if (data[j].抛掷平均分 < data[j + 1].抛掷平均分) {
                    var swap = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = swap;
                }
            }
        }
    } else if (index == 3) {
        //根底
        for (var i = 0; i < data.length - 1; i++) {
            for (var j = 0; j < data.length - i - 1; j++) {
                if (data[j].根底平均分 < data[j + 1].根底平均分) {
                    var swap = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = swap;
                }
            }
        }
    } else if (index == 4) {
        //伞岩
        for (var i = 0; i < data.length - 1; i++) {
            for (var j = 0; j < data.length - i - 1; j++) {
                if (data[j].伞岩平均分 < data[j + 1].伞岩平均分) {
                    var swap = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = swap;
                }
            }
        }
    }
    var list = data.slice(0, 3);
    for (var i = 0; i < list.length; i++) {
        if (list[i].块度平均分 == null || list[i].抛掷平均分 == null || list[i].根底平均分 == null || list[i].伞岩平均分 == null) {
            continue;
        } else {
            best.push(list[i]);
        }
    }
    return list;
}

//查询并预览图片
function queryFilePicture(id) {
    $.ajax({
        url: '/Table/QueryFile',
        type: 'post',
        data: {
            "id": id,
        },
        success: function (result) {

            var Indicators = [];
            var Wrapper = [];
            var Button = [];

            $.each(result, function (i, v) {
                var list = v.split("/");
                Indicators.push('<li data-target="#carousel-example-generic" data-slide-to="')
                Indicators.push(i)
                Indicators.push('"')
                Wrapper.push('<div class="item')
                if (i === 0) {
                    Indicators.push(' class="active"')
                    Wrapper.push(' active')
                }
                Indicators.push('></li>');

                Wrapper.push('"><img id ="imgTest" src="')
                Wrapper.push(v)
                Wrapper.push('">')
                Wrapper.push('<div class="carousel-caption" style="display:none">')
                Wrapper.push('<p id="picId">')
                Wrapper.push(list[list.length - 2])
                Wrapper.push('</p>')
                Wrapper.push('<p id= "picName">')
                Wrapper.push(list[list.length - 1])
                Wrapper.push('</p>')
                Wrapper.push('</div>')
                Wrapper.push('</div>')
            })

            Button.push('<button type="button" class="btn btn-default" onclick="tranImg(180)">旋转</button>');
            Button.push('<button type="button" class="btn btn-default" onclick="deletePic()">删除</button>');
            Button.push('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>');

            $('#Indicators').html(Indicators.join(''));
            $('#Wrapper').html(Wrapper.join(''));
            $('#Button').html(Button.join(''));
            $('#image').modal('show');
        }
    });
}

//删除图片
function deletePic() {
    var div = document.getElementsByClassName("item active", "div");
    var id = div[0].children[1].children[0].innerHTML;
    $.ajax({
        url: '/Table/deletePic',
        type: 'post',
        data: {
            "id": id,
        },
        success: function (result) {
            if (!result.success) {
                alert(result.message);
            } else {
                location.reload();
            }
        }
    })
}
//优化意见
function queryProject() {
    //块度
    $('#block').bootstrapTable('destroy');
    $('#block').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        //showExport: true,//导出按钮
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        sortName: "name",
        sortOrder: "desc",
        detailView: true,
        detailFormatter: detailFormatter,
        responseHandler: function (data) {
            var list = MaxFormatter(data, 1)
            return list;
        },
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
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "爆破效果",
                    valign: "middle",
                    align: "center",
                    colspan: 4,
                    rowspan: 1
                }
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                }
            ]
        ]
    });
    //抛掷
    $('#throw').bootstrapTable('destroy');
    $('#throw').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        //showExport: true,//导出按钮
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        sortName: "name",
        sortOrder: "desc",
        detailView: true,
        detailFormatter: detailFormatter,
        responseHandler: function (data) {
            var list = MaxFormatter(data, 2)
            return list;
        },
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
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "爆破效果",
                    valign: "middle",
                    align: "center",
                    colspan: 4,
                    rowspan: 1
                }
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                }
            ]
        ]
    });
    //根底
    $('#found').bootstrapTable('destroy');
    $('#found').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        //showExport: true,//导出按钮
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        sortName: "name",
        sortOrder: "desc",
        detailView: true,
        detailFormatter: detailFormatter,
        responseHandler: function (data) {
            var list = MaxFormatter(data, 3)
            return list;
        },
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
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "爆破效果",
                    valign: "middle",
                    align: "center",
                    colspan: 4,
                    rowspan: 1
                }
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                }
            ]
        ]
    });
    //伞岩
    $('#san').bootstrapTable('destroy');
    $('#san').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        //showExport: true,//导出按钮
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        sortName: "name",
        sortOrder: "desc",
        detailView: true,
        detailFormatter: detailFormatter,
        responseHandler: function (data) {
            var list = MaxFormatter(data, 4)
            return list;
        },
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
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    title: "爆破效果",
                    valign: "middle",
                    align: "center",
                    colspan: 4,
                    rowspan: 1
                }
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                }
            ]
        ]
    });
}
//历史记录表格
function records(id) {
    //评分的历史记录表格
    $('#history').bootstrapTable('destroy');
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
function upFile(id, nm) {
    $("#ubm").val(id);
    $("#unm").val(nm);
}
function tranImg(trun) {
    var imgClass = document.getElementsByClassName('item active');
    var imgObj = imgClass[0].firstElementChild;
    var current = 0;
    if (imgObj.style.transform == "") {
        current = (current + trun) % 360;
        imgObj.style.transform = 'rotate(' + current + 'deg)';
    } else {
        imgObj.style.transform = "";
    }
}
$(function () {
    //预览轮播图(设置不自动播放)
    $('#carousel-example-generic').carousel({
        pause: true,
        interval: false
    });
    //日期控件
    $(".form_datetime").datetimepicker({
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
        getEchartsDate();
    });


    //查询
    selections = [];
    $('#table').bootstrapTable({
        toolbar: "#toolbar",//工具按钮用哪个容器
        method: "post",//请求方式
        showExport: true,//导出按钮
        //showColumns: "true",//选择显示的列
        showToggle: "table",//切换视图
        showRefresh: "true",//刷新
        url: '/Table/QueryStatistics',//请求地址
        queryParamsType: 'C',// 重写分页传递参数
        queryParams: queryParams,
        pagination: true,//显示分页条
        sidePagination: "client",//设置在哪里进行分页( 'client' 客户端 或者 'server' 服务器)
        pageNumber: 1,//首页页码
        pageSize: 10,//页面数据条数
        pageList: [5, 10, "All"],//可选的每页显示数据个数
        sortName: "name",
        sortOrder: "desc",
        detailView: true,
        detailFormatter: detailFormatter,
        maintainSelected: true, //checkbox的选择项
        responseHandler: myHandler,
        columns: [
            [
                {
                    field: 'state',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle',
                    colspan: 1,
                    rowspan: 2,
                    formatter: stateFormatter
                }, {
                    field: '项目编码',
                    title: "项目编码",
                    valign: "middle",
                    align: "center",
                    visible: false,
                    sortable: true,
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
                },
                {
                    field: '日期',
                    title: "日期",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '岩性',
                    title: "岩性",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '孔距',
                    title: "孔距 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '排距',
                    title: "排距 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '孔数',
                    title: "孔数",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '孔总深',
                    title: "孔总深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '平均孔深',
                    title: "平均孔深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '炸药量',
                    title: "炸药量 /kg",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '抵抗线',
                    title: "抵抗线 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '超深',
                    title: "超深 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '填充',
                    title: "填充 /m",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                },
                {
                    field: '爆破量',
                    title: "爆破量 /吨",
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    colspan: 1,
                    rowspan: 2,
                    formatter: numberFormatter
                },
                {
                    field: '炸药单耗',
                    title: "炸药单耗 kg/m³",
                    valign: "middle",
                    align: "center",
                    sortable: true,
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
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    valign: "middle",
                    align: "center",
                    sortable: true,
                    formatter: numberFormatter
                },
            ]
        ]
    });
    //复选框监听事件
    $('#table').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        var data = $('#table').bootstrapTable('getAllSelections')
        getEchartsDate(data)
    });

    //checkbox全选
    function stateFormatter(value, row, index) {
        return {
            disabled: false,//设置是否可用
            checked: true//设置选中
        };
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
    function seeFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button  ', disabled,
            ' data-toggle="modal" data-target="#seeModal" class="btn btn-primary" onclick="records(',
            "'" + row.项目编码 + "'",
            ')">',
            '历史记录',
            '</button>',
        ].join('');
    }

    //上传文件
    function upFormatter(value, row, index) {
        return [
            '<button data-toggle="modal" data-target="#upModal" class="btn btn-primary" onclick="upFile(',
            "'" + row.项目编码 + "'",
            ',',
            "'" + row.日期 + "'",
            ')">',
            '上传',
            '</button>',
        ].join('');
    }

    //预览图片
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

    //下载文件
    function loadFormatter(value, row, index) {
        var disabled = value ? "" : "disabled";
        return [
            '<button  ', disabled,
            ' type= "button" class="btn btn-primary" onclick="window.location.href=',
            "'",
            '/Table/DownloadFile?id=',
            row.项目编码,
            "'",
            '">',
            '下载',
            '</button>',
        ].join('');
    }

    //最优项目
    function optimalFormatter(value, row, index) {
        return [
            '<button  data-toggle="modal" data-target="#seeProjects" class="btn btn-primary" onclick="queryProject()">',
            '优化',
            '</button>',
        ].join('');
    }

    //打分
    $('#mark').bootstrapTable('destroy');
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
        pageList: [5, 10, "All"],//可选的每页显示数据个数
        sortName: "name",
        sortOrder: "desc",
        detailView: true,
        detailFormatter: detailFormatter,
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
                    sortable: true,
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
                    title: "操作",
                    valign: "middle",
                    align: "center",
                    colspan: 6,
                    rowspan: 1,
                    formatter: commentFormatter
                }
            ], [
                {
                    field: '块度平均分',
                    title: '块度',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '抛掷平均分',
                    title: '抛掷',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '根底平均分',
                    title: '根底',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                },
                {
                    field: '伞岩平均分',
                    title: '伞岩',
                    sortable: true,
                    valign: "middle",
                    align: "center",
                    formatter: numberFormatter
                }, {
                    field: '打分',
                    title: "评分",
                    valign: "middle",
                    align: "center",
                    formatter: commentFormatter
                }, {
                    field: '查看',
                    title: "查看",
                    valign: "middle",
                    align: "center",
                    formatter: seeFormatter
                }, {
                    title: '上传',
                    valign: "middle",
                    align: "center",
                    formatter: upFormatter
                }, {
                    field: '预览',
                    title: "预览",
                    valign: "middle",
                    align: "center",
                    formatter: lookFormatter
                }, {
                    field: '下载',
                    title: "下载",
                    valign: "middle",
                    align: "center",
                    formatter: loadFormatter
                }, {
                    field: '优化',
                    title: "优化",
                    valign: "middle",
                    align: "center",
                    formatter: optimalFormatter
                }
            ]
        ]
    });
    //打分拟态框关闭
    $('#myModal').on('hide.bs.modal', function () {
        location.reload();
    })
    //预览图片关闭
    $('#image').on('hide.bs.modal', function () {
        $.ajax({
            url: '/Table/deleteLookPic',
            type: 'post',
            data: {},
            success: function (result) {
                if (result.success) {
                    //alert(result.message)
                    //location.reload();
                }
            }
        })
    })

    //查询Echarts
    //初始化切换
    $(".animsition").animsition({

        inClass: 'fade-in-right',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
        loading: true,
        loadingParentElement: 'body', //animsition wrapper element
        loadingClass: 'animsition-loading',
        unSupportCss: ['animation-duration',
            '-webkit-animation-duration',
            '-o-animation-duration'
        ],
        //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
        //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".

        overlay: false,

        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body'
    });

    // 基于准备好的dom，初始化echarts实例

    var myChart3 = echarts.init(document.getElementById('main3'), 'macarons');

    // 指定图表的配置项和数据

    var date = ['2016/11/1', '2016/11/2', '2016/11/3', '2016/11/4', '2016/11/5', '2016/11/6', '2016/11/7', '2016/11/8', '2016/11/9', '2016/11/10',
        '2016/11/11', '2016/11/12', '2016/11/13', '2016/11/14', '2016/11/15', '2016/11/16', '2016/11/17', '2016/11/18'
        , '2016/11/19', '2016/11/20', '2016/11/21', '2016/11/22', '2016/11/23', '2016/11/24', '2016/11/25', '2016/11/26', '2016/11/27'
        , '2016/11/28', '2016/11/29', '2016/11/30'];

    function myHandler(data) {
        getEchartsDate(data)
        return data;
    }

    function getEchartsDate(res) {
        var data = res
        myChart3.setOption({
            xAxis: {
                data: data.map(function (v, i) {
                    return v.日期
                })
            },
            series: [
                {
                    // 根据名字对应到相应的系列
                    name: '孔距',
                    data: data.map(function (v, i) {
                        return v.孔距
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '排距',
                    data: data.map(function (v, i) {
                        return v.排距
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '孔数',
                    data: data.map(function (v, i) {
                        return v.孔数
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '孔总深',
                    data: data.map(function (v, i) {
                        return v.孔总深
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '平均孔深',
                    data: data.map(function (v, i) {
                        return v.平均孔深
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '炸药量',
                    data: data.map(function (v, i) {
                        return v.炸药量
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '抵抗线',
                    data: data.map(function (v, i) {
                        return v.抵抗线
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '超深',
                    data: data.map(function (v, i) {
                        return v.超深
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '填充',
                    data: data.map(function (v, i) {
                        return v.填充
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '爆破量',
                    data: data.map(function (v, i) {
                        return v.爆破量.toFixed(2)
                    })
                },
                {
                    // 根据名字对应到相应的系列
                    name: '炸药单耗',
                    data: data.map(function (v, i) {
                        return v.炸药单耗.toFixed(2)
                    })
                }
            ]
        });
    }

    function my_data() {
        var data = [];
        for (var i = 0; i < 30; i++) {
            data.push(Math.round(Math.random() * (1000 - 100) + 100));
        };
        return data;
    }

    var option3 = {
        title: {
            text: '项目报表柱状图'
        },
        tooltip: {
            trigger: 'axis',
            /* axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }*/
        },
        legend: {
            x: 'center',
            top: '8%',
            data: ['孔距', '排距', '孔数', '孔总深', '平均孔深', '炸药量', '抵抗线', '超深', '填充', '爆破量', '炸药单耗']
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                //数据视图
                //dataView: {
                //    show: true, readOnly: true, optionToContent: function (opt) {
                //        var axisData = opt.xAxis[0].data;
                //        var series = opt.series;
                //        var table = '<table style="width:100%;text-align:center"><tbody><tr>'
                //            + '<td>日期</td>';
                //        for (var n = 0; n < series.length; n++) {
                //            table += '<td>' + series[n].name + '</td>';
                //        }
                //        table += '</tr>';
                //        for (var i = 0, l = axisData.length; i < l; i++) {
                //            table += '<tr>'
                //                + '<td>' + axisData[i] + '</td>';
                //            for (var j = 0; j < series.length; j++) {
                //                if (typeof series[j].data[i] == "number") {
                //                    table += '<td>' + series[j].data[i].toFixed(2) + '</td>';
                //                } else {
                //                    table += '<td>' + series[j].data[i] + '</td>';
                //                }
                //            }
                //            table += '</tr>';
                //        }
                //        table += '</tbody></table>';
                //        return table;
                //    }
                //},
                magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                //刷新
                //restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            top: '37%',
            containLabel: true
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
        }, {
            start: 74,
            end: 100,
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                // 根据名字对应到相应的系列
                name: '孔距',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '排距',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '孔数',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '孔总深',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '平均孔深',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '炸药量',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '抵抗线',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '超深',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '填充',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '爆破量',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }, {
                // 根据名字对应到相应的系列
                name: '炸药单耗',
                type: 'bar',
                stack: '总量',
                barMaxWidth: 30,
                data: []
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。

    myChart3.setOption(option3);
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "孔距" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "排距" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "孔数" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "孔总深" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "平均孔深" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "抵抗线" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "超深" })
    myChart3.dispatchAction({ type: 'legendUnSelect', name: "填充" })

    window.onresize = myChart3.resize;

});