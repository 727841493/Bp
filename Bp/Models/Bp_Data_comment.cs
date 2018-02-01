namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_Data_comment
    {
        [StringLength(50)]
        public string ID { get; set; }

        public double? 块度评分 { get; set; }

        public double? 抛掷评分 { get; set; }

        public double? 根底评分 { get; set; }

        public double? 伞岩评分 { get; set; }

        [StringLength(500)]
        public string 评论 { get; set; }

        [StringLength(50)]
        public string 评论人 { get; set; }

        [StringLength(50)]
        public string 项目编码 { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
