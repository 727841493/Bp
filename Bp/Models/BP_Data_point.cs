namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_point
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id_point { get; set; }

        public int? id_object { get; set; }

        public int? my_id { get; set; }

        public double? x { get; set; }

        public double? y { get; set; }

        public double? z { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
