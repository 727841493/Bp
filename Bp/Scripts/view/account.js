$(document).ready(function () {
    $(document).ready(function () {
        $("#bz").mouseenter(function () {
            $("#before").addClass("mobile");
            $("#show").removeClass("mobile");
        });
        $("#show").mouseleave(function () {
            $("#before").removeClass("mobile");
            $("#show").addClass("mobile");
        });
    });
});