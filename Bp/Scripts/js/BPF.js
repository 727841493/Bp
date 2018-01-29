$(function () {
    $.ajaxSetup(
        {
            type: "POST",
            dataType: "json",
            error: function (err) {
                alert(err);
            }
        })
})