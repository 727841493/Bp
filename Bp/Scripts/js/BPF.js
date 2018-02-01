$(function () {
    $.ajaxSetup(
        {
            type: "post",
            dataType: "json",
            error: function (err) {
                alert(err);
            }
        })
})