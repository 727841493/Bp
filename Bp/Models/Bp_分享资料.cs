namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Bp_分享资料
    {
        [StringLength(50)]
        public string ID { get; set; }

        [StringLength(50)]
        public string 资料名称 { get; set; }

        public DateTime? 上传时间 { get; set; }

        [StringLength(50)]
        public string 上传人 { get; set; }

        [StringLength(50)]
        public string 别名 { get; set; }
    }
}
