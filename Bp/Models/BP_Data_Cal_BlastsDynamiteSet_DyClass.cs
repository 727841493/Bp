namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_Cal_BlastsDynamiteSet_DyClass
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }

        public int? preId { get; set; }

        [StringLength(30)]
        public string PreName { get; set; }

        public double? lg { get; set; }

        [StringLength(20)]
        public string lgname { get; set; }

        [StringLength(20)]
        public string wname { get; set; }

        public int? type { get; set; }

        public int? wwhere { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
