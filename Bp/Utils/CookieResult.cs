using Bp.Models;
using System.Web;
using System.Web.Security;

namespace Bp.Utils
{
    public class CookieResult
    {
        /// <summary>
        ///获取登录的用户信息
        /// </summary>
        /// <returns>登录用户的登录名</returns>
        public static string CookieName()
        {
            //获取cookie
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            //解密
            FormsAuthenticationTicket Ticket = FormsAuthentication.Decrypt(authCookie.Value);
            //反序列化
            var user = SerializeHelper.Instance.JsonDeserialize<Users>(Ticket.UserData);
            return user.登录名;
        }
        /// <summary>
        ///获取登录的用户信息
        /// </summary>
        public static Users CookieUser()
        {
            //获取cookie
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            //解密
            FormsAuthenticationTicket Ticket = FormsAuthentication.Decrypt(authCookie.Value);
            //反序列化
            var user = SerializeHelper.Instance.JsonDeserialize<Users>(Ticket.UserData);
            return user;
        }
    }
}