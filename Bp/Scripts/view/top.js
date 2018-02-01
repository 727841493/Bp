$(function () {
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
                $("#jb").html("级别：" + result.级别)
                $("#lsbm").html("隶属部门：" + result.隶属部门)
                $("#ywks").html("业务科室：" + result.业务科室)
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

})

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