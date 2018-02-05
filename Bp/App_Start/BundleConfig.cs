using System.Web;
using System.Web.Optimization;

namespace Bp
{
    public class BundleConfig
    {
        // 有关捆绑的详细信息，请访问 https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // 使用要用于开发和学习的 Modernizr 的开发版本。然后，当你做好
            // 生产准备就绪，请使用 https://modernizr.com 上的生成工具仅选择所需的测试。
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //框架css
            bundles.Add(new StyleBundle("~/Content/kj").Include(
                      "~/Content/css/font-awesome.css",
                      "~/Content/css/se7en-font.css",
                      "~/Content/css/isotope.css",
                      "~/Content/css/jquery.fancybox.css",
                      "~/Content/css/fullcalendar.css",
                      "~/Content/css/wizard.css",
                      "~/Content/css/select2.css",
                      "~/Content/css/morris.css",
                      "~/Content/css/datatables.css",
                      "~/Content/css/datepicker.css",
                      "~/Content/css/timepicker.css",
                      "~/Content/css/colorpicker.css",
                      "~/Content/css/bootstrap-switch.css",
                      "~/Content/css/daterange-picker.css",
                      "~/Content/css/bootstrap-table.css",
                      "~/Content/css/typeahead.css",
                      "~/Content/css/summernote.css",
                      "~/Content/css/pygments.css",
                      "~/Content/css/style.css"
                      ));
            //框架js
            bundles.Add(new ScriptBundle("~/bundles/kj").Include(
                      "~/Scripts/js/jquery-ui-1.10.2.js",
                      "~/Scripts/js/raphael.min.js",
                      "~/Scripts/js/selectivizr-min.js",
                      "~/Scripts/js/jquery.mousewheel.js",
                      "~/Scripts/js/jquery.vmap.min.js",
                      "~/Scripts/js/jquery.vmap.sampledata.js",
                      "~/Scripts/js/jquery.vmap.world.js",
                      "~/Scripts/js/jquery.bootstrap.wizard.js",
                      "~/Scripts/js/fullcalendar.min.js",
                      "~/Scripts/js/gcal.js",
                      "~/Scripts/js/jquery.datatables.min.js",
                      "~/Scripts/js/datatable-editable.js",
                      "~/Scripts/js/jquery.easy-pie-chart.js",
                      "~/Scripts/js/excanvas.min.js",
                      "~/Scripts/js/jquery.isotope.min.js",
                      "~/Scripts/js/isotope_extras.js",
                      "~/Scripts/js/modernizr.custom.js",
                      "~/Scripts/js/jquery.fancybox.pack.js",
                      "~/Scripts/js/select2.js",
                      "~/Scripts/js/styleswitcher.js",
                      "~/Scripts/js/wysiwyg.js",
                      "~/Scripts/js/summernote.min.js",
                      "~/Scripts/js/jquery.inputmask.min.js",
                      "~/Scripts/js/jquery.validate.js",
                      "~/Scripts/js/bootstrap-fileupload.js",
                      "~/Scripts/js/bootstrap-datepicker.js",
                      "~/Scripts/js/bootstrap-timepicker.js",
                      "~/Scripts/js/bootstrap-colorpicker.js",
                      "~/Scripts/js/bootstrap-switch.min.js",
                      "~/Scripts/js/bootstrap-table.js",
                      "~/Scripts/js/tableExport.min.js",
                      "~/Scripts/js/bootstrap-table-export.js",
                      "~/Scripts/js/bootstrap-table-mobile.min.js",
                      "~/Scripts/js/bootstrap-table-zh-CN.js",
                      "~/Scripts/js/BPF.js",
                      "~/Scripts/js/typeahead.js",
                      "~/Scripts/js/daterange-picker.js",
                      "~/Scripts/js/date.js",
                      "~/Scripts/js/morris.min.js",
                      "~/Scripts/js/skycons.js",
                      "~/Scripts/js/fitvids.js",
                      "~/Scripts/js/jquery.sparkline.min.js",
                      "~/Scripts/js/main.js",
                      "~/Scripts/js/respond.js",
                       "~/Scripts/jquery.cookie.js"
                      ));

            //文本框时间插件
            bundles.Add(new ScriptBundle("~/bundles/time").Include(
                      "~/Scripts/bootstrap-datetimepicker.js",
                     "~/Scripts/bootstrap-datetimepicker.zh-CN.js"
                     ));
            bundles.Add(new StyleBundle("~/Content/time").Include(
                      "~/Content/bootstrap-datetimepicker.css"
                     ));
            //登录页
            bundles.Add(new StyleBundle("~/Content/login").Include(
                      "~/Content/login.css"));

            bundles.Add(new ScriptBundle("~/bundles/login").Include(
                      "~/Scripts/view/account.js"));
            //首页
            bundles.Add(new ScriptBundle("~/bundles/home").Include(
                     "~/Scripts/view/home.js"));
            //用户
            bundles.Add(new ScriptBundle("~/bundles/user").Include(
                     "~/Scripts/view/user.js"));

            //项目页面
            bundles.Add(new ScriptBundle("~/bundles/table").Include(
                     "~/Scripts/view/table.js"));

            //项目评价
            bundles.Add(new StyleBundle("~/Content/comment").Include(
                    "~/Content/star-rating.css"
                   ));

            bundles.Add(new ScriptBundle("~/bundles/comment").Include(
                    "~/Scripts/star-rating.js"
                    ));

            //头部
            bundles.Add(new ScriptBundle("~/bundles/top").Include(
                   "~/Scripts/view/top.js"
                   ));

            //项目成本页面
            bundles.Add(new ScriptBundle("~/bundles/edit").Include(
                   "~/Scripts/view/edit.js"
                   ));

            //项目真实数据页面
            bundles.Add(new ScriptBundle("~/bundles/truthful").Include(
                  "~/Scripts/view/truthful.js"
                  ));

            //Echarts图表
            bundles.Add(new StyleBundle("~/Content/echarts").Include(
                   "~/Content/echarts/drop-down.css",
                   "~/Content/echarts/system.css"
                  ));

            bundles.Add(new ScriptBundle("~/bundles/echarts").Include(
                    "~/Scripts/echarts/jquery-ui.min.js",
                     "~/Scripts/echarts/select-widget-min.js",
                    "~/Scripts/echarts/jquery.animsition.min.js",
                    "~/Scripts/echarts/echarts.js",
                    "~/Scripts/echarts/macarons.js",
                    "~/Scripts/echarts/common.js"
                    ));
        }
    }
}