using Bp.Models;
using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Bp.Controllers
{
    public class AccountController : Controller
    {
        DBContext db = new DBContext();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        ///用户登录
        /// </summary>
        /// <param name="user">用户信息</param>
        /// <returns>登录是否成功</returns>
        public RedirectResult DoLogin(string inputName, string inputPassword, string flag)
        {
            Users user = new Users();
            user.登录名 = inputName;
            user.密码 = inputPassword;

            string passWord = Pub.Security.CreateDbPassword(user.密码);
            Users loginUser = db.Users.FirstOrDefault(u => u.登录名 == user.登录名 && u.密码 == passWord);

            if (loginUser != null)
            {
                //序列化用户实体
                var UserData = SerializeHelper.Instance.JsonSerialize<Users>(loginUser);
                //保存身份信息，参数说明可以看提示
                FormsAuthenticationTicket Ticket = new FormsAuthenticationTicket(1, loginUser.登录名, DateTime.Now, DateTime.Now.AddHours(12), false, UserData, FormsAuthentication.FormsCookiePath);

                //加密身份信息，保存至Cookie
                HttpCookie Cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(Ticket));
                Response.Cookies.Add(Cookie);

                HttpCookie userName = new HttpCookie("Xing");
                userName["n"] = user.登录名;
                Response.Cookies.Add(userName);

                if (flag == "true")
                {
                    Random ran = new Random();
                    int RandKey = ran.Next(100, 999);
                    HttpCookie login = new HttpCookie("Porschev");
                    login["p"] = user.登录名;
                    login["n"] = RandKey + "-" + inputPassword + "-" + RandKey;
                    login.Expires = DateTime.Now.AddMinutes(1440);
                    Response.Cookies.Add(login);
                }
                else
                {
                    foreach (string cookiename in Request.Cookies.AllKeys)
                    {
                        HttpCookie cookies = Request.Cookies[cookiename];
                        HttpCookie cookie = Request.Cookies["Porschev"];
                        if (cookie == cookies)
                        {
                            cookies.Expires = DateTime.Today.AddDays(-1);
                            Response.Cookies.Add(cookies);
                            Request.Cookies.Remove(cookiename);
                        }
                    }
                }
                return Redirect("/Home/Index");
                //return AjaxResult.Success(loginUser, "登录成功").ToString();
            }
            return Redirect("/Account/Index");
            //return AjaxResult.Error("登录失败").ToString();
        }
    }
}