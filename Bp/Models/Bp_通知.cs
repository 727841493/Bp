namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_通知
    {
        [StringLength(50)]
        public string ID { get; set; }

        [StringLength(500)]
        public string 标题 { get; set; }

        [StringLength(500)]
        public string 内容 { get; set; }

        [StringLength(500)]
        public string 发布人 { get; set; }

        public DateTime? 发布时间 { get; set; }

        [StringLength(500)]
        public string 查看人 { get; set; }
    }
}
