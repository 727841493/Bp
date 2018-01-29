using Newtonsoft.Json;

namespace Bp.Utils
{
    /// <summary>
    /// 前台Ajax请求的统一返回结果类
    /// </summary>
    public class AjaxResult
    {
        public AjaxResult()
        {
        }
        /// <summary>
        /// 是否产生错误
        /// </summary>
        public bool success = false;
        /// <summary>
        /// 错误信息，或者成功信息
        /// </summary>
        public string message;
        /// <summary>
        /// 成功可能时返回的数据
        /// </summary>
        public object data;


        #region Error
        public static AjaxResult Error()
        {
            return new AjaxResult()
            {
                success = false
            };
        }
        public static AjaxResult Error(string msg)
        {
            return new AjaxResult()
            {
                success = false,
                message = msg
            };
        }
        public static AjaxResult Error(string msg, System.Exception ex)
        {
            string m = string.Empty;
            m = ex.Message;
            while (ex.InnerException != null)
            {
                ex = ex.InnerException;
                if (ex.InnerException == null)
                {
                    m = ex.Message;
                }
            }
            return new AjaxResult()
            {
                success = false,
                message = msg,
                data = m
            };
        }
        #endregion

        #region Success
        public static AjaxResult Success()
        {
            return new AjaxResult()
            {
                success = true
            };
        }
        public static AjaxResult Success(object d)
        {
            return new AjaxResult()
            {
                success = true,
                data = d
            };
        }
        public static AjaxResult Success(object d, string msg)
        {
            return new AjaxResult()
            {
                success = true,
                data = d,
                message = msg
            };
        }
        #endregion

        public override string ToString()
        {
            JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
            };
            string json = JsonConvert.SerializeObject(this, microsoftDateFormatSettings);
            return json;
        }
    }
}
