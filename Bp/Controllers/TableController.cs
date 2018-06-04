using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace Bp.Controllers
{
    public class TableController : Controller
    {

        DBContext db = new DBContext();

        /// <summary>
        ///查询页面
        /// </summary>
        public ActionResult Query()
        {
            return View();
        }

        /// <summary>
        ///操作页面
        /// </summary>
        public ActionResult Operation()
        {
            return View();
        }

        /// <summary>
        ///真实数据页面
        /// </summary>
        public ActionResult Truthful()
        {
            return View();
        }

        /// <summary>
        ///成本页面
        /// </summary>
        public ActionResult Edit()
        {
            return View();
        }

        /// <summary>
        ///爆破设计统计数据表的显示和筛选
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="steps">台阶水平</param>
        /// <param name="lithology">岩性</param>
        /// <param name="avg">平均分</param>
        /// <returns>查询报表数据</returns>
        public JsonResult QueryStatistics(string startTime, string endTime, double? steps, string lithology, string avg)
        {
            try
            {
                var name = CookieResult.CookieName();
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];
                var list = from sj in db.Bp_项目数据
                           select new
                           {
                               项目编码 = sj.项目编码,
                               台阶水平 = sj.台阶水平,
                               日期 = sj.日期,
                               岩性 = sj.岩性,
                               孔距 = sj.孔距 / sj.数量,
                               排距 = sj.排距 / sj.数量,
                               孔数 = sj.孔数,
                               平均孔深 = sj.平均孔深,
                               炸药量 = sj.炸药量,
                               抵抗线 = sj.抵抗线 / sj.数量,
                               超深 = sj.超深 / sj.数量,
                               填充 = sj.填充,
                               孔总深 = sj.平均孔深 * sj.孔数,
                               爆破量 = (sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65,
                               炸药单耗 = ((sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65) == 0 ? 0 : sj.炸药量 / (((sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65) / 2.65),
                               块度平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.块度评分).Average(),
                               抛掷平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.抛掷评分).Average(),
                               根底平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.根底评分).Average(),
                               伞岩平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.伞岩评分).Average(),
                               总平均分 = (db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.块度评分).Average() + db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.抛掷评分).Average() + db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.根底评分).Average() + db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.伞岩评分).Average()) / 4,
                               打分 = !db.Bp_Data_comment.Any(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID && x.评论人 == name),
                               查看 = db.Bp_Data_comment.Any(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID),
                               下载 = db.Bp_项目资料.Any(x => x.项目编码 == sj.项目编码),
                               预览 = db.Bp_项目资料.Where(x => x.项目编码 == sj.项目编码).Select(x => x.资料名称),
                           };
                if (!string.IsNullOrEmpty(startTime))
                {
                    list = list.Where(x => String.Compare(startTime, x.日期) <= 0);
                }
                if (!string.IsNullOrEmpty(endTime))
                {
                    list = list.Where(x => String.Compare(x.日期, endTime) <= 0);
                }
                if (steps != null)
                {
                    list = list.Where(lp => lp.台阶水平 == steps);
                }
                if (!string.IsNullOrEmpty(lithology))
                {
                    list = list.Where(bb => bb.岩性.Equals(lithology));
                }
                if (!string.IsNullOrEmpty(avg))
                {
                    if (avg.Equals("优"))
                    {
                        list = list.Where(b => b.总平均分 >= 4.5 && b.总平均分 <= 5);
                    }
                    if (avg.Equals("良"))
                    {
                        list = list.Where(b => b.总平均分 >= 4 && b.总平均分 < 4.5);
                    }
                    if (avg.Equals("中"))
                    {
                        list = list.Where(b => b.总平均分 >= 3 && b.总平均分 < 4);
                    }
                    if (avg.Equals("差"))
                    {
                        list = list.Where(b => b.总平均分 < 3);
                    }
                }
                switch (sortOrder)
                {
                    case "a":
                        list = list.OrderByDescending(w => w.日期);
                        break;
                    case "last_desc":
                        list = list.OrderByDescending(w => w.日期);
                        break;
                    case "last":
                        list = list.OrderBy(w => w.日期);
                        break;
                    default:
                        list = list.OrderByDescending(w => w.日期);
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
        ///查询爆破评分
        /// </summary>
        public JsonResult QueryComments()
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from com in db.Bp_Data_comment
                           select new
                           {
                               ID = com.ID,
                               伞岩评分 = com.伞岩评分,
                               块度评分 = com.块度评分,
                               抛掷评分 = com.抛掷评分,
                               根底评分 = com.根底评分,
                               评论 = com.评论,
                               评论人 = com.评论人,
                               项目ID = com.项目ID,
                               项目编码 = com.项目编码,
                           };

                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        ///添加爆破评分
        /// </summary>
        /// <param name="id">项目编码</param>
        /// <param name="kd">块度分数</param>
        /// <param name="pz">抛掷分数</param>
        /// <param name="gd">根底分数</param>
        /// <param name="sy">伞岩分数</param>
        /// <param name="test">评价</param>
        /// <returns>添加是否成功</returns>
        public string AddComment(string id, double? kd, double? pz, double? gd, double? sy, string text)
        {
            var name = CookieResult.CookieName();

            if (kd == null)
            {
                kd = 0;
            }
            if (pz == null)
            {
                pz = 0;
            }
            if (gd == null)
            {
                gd = 0;
            }
            if (sy == null)
            {
                sy = 0;
            }
            var xm = db.Bp_项目.Where(x => x.项目编码 == id).FirstOrDefault();
            var userComment = db.Bp_Data_comment.FirstOrDefault(x => x.项目编码 == id && x.项目ID == xm.ID && x.评论人 == name);

            if (userComment != null)
            {
                return AjaxResult.Error("你已给该次爆破评过分了！").ToString();
            }
            try
            {
                Bp_Data_comment comment = new Bp_Data_comment
                {
                    ID = Guid.NewGuid().ToString(),
                    项目ID = xm.ID,
                    项目编码 = id,
                    评论人 = name,
                    块度评分 = kd,
                    抛掷评分 = pz,
                    根底评分 = gd,
                    伞岩评分 = sy,
                    评论 = text,
                };
                db.Bp_Data_comment.Add(comment);
                db.SaveChanges();
                return AjaxResult.Success(null, "添加成功").ToString();
            }
            catch (Exception e)
            {
                return AjaxResult.Error("添加失败", e).ToString();
            }
        }

        /// <summary>
        ///查看该次爆破的评分记录
        /// </summary>
        /// <param name="id">项目编码</param>
        /// <returns>评分记录</returns>
        public JsonResult QueryHistory(string id)
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from cm in db.Bp_Data_comment
                           select new
                           {
                               cm.项目编码,
                               块度评分 = cm.块度评分,
                               抛掷评分 = cm.抛掷评分,
                               根底评分 = cm.根底评分,
                               伞岩评分 = cm.伞岩评分,
                               总分 = cm.块度评分 + cm.抛掷评分 + cm.根底评分 + cm.伞岩评分,
                               评论人 = cm.评论人,
                               评论 = cm.评论,
                           };

                if (!string.IsNullOrEmpty(id))
                {
                    list = list.Where(cm => cm.项目编码 == id);
                }

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


            foreach (var s in list)
            {

                //目标文件夹的文件名
                string desdir = Server.MapPath(load) + CookieResult.CookieName() + "\\" + s.资料ID;
                //判断文件夹是否存在
                if (!Directory.Exists(desdir))
                {
                    // 目录不存在，建立目录
                    Directory.CreateDirectory(desdir);
                }

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
                        img.Dispose();
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
        ///删除预览图片
        /// </summary>
        public string deleteLookPic()
        {
            //目标文件夹配置路径
            string load = System.Configuration.ConfigurationManager.AppSettings["loadSrc"];

            //目标文件夹的文件名
            string desdir = Server.MapPath(load) + CookieResult.CookieName();

            DirectoryInfo dir = new DirectoryInfo(desdir);
            FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
            foreach (FileSystemInfo i in fileinfo)
            {
                if (i is DirectoryInfo)            //判断是否文件夹
                {
                    DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                    subdir.Delete(true);          //删除子目录和文件
                }
                else
                {
                    System.IO.File.Delete(i.FullName);      //删除指定文件
                }
            }
            return AjaxResult.Success(null, "删除成功").ToString();
        }


        /// <summary>
        ///删除文件中的图片
        /// </summary>
        /// <param name="id">资料ID</param>
        /// <param name="name">资料名称</param>
        /// <returns>图片</returns>
        public string deletePic(string id)
        {
            var user = CookieResult.CookieName();
            var list = db.Bp_项目资料.Where(x => x.资料ID == id).FirstOrDefault();
            if (list == null)
            {
                return AjaxResult.Error("图片不存在或已被删除").ToString();
            }
            else
            {
                if (list.上传人 != user)
                {
                    return AjaxResult.Error("无权删除该图片").ToString();
                }
                else
                {
                    try
                    {
                        var homePath = System.Configuration.ConfigurationManager.AppSettings["imageSrc"];

                        var path = homePath + list.资料ID;

                        DirectoryInfo di = new DirectoryInfo(path);
                        di.Delete(true);

                        db.Bp_项目资料.Remove(list);
                        db.SaveChanges();
                        return AjaxResult.Success(null, "删除成功").ToString();
                    }
                    catch (Exception e)
                    {
                        return AjaxResult.Error("删除失败" + e).ToString();
                    }

                }
            }
        }

        //上传
        [HttpPost]
        public void Upload(FormCollection form)
        {
            //if (Request.Files.Count == 0)
            //{
            //Request.Files.Count 文件数为0上传不成功
            //Response.Write("<script>alert('上传失败');window.location.href='/Table/Operation';</script>");
            //}
            var files = Request.Files["file"];
            if (files.ContentLength == 0)
            {
                //文件大小大（以字节为单位）为0时，做一些操作
                Response.Write("<script>alert('上传失败');window.location.href='/Table/Operation';</script>");
            }
            else
            {

                //上传人
                var user = CookieResult.CookieUser();
                //流水号
                List<SqlParameter> paramArray = new List<SqlParameter>();
                paramArray.Add(new SqlParameter("@别名", "项目流水号"));
                paramArray.Add(new SqlParameter("@写流水号", 1));
                SqlParameter param = new SqlParameter("@输出流水号", SqlDbType.VarChar);
                param.Direction = ParameterDirection.Output;
                param.Size = 100;
                paramArray.Add(param);
                db.Database.ExecuteSqlCommand("EXEC [sp_GetNewID] @别名,@写流水号,@输出流水号 out", paramArray.ToArray());
                string result = paramArray[2].Value.ToString();

                var number = Convert.ToInt32(result);

                //项目编码

                var bm = Request["ubm"].ToString();

                //项目名称

                var nm = Request["unm"].ToString();

                //上传时间
                var time = DateTime.Now;

                //上传电脑
                var clientPCName = "";
                
                //根据目标IP地址获取IP对象
                //    System.Net.IPAddress clientIP = System.Net.IPAddress.Parse(Request.UserHostAddress);
                //根据IP对象创建主机对象
                //    System.Net.IPHostEntry ihe = System.Net.Dns.GetHostEntry(clientIP);
                //获取客户端主机名称
                //    clientPCName = ihe.HostName;

                //文件存放路径
                var homePath = System.Configuration.ConfigurationManager.AppSettings["imageSrc"];
                var guid = Guid.NewGuid().ToString();

                //文件大小不为0
                files = Request.Files["file"];

                //取得目标文件夹的路径
                string target = homePath + guid;

                //取得文件名字
                var filename = files.FileName;

                try
                {
                    //判断文件夹是否存在
                    if (!Directory.Exists(target))
                    {
                        // 目录不存在，建立目录
                        Directory.CreateDirectory(target);
                    }
                    //获取存储的目标地址
                    string path = target + "\\" + filename;
                    files.SaveAs(path);

                    string info = target + "\\" + "Upload_File_State.inf";
                    string vTime = time.Year+"-"+time.Month+"-"+time.Day+" " +time.Hour+":"+time.Minute+":"+time.Second;
                    //可以指定盘符，也可以指定任意文件名，还可以为word等文件
                    FileStream fs = new FileStream(info, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                    // 创建写入流
                    StreamWriter sw = new StreamWriter(fs);
                    // 写入Hello World
                    sw.WriteLine("[基本信息]");
                    sw.WriteLine("上传文件名=" + filename);
                    sw.WriteLine("上传类型=项目");
                    sw.WriteLine("上传文件大小=" + files.ContentLength);
                    sw.WriteLine("上传日期=" + vTime);
                    sw.WriteLine("上传登录名=" + user.登录名);
                    sw.WriteLine("上传用户=" + user.用户姓名);
                    sw.WriteLine("上传计算机=" + clientPCName);
                    sw.WriteLine("是否逻辑删除=0");
                    sw.Close(); //关闭文件
                    Bp_项目资料 xmzl = new Bp_项目资料
                    {
                        项目编码 = bm,
                        项目名称 = nm,
                        资料ID = guid,
                        资料名称 = filename,
                        上传时间 = time,
                        上传人 = user.登录名,
                        上传电脑 = clientPCName,
                        流水号 = number,
                    };
                    db.Bp_项目资料.Add(xmzl);
                    db.SaveChanges();
                    Response.Write("<script>alert('上传成功');window.location.href='/Table/Operation';</script>");
                }
                catch (Exception)
                {
                    Response.Write("<script>alert('上传失败');window.location.href='/Table/Operation';</script>");
                }
            }
        }

        /// <summary>
        ///查看成本统计
        /// </summary>
        /// <param name="id">月份</param>
        /// <param name="bm">年份</param>
        /// <returns>成本统计</returns>
        public JsonResult QueryCost(string id, string bm)
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from tj in db.Bp_成本统计
                           select new
                           {
                               月份 = tj.月份,
                               年份 = tj.yearID,
                               钻孔 = tj.钻孔,
                               火工品 = tj.火工品,
                               冲击炮 = tj.冲击炮,
                               装载 = tj.装载,
                               运输 = tj.运输,
                               辅助 = tj.辅助,
                               其他 = tj.其他,
                               总计 = tj.合计,
                               产量 = tj.产量,
                           };

                if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(bm))
                {
                    var month = int.Parse(id);
                    var yearID = int.Parse(bm);
                    list = list.Where(x => x.月份 == month && x.年份 == yearID);
                }

                switch (sortOrder)
                {
                    case "a":
                        list = list.OrderByDescending(w => w.月份);
                        break;
                    case "last_desc":
                        list = list.OrderByDescending(w => w.月份);
                        break;
                    case "last":
                        list = list.OrderBy(w => w.月份);
                        break;
                    default:
                        list = list.OrderBy(w => w.月份);
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
        ///添加或修改
        /// </summary>
        /// <param name="id">月份</param>
        /// <param name="bm">年份</param>
        /// <returns>是否成功</returns>
        public string SaveOrChange(string id, string bm, string zk, string hgp, string cjp, string zz, string ys, string fz, string qt, string ycl)
        {
            try
            {
                Double sum = Double.Parse(zk) + Double.Parse(hgp) + Double.Parse(cjp) + Double.Parse(zz) + Double.Parse(ys) + Double.Parse(fz) + Double.Parse(qt);
                var monthID = int.Parse(id);
                var yearID = int.Parse(bm);
                var cost = db.Bp_成本统计.Where(x => x.月份 == monthID && x.yearID == yearID).FirstOrDefault();
                //默认最大,减少返回false(显示红字)
                var flag = "";
                if (cost != null)
                {
                    if (cost.合计 == null)
                    {
                        cost.钻孔 = Double.Parse(zk);
                        cost.火工品 = Double.Parse(hgp);
                        cost.冲击炮 = Double.Parse(cjp);
                        cost.装载 = Double.Parse(zz);
                        cost.运输 = Double.Parse(ys);
                        cost.辅助 = Double.Parse(fz);
                        cost.其他 = Double.Parse(qt);
                        cost.合计 = sum;
                        cost.产量 = Double.Parse(ycl);
                        db.SaveChanges();
                        return AjaxResult.Success(flag, "操作成功").ToString();
                    }
                    else
                    {
                        if (cost.合计 > sum)
                        {
                            flag = "false";
                        }
                        else
                        {
                            flag = "true";
                        }
                        cost.钻孔 = Double.Parse(zk);
                        cost.火工品 = Double.Parse(hgp);
                        cost.冲击炮 = Double.Parse(cjp);
                        cost.装载 = Double.Parse(zz);
                        cost.运输 = Double.Parse(ys);
                        cost.辅助 = Double.Parse(fz);
                        cost.其他 = Double.Parse(qt);
                        cost.合计 = sum;
                        cost.产量 = Double.Parse(ycl);
                        db.SaveChanges();
                        return AjaxResult.Success(flag, "操作成功").ToString();
                    }
                }
                return AjaxResult.Error("操作失败").ToString();
            }
            catch (Exception e)
            {
                return AjaxResult.Error("操作失败", e).ToString();
            }
        }

        /// <summary>
        ///添加成本年份和月份
        /// </summary>
        /// <param name="year">年份</param>
        /// <returns>是否成功</returns>
        public string AddOneYear(string year)
        {
            try
            {
                var i = int.Parse(year);
                var ye = db.Bp_成本年份.Where(x => x.年份 == i).FirstOrDefault();
                if (ye != null)
                {
                    return AjaxResult.Error("已添加过该年份！").ToString();
                }
                else
                {
                    Bp_成本年份 y = new Bp_成本年份
                    {
                        年份 = i,
                    };
                    db.Bp_成本年份.Add(y);
                    db.SaveChanges();
                    var tye = db.Bp_成本年份.Where(x => x.年份 == i).FirstOrDefault();
                    for (int m = 1; m < 13; m++)
                    {
                        Bp_成本统计 o = new Bp_成本统计
                        {
                            ID = Guid.NewGuid().ToString(),
                            月份 = m,
                            yearID = tye.id,
                        };
                        db.Bp_成本统计.Add(o);
                        db.SaveChanges();
                    }
                    return AjaxResult.Success(null, "添加成功").ToString();
                }
            }
            catch (Exception)
            {
                return AjaxResult.Error("添加失败").ToString();
            }
        }

        /// <summary>
        ///成本年份查询
        /// </summary>
        /// <returns>成本年份</returns>
        public JsonResult QueryCostYears()
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from y in db.Bp_成本年份
                           select new
                           {
                               年份 = y.年份,
                               钻孔 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.钻孔).Sum(),
                               火工品 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.火工品).Sum(),
                               冲击炮 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.冲击炮).Sum(),
                               装载 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.装载).Sum(),
                               运输 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.运输).Sum(),
                               辅助 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.辅助).Sum(),
                               其他 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.其他).Sum(),
                               合计 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.合计).Sum(),
                               产量 = db.Bp_成本统计.Where(x => x.yearID == y.id).Select(x => x.产量).Sum()
                           };
                switch (sortOrder)
                {
                    case "a":
                        list = list.OrderByDescending(w => w.年份);
                        break;
                    case "last_desc":
                        list = list.OrderByDescending(w => w.年份);
                        break;
                    case "last":
                        list = list.OrderBy(w => w.年份);
                        break;
                    default:
                        list = list.OrderBy(w => w.年份);
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
        ///查询该年每月成本产量
        ///<param name="id">年份</param>
        /// </summary>
        public JsonResult QueryYearCost(string id)
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from mon in db.Bp_成本统计
                           select new
                           {
                               月份 = mon.月份,
                               钻孔 = mon.钻孔,
                               火工品 = mon.火工品,
                               冲击炮 = mon.冲击炮,
                               装载 = mon.装载,
                               运输 = mon.运输,
                               辅助 = mon.辅助,
                               其他 = mon.其他,
                               总计 = mon.合计,
                               年份 = mon.yearID,
                               年 = db.Bp_成本年份.Where(x => x.id == mon.yearID).Select(a => a.年份).FirstOrDefault(),
                               产量 = mon.产量,
                           };
                if (!string.IsNullOrEmpty(id))
                {
                    int year = int.Parse(id);
                    var ye = db.Bp_成本年份.Where(x => x.年份 == year).FirstOrDefault();
                    list = list.Where(x => x.年份 == ye.id);
                }
                switch (sortOrder)
                {
                    case "a":
                        list = list.OrderByDescending(w => w.月份);
                        break;
                    case "last_desc":
                        list = list.OrderByDescending(w => w.月份);
                        break;
                    case "last":
                        list = list.OrderBy(w => w.月份);
                        break;
                    default:
                        list = list.OrderBy(w => w.月份);
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
        ///查询该年每月成本占比
        ///<param name="id">年份</param>
        /// </summary>
        public JsonResult lookCost(string ye, string mon, string tye)
        {
            int pageSize = int.Parse(Request["pageSize"] ?? "10");
            int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
            string sortOrder = Request["sortOrder"];
            string searchText = Request["searchText"];
            string sortName = Request["sortName"];

            var list = from y in db.Bp_成本年份
                       join m in db.Bp_成本统计 on y.id equals m.yearID
                       select new
                       {
                           年份ID = m.yearID,
                           年份 = y.年份,
                           月份 = m.月份,
                           钻孔 = m.钻孔 / m.产量,
                           火工品 = m.火工品 / m.产量,
                           冲击炮 = m.冲击炮 / m.产量,
                           装载 = m.装载 / m.产量,
                           运输 = m.运输 / m.产量,
                           辅助 = m.辅助 / m.产量,
                           其他 = m.其他 / m.产量,
                           总计 = m.合计 / m.产量,
                       };
            if (!string.IsNullOrEmpty(ye))
            {
                var yearID = int.Parse(ye);
                list = list.Where(x => x.年份ID == yearID);
            }
            if (!string.IsNullOrEmpty(tye))
            {
                var year = int.Parse(tye);
                list = list.Where(x => x.年份 == year);
            }
            if (!string.IsNullOrEmpty(mon))
            {
                var month = int.Parse(mon);
                list = list.Where(x => x.月份 == month);
            }
            switch (sortOrder)
            {
                case "a":
                    list = list.OrderByDescending(w => w.月份);
                    break;
                case "last_desc":
                    list = list.OrderByDescending(w => w.月份);
                    break;
                case "last":
                    list = list.OrderBy(w => w.月份);
                    break;
                default:
                    list = list.OrderBy(w => w.月份);
                    break;
            };
            return Json(list);


        }
        /// <summary>
        ///删除该年成本
        ///<param name="id">年份</param>
        /// </summary>
        public string deleteYear(string id)
        {
            try
            {
                var flag = false;
                var name = CookieResult.CookieName();
                var i = int.Parse(id);
                var user = db.Users.Where(x => x.登录名 == name).FirstOrDefault();
                var ye = db.Bp_成本年份.Where(x => x.年份 == i).FirstOrDefault();
                var list = db.Bp_成本统计.Where(x => x.yearID == ye.id);
                foreach (var l in list)
                {
                    if (l.合计 != null)
                    {
                        flag = true;
                    }
                }
                if (flag)
                {
                    if (user.级别 == 1)
                    {
                        db.Bp_成本统计.RemoveRange(list);
                        db.Bp_成本年份.Remove(ye);
                        db.SaveChanges();
                        return AjaxResult.Success(null, "删除成功").ToString();
                    }
                    else
                    {
                        return AjaxResult.Error("权限不足").ToString();
                    }
                }
                else
                {
                    db.Bp_成本统计.RemoveRange(list);
                    db.Bp_成本年份.Remove(ye);
                    db.SaveChanges();
                    return AjaxResult.Success(null, "删除成功").ToString();
                }
            }
            catch (Exception)
            {
                return AjaxResult.Error("删除失败").ToString();
            }
        }

        /// <summary>
        ///查询该次爆破的真实数据
        ///<param name="id">项目编码</param>
        ///<param name="name">项目名称(日期)</param>
        /// </summary>
        public JsonResult QueryTureData(string id, string name)
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];
                if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(name))
                {
                    var f = db.Bp_项目数据.Where(x => x.项目编码 == id && x.日期 == name).FirstOrDefault();
                    var t = db.Bp_真实数据.Where(x => x.项目编码 == id && x.日期 == name);
                    if (f != null && t.Count() == 0)
                    {
                        Bp_真实数据 bp = new Bp_真实数据
                        {
                            项目ID = f.项目ID,
                            项目编码 = f.项目编码,
                            日期 = f.日期,
                        };
                        db.Bp_真实数据.Add(bp);
                    }
                    else if (f != null && t.Count() > 1)
                    {
                        foreach (var item in t)
                        {
                            if (item.孔距 > 0 || item.排距 > 0 || item.孔数 > 0 || item.平均孔深 > 0 || item.炸药量 > 0 || item.抵抗线 > 0 || item.超深 > 0 || item.填充 > 0)
                            {
                                continue;
                            }
                            else
                            {
                                db.Bp_真实数据.Remove(item);
                            }
                        }
                    }
                    db.SaveChanges();
                }
                var list = from tu in db.Bp_真实数据
                           select new
                           {
                               项目编码 = tu.项目编码,
                               日期 = tu.日期,
                               孔距 = tu.孔距,
                               排距 = tu.排距,
                               孔数 = tu.孔数,
                               平均孔深 = tu.平均孔深,
                               炸药量 = tu.炸药量,
                               抵抗线 = tu.抵抗线,
                               超深 = tu.超深,
                               填充 = tu.填充,
                               孔总深 = tu.平均孔深 * tu.孔数,
                               爆破量 = tu.孔距 * tu.排距 * (tu.平均孔深 - tu.超深) * tu.孔数 * 2.65,
                               炸药单耗 = (tu.孔距 * tu.排距 * (tu.平均孔深 - tu.超深) * tu.孔数 * 2.65) / 2.65 == 0 ? 0 : tu.炸药量 / ((tu.孔距 * tu.排距 * (tu.平均孔深 - tu.超深) * tu.孔数 * 2.65) / 2.65),
                           };
                if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(name))
                {
                    list = list.Where(x => x.项目编码 == id && x.日期 == name);
                }
                switch (sortOrder)
                {
                    case "a":
                        list = list.OrderByDescending(w => w.日期);
                        break;
                    case "last_desc":
                        list = list.OrderByDescending(w => w.日期);
                        break;
                    case "last":
                        list = list.OrderBy(w => w.日期);
                        break;
                    default:
                        list = list.OrderByDescending(w => w.日期);
                        break;
                };
                return Json(list);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        ///添加或修改该次爆破的真实数据
        /// </summary>
        public string SaveOrChangeData(string id, string name, double? tkj, double? tpj, int? tks, double? tpjks, double? tzyl, double? tdkx, double? tcs, double? ttc)
        {
            try
            {
                var t = db.Bp_真实数据.Where(x => x.项目编码 == id && x.日期 == name).FirstOrDefault();
                if (t != null)
                {
                    t.孔距 = tkj;
                    t.排距 = tpj;
                    t.孔数 = tks;
                    t.平均孔深 = tpjks;
                    t.炸药量 = tzyl;
                    t.抵抗线 = tdkx;
                    t.超深 = tcs;
                    t.填充 = ttc;
                }
                db.SaveChanges();
                return AjaxResult.Success(null, "操作成功").ToString();
            }
            catch (Exception)
            {
                return AjaxResult.Error("操作失败").ToString();
            }

        }

        /// <summary>
        ///该次爆破的真实数据与设计数据对比
        /// </summary>
        public JsonResult TdContrastFd(string id, string name)
        {
            int pageSize = int.Parse(Request["pageSize"] ?? "10");
            int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
            string sortOrder = Request["sortOrder"];
            string searchText = Request["searchText"];
            string sortName = Request["sortName"];

            var list = from f in db.Bp_项目数据
                       join t in db.Bp_真实数据 on f.项目编码 equals t.项目编码
                       select new
                       {
                           项目编码 = f.项目编码,
                           日期 = f.日期,

                           //孔距 排距 抵抗线 超深 

                           孔距 = t.孔距 == 0 ? 0 : f.孔距 / f.数量 - t.孔距 < 0 ? (f.孔距 / f.数量 - t.孔距) * (-1) / t.孔距 : (f.孔距 / f.数量 - t.孔距) / t.孔距,

                           排距 = t.排距 == 0 ? 0 : f.排距 / f.数量 - t.排距 < 0 ? (f.排距 / f.数量 - t.排距) * (-1) / t.排距 : (f.排距 / f.数量 - t.排距) / t.排距,

                           孔数 = t.孔数 == 0 ? 0 : f.孔数 - t.孔数 < 0 ? (f.孔数 - t.孔数) * (-1) / t.孔数 : (f.孔数 - t.孔数) / t.孔数,

                           平均孔深 = t.平均孔深 == 0 ? 0 : f.平均孔深 - t.平均孔深 < 0 ? (f.平均孔深 - t.平均孔深) * (-1) / t.平均孔深 : (f.平均孔深 - t.平均孔深) / t.平均孔深,

                           炸药量 = t.炸药量 == 0 ? 0 : f.炸药量 - t.炸药量 < 0 ? (f.炸药量 - t.炸药量) * (-1) / t.炸药量 : (f.炸药量 - t.炸药量) / t.炸药量,

                           抵抗线 = t.抵抗线 == 0 ? 0 : f.抵抗线 / f.数量 - t.抵抗线 < 0 ? (f.抵抗线 / f.数量 - t.抵抗线) * (-1) / t.抵抗线 : (f.抵抗线 / f.数量 - t.抵抗线) / t.抵抗线,

                           超深 = t.超深 == 0 ? 0 : f.超深 / f.数量 - t.超深 < 0 ? (f.超深 / f.数量 - t.超深) * (-1) / t.超深 : (f.超深 / f.数量 - t.超深) / t.超深,

                           填充 = t.填充 == 0 ? 0 : f.填充 - t.填充 < 0 ? (f.填充 - t.填充) * (-1) / t.填充 : (f.填充 - t.填充) / t.填充,

                           孔总深 = t.平均孔深 * t.孔数 == 0 ? 0 : (f.平均孔深 * f.孔数 - t.平均孔深 * t.孔数) < 0 ? (f.平均孔深 * f.孔数 - t.平均孔深 * t.孔数) * (-1) / (t.平均孔深 * t.孔数) : (f.平均孔深 * f.孔数 - t.平均孔深 * t.孔数) / (t.平均孔深 * t.孔数),

                           爆破量 = t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65 == 0 ? 0 : ((f.孔距 / f.数量) * (f.排距 / f.数量) * (f.平均孔深 - f.超深 / f.数量) * f.孔数 * 2.65) - (t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) < 0 ? (((f.孔距 / f.数量) * (f.排距 / f.数量) * (f.平均孔深 - f.超深 / f.数量) * f.孔数 * 2.65) - (t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65)) * (-1) / (t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) : (((f.孔距 / f.数量) * (f.排距 / f.数量) * (f.平均孔深 - f.超深 / f.数量) * f.孔数 * 2.65) - (t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65)) / (t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65),

                           炸药单耗 = (t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) / 2.65 == 0 ? 0 : (f.炸药量 / (((f.孔距 / f.数量) * (f.排距 / f.数量) * (f.平均孔深 - f.超深 / f.数量) * f.孔数 * 2.65) / 2.65)) - (t.炸药量 / ((t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) / 2.65)) < 0 ? ((f.炸药量 / (((f.孔距 / f.数量) * (f.排距 / f.数量) * (f.平均孔深 - f.超深 / f.数量) * f.孔数 * 2.65) / 2.65)) - (t.炸药量 / ((t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) / 2.65))) * (-1) / (t.炸药量 / ((t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) / 2.65)) : ((f.炸药量 / (((f.孔距 / f.数量) * (f.排距 / f.数量) * (f.平均孔深 - (f.超深 / f.数量)) * f.孔数 * 2.65) / 2.65)) - (t.炸药量 / ((t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) / 2.65))) / (t.炸药量 / ((t.孔距 * t.排距 * (t.平均孔深 - t.超深) * t.孔数 * 2.65) / 2.65)),
                       };
            if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(name))
            {
                list = list.Where(x => x.项目编码 == id && x.日期 == name);
            }
            switch (sortOrder)
            {
                case "a":
                    list = list.OrderByDescending(w => w.日期);
                    break;
                case "last_desc":
                    list = list.OrderByDescending(w => w.日期);
                    break;
                case "last":
                    list = list.OrderBy(w => w.日期);
                    break;
                default:
                    list = list.OrderBy(w => w.日期);
                    break;
            };
            return Json(list);
        }
    }
}