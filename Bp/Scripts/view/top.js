﻿$(function () {

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

    //清除cookie    
    function clearCookie(name) {
        setCookie(name, "", -1);
    }

    // 调用函数
    var cookie = getCookie("Xing");
    if (cookie != undefined) {
        var name = cookie.split("=");
        $("#nm").html(name[1]);
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
                if (result.邮箱 == null) {
                    $("#yx").html("邮箱：无")
                } else {
                    $("#yx").html("邮箱：" + result.邮箱)
                }
                if (result.手机 == null) {
                    $("#sj").html("手机：无")
                } else {
                    $("#sj").html("手机：" + result.手机)
                }
            }
        });
    }

    $("#change").click(function () {
        var name = $("#Name").val();
        var oldPassword = $("#OldPassword").val();
        var newPassword = $("#NewPassword").val();
        if (oldPassword == "") {
            alert("原密码不能为空");
            $("#OldPassword").focus();
        } else {
            if (newPassword == "") {
                alert("新密码不能为空");
                $("#NewPassword").focus();
            }
        }
        if (oldPassword != "" && newPassword != "") {
            $.ajax({
                url: '/User/ChangePassword',
                type: 'post',
                data: {
                    "name": name,
                    "oldPassword": oldPassword,
                    "newPassword": newPassword,
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        $("#OldPassword").focus();
                        $("#OldPassword").val("");
                        $("#NewPassword").val("");
                    } else {
                        alert(result.message);
                        window.location.href = "/Account/Index";
                        clearCookie("Xing");
                        clearCookie(".ASPXAUTH");
                        clearCookie("Porschev");
                    }
                }
            });
        }
    });

    $('#changePass').on('show.bs.modal', function () {
        $("#Name").val(name[1]);
    })
    $('#changePass').on('hide.bs.modal', function () {
        $("#OldPassword").val("");
        $("#NewPassword").val("");
    })

    //var test = window.location.pathname;
    //if (test != "/Home/Index" && test != "/Account/Index") {
    //    $("#home").removeClass("current");
    //    $('#bao').attr('class', 'current');
    //}

    setInterval("queryRefresh();", 5 * 1000);

});

function queryRefresh() {
    var test = window.location.pathname;
    if (test == "/Home/Index") {
        //首页
        var m = queryMessages();
        var f = queryFiles();
        var messages = $("#showMsg").bootstrapTable('getData');
        var msg = messages.length;
        var files = $("#showFlie").bootstrapTable('getData');
        var fl = files.length;
        if (m != msg) {
            $("#showMsg").bootstrapTable('refresh');
        }
        if (f != fl) {
            $("#showFlie").bootstrapTable('refresh');
        }
    } else if (test == "/Table/Operation") {
        //操作
        var ks = queryMarks();
        var list = [];
        for (var i = 0; i < ks.length; i++) {
            var row = ks[i]
            if (row.伞岩平均分 != null && row.块度平均分 != null && row.抛掷平均分 != null && row.根底平均分 != null) {
                list.push(row);
            }
        }
        var marks = $("#mark").bootstrapTable('getData');
        var view = [];
        for (var i = 0; i < marks.length; i++) {
            var row = marks[i]
            if (row.伞岩平均分 != null && row.块度平均分 != null && row.抛掷平均分 != null && row.根底平均分 != null) {
                view.push(row);
            }
        }

        if (list.length != view.length) {
            $("#mark").bootstrapTable('refresh');
        } else {
            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < view.length; j++) {
                    if (list[i].项目编码 == view[j].项目编码 && list[i].日期 == view[j].日期) {
                        if (list[i].伞岩平均分 != view[j].伞岩平均分 || list[i].块度平均分 != view[j].块度平均分 || list[i].抛掷平均分 != view[j].抛掷平均分 || list[i].根底平均分 != view[j].根底平均分) {
                            $("#mark").bootstrapTable('refresh');
                        }
                    } else {
                        continue;
                    }
                }
            }
        }
    } else if (test == "/Table/Truthful") {
        //数据对比
        var ts = queryTrues();
        var sum = [];
        for (var i = 0; i < ts.length; i++) {
            var row = ts[i]
            if (row.孔总深 != null && row.爆破量 != null && row.炸药单耗 != null) {
                sum.push(row)
            }
        }
        var myTure = $("#showTrue").bootstrapTable('getData');
        var mt = [];
        for (var i = 0; i < myTure.length; i++) {
            var row = myTure[i]
            $.ajax({
                url: '/Table/QueryTureData',
                type: 'post',
                async: false,
                data: {
                    "id": row.项目编码,
                    "name": row.日期,
                },
                success: function (result) {
                    for (var one of result) {
                        if (one.孔总深 != null && one.爆破量 != null && one.炸药单耗 != null) {
                            mt.push(one);
                        }
                    }
                }
            });
        }
        if (sum.length != mt.length) {
            $("#showTrue").bootstrapTable('refresh');
        } else {
            for (var i = 0; i < sum.length; i++) {
                for (var j = 0; j < mt.length; j++) {
                    if (sum[i].项目编码 == mt[j].项目编码 && sum[i].日期 == mt[j].日期) {
                        if (sum[i].孔距 != mt[j].孔距 || sum[i].排距 != mt[j].排距
                            || sum[i].抵抗线 != mt[j].抵抗线 || sum[i].孔数 != mt[j].孔数
                            || sum[i].平均孔深 != mt[j].平均孔深 || sum[i].炸药量 != mt[j].炸药量
                            || sum[i].超深 != mt[j].超深 || sum[i].填充 != mt[j].填充) {
                            $("#showTrue").bootstrapTable('refresh');
                        }
                    } else {
                        continue;
                    }
                }
            }
        }
    } else if (test == "/Table/Edit") {
        var num = queryCost();
        var year = $("#showYear").bootstrapTable('getData');
        if (num.length != year.length) {
            $("#showYear").bootstrapTable('refresh');
        } else {
            for (var i = 0; i < num.length; i++) {
                for (var j = 0; j < year.length; j++) {
                    if (num[i].年份 == year[j].年份) {
                        if (num[i].钻孔 != year[j].钻孔 || num[i].火工品 != year[j].火工品 || num[i].冲击炮 != year[j].冲击炮
                            || num[i].装载 != year[j].装载 || num[i].运输 != year[j].运输 || num[i].辅助 != year[j].辅助
                            || num[i].其他 != year[j].其他 || num[i].合计 != year[j].合计 || num[i].产量 != year[j].产量) {
                            $("#showYear").bootstrapTable('refresh');
                        }
                    } else {
                        continue;
                    }
                }
            }
        }
    }
}

//查询通知条数
function queryMessages() {
    var c = 0;
    $.ajax({
        url: '/Home/QueryMessages',
        type: 'post',
        async: false,
        data: {},
        success: function (result) {
            c = result.length;
        }
    });
    return c;
}
//查询共享文件条数
function queryFiles() {
    var c = 0;
    $.ajax({
        url: '/Home/QueryAllShare',
        type: 'post',
        async: false,
        data: {},
        success: function (result) {
            c = result.length;
        }
    });
    return c;
}
//查询打分条数
function queryMarks() {
    var c;
    $.ajax({
        url: '/Table/QueryStatistics',
        type: 'post',
        async: false,
        data: {},
        success: function (result) {
            c = result;
        }
    });
    return c;
}
//查询真实数据
function queryTrues() {
    var c;
    $.ajax({
        url: '/Table/QueryTureData',
        type: 'post',
        async: false,
        data: {},
        success: function (result) {
            c = result;
        }
    });
    return c;
}
//查询成本
function queryCost() {
    var c;
    $.ajax({
        url: '/Table/QueryCostYears',
        type: 'post',
        async: false,
        data: {},
        success: function (result) {
            c = result;
        }
    });
    return c;
}


function loginOut() {
    window.location.href = "/Account/Index";
    clearCookie("Xing");
    clearCookie(".ASPXAUTH");
    clearCookie("Porschev");
}

function show_confirm() {
    var r = confirm("确定退出吗？");
    if (r == true) {
        window.location.href = "/Account/Index";
        clearCookie("Xing");
        clearCookie(".ASPXAUTH");
        clearCookie("Porschev");
    }
}  