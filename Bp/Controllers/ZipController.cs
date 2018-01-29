using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bp.Controllers
{
    public class ZipController : Controller
    {
        DBContext db = new DBContext();

        public ActionResult Down()
        {
            return View();
        }

        public JsonResult QueryStatistics()
        {
            try
            {
                //var name = CookieResult.CookieName();
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from xm in db.Bp_项目
                           join sj in db.Bp_项目数据 on xm.项目编码 equals sj.项目编码
                           select new
                           {
                               项目编码 = xm.项目编码,
                               日期 = sj.日期,
                               块度平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码).Select(b => b.块度评分).Average(),
                               抛掷平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码).Select(b => b.抛掷评分).Average(),
                               根底平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码).Select(b => b.根底评分).Average(),
                               伞岩平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码).Select(b => b.伞岩评分).Average(),
                               下载 = db.Bp_项目资料.Any(x => x.项目编码 == sj.项目编码),
                           };
                switch (sortOrder)
                {
                    case "a":
                        list = list.OrderByDescending(w => w.项目编码);
                        break;
                    case "last_desc":
                        list = list.OrderByDescending(w => w.项目编码);
                        break;
                    case "last":
                        list = list.OrderBy(w => w.项目编码);
                        break;
                    default:
                        list = list.OrderBy(w => w.项目编码);
                        break;
                };
                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        ///下载文件
        /// </summary>
        /// <param name="id">项目编码</param>
        public void DownloadFile(string id)
        {
            //根据项目编码查询符合条件的资料
            var list = db.Bp_项目资料.Where(x => x.项目编码 == id);

            //存放查询出来的文件
            List<string> files = new List<string>();

            //文件根目录
            var homePath = System.Configuration.ConfigurationManager.AppSettings["imageSrc"];

            foreach (var s in list)
            {
                //动态拼接文件路径
                string path = homePath + s.资料ID;
                var ls = Directory.GetFiles(path).ToList();
                files.AddRange(ls);
            }
            //压缩包名称
            string fileName = DateTime.Now.ToString("yyyyMMddhhmmss") + @".zip";
            //string absoluFilePath = @"C:\Program Files (x86)\MicroStarSoft\中矿微星后台服务程序\UserFiles\Zip\"+date+@".zip";
            //压缩包备份路径
            string absolu = System.Configuration.ConfigurationManager.AppSettings["absoluSrc"];
            //压缩包备份
            string absoluFilePath = Server.MapPath(absolu) + fileName;
            ZipHelper.ZipManyFilesOrDictorys(files, absoluFilePath, null);
            //string absoluFilePath = Server.MapPath(System.Configuration.ConfigurationManager.AppSettings["AttachmentPath"] + filePath);
            //下载
            Response.ClearHeaders();
            Response.Clear();
            Response.Expires = 0;
            Response.Buffer = true;
            Response.AddHeader("Accept-Language", "zh-tw");
            FileStream fileStream = new FileStream(absoluFilePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            byte[] byteFile = null;
            if (fileStream.Length == 0)
            {
                byteFile = new byte[1];
            }
            else
            {
                byteFile = new byte[fileStream.Length];
            }
            fileStream.Read(byteFile, 0, (int)byteFile.Length);
            fileStream.Close();
            Response.AddHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
            Response.ContentType = "application/octet-stream";
            Response.BinaryWrite(byteFile);
            Response.Flush();
            Response.End();
            //删除备份
            System.IO.File.Delete(absoluFilePath);
        }

    }
}