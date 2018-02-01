using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bp.Controllers
{
    public class TableController : Controller
    {

        DBContext db = new DBContext();

        public ActionResult Query()
        {
            return View();
        }

        public ActionResult Mark()
        {
            return View();
        }

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
                               炸药单耗 = ((sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65) == 0 ? 0 : sj.炸药量 / ((sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65) / 2.65,
                               块度平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.块度评分).Average(),
                               抛掷平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.抛掷评分).Average(),
                               根底平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.根底评分).Average(),
                               伞岩平均分 = db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.伞岩评分).Average(),
                               总平均分 = (db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.块度评分).Average() + db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.抛掷评分).Average() + db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.根底评分).Average() + db.Bp_Data_comment.Where(b => b.项目编码 == sj.项目编码 && b.项目ID == sj.项目ID).Select(b => b.伞岩评分).Average()) / 4,
                               可打分 = !db.Bp_Data_comment.Any(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID && x.评论人 == name),
                               查看历史 = db.Bp_Data_comment.Any(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID),
                           };
                if (!string.IsNullOrEmpty(startTime))
                {
                    //list = list.Where(x => String.Compare(startTime, x.日期) <= 0);
                    list = list.Where(x => x.日期.CompareTo(startTime) >= 0);
                }
                if (!string.IsNullOrEmpty(endTime))
                {
                    //list = list.Where(x => String.Compare(x.日期, endTime) <= 0);
                    list = list.Where(x => x.日期.CompareTo(endTime) < 0);
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
        ///成本核算
        /// </summary>
        public JsonResult QueryCost(string id, string bm)
        {
            try
            {
                int pageSize = int.Parse(Request["pageSize"] ?? "10");
                int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
                string sortOrder = Request["sortOrder"];
                string searchText = Request["searchText"];
                string sortName = Request["sortName"];

                var list = from sj in db.Bp_项目数据
                           select new
                           {
                               项目ID = sj.项目ID,
                               项目编码 = sj.项目编码,
                               台阶水平 = sj.台阶水平,
                               日期 = sj.日期,
                               钻孔 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.钻孔).FirstOrDefault(),
                               火工品 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.火工品).FirstOrDefault(),
                               冲击炮 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.冲击炮).FirstOrDefault(),
                               装载 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.装载).FirstOrDefault(),
                               运输 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.运输).FirstOrDefault(),
                               辅助 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.辅助).FirstOrDefault(),
                               其他 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.其他).FirstOrDefault(),
                               总计 = db.Bp_成本核算.Where(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID).Select(x => x.合计).FirstOrDefault(),
                               添加 = !db.Bp_成本核算.Any(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID),
                               修改 = db.Bp_成本核算.Any(x => x.项目编码 == sj.项目编码 && x.项目ID == sj.项目ID),
                           };

                if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(bm))
                {
                    list = list.Where(x => x.项目ID == id && x.项目编码 == bm);
                }

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

        //添加或修改
        public string SaveOrChange(string id, string bm, string zk, string hgp, string cjp, string zz, string ys, string fz, string qt)
        {
            //float id, float bm, float zk, float hgp, float cjp, float zz, float ys, float fz, float qt

            var xm = db.Bp_项目数据.Where(x => x.项目ID == id && x.项目编码 == bm).FirstOrDefault();
            var cost = db.Bp_成本核算.Where(x => x.项目ID == id && x.项目编码 == bm).FirstOrDefault();
            //默认最大,减少返回false(显示红字)
            var flag ="";
            try
            {
                Double sum = Double.Parse(zk) + Double.Parse(hgp) + Double.Parse(cjp) + Double.Parse(zz) + Double.Parse(ys) + Double.Parse(fz) + Double.Parse(qt);
                if (xm != null)
                {
                    if (cost == null)
                    {
                        Bp_成本核算 bp = new Bp_成本核算
                        {
                            ID = Guid.NewGuid().ToString(),
                            项目ID = xm.项目ID,
                            项目编码 = xm.项目编码,
                            钻孔 = Double.Parse(zk),
                            火工品 = Double.Parse(hgp),
                            冲击炮 = Double.Parse(cjp),
                            装载 = Double.Parse(zz),
                            运输 = Double.Parse(ys),
                            辅助 = Double.Parse(fz),
                            其他 = Double.Parse(qt),
                            合计 = sum,
                        };
                        db.Bp_成本核算.Add(bp);
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
                    }
                }
                db.SaveChanges();
                return AjaxResult.Success(flag, "操作成功").ToString();
            }
            catch (Exception e)
            {
                return AjaxResult.Error("操作失败", e).ToString();
            }
        }
    }
}