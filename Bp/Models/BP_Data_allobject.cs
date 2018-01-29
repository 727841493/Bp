namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_allobject
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id_object { get; set; }

        public int? my_id { get; set; }

        public int? bordercolor { get; set; }

        public int? borderstyle { get; set; }

        public int? borderwidth { get; set; }

        public int? fillcolor { get; set; }

        public int? fillstyle { get; set; }

        public int? layer { get; set; }

        public int? shape { get; set; }

        [StringLength(20)]
        public string ltext { get; set; }

        public double? d { get; set; }

        public int? comb { get; set; }

        public DateTime? date1 { get; set; }

        public int? locked { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
