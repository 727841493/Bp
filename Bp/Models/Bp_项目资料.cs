namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_项目资料
    {
        [StringLength(50)]
        public string 项目编码 { get; set; }

        [StringLength(50)]
        public string 项目名称 { get; set; }

        [StringLength(50)]
        public string 资料ID { get; set; }

        [StringLength(50)]
        public string 资料名称 { get; set; }

        public DateTime? 上传时间 { get; set; }

        [StringLength(50)]
        public string 上传人 { get; set; }

        [StringLength(50)]
        public string 上传电脑 { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int 流水号 { get; set; }
    }
}
