namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_geologicalinf
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id_geol { get; set; }

        public int? id_object { get; set; }

        public double? l_from { get; set; }

        public double? l_to { get; set; }

        public int? rockid { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
