using Bp.Models;
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

        public JsonResult QueryUsers(string name)
        {

            var list = db.Users.Where(x => x.登录名 == name).FirstOrDefault();
            return Json(list);
        }
    }
}