namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_项目权限
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(20)]
        public string 登录名 { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string 项目编码 { get; set; }

        [StringLength(50)]
        public string 备注 { get; set; }
    }
}
