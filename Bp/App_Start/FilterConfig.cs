﻿using Bp.Filter;
using System.Web;
using System.Web.Mvc;

namespace Bp
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new LoginFilter());
        }
    }
}
