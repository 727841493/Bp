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

    function getCookie(cookie_name) {
        var allcookies = document.cookie;
        var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度

        // 如果找到了索引，就代表cookie存在，
        // 反之，就说明不存在。
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可。
            cookie_pos += cookie_name.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
            var cookie_end = allcookies.indexOf(";", cookie_pos);

            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }

            var value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
        }
        return value;
    }

    // 调用函数
    var cookie = getCookie("Xing");
    if (cookie != undefined) {
        var name = cookie.split("=");
        $.ajax({
            url: '/User/QueryUsers',
            type: 'post',
            data: {
                "name": name[1],
            },
            success: function (result) {
                $("#dlm").html("登录名：" + result.登录名)
                $("#yhm").html("用户姓名：" + result.用户姓名)
                $("#yhlb").html("用户类别：" + result.用户类别)
                $("#lsbm").html("隶属部门：" + result.隶属部门)
                $("#ywks").html("业务科室：" + result.业务科室)
            }
        });
    }
});

