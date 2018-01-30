using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bp.Controllers
{
    public class UserController : Controller
    {
        DBContext db = new DBContext();

        public ActionResult Index()
        {
            return View();
        }
        //查询
        public JsonResult QueryUsers(string name)
        {
            var list = db.Users.Where(x => x.登录名 == name).FirstOrDefault();
            return Json(list);
        }
        //修改密码
        public string ChangePassword(string name, string oldPassword, string newPassword)
        {
            var user = db.Users.Where(x => x.登录名 == name).FirstOrDefault();
            if (user != null)
            {
                if (user.密码 == Pub.Security.CreateDbPassword(oldPassword))
                {
                    user.密码 = Pub.Security.CreateDbPassword(newPassword);
                    db.SaveChanges();
                    return AjaxResult.Success(user, "修改成功,请重新登录").ToString();
                }
                else
                {
                    return AjaxResult.Error("修改失败,原密码错误").ToString();
                }
            }
            return AjaxResult.Error("修改失败").ToString();
        }
    }
}