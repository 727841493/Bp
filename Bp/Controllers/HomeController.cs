using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bp.Controllers
{
    public class HomeController : Controller
    {
        DBContext db = new DBContext();

        public ActionResult Index()
        {
            return View();
        }
        //报表查询
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

                var info = db.Bp_项目数据.ToList();

                if (info.Count != 0)
                {
                    db.Bp_项目数据.RemoveRange(info);
                    db.SaveChanges();
                }

                var lists = from xm in db.Bp_项目
                            join lp in db.BP_Data_lbastpreset on xm.ID equals lp.项目ID
                            join bb in db.BP_Data_Cal_BlastsDynamiteSet_Base on lp.项目ID equals bb.项目ID
                            //join bv in db.BP_Data_Cal_BlastsDynamiteSet_VolBase on bb.项目ID equals bv.项目ID
                            join bd in db.BP_Data_Cal_BlastsDynamiteSet_Detail on bb.项目ID equals bd.项目ID
                            select new
                            {
                                项目ID = xm.ID,
                                项目编码 = xm.项目编码,
                                台阶水平 = lp.Z1,
                                日期 = lp.lbastpresetname,
                                岩性 = bb.mainRock,
                                //孔距 = bv.VolNo == "B" ? bv.ColLength : 0,
                                //排距 = bv.VolNo == "B" ? bv.VolLength : 0,
                                孔距 = db.BP_Data_Cal_BlastsDynamiteSet_VolBase.Where(x => x.项目ID == bb.项目ID).Select(x => x.ColLength).Average(),
                                排距 = db.BP_Data_Cal_BlastsDynamiteSet_VolBase.Where(x => x.VolNo != "A" && x.项目ID == bb.项目ID).Select(x => x.VolLength).Average(),
                                孔数 = bb.countBlast,
                                平均孔深 = bb.LbastDepth,
                                炸药量 = bb.countlg,
                                //抵抗线 = bv.VolNo == "A" ? bv.VolDikang : 0,
                                //超深 = bv.VolNo == "A" ? bv.BlastAddDepth : 0,
                                抵抗线 = db.BP_Data_Cal_BlastsDynamiteSet_VolBase.Where(x => x.VolNo == "A" && x.项目ID == bb.项目ID).Select(x => x.VolDikang).FirstOrDefault(),
                                超深 = db.BP_Data_Cal_BlastsDynamiteSet_VolBase.Where(x => x.项目ID == bb.项目ID).Select(x => x.BlastAddDepth).Average(),
                                填充 = bd.l1,
                            };
                List<Bp_项目数据> list = new List<Bp_项目数据>();
                List<string> id = new List<string>();
                List<string> bm = new List<string>();
                foreach (var item in lists)
                {
                    if (bm.IndexOf(item.项目编码) == -1 && id.IndexOf(item.项目ID)==-1)
                    {
                        bm.Add(item.项目编码);
                        id.Add(item.项目ID);
                        Bp_项目数据 bp = new Bp_项目数据();
                        bp.项目ID = item.项目ID;
                        bp.项目编码 = item.项目编码;
                        bp.台阶水平 = item.台阶水平;
                        bp.日期 = item.日期;
                        bp.岩性 = item.岩性;
                        bp.孔距 = item.孔距;
                        bp.排距 = item.排距;
                        bp.孔数 = item.孔数;
                        bp.平均孔深 = item.平均孔深;
                        bp.炸药量 = item.炸药量;
                        bp.抵抗线 = item.抵抗线;
                        bp.超深 = item.超深;
                        bp.填充 = item.填充;
                        bp.数量 = 1;
                        list.Add(bp);
                    }
                    else
                    {
                        foreach (var i in list)
                        {
                            if (i.项目编码 == item.项目编码)
                            {
                                i.孔距 = i.孔距 + item.孔距;
                                i.排距 = i.排距 + item.排距;
                                i.抵抗线 = i.抵抗线 + item.抵抗线;
                                i.超深 = i.超深 + item.超深;
                                i.数量 = i.数量 + 1;
                            }
                        }
                    }
                }
                db.Bp_项目数据.AddRange(list);
                db.SaveChanges();

                var xmsj = from sj in db.Bp_项目数据
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
                               炸药单耗 = ((sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65) == 0 ? 0 : sj.炸药量 / (((sj.孔距 / sj.数量) * (sj.排距 / sj.数量) * (sj.平均孔深 - (sj.超深 / sj.数量)) * sj.孔数 * 2.65) / 2.65)
                           };
                switch (sortOrder)
                {
                    case "a":
                        xmsj = xmsj.OrderByDescending(w => w.项目编码);
                        break;
                    case "last_desc":
                        xmsj = xmsj.OrderByDescending(w => w.项目编码);
                        break;
                    case "last":
                        xmsj = xmsj.OrderBy(w => w.项目编码);
                        break;
                    default:
                        xmsj = xmsj.OrderBy(w => w.项目编码);
                        break;
                };
                return Json(xmsj);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //查询通知
        public JsonResult QueryMessages(string id)
        {
            var name = CookieResult.CookieName();
            int pageSize = int.Parse(Request["pageSize"] ?? "10");
            int pageNumber = int.Parse(Request["pageNumber"] ?? "1");
            string sortOrder = Request["sortOrder"];
            string searchText = Request["searchText"];
            string sortName = Request["sortName"];
            var list = from msg in db.Bp_通知
                       select new
                       {
                           状态 = msg.查看人.IndexOf(name),
                           ID = msg.ID,
                           标题 = msg.标题,
                           内容 = msg.内容,
                           发布时间 = msg.发布时间,
                           发布人 = msg.发布人,
                           查看人 = msg.查看人,
                       };
            DateTime now = DateTime.Now;
            DateTime d1 = new DateTime(now.Year, now.Month, 1);
            string startTime = d1.ToString();
            list = list.Where(x => String.Compare(startTime,x.发布时间) <= 0);
            if (!string.IsNullOrEmpty(id))
            {
                list = list.Where(x => x.ID == id);
                if (list.Count() > 0)
                {
                    ChangeStatus(id, name);
                }
            }
            switch (sortOrder)
            {
                case "desc":
                    list = list.OrderByDescending(w => w.发布时间);
                    break;
                case "asc":
                    list = list.OrderBy(w => w.发布时间);
                    break;
                default:
                    list = list.OrderByDescending(w => w.发布时间);
                    break;
            };
            return Json(list);
        }

        //修改状态
        public void ChangeStatus(string id, string name)
        {
            var msg = db.Bp_通知.Where(x => x.ID == id).FirstOrDefault();
            if (msg.查看人.IndexOf(name) == -1)
            {
                if (msg.查看人 == "")
                {
                    msg.查看人 = name;
                }
                msg.查看人 = msg.查看人 + "," + name;
            }
            db.SaveChanges();
        }

        //添加通知
        public string AddMessages(string title, string context)
        {
            try
            {
                var name = CookieResult.CookieName();
                var time = DateTime.Now;
                Bp_通知 msg = new Bp_通知
                {
                    ID = Guid.NewGuid().ToString(),
                    标题 = title,
                    内容 = context,
                    发布人 = name,
                    查看人 = name,
                    发布时间 = time.ToString(),

                };
                db.Bp_通知.Add(msg);
                db.SaveChanges();
                return AjaxResult.Success(null, "发布成功").ToString();
            }
            catch (Exception)
            {
                return AjaxResult.Error("发布失败！").ToString();
            }
        }
    }
}