using Bp.Models;
using Bp.Utils;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Bp.Filter
{
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class LoginFilter : ActionFilterAttribute
    {
        /// <summary>  
        /// OnActionExecuting是Action执行前的操作  
        /// </summary>  
        /// <param name="filterContext"></param>  
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName == "Account" && (filterContext.ActionDescriptor.ActionName == "DoLogin" || filterContext.ActionDescriptor.ActionName == "Index"))
            {
                base.OnActionExecuting(filterContext);
            }
            else
            {
                //获取cookie
                HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
                if (authCookie==null)
                {
                    filterContext.Result = new RedirectResult("/Account/Index");
                    return;
                }
                //解密
                FormsAuthenticationTicket Ticket = FormsAuthentication.Decrypt(authCookie.Value);
                //反序列化
                var name = SerializeHelper.Instance.JsonDeserialize<Users>(Ticket.UserData);

                if (name == null)
                {
                    filterContext.Result = new RedirectResult("/Account/Index");
                }
                else
                {
                    base.OnActionExecuting(filterContext);
                }
            }
        }
    }
}
