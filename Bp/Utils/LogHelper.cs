using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Bp.Utils
{
    public static class LogHelper
    {
        public static void Error(Exception ex,Type type)
        {
            ILog log = log4net.LogManager.GetLogger(type);
            log.Error("error", ex);
        }

        public static void Error(Exception ex)
        {
            ILog log = log4net.LogManager.GetLogger(string.Empty);
            log.Error(ex);
        }

        public static void Info(string info)
        {
            ILog log = log4net.LogManager.GetLogger("");
            log.Info(DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss") + "  " + info);
        }
    }
}
