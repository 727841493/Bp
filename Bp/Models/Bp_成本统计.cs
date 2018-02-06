namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_成本统计
    {
        [StringLength(50)]
        public string ID { get; set; }

        public int 月份 { get; set; }

        public double? 钻孔 { get; set; }

        public double? 火工品 { get; set; }

        public double? 冲击炮 { get; set; }

        public double? 装载 { get; set; }

        public double? 运输 { get; set; }

        public double? 辅助 { get; set; }

        public double? 其他 { get; set; }

        public double? 合计 { get; set; }

        public double? 产量 { get; set; }

        public int yearID { get; set; }
    }
}
