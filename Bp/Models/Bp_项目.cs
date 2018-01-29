namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_项目
    {
        [StringLength(50)]
        public string ID { get; set; }

        [Key]
        [StringLength(50)]
        public string 项目编码 { get; set; }

        [StringLength(200)]
        public string 项目名称 { get; set; }

        [StringLength(50)]
        public string 项目创建人 { get; set; }

        public DateTime? 项目创建日期 { get; set; }

        [StringLength(200)]
        public string 项目拼音 { get; set; }

        public byte? 级别 { get; set; }

        public byte? 末级 { get; set; }

        [StringLength(20)]
        public string 上级 { get; set; }

        [StringLength(20)]
        public string 类别 { get; set; }

        [StringLength(20)]
        public string 科目 { get; set; }
    }
}
