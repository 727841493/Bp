using Bp.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;

namespace Bp.Filter
{
    public class WebApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        //重写基类的异常处理方法
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            Trace.TraceError("异常: {0},请求 URI: {1}", actionExecutedContext.Exception.Message, actionExecutedContext.Request.RequestUri);
            LogHelper.Error(actionExecutedContext.Exception);
            base.OnException(actionExecutedContext);
        }
    }
}