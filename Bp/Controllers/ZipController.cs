using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Web;
using System.Web.Script.Serialization;
using System.Security.Cryptography;
using System.Drawing;
using System.Web.UI;
using System.Text;

namespace Bp.Controllers
{
    public class ZipController : Controller
    {
        DBContext db = new DBContext();

        public ActionResult Down()
        {
            return View();
        }
        public ActionResult Up()
        {
            return View();
        }
        public JsonResult QueryStatistics()
        {
            try
            {
                var name = CookieResult.CookieName();
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
                               预览 = db.Bp_项目资料.Where(x => x.项目编码 == sj.项目编码).Select(x => x.资料名称)
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


        /// <summary>
        ///查询文件中的图片
        /// </summary>
        /// <param name="id">项目编码</param>
        /// <returns>图片</returns>
        public JsonResult QueryFile(string id)
        {
            //根据项目编码查询符合条件的资料
            var list = db.Bp_项目资料.Where(x => x.项目编码 == id);

            //存放查询出来的文件
            List<string> files = new List<string>();

            //文件根目录
            var homePath = System.Configuration.ConfigurationManager.AppSettings["imageSrc"];

            //目标文件夹配置路径
            string load = System.Configuration.ConfigurationManager.AppSettings["loadSrc"];

            //目标文件夹的文件名
            string desdir = Server.MapPath(load) + CookieResult.CookieName();
            //判断文件夹是否存在
            if (!Directory.Exists(desdir))
            {
                // 目录不存在，建立目录
                Directory.CreateDirectory(desdir);
            }

            foreach (var s in list)
            {
                //动态拼接文件路径
                string path = homePath + s.资料ID;

                //文件路径集合
                var ls = Directory.GetFiles(path).ToList();

                foreach (var l in ls)
                {
                    try
                    {
                        //判断文件是否是图片格式
                        System.Drawing.Image img = System.Drawing.Image.FromFile(l);

                        //目标图片保存的路径和名称
                        String imgPath = desdir + '\\' + l.Split('\\').Last();

                        //true 覆盖已存在的同名文件,false则反之
                        bool isrewrite = true;

                        //从源文件复制到目标文件中
                        System.IO.File.Copy(l, imgPath, isrewrite);

                        //绝对路径转换为相对路径
                        int j = imgPath.IndexOf("Data");
                        string str = imgPath.Substring(j);
                        string url = str.Replace(@"\", @"/");

                        //添加到查询文件集合中
                        files.Add("../" + url);
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }
            return Json(files);
        }

        /// <summary>
        ///删除预览保存的图片
        /// </summary>
        /// <returns>空文件夹</returns>
        public RedirectResult DeletePicture()
        {
            //目标文件夹配置路径
            string load = System.Configuration.ConfigurationManager.AppSettings["loadSrc"];
            // 判断文件夹是否存在 
            string strPath = Server.MapPath(load) + CookieResult.CookieName();
            if (Directory.Exists(strPath))
            { // 获得文件夹数组 
                string[] strDirs = Directory.GetDirectories(strPath);
                // 获得文件数组 
                string[] strFiles = Directory.GetFiles(strPath);
                // 遍历所有子文件夹 
                foreach (string strFile in strFiles)
                { // 删除文件夹 
                    System.IO.File.Delete(strFile);
                } // 遍历所有文件 
                foreach (string strdir in strDirs)
                { // 删除文件 
                    Directory.Delete(strdir, true);
                }
            } // 成功 
            string redirect = System.Configuration.ConfigurationManager.AppSettings["redirect"];
            return Redirect(redirect);
        }


        //上传文件
        //[HttpPost]
        //public RedirectResult UploadFile(HttpPostedFileBase file)
        //{
        //    var fileName = file.FileName;
        //    var filePath = Server.MapPath(string.Format("~/{0}", "Zip"));
        //    file.SaveAs(Path.Combine(filePath, fileName));
        //    return Redirect("/Zip/Up");
        //}

        [HttpPost]
        public void UploadFile()
        {
            var name = CookieResult.CookieName();
            //流水号
            var number = db.Bp_项目资料.Select(x => x.流水号).Max();
            //项目编码
            var bm = Request["ubm"].ToString();
            //项目名称
            var nm = Request["unm"].ToString();
            //上传时间
            var time = DateTime.Now;
            //文件
            HttpPostedFileBase file = Request.Files["filename"];
            //文件名称
            var fileName = file.FileName;
            //上传电脑
            System.Net.IPAddress clientIP = System.Net.IPAddress.Parse(Request.UserHostAddress);//根据目标IP地址获取IP对象
            System.Net.IPHostEntry ihe = System.Net.Dns.GetHostEntry(clientIP);//根据IP对象创建主机对象
            string clientPCName = ihe.HostName;//获取客户端主机名称
            //上传根路径
            var homePath = System.Configuration.ConfigurationManager.AppSettings["imageSrc"];
            //文件夹
            var guid = Guid.NewGuid().ToString();
            string strPath = homePath + guid;
            //判断文件夹是否存在
            if (!Directory.Exists(strPath))
            {
                // 目录不存在，建立目录
                Directory.CreateDirectory(strPath);
            }
            //保存
            var filePath = string.Format("{0}", strPath);

            Bp_项目资料 zl = new Bp_项目资料
            {
                项目名称 = nm,
                项目编码 = bm,
                资料ID = guid,
                上传人 = name,
                上传时间 = time,
                资料名称 = fileName,
                上传电脑 = clientPCName,
                流水号 = number + 1,
            };
            db.Bp_项目资料.Add(zl);

            try
            {
                file.SaveAs(Path.Combine(filePath, fileName));
                db.SaveChanges();
                Response.Write("<script>alert('上传成功');window.location.href='/Zip/Up';</script>");
            }
            catch (Exception)
            {
                Response.Write("<script>alert('上传失败');window.location.href='/Zip/Up';</script>");
            }
        }

    }
}
