namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_项目数据
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(50)]
        public string 项目ID { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string 项目编码 { get; set; }

        public double? 台阶水平 { get; set; }

        [StringLength(50)]
        public string 日期 { get; set; }

        [StringLength(10)]
        public string 岩性 { get; set; }

        public double? 孔距 { get; set; }

        public double? 排距 { get; set; }

        public int? 孔数 { get; set; }

        public double? 平均孔深 { get; set; }

        public double? 炸药量 { get; set; }

        public double? 抵抗线 { get; set; }

        public double? 超深 { get; set; }

        public double? 填充 { get; set; }

        public int? 数量 { get; set; }
    }
}
