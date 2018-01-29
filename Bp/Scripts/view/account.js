$(function () {
    $("#bz").mouseenter(function () {
        $("#before").addClass("mobile");
        $("#show").removeClass("mobile");
    });
    $("#show").mouseleave(function () {
        $("#before").removeClass("mobile");
        $("#show").addClass("mobile");
    });

    $("#remember").change(function () {
        var flag = document.getElementById("remember").checked
        $("#flag").val(flag)
    });


    function getCookie(cookie_name) {
        var allcookies = document.cookie;
        var cookie_pos = allcookies.indexOf(cookie_name);   //�����ĳ���

        // ����ҵ����������ʹ���cookie���ڣ�
        // ��֮����˵�������ڡ�
        if (cookie_pos != -1) {
            // ��cookie_pos����ֵ�Ŀ�ʼ��ֻҪ��ֵ��1���ɡ�
            cookie_pos += cookie_name.length + 1;      //�������׳����⣬�������Ҳο���ʱ���Լ��ú��о�һ��
            var cookie_end = allcookies.indexOf(";", cookie_pos);

            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }

            var value = unescape(allcookies.substring(cookie_pos, cookie_end));         //����Ϳ��Եõ�����Ҫ��cookie��ֵ�ˡ�����
        }
        return value;
    }

    // ���ú���
    var cookie = getCookie("Porschev");
    if (cookie != undefined) {
        var user = cookie.split("&");
        var name = user[0].split("=");
        var password = user[1].split("-");
        $("#inputName").val(name[1]);
        $("#inputPassword").val(password[1]);
        document.getElementById("remember").checked = true;
    }

});
//ҳ������¼�
$(document).keyup(function (event) {
    if (event.keyCode == 13) {
        $("#login").trigger("click");
    }
});